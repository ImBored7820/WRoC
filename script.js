let canvas;
let ctx;

const refreshRate = () => {
    drawMap();
    window.requestAnimationFrame(refreshRate);
}

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    window.requestAnimationFrame(refreshRate);
}

const tileWidth = 20;
const tileHeight = 20;

const rows = 20;
const cols = 20;

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
    for (let currentRow = 0; currentRow < rows; currentRow++) {
        for (let currentCol = 0; currentCol < cols; currentCol++) {

            let arrayIndex = currentRow * rows + currentCol;

            if (map[arrayIndex] === 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }
            else if (map[arrayIndex] === 1)
            {
                ctx.fillStyle = "gray";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }
            else if (map[arrayIndex] === 2)
            {
                ctx.fillStyle = "brown";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }
            else if (map[arrayIndex] === 3)
            {
                ctx.fillStyle = "lightgray";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }    

        }
    }
}