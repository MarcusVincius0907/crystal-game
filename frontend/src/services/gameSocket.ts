// src/gameService.js
import { io } from 'socket.io-client';
import store from "../store/index";
import { getMatchById, setOpponentLoader } from '../store/modules/main';
import SessionStorageService, { StorageKeys } from './sessionStorageService';

const sessionStorageService = new SessionStorageService();

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
}); // Connect to NestJS WebSocket server

// Listen for match start
socket.on('matchStarted', (data) => {
  console.log(data.message); // Show match started message
});

// Listen for game updates
socket.on('gameUpdate', () => {
  const matchId = (sessionStorageService.getItem(StorageKeys.MATCH_ID) || '').toString();
  const ownerId = (sessionStorageService.getItem(StorageKeys.OWNER_ID) || '').toString();
  store.dispatch(getMatchById({ matchId, ownerId }));
  store.dispatch(setOpponentLoader(false));
});

export const joinRoom = (roomId: string) => {
  socket.emit('joinRoom', roomId);
};

export const startMatch = (roomId: string) => {
  socket.emit('startMatch', roomId);
};

export const sendGameUpdate = (roomId: string, ownerId: string, update: any) => {
  socket.emit('gameUpdate', { roomId, ownerId, update });
  store.dispatch(setOpponentLoader(true));
};

export default socket;
