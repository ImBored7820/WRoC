/**
 * Author: musa -
 * Date: 05/20/2026
 * Time: 13:31:41
 *
 * Description: Describe what the file does
 * Info: WRoC | roomRegistry.ts | WebStorm
 */
export interface RoomData {
    roomX: number,
    roomY: number,
    cols: number,
    rows: number,
    patterns: number[]
}

export const roomRegistry: RoomData[] = [];

export function registerRoom(roomX: number, roomY: number, cols: number, rows: number, patterns: number[]) {
    roomRegistry.push({roomX, roomY, cols, rows, patterns});
}

export function unregisterAllRooms() {
    roomRegistry.length = 0;
}