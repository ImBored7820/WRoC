export interface RoomData {
    roomX: number;
    roomY: number;
    cols: number;
    rows: number;
    patterns: number[];
}
export declare const roomRegistry: RoomData[];
export declare function registerRoom(roomX: number, roomY: number, cols: number, rows: number, patterns: number[]): void;
export declare function unregisterAllRooms(): void;
//# sourceMappingURL=roomRegistry.d.ts.map