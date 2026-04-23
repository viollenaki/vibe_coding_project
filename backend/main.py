import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Set

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Game State
# rooms = {
#     "room_id": {
#         "players": {"player_name": score},
#         "status": "waiting" | "playing" | "finished",
#         "timer": 10
#     }
# }
rooms: Dict[str, dict] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()
        self.active_connections[room_id].add(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active_connections:
            self.active_connections[room_id].discard(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: dict):
        if room_id in self.active_connections:
            # We use a copy of the set to avoid issues if a connection disconnects during broadcast
            connections = list(self.active_connections[room_id])
            for connection in connections:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    # Connection might be closed
                    pass

manager = ConnectionManager()

async def game_loop(room_id: str):
    if room_id not in rooms:
        return
        
    room = rooms[room_id]
    room["status"] = "starting"
    
    # Countdown
    for i in range(3, 0, -1):
        await manager.broadcast(room_id, {"type": "COUNTDOWN", "value": i})
        await asyncio.sleep(1)
    
    room["status"] = "playing"
    await manager.broadcast(room_id, {"type": "GAME_START"})
    
    # Game duration
    duration = 10
    for i in range(duration, -1, -1):
        room["timer"] = i
        await manager.broadcast(room_id, {"type": "TIME_UPDATE", "value": i})
        if i > 0:
            await asyncio.sleep(1)
            
    room["status"] = "finished"
    # Find winner
    players = room["players"]
    if not players:
        winner = "No one"
    else:
        winner = max(players, key=players.get)
        # Handle ties
        max_score = players[winner]
        winners = [p for p, s in players.items() if s == max_score]
        winner = ", ".join(winners) if len(winners) > 1 else winners[0]
    
    await manager.broadcast(room_id, {
        "type": "GAME_OVER", 
        "winner": winner, 
        "scores": players
    })

@app.get("/")
async def root():
    return {"message": "Click War API is running"}

@app.websocket("/ws/{room_id}/{player_name}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, player_name: str):
    await manager.connect(room_id, websocket)
    
    if room_id not in rooms:
        rooms[room_id] = {
            "players": {},
            "status": "waiting",
            "timer": 10
        }
    
    # Add player
    rooms[room_id]["players"][player_name] = 0
    
    # Broadcast current state to everyone in the room
    await manager.broadcast(room_id, {
        "type": "ROOM_UPDATE", 
        "players": list(rooms[room_id]["players"].keys()),
        "scores": rooms[room_id]["players"],
        "status": rooms[room_id]["status"]
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "CLICK":
                if rooms[room_id]["status"] == "playing":
                    rooms[room_id]["players"][player_name] += 1
                    await manager.broadcast(room_id, {
                        "type": "SCORE_UPDATE", 
                        "scores": rooms[room_id]["players"]
                    })
            
            elif message["type"] == "START_GAME":
                if rooms[room_id]["status"] != "playing" and rooms[room_id]["status"] != "starting":
                    # Reset scores
                    for p in rooms[room_id]["players"]:
                        rooms[room_id]["players"][p] = 0
                    asyncio.create_task(game_loop(room_id))
            
            elif message["type"] == "RESET":
                 rooms[room_id]["status"] = "waiting"
                 for p in rooms[room_id]["players"]:
                        rooms[room_id]["players"][p] = 0
                 await manager.broadcast(room_id, {
                    "type": "ROOM_UPDATE", 
                    "players": list(rooms[room_id]["players"].keys()),
                    "scores": rooms[room_id]["players"],
                    "status": rooms[room_id]["status"]
                })
                    
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        if room_id in rooms and player_name in rooms[room_id]["players"]:
            del rooms[room_id]["players"][player_name]
            
            # If room is empty, delete it
            if not rooms[room_id]["players"]:
                del rooms[room_id]
            else:
                await manager.broadcast(room_id, {
                    "type": "ROOM_UPDATE",
                    "players": list(rooms[room_id]["players"].keys()),
                    "scores": rooms[room_id]["players"],
                    "status": rooms[room_id]["status"]
                })
    except Exception as e:
        print(f"Error: {e}")
        manager.disconnect(room_id, websocket)
