import { Mob, ZombieMob, SkeletonMob, HallMonitorMob, TeacherMob, } from "./entities/mob.js";
import { hasRoomBeenSpawned, markRoomSpawned } from "./map/roomRegistry.js";
const TILE_SIZE = 36;
export function spawnRoomMobs(roomId, roomX, roomY, roomW, roomH, playerLevel, roomType) {
    if (hasRoomBeenSpawned(roomId))
        return [];
    const mobs = [];
    let count;
    if (roomType === "room") {
        count = Math.min(2 + Math.floor(playerLevel / 2), 8);
    }
    else {
        count = Math.min(1 + Math.floor(playerLevel / 3), 5);
    }
    const inset = 2 * TILE_SIZE;
    const spawnW = roomW - inset * 2;
    const spawnH = roomH - inset * 2;
    for (let i = 0; i < count; i++) {
        const sx = roomX + inset + Math.random() * spawnW;
        const sy = roomY + inset + Math.random() * spawnH;
        if (roomType === "room") {
            if (i % 2 === 0) {
                mobs.push(new ZombieMob(sx, sy, playerLevel, roomId, playerLevel));
            }
            else {
                mobs.push(new SkeletonMob(sx, sy, playerLevel, roomId, playerLevel));
            }
        }
        else {
            if (i % 2 === 0) {
                mobs.push(new HallMonitorMob(sx, sy, playerLevel, roomId, playerLevel));
            }
            else {
                mobs.push(new TeacherMob(sx, sy, playerLevel, roomId, playerLevel));
            }
        }
    }
    markRoomSpawned(roomId);
    return mobs;
}
export function respawnRoomMobs(roomId, roomX, roomY, roomW, roomH, playerLevel, roomType) {
    const mobs = [];
    let count;
    if (roomType === "room") {
        count = Math.min(2 + Math.floor(playerLevel / 2), 8);
    }
    else {
        count = Math.min(1 + Math.floor(playerLevel / 3), 5);
    }
    const inset = 2 * TILE_SIZE;
    const spawnW = roomW - inset * 2;
    const spawnH = roomH - inset * 2;
    for (let i = 0; i < count; i++) {
        const sx = roomX + inset + Math.random() * spawnW;
        const sy = roomY + inset + Math.random() * spawnH;
        if (roomType === "room") {
            mobs.push(i % 2 === 0
                ? new ZombieMob(sx, sy, playerLevel, roomId, playerLevel)
                : new SkeletonMob(sx, sy, playerLevel, roomId, playerLevel));
        }
        else {
            mobs.push(i % 2 === 0
                ? new HallMonitorMob(sx, sy, playerLevel, roomId, playerLevel)
                : new TeacherMob(sx, sy, playerLevel, roomId, playerLevel));
        }
    }
    markRoomSpawned(roomId);
    return mobs;
}
//# sourceMappingURL=spawner.js.map