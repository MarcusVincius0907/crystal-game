export enum StorageKeys {
    MATCH_ID = 'MATCH_ID',
    OWNER_ID = 'OWNER_ID',
}

class SessionStorageService {
    // Save data to session storage
    setItem(key: string, value: any): void {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
    }

    // Retrieve data from session storage
    getItem<T>(key: string): T | null {
        const serializedValue = sessionStorage.getItem(key);
        if (serializedValue) {
            try {
                return JSON.parse(serializedValue) as T;
            } catch (error) {
                console.error('Error parsing session storage item:', error);
            }
        }
        return null;
    }

    // Remove data from session storage
    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    // Clear all data from session storage
    clear(): void {
        sessionStorage.clear();
    }

    // Check if a key exists in session storage
    hasKey(key: string): boolean {
        return sessionStorage.getItem(key) !== null;
    }
}

export default SessionStorageService;