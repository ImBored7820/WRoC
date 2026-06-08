/**
 * Author: musa -
 * Date: 05/20/2026
 *
 * Description: Room registry with freeze/activate system and door connections
 * Info: WRoC | roomRegistry.ts | WebStorm
 */

import type { Mob } from "../entities/mob.js";
import type { boss } from "../Boss.js";
import type { Item } from "../items/Item.js";

// each tile is 36 pixels wide/tall - this helps with positioning everything
const TILE_SIZE = 36;
// how far from the edge you need to be to "enter" a room - prevents edge flickering
const ENTRY_MARGIN = 18;

// save state of a room when player leaves so we can restore it later
export interface RoomSnapshot {
    mobs: Mob[];
    minibossAlive: boolean;
    minibossHealth: number;
    droppedItems: DroppedItem[];
    defeatedBannerTimer: number; // how long to show "defeated" text
    respawnTimer: number; // when mobs should come back
}

// items sitting on the ground that player can pick up
export interface DroppedItem {
    item: Item;
    x: number; // world position
    y: number;
}

// everything we need to know about a room
export interface RoomData {
    roomId: number; // unique id for this room
    roomX: number;  // top-left corner in world coordinates
    roomY: number;
    cols: number;   // how many tiles wide
    rows: number;   // how many tiles tall
    patterns: number[]; // the actual tile data for drawing
    roomType: "room" | "hallway"; // different types behave differently
    isActive: boolean; // is this room currently loaded/running
    snapshot: RoomSnapshot | null; // saved state when inactive
    miniboss: boss | null; // boss that lives in this room if any
}

// connects two rooms through a door
export interface DoorConnection {
    fromRoomId: number;
    toRoomId: number;
    doorTileX: number; // where the door is located
    doorTileY: number;
    spawnX: number;    // where player appears when entering
    spawnY: number;
}

// global registries that track all rooms and doors
export const roomRegistry: RoomData[] = [];
export const doorConnections: DoorConnection[] = [];

// room id counter starts at 1 (0 means no room)
let nextRoomId = 1;
// keep track of which rooms have had mobs spawned already
const spawnedRoomIds = new Set<number>();

// creates a new room and adds it to the registry
export function registerRoom(
    roomX: number,
    roomY: number,
    cols: number,
    rows: number,
    patterns: number[],
    roomType: "room" | "hallway" = "room"
): number {
    const roomId = nextRoomId++;
    roomRegistry.push({
        roomId,
        roomX,
        roomY,
        cols,
        rows,
        patterns,
        roomType,
        isActive: false,  // rooms start inactive
        snapshot: null,   // no saved state yet
        miniboss: null,   // no boss by default
    });
    return roomId;
}

// sets up a door between two rooms
export function registerDoor(conn: DoorConnection): void {
    doorConnections.push(conn);
}

// wipe everything clean - useful for restarting the game
export function unregisterAllRooms(): void {
    roomRegistry.length = 0;
    doorConnections.length = 0;
    nextRoomId = 1;
    spawnedRoomIds.clear();
}

// find a room by its id - returns undefined if not found
export function getRoomById(roomId: number): RoomData | undefined {
    return roomRegistry.find(r => r.roomId === roomId);
}

// check if player is inside a room's boundaries
export function isRoomActive(roomX: number, roomY: number, cols: number, rows: number, playerX: number, playerY: number): boolean {
    const roomW = cols * TILE_SIZE;
    const roomH = rows * TILE_SIZE;
    // use player center point instead of top-left corner
    const cx = playerX + 15;
    const cy = playerY + 15;
    // player must be inside the margins to count as "in the room"
    return (
        cx >= roomX + ENTRY_MARGIN &&
        cx < roomX + roomW - ENTRY_MARGIN &&
        cy >= roomY + ENTRY_MARGIN &&
        cy < roomY + roomH - ENTRY_MARGIN
    );
}

// figures out which room the player is currently in
// uses "depth" to handle overlapping rooms - picks the one player is deepest inside
export function getActiveRoomId(playerX: number, playerY: number, currentRoomId: number | null = null): number | null {
    const cx = playerX + 15;
    const cy = playerY + 15;
    let bestId: number | null = null;
    let bestDepth = -1;

    // check every room to see which one player is deepest inside
    for (const room of roomRegistry) {
        if (!isRoomActive(room.roomX, room.roomY, room.cols, room.rows, playerX, playerY)) continue;

        const roomW = room.cols * TILE_SIZE;
        const roomH = room.rows * TILE_SIZE;
        // calculate how far from each edge the player is
        const depthX = Math.min(cx - room.roomX, room.roomX + roomW - cx);
        const depthY = Math.min(cy - room.roomY, room.roomY + roomH - cy);
        const depth = Math.min(depthX, depthY); // overall depth is the minimum

        if (depth > bestDepth) {
            bestDepth = depth;
            bestId = room.roomId;
        }
    }

    // add some stickiness so we don't constantly switch between rooms on shared walls
    // if current room is still valid and close enough to new room, stick with current
    if (currentRoomId !== null && bestId !== null && bestId !== currentRoomId) {
        const current = getRoomById(currentRoomId);
        if (current && isRoomActive(current.roomX, current.roomY, current.cols, current.rows, playerX, playerY)) {
            const roomW = current.cols * TILE_SIZE;
            const roomH = current.rows * TILE_SIZE;
            const depthX = Math.min(cx - current.roomX, current.roomX + roomW - cx);
            const depthY = Math.min(cy - current.roomY, current.roomY + roomH - cy);
            const currentDepth = Math.min(depthX, depthY);
            // if current room depth is close to best room depth, stay put
            if (currentDepth >= bestDepth - 8) return currentRoomId;
        }
    }

    return bestId;
}

// turn off a room - stops updating it and saves its state
export function freezeRoom(roomId: number): void {
    const room = getRoomById(roomId);
    if (!room) return;
    room.isActive = false;
}

// turn on a room - starts updating it again
export function activateRoom(roomId: number): void {
    const room = getRoomById(roomId);
    if (!room) return;
    room.isActive = true;
}

// save the current state of a room so we can restore it later
export function saveRoomSnapshot(roomId: number, snapshot: RoomSnapshot): void {
    const room = getRoomById(roomId);
    if (room) room.snapshot = snapshot;
}

// get the saved state of a room
export function getRoomSnapshot(roomId: number): RoomSnapshot | null {
    return getRoomById(roomId)?.snapshot ?? null;
}

// check if we've already spawned mobs in this room
export function hasRoomBeenSpawned(roomId: number): boolean {
    return spawnedRoomIds.has(roomId);
}

// mark a room as having mobs spawned
export function markRoomSpawned(roomId: number): void {
    spawnedRoomIds.add(roomId);
}

// reset spawn status for a room
export function clearSpawnedRoom(roomId: number): void {
    spawnedRoomIds.delete(roomId);
}

// check if all enemies in a room are dead
export function isRoomCleared(roomId: number, mobs: Mob[]): boolean {
    const room = getRoomById(roomId);
    if (!room) return true; // no room = cleared by default

    // check if any regular mobs are still alive in this room
    const roomMobsAlive = mobs.some(m => m.homeRoomId === roomId && !m.isMobDead);
    // check if the miniboss is still kicking
    const minibossAlive = room.miniboss && !room.miniboss.isDead;

    // room is cleared only if both regular mobs and miniboss are dead
    return !roomMobsAlive && !minibossAlive;
}

// get the world coordinates and size of a room - useful for collision detection
export function getRoomWorldBounds(roomId: number): { x: number; y: number; w: number; h: number } | null {
    const room = getRoomById(roomId);
    if (!room) return null;
    return {
        x: room.roomX,
        y: room.roomY,
        w: room.cols * TILE_SIZE,
        h: room.rows * TILE_SIZE,
    };
}