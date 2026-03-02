let canvas;
let ctx;
let mapCanvas;
let mapCtx;

const tileWidth = 20;
const tileHeight = 20;
const rows = 20;
const cols = 20;

const tileColors = {
    0: "black",
    1: "gray",
    2: "brown",
    3: "lightgray"
};

const map = [
    0,2,2,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0, // Center
    0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0, // Center 
    0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,3,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,
]

const drawMap = () => {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            mapCtx.fillStyle = tileColors[map[index]];
            mapCtx.fillRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
        }
    }
};

const refreshRate = () => {
    ctx.drawImage(mapCanvas, 0, 0);
    window.requestAnimationFrame(refreshRate);
};

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    mapCanvas = document.createElement("canvas");
    mapCanvas.width = cols * tileWidth;
    mapCanvas.height = rows * tileHeight;
    mapCtx = mapCanvas.getContext("2d");
    
    drawMap();
    window.requestAnimationFrame(refreshRate);
};