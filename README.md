# Click War - Multiplayer Speed Clicker

A real-time, multiplayer "Click War" game built with **FastAPI** (Python) and **Next.js** (React/TypeScript). Players join a room and compete to see who can click a button the fastest within a 10-second window.

## 🚀 Quick Start

### 1. Prerequisites

- **Python 3.10+**
- **Node.js 20+**

### 2. Backend Setup

The backend is a FastAPI server managing game state and WebSocket connections.

```bash
# Navigate to root
# Create virtual environment (if not already done)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`.

### 3. Frontend Setup

The frontend is a modern Next.js application using Tailwind CSS.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will be available at `http://localhost:3000`.

## 🎮 How to Play

1. Open `http://localhost:3000`.
2. Enter a **Room ID** (e.g., "battle") and your **Name**.
3. To test multiplayer, open another tab/browser and join the same **Room ID**.
4. Click **START GAME** once all players are in the lobby.
5. Wait for the 3-second countdown.
6. **CLICK!** Hammer the big blue button as fast as you can.
7. After 10 seconds, the winner is announced!

## 🛠 Tech Stack

- **Backend:** FastAPI, WebSockets, Python 3.14 (asyncio)
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Harness:** Gemini CLI / Cursor config with custom hooks and skills

## 📂 Project Structure

- `backend/`: FastAPI source code and logic.
- `frontend/`: Next.js React application.
- `.gemini/`: AI harness configuration (hooks, skills, manifest).
- `context/`: Architectural guidance for AI agents.
