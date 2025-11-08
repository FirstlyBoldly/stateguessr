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

const getCoordsFromEvent = (e, freehand) => {
    const rect = freehand.getBoundingClientRect();
    return {
        x: e.offsetX ?? e.touches[0].clientX - rect.left,
        y: e.offsetY ?? e.touches[0].clientY - rect.top,
        pressure: e.pressure ?? 0.5,
    }
}

const drawStroke = (ctx, points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.fillStyle = fillStyle;
    ctx.stroke();
};

const handleDown = (e, freehand) => {
    if (e.type === "touchstart") {
        e.preventDefault();
    }

    isDrawing = true;
    inputs = [getCoordsFromEvent(e, freehand)];
    clearInterval(timeout);
    timeout = setInterval(() => {
        window.dispatchEvent(canvasUpdated());
    }, 3000);
};

const handleMove = (e, freehand) => {
    if (e.type === "touchmove") {
        e.preventDefault();
    }

    if (!isDrawing) {
        return;
    }

    inputs.push(getCoordsFromEvent(e, freehand));
    const output = getStroke(inputs, options);
    drawStroke(freehand.getContext("2d"), output);
};

const handleLeave = (e, ctx) => {
    if (e.type === "touchcancel") {
        e.preventDefault();
    }

    if (isDrawing) {
        stopDrawing(ctx);
    }
};

const handleUp = (e, ctx) => {
    if (e.type === "touchend") {
        e.preventDefault();
    }

    stopDrawing(ctx);
};

const stopDrawing = (ctx) => {
    isDrawing = false;
    ctx.closePath();

    window.dispatchEvent(canvasUpdated());

    clearInterval(timeout);
    timeout = null;
};

export const Freehand = () => {
    const freehand = document.createElement("canvas");
    const ctx = freehand.getContext("2d");
    freehand.classList.add("freehand");

    freehand.addEventListener("mousedown", (e) => { handleDown(e, freehand); });
    freehand.addEventListener("touchstart", (e) => { handleDown(e, freehand); }, { passive: false });

    freehand.addEventListener("mousemove", (e) => { handleMove(e, freehand); });
    freehand.addEventListener("touchmove", (e) => { handleMove(e, freehand); }, { passive: false });

    freehand.addEventListener("mouseleave", (e) => { handleLeave(e, ctx); });
    freehand.addEventListener("touchcancel", (e) => { handleLeave(e, ctx); }, { passive: false });

    freehand.addEventListener("mouseup", (e) => { handleUp(e, ctx); });
    freehand.addEventListener("touchend", (e) => { handleUp(e, ctx); }, { passive: false });

    return freehand;
};
