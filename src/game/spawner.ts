/**
 * Author: musa -
 * Date: 06/05/2026
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
    // dont spawn mobs twice in the same room - prevents spam
    if (hasRoomBeenSpawned(roomId)) return [];

    const mobs: Mob[] = [];
    let count: number;

    // regular rooms get more mobs than hallways
    if (roomType === "room") {
        // starts at 2 mobs, adds 1 every 2 levels, caps at 8
        count = Math.min(2 + Math.floor(playerLevel / 2), 8);
    } else {
        // hallways get fewer mobs since theyre smaller
        count = Math.min(1 + Math.floor(playerLevel / 3), 5);
    }

    // keep mobs away from the walls so they dont get stuck
    const inset = 2 * TILE_SIZE;
    const spawnW = roomW - inset * 2;
    const spawnH = roomH - inset * 2;

    for (let i = 0; i < count; i++) {
        // random position within the safe spawn area
        const sx = roomX + inset + Math.random() * spawnW;
        const sy = roomY + inset + Math.random() * spawnH;

        if (roomType === "room") {
            // alternate between zombies and skeletons for variety
            if (i % 2 === 0) {
                mobs.push(new ZombieMob(sx, sy, playerLevel, roomId, playerLevel));
            } else {
                mobs.push(new SkeletonMob(sx, sy, playerLevel, roomId, playerLevel));
            }
        } else {
            // hallways get school-themed mobs
            if (i % 2 === 0) {
                mobs.push(new HallMonitorMob(sx, sy, playerLevel, roomId, playerLevel));
            } else {
                mobs.push(new TeacherMob(sx, sy, playerLevel, roomId, playerLevel));
            }
        }
    }

    // mark this room as spawned so we dont do it again
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

    // exact same spawn count logic as initial spawn
    if (roomType === "room") {
        count = Math.min(2 + Math.floor(playerLevel / 2), 8);
    } else {
        count = Math.min(1 + Math.floor(playerLevel / 3), 5);
    }

    // same safe spawn area calculation
    const inset = 2 * TILE_SIZE;
    const spawnW = roomW - inset * 2;
    const spawnH = roomH - inset * 2;

    for (let i = 0; i < count; i++) {
        const sx = roomX + inset + Math.random() * spawnW;
        const sy = roomY + inset + Math.random() * spawnH;

        // using ternary here to make it more compact but same mob types
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

    // mark the room as spawned again to prevent immediate respawn
    markRoomSpawned(roomId);
    return mobs;
}