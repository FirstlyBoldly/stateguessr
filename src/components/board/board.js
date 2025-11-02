import "./board.css";
import { Button } from "../button";
import { predictState } from "../../services/tfjs";
import { Canvas, clearCanvas, canvasEvents } from "../canvas";

export const Board = (sign) => {
    const board = document.createElement("div");
    board.id = "board";

    const displayContainer = document.getElementById("display-container");
    const displayContainerStyle = window.getComputedStyle(displayContainer);

    const canvas = Canvas();
    const displayContainerViewportOffsets = displayContainer.getBoundingClientRect();
    const canvasSize = window.innerHeight - displayContainerViewportOffsets.bottom - parseInt(displayContainerStyle.marginBottom);
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const button = Button(
        "",
        () => {
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;
            clearCanvas(ctx, w, h);
            sign.clear();
        }
    );
    button.id = "reset-button";
    const refreshLogo = document.getElementById("refresh-logo");
    button.appendChild(refreshLogo);

    board.append(button, canvas);

    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const prediction = predictState(canvas).toUpperCase();
        if (prediction) {
            sign.write(prediction);
        }
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        sign.clear();
    });

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "q") {
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;
            button.click();
            clearCanvas(ctx, w, h);
        }
    });

    return board;
};
