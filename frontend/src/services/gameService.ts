import http from '../api/AxiosInstance';
import SessionStorageService, { StorageKeys } from './sessionStorageService';

const sessionService = new SessionStorageService();

export async function findMatch(userName: string): Promise<string> {
    try {
        const response = await http.post('/match/find', { name: userName });
        const ownerId: string = response?.data?.ownerId; // Ensure ownerId is a string
        sessionService.setItem(StorageKeys.OWNER_ID, ownerId); // Pass correct type to setItem

        return await new Promise<string>((resolve) => { // Explicitly type the Promise
            const interval = setInterval(async () => {
                const resp = await http.get(`/match/status/${ownerId}`);
                if (resp.data.status === "matched") {
                    clearInterval(interval);
                    resolve(resp.data?.matchId as string); // Ensure matchId is resolved as a string
                }
            }, 1000);
        });

    } catch (error) {
        console.error('Error fetching game data:', error);
        throw error;
    }
}