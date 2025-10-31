import "./board.css";
import * as tf from "@tensorflow/tfjs";
import metadata from "/model/metadata";
import { Canvas, clearCanvas, canvasEvents } from "../canvas";
import { Button } from "../button";
import { Display } from "../display";

const model = await tf.loadLayersModel("/model/model.json");

const predictState = (pixels) => {
    let tensor = tf.browser.fromPixels(pixels, 3);
    tensor = tensor.expandDims(0);
    const result = model.predict(tensor);
    const index = result.as1D().argMax().dataSync()[0];
    return metadata["class_names"][index];
};

export const Board = () => {
    const board = document.createElement("div");
    board.id = "board";

    const controlContainer = document.createElement("div");
    controlContainer.id = "control-container";

    const canvas = Canvas();
    const display = Display();
    const button = Button(
        "Reset",
        () => {
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;
            clearCanvas(ctx, w, h);
        }
    );

    controlContainer.append(display, button);
    board.append(canvas, controlContainer);

    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const prediction = predictState(canvas);
        if (prediction) {
            display.innerText = prediction;
        }
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        display.innerText = "";
    });

    return board;
};
