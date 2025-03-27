const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let paths = [];
let undonePaths = [];
let color = "#000000"; 
let penSize = 3;

// Mouse Event Listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

function startDrawing(event) {
    drawing = true;
    const path = { points: [], color: ctx.strokeStyle, width: ctx.lineWidth };
    paths.push(path);
    addPoint(event, path);
}

function draw(event) {
    if (!drawing) return;
    const path = paths[paths.length - 1];
    addPoint(event, path);
    redrawCanvas();
}

function stopDrawing() {
    drawing = false;
}

function addPoint(event, path) {
    const x = event.offsetX;
    const y = event.offsetY;
    path.points.push({ x, y });
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.beginPath();
        path.points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    });
}

function clearCanvas() {
    paths = [];
    undonePaths = [];
    redrawCanvas();
}

function undo() {
    if (paths.length > 0) {
        undonePaths.push(paths.pop());
        redrawCanvas();
    }
}

function redo() {
    if (undonePaths.length > 0) {
        paths.push(undonePaths.pop());
        redrawCanvas();
    }
}

function saveCanvas() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "drawing.png";
    link.click();
}

// Additional Functions
function changeColor(newColor) {
    ctx.strokeStyle = newColor;
}

function changePenSize(newSize) {
    ctx.lineWidth = newSize;
}
