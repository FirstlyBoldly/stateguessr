import "./freehand.css";
import { getStroke } from "perfect-freehand";

const fillStyle = "black";
const options = {
    size: 1,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
};
let timeout = null;
let isDrawing = false;
let inputs = [];

export const canvasEvents = {
    canvasUpdated: "canvas:updated",
    canvasCleared: "canvas:reset",
}

const canvasUpdated = () => {
    return new CustomEvent(canvasEvents.canvasUpdated);
};

const canvasCleared = () => {
    return new CustomEvent(canvasEvents.canvasCleared);
};

export const clearCanvas = (ctx, width, height) => {
    inputs = [];
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "#C4C4C4";
    ctx.fill();
    window.dispatchEvent(canvasCleared());
};

const drawStroke = (ctx, points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.fillStyle = fillStyle;
    ctx.stroke();
};

export const Freehand = () => {
    const freehand = document.createElement("canvas");
    freehand.classList.add("freehand");
    freehand.width = 224;
    freehand.height = 224;

    const ctx = freehand.getContext("2d");
    freehand.addEventListener("pointerdown", (e) => {
        isDrawing = true;
        inputs = [{
            x: e.offsetX,
            y: e.offsetY,
            pressure: e.pressure
        }];
        timeout = setInterval(() => {
            window.dispatchEvent(canvasUpdated());
        }, 3000);
    });

    freehand.addEventListener("pointermove", (e) => {
        if (!isDrawing) return;
        inputs.push({
            x: e.offsetX,
            y: e.offsetY,
            pressure: e.pressure
        });
        const output = getStroke(inputs, options);
        drawStroke(ctx, output);
    });

    const stopDrawing = () => {
        isDrawing = false;
        ctx.closePath();

        window.dispatchEvent(canvasUpdated());

        clearInterval(timeout);
        timeout = null;
    };

    freehand.addEventListener("pointerleave", () => {
        if (isDrawing) {
            stopDrawing();
        }
    });

    freehand.addEventListener("pointerup", () => {
        stopDrawing();
    });

    return freehand;
};
