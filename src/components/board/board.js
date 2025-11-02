import "./board.css";
import { Button } from "../button";
import { predictState } from "../../services/tfjs";
import { Canvas, clearCanvas, canvasEvents } from "../canvas";

export const Board = (sign) => {
    const board = document.createElement("div");
    board.id = "board";

    const displayContainer = document.getElementById("display-container");

    const canvas = Canvas();
    canvas.width = displayContainer.offsetWidth;
    canvas.height = displayContainer.offsetWidth;

    const button = Button(
        "Reset",
        () => {
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;
            clearCanvas(ctx, w, h);
            sign.clear();
        }
    );
    button.id = "reset-button";

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

    return board;
};
