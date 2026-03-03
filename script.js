var canvas;
var ctx;
var mapCanvas;
var mapCtx;
var tileWidth = 20;
var tileHeight = 20;
var rows = 20;
var cols = 20;
var tileColors = {
    0: "black",
    1: "gray",
    2: "brown",
    3: "lightgray"
};
var map = [
    [0,2,1]
];
var drawMap = function () {
// TODO FIGURE OUT 2D MAP
};
var refreshRate = function () {
    ctx.drawImage(mapCanvas, 0, 0);
    window.requestAnimationFrame(refreshRate);
};
window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    mapCanvas = document.createElement("canvas");
    mapCanvas.width = cols * tileWidth;
    mapCanvas.height = rows * tileHeight;
    mapCtx = mapCanvas.getContext("2d");
    drawMap();
    window.requestAnimationFrame(refreshRate);
};
