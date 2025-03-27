const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let paths = [];
let undonePaths = [];
let color = "#000000"; 
let penSize = 3;

// Resize canvas dynamically
function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    redrawCanvas();
}

// Initialize canvas size on load
window.onload = resizeCanvas;
window.onresize = resizeCanvas;

// Mouse and Touch Event Listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("touchstart", startDrawingTouch);
canvas.addEventListener("touchmove", drawTouch);
canvas.addEventListener("touchend", stopDrawing);

// Start Drawing
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

// Stop Drawing
function stopDrawing() {
    drawing = false;
}

// Touch Drawing Support
function startDrawingTouch(event) {
    event.preventDefault();
    startDrawing(event.touches[0]);
}

function drawTouch(event) {
    event.preventDefault();
    draw(event.touches[0]);
}

// Add a point to the path
function addPoint(event, path) {
    const x = event.offsetX || event.clientX - canvas.getBoundingClientRect().left;
    const y = event.offsetY || event.clientY - canvas.getBoundingClientRect().top;
    path.points.push({ x, y });
}

// Redraw the canvas
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

// Clear the Canvas
function clearCanvas() {
    paths = [];
    undonePaths = [];
    redrawCanvas();
}

// Undo Action
function undo() {
    if (paths.length > 0) {
        undonePaths.push(paths.pop());
        redrawCanvas();
    }
}

// Redo Action
function redo() {
    if (undonePaths.length > 0) {
        paths.push(undonePaths.pop());
        redrawCanvas();
    }
}

// Save as PNG
function saveCanvas() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "drawing.png";
    link.click();
}

// Change Pen Color
function changeColor(newColor) {
    ctx.strokeStyle = newColor;
}

// Change Pen Size
function changePenSize(newSize) {
    ctx.lineWidth = newSize;
}
