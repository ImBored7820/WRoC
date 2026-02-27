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

const tileWidth = 10;
const tileHeight = 10;

const rows = 20;
const cols = 20;

const map = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 
    0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1 ,0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,0 ,1 ,0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,0 ,1 ,0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,0 ,1 ,0,
    0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0,
    0 ,1 ,0 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,0 ,1 ,0,
    0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
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
                ctx.fillStyle = "yellow";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }
            else if (map[arrayIndex] === 2)
            {
                ctx.fillStyle = "red";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }
            else if (map[arrayIndex] === 3)
            {
                ctx.fillStyle = "blue";
                ctx.fillRect(currentCol * tileWidth, currentRow * tileHeight, tileWidth, tileHeight);
            }    

        }
    }
}