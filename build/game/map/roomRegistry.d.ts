import type { Mob } from "../entities/mob.js";
import type { boss } from "../entities/Boss.js";
import type { Item } from "../items/Item.js";
export interface RoomSnapshot {
    mobs: Mob[];
    minibossAlive: boolean;
    minibossHealth: number;
    droppedItems: DroppedItem[];
    defeatedBannerTimer: number;
    respawnTimer: number;
}
export interface DroppedItem {
    item: Item;
    x: number;
    y: number;
}
export interface RoomData {
    roomId: number;
    roomX: number;
    roomY: number;
    cols: number;
    rows: number;
    patterns: number[];
    roomType: "room" | "hallway";
    isActive: boolean;
    snapshot: RoomSnapshot | null;
    miniboss: boss | null;
}
export interface DoorConnection {
    fromRoomId: number;
    toRoomId: number;
    doorTileX: number;
    doorTileY: number;
    spawnX: number;
    spawnY: number;
}
export declare const roomRegistry: RoomData[];
export declare const doorConnections: DoorConnection[];
export declare function registerRoom(roomX: number, roomY: number, cols: number, rows: number, patterns: number[], roomType?: "room" | "hallway"): number;
export declare function registerDoor(conn: DoorConnection): void;
export declare function unregisterAllRooms(): void;
export declare function getRoomById(roomId: number): RoomData | undefined;
export declare function isRoomActive(roomX: number, roomY: number, cols: number, rows: number, playerX: number, playerY: number): boolean;
export declare function getActiveRoomId(playerX: number, playerY: number, currentRoomId?: number | null): number | null;
export declare function freezeRoom(roomId: number): void;
export declare function activateRoom(roomId: number): void;
export declare function saveRoomSnapshot(roomId: number, snapshot: RoomSnapshot): void;
export declare function getRoomSnapshot(roomId: number): RoomSnapshot | null;
export declare function hasRoomBeenSpawned(roomId: number): boolean;
export declare function markRoomSpawned(roomId: number): void;
export declare function clearSpawnedRoom(roomId: number): void;
export declare function isRoomCleared(roomId: number, mobs: Mob[]): boolean;
export declare function getRoomWorldBounds(roomId: number): {
    x: number;
    y: number;
    w: number;
    h: number;
} | null;
//# sourceMappingURL=roomRegistry.d.ts.map