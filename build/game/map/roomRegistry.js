const TILE_SIZE = 36;
const ENTRY_MARGIN = 18;
export const roomRegistry = [];
export const doorConnections = [];
let nextRoomId = 1;
const spawnedRoomIds = new Set();
export function registerRoom(roomX, roomY, cols, rows, patterns, roomType = "room") {
    const roomId = nextRoomId++;
    roomRegistry.push({
        roomId,
        roomX,
        roomY,
        cols,
        rows,
        patterns,
        roomType,
        isActive: false,
        snapshot: null,
        miniboss: null,
    });
    return roomId;
}
export function registerDoor(conn) {
    doorConnections.push(conn);
}
export function unregisterAllRooms() {
    roomRegistry.length = 0;
    doorConnections.length = 0;
    nextRoomId = 1;
    spawnedRoomIds.clear();
}
export function getRoomById(roomId) {
    return roomRegistry.find(r => r.roomId === roomId);
}
export function isRoomActive(roomX, roomY, cols, rows, playerX, playerY) {
    const roomW = cols * TILE_SIZE;
    const roomH = rows * TILE_SIZE;
    const cx = playerX + 15;
    const cy = playerY + 15;
    return (cx >= roomX + ENTRY_MARGIN &&
        cx < roomX + roomW - ENTRY_MARGIN &&
        cy >= roomY + ENTRY_MARGIN &&
        cy < roomY + roomH - ENTRY_MARGIN);
}
export function getActiveRoomId(playerX, playerY, currentRoomId = null) {
    const cx = playerX + 15;
    const cy = playerY + 15;
    let bestId = null;
    let bestDepth = -1;
    for (const room of roomRegistry) {
        if (!isRoomActive(room.roomX, room.roomY, room.cols, room.rows, playerX, playerY))
            continue;
        const roomW = room.cols * TILE_SIZE;
        const roomH = room.rows * TILE_SIZE;
        const depthX = Math.min(cx - room.roomX, room.roomX + roomW - cx);
        const depthY = Math.min(cy - room.roomY, room.roomY + roomH - cy);
        const depth = Math.min(depthX, depthY);
        if (depth > bestDepth) {
            bestDepth = depth;
            bestId = room.roomId;
        }
    }
    if (currentRoomId !== null && bestId !== null && bestId !== currentRoomId) {
        const current = getRoomById(currentRoomId);
        if (current && isRoomActive(current.roomX, current.roomY, current.cols, current.rows, playerX, playerY)) {
            const roomW = current.cols * TILE_SIZE;
            const roomH = current.rows * TILE_SIZE;
            const depthX = Math.min(cx - current.roomX, current.roomX + roomW - cx);
            const depthY = Math.min(cy - current.roomY, current.roomY + roomH - cy);
            const currentDepth = Math.min(depthX, depthY);
            if (currentDepth >= bestDepth - 8)
                return currentRoomId;
        }
    }
    return bestId;
}
export function freezeRoom(roomId) {
    const room = getRoomById(roomId);
    if (!room)
        return;
    room.isActive = false;
}
export function activateRoom(roomId) {
    const room = getRoomById(roomId);
    if (!room)
        return;
    room.isActive = true;
}
export function saveRoomSnapshot(roomId, snapshot) {
    const room = getRoomById(roomId);
    if (room)
        room.snapshot = snapshot;
}
export function getRoomSnapshot(roomId) {
    return getRoomById(roomId)?.snapshot ?? null;
}
export function hasRoomBeenSpawned(roomId) {
    return spawnedRoomIds.has(roomId);
}
export function markRoomSpawned(roomId) {
    spawnedRoomIds.add(roomId);
}
export function clearSpawnedRoom(roomId) {
    spawnedRoomIds.delete(roomId);
}
export function isRoomCleared(roomId, mobs) {
    const room = getRoomById(roomId);
    if (!room)
        return true;
    const roomMobsAlive = mobs.some(m => m.homeRoomId === roomId && !m.isMobDead);
    const minibossAlive = room.miniboss && !room.miniboss.isDead;
    return !roomMobsAlive && !minibossAlive;
}
export function getRoomWorldBounds(roomId) {
    const room = getRoomById(roomId);
    if (!room)
        return null;
    return {
        x: room.roomX,
        y: room.roomY,
        w: room.cols * TILE_SIZE,
        h: room.rows * TILE_SIZE,
    };
}
//# sourceMappingURL=roomRegistry.js.map