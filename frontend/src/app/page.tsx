"use client";

import { useState } from "react";
import { useGameWebSocket } from "@/hooks/useGameWebSocket";
import { Users, Trophy, Timer, MousePointer2, LogOut } from "lucide-react";

export default function ClickWar() {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joined, setJoined] = useState(false);

  const { gameState, connect, disconnect, sendClick, startGame, resetGame } =
    useGameWebSocket(roomId, playerName);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && playerName) {
      connect();
      setJoined(true);
    }
  };

  const handleLeave = () => {
    disconnect();
    setJoined(false);
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="flex items-center justify-center mb-8 gap-3">
            <MousePointer2 className="w-10 h-10 text-blue-500 animate-bounce" />
            <h1 className="text-4xl font-black tracking-tighter italic">
              CLICK WAR
            </h1>
          </div>
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter room name..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your name..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              JOIN ROOM
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Players & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="font-bold">PLAYERS</h2>
              </div>
              <span className="bg-slate-700 px-2 py-1 rounded text-xs font-mono">
                ROOM: {roomId}
              </span>
            </div>
            <div className="space-y-3">
              {gameState.players.map((p) => (
                <div
                  key={p}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    p === playerName
                      ? "bg-blue-900/20 border-blue-500/50"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  <span className="font-medium truncate max-w-[120px]">
                    {p} {p === playerName && "(You)"}
                  </span>
                  <span className="font-mono text-blue-400 font-bold">
                    {gameState.scores[p] || 0}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleLeave}
              className="w-full mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Leave Room
            </button>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Game Background Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <MousePointer2 className="w-96 h-96" />
            </div>

            {gameState.status === "waiting" && (
              <div className="text-center z-10">
                <h2 className="text-2xl font-bold mb-4">
                  Waiting for players...
                </h2>
                <button
                  onClick={startGame}
                  className="bg-green-600 hover:bg-green-500 text-white text-xl font-black px-12 py-6 rounded-2xl shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
                >
                  START GAME
                </button>
              </div>
            )}

            {gameState.status === "starting" && (
              <div className="text-center z-10 animate-pulse">
                <h2 className="text-4xl font-bold mb-4 text-slate-400 uppercase tracking-widest">
                  Starting in
                </h2>
                <div className="text-9xl font-black text-blue-500">
                  {gameState.timer}
                </div>
              </div>
            )}

            {gameState.status === "playing" && (
              <div className="w-full h-full flex flex-col items-center justify-between z-10">
                <div className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-full border border-slate-700 mb-8">
                  <Timer
                    className={`w-6 h-6 ${gameState.timer <= 3 ? "text-red-500 animate-pulse" : "text-blue-400"}`}
                  />
                  <span className="text-3xl font-mono font-bold">
                    {gameState.timer}s
                  </span>
                </div>

                <button
                  onMouseDown={sendClick}
                  className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-6xl font-black shadow-[0_0_50px_rgba(59,130,246,0.5)] active:scale-90 active:shadow-none transition-all border-8 border-blue-400 select-none cursor-pointer group"
                >
                  <span className="group-active:scale-110 transition-transform">
                    CLICK!
                  </span>
                </button>

                <div className="mt-12 text-slate-400 font-medium uppercase tracking-widest italic">
                  Hammer that button!
                </div>
              </div>
            )}

            {gameState.status === "finished" && (
              <div className="text-center z-10 bg-slate-900/80 backdrop-blur-sm p-12 rounded-3xl border-2 border-yellow-500/30">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
                <h2 className="text-5xl font-black mb-2 italic">GAME OVER</h2>
                <p className="text-xl text-slate-400 mb-8">
                  Winner:{" "}
                  <span className="text-yellow-500 font-bold">
                    {gameState.winner}
                  </span>
                </p>

                <div className="max-w-xs mx-auto mb-8 space-y-2">
                  {Object.entries(gameState.scores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, score], i) => (
                      <div
                        key={name}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-slate-500">
                          {i + 1}. {name}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {score}
                        </span>
                      </div>
                    ))}
                </div>

                <button
                  onClick={resetGame}
                  className="bg-white text-slate-900 hover:bg-slate-200 text-lg font-bold px-8 py-3 rounded-xl transition-all"
                >
                  PLAY AGAIN
                </button>
              </div>
            )}

            {gameState.status === "disconnected" && (
              <div className="text-center z-10">
                <p className="text-red-500 font-bold mb-4">
                  Disconnected from server.
                </p>
                <button
                  onClick={connect}
                  className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-bold"
                >
                  RECONNECT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
