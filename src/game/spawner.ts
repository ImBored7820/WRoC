/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: Room-aware mob spawning scaled to player level
 * Info: WRoC | spawner.ts | WebStorm
 */
import {
    Mob, ZombieMob, SkeletonMob, HallMonitorMob, TeacherMob,
} from "./entities/mob.js";
import { hasRoomBeenSpawned, markRoomSpawned } from "./map/roomRegistry.js";

const TILE_SIZE = 36;

// Spawns mobs into a room based on player level and room type
export function spawnRoomMobs(
    roomId: number,
    roomX: number,
    roomY: number,
    roomW: number,
    roomH: number,
    playerLevel: number,
    roomType: "room" | "hallway"
): Mob[] {
    if (hasRoomBeenSpawned(roomId)) return [];

    const mobs: Mob[] = [];
    let count: number;

    if (roomType === "room") {
        count = Math.min(2 + Math.floor(playerLevel / 2), 8);
    } else {
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
            } else {
                mobs.push(new SkeletonMob(sx, sy, playerLevel, roomId, playerLevel));
            }
        } else {
            if (i % 2 === 0) {
                mobs.push(new HallMonitorMob(sx, sy, playerLevel, roomId, playerLevel));
            } else {
                mobs.push(new TeacherMob(sx, sy, playerLevel, roomId, playerLevel));
            }
        }
    }

    markRoomSpawned(roomId);
    return mobs;
}

// Respawns mobs in a room that has been cleared — same logic as initial spawn
export function respawnRoomMobs(
    roomId: number,
    roomX: number,
    roomY: number,
    roomW: number,
    roomH: number,
    playerLevel: number,
    roomType: "room" | "hallway"
): Mob[] {
    const mobs: Mob[] = [];
    let count: number;

    if (roomType === "room") {
        count = Math.min(2 + Math.floor(playerLevel / 2), 8);
    } else {
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
        } else {
            mobs.push(i % 2 === 0
                ? new HallMonitorMob(sx, sy, playerLevel, roomId, playerLevel)
                : new TeacherMob(sx, sy, playerLevel, roomId, playerLevel));
        }
    }

    markRoomSpawned(roomId);
    return mobs;
}
