/**
 * Author: musa -
 * Date: 05/17/2026
 *
 * Description: Draws a trisect of three rooms and registers them
 * Info: WRoC | drawTrisect.ts | WebStorm
 */
import {colors} from "../collisionlogic.js";
import {registerRoom} from "./roomRegistry.js";

// each tile is 36x36 pixels - makes it nice and chunky
const pixelWidth = 36;
const pixelHeight = 36;
const rows = 20;
const cols = 20;

// total width of one room in pixels
const roomPixelArea = cols * pixelWidth;

// this function cuts holes in the walls so you can walk between rooms
// basically punches doorways in the middle of east/west walls
export function withPassages(pattern: number[]): number[] {
    return pattern.map((tile, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        // rows 9-11 are the middle, cols 0 and 19 are the side walls
        if (row >= 9 && row <= 11 && (col === 0 || col === cols - 1)) return 1;
        return tile;
    });
}

// this is our basic room layout - walls around the outside, floor in the middle
// the decimal numbers probably map to different wall/floor textures
export const defaultPattern = withPassages([
    0.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.36,0,0,0.9,
    2.36,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2.36,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.9,
]);

export const roomPattern = defaultPattern;

export interface TrisectResult {
    roomIds: [number, number, number];
}

// this is the main function that draws three connected rooms side by side
export function drawTrisect(ctx: CanvasRenderingContext2D, x: number, y: number,
                            roomOnePattern?: number[], roomOneColors?: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void },
                            roomTwoPattern?: number[], roomTwoColors?: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void },
                            roomThreePattern?: number[], roomThreeColors?: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void },
                            roomTypes?: ["room" | "hallway", "room" | "hallway", "room" | "hallway"]
): TrisectResult {

    // rooms overlap by one column so they share walls (like old Pokemon games)
    const roomOneX = x;
    const roomTwoX = x + roomPixelArea - pixelWidth; // subtract one tile width for overlap
    const roomThreeX = x + (roomPixelArea - pixelWidth) * 2; // same for the third room

    // use default patterns if none provided
    const patternOne = roomOnePattern ?? defaultPattern;
    const patternTwo = roomTwoPattern ?? defaultPattern;
    const patternThree = roomThreePattern ?? defaultPattern;

    // use default colors if none provided
    const colorOne = roomOneColors ?? colors;
    const colorTwo = roomTwoColors ?? colors;
    const colorThree = roomThreeColors ?? colors;

    // default all to regular rooms unless specified
    const types = roomTypes ?? ["room", "room", "room"];

    // draw all three rooms to the canvas
    oneToTwoDimensional(ctx, roomOneX, y, patternOne, colorOne);
    oneToTwoDimensional(ctx, roomTwoX, y, patternTwo, colorTwo);
    oneToTwoDimensional(ctx, roomThreeX, y, patternThree, colorThree);

    // register the rooms in the game's room system and get their IDs back
    const id1 = registerRoom(roomOneX, y, cols, rows, patternOne, types[0]);
    const id2 = registerRoom(roomTwoX, y, cols, rows, patternTwo, types[1]);
    const id3 = registerRoom(roomThreeX, y, cols, rows, patternThree, types[2]);

    return { roomIds: [id1, id2, id3] };
}

// makes a hallway pattern - basically just walls around the edges and floor inside
// good for connecting rooms together
export const hallwayPattern: number[] = withPassages(
    defaultPattern.map((tile, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        // keep the top and bottom rows as walls
        if (row === 0 || row === rows - 1) return tile;
        // keep the left and right columns as walls
        if (col === 0 || col === cols - 1) return tile;
        // everything else becomes floor
        return 1;
    })
);

export interface HallwayResult {
    roomId: number;
}

// draws a custom sized hallway - useful for connecting different areas
export function drawHallway(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    widthTiles: number,
    heightTiles: number = 5 // default to 5 tiles high
): HallwayResult {
    const pattern: number[] = [];

    // build the hallway pattern tile by tile
    for (let row = 0; row < heightTiles; row++) {
        for (let col = 0; col < widthTiles; col++) {
            const isTop = row === 0;
            const isBot = row === heightTiles - 1;
            const isLeft = col === 0;
            const isRight = col === widthTiles - 1;

            // corners and edges get wall textures, inside gets floor
            if (isTop) pattern.push(isLeft || isRight ? 0.9 : 0);
            else if (isBot) pattern.push(isLeft || isRight ? 0.18 : 0);
            else if (isLeft) pattern.push(0.27);
            else if (isRight) pattern.push(0.9);
            else pattern.push(1); // floor tile
        }
    }

    // actually draw the hallway to the canvas
    for (let row = 0; row < heightTiles; row++) {
        for (let col = 0; col < widthTiles; col++) {
            const tileX = col * pixelWidth;
            const tileY = row * pixelHeight;
            colors[pattern[row * widthTiles + col]]?.(ctx, tileX + x, tileY + y, pixelWidth, pixelHeight);
        }
    }

    // register it so the game knows about it
    const roomId = registerRoom(x, y, widthTiles, heightTiles, pattern, "hallway");
    return { roomId };
}

// converts our 1D array pattern into actual 2D tiles on the canvas
// this is where the magic happens - takes numbers and turns them into pixels
function oneToTwoDimensional(ctx: CanvasRenderingContext2D, x: number, y: number, pattern: number[], color: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void }) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col; // convert 2D coordinates to 1D array index
            const tileX = col * pixelWidth;
            const tileY = row * pixelHeight;

            // look up the color function for this tile type and draw it
            color[pattern[index]]?.(ctx, tileX+x, tileY+y, pixelWidth, pixelHeight);
        }
    }
}