"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type GameStatus =
  | "waiting"
  | "starting"
  | "playing"
  | "finished"
  | "disconnected";

export interface GameState {
  status: GameStatus;
  players: string[];
  scores: Record<string, number>;
  timer: number;
  winner: string | null;
}

export const useGameWebSocket = (
  roomId: string | null,
  playerName: string | null,
) => {
  const [gameState, setGameState] = useState<GameState>({
    status: "disconnected",
    players: [],
    scores: {},
    timer: 10,
    winner: null,
  });

  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!roomId || !playerName) return;

    // Use absolute URL for the backend
    const socketUrl = `ws://localhost:8000/ws/${roomId}/${playerName}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      setGameState((prev) => ({ ...prev, status: "waiting" }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);

      switch (data.type) {
        case "ROOM_UPDATE":
          setGameState((prev) => ({
            ...prev,
            players: data.players,
            scores: data.scores,
            status: data.status,
          }));
          break;
        case "COUNTDOWN":
          setGameState((prev) => ({
            ...prev,
            status: "starting",
            timer: data.value,
          }));
          break;
        case "GAME_START":
          setGameState((prev) => ({ ...prev, status: "playing" }));
          break;
        case "TIME_UPDATE":
          setGameState((prev) => ({ ...prev, timer: data.value }));
          break;
        case "SCORE_UPDATE":
          setGameState((prev) => ({ ...prev, scores: data.scores }));
          break;
        case "GAME_OVER":
          setGameState((prev) => ({
            ...prev,
            status: "finished",
            winner: data.winner,
            scores: data.scores,
          }));
          break;
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
      setGameState((prev) => ({ ...prev, status: "disconnected" }));
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  }, [roomId, playerName]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }
  }, []);

  const sendClick = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "CLICK" }));
    }
  }, []);

  const startGame = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "START_GAME" }));
    }
  }, []);

  const resetGame = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "RESET" }));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return {
    gameState,
    connect,
    disconnect,
    sendClick,
    startGame,
    resetGame,
  };
};
