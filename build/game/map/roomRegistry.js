export const roomRegistry = [];
export function registerRoom(roomX, roomY, cols, rows, patterns) {
    roomRegistry.push({ roomX, roomY, cols, rows, patterns });
}
export function unregisterAllRooms() {
    roomRegistry.length = 0;
}
//# sourceMappingURL=roomRegistry.js.map