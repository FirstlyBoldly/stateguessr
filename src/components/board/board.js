import "./board.css";
import { Button } from "../button";
import { predictState } from "../../services/tfjs";
import { Freehand, clearCanvas, canvasEvents } from "../freehand";

const rippingPaperSoundEffect = document.getElementById("ripping-paper");
let freehandIsTransitioning = false;

const calcFreehandSize = () => {
    const displayContainer = document.getElementById("display-container");
    const displayContainerStyle = window.getComputedStyle(displayContainer);
    const displayContainerViewportOffsets = displayContainer.getBoundingClientRect();
    return window.innerHeight - displayContainerViewportOffsets.bottom - parseInt(displayContainerStyle.marginBottom) * 2;
};

const resetFreehand = () => {
    if (freehandIsTransitioning) return;
    freehandIsTransitioning = true;

    let front = document.getElementById("front-canvas");
    let back = document.getElementById("back-canvas");

    front.addEventListener("transitionend", function handle() {
        this.removeEventListener("transitionend", handle);
        this.classList.remove("dropped");

        clearCanvas(
            this.getContext("2d"),
            this.width,
            this.height
        );

        this.id = "back-canvas";
        back.id = "front-canvas";

        freehandIsTransitioning = false;
    });

    front.classList.add("dropped");
    rippingPaperSoundEffect.play();
}

const resetFreehandButton = () => {
    const button = Button(
        "",
        () => {
            resetFreehand();
        }
    );
    button.id = "reset-button";
    const refreshLogo = document.getElementById("refresh-logo");
    button.appendChild(refreshLogo);
    return button;
};

const addFreehandShortcuts = () => {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "q") {
            const button = document.getElementById("reset-button");
            button.classList.add("button-is-pressed");
            button.addEventListener("transitionend", function handle() {
                this.removeEventListener("transitionend", handle);
                this.classList.remove("button-is-pressed");
            });
            resetFreehand();
        }
    });
};

export const Board = (sign, indicator) => {
    const board = document.createElement("div");
    board.id = "board";

    const freehand1 = Freehand();
    freehand1.id = "front-canvas";
    const freehand2 = Freehand();
    freehand2.id = "back-canvas";

    const canvasSize = calcFreehandSize();
    freehand1.width = freehand2.width = canvasSize;
    freehand1.height = freehand2.height = canvasSize;
    board.style.width = `${canvasSize}px`;
    board.style.height = `${canvasSize}px`;

    const resetCanvas = resetFreehandButton();

    board.append(resetCanvas, freehand1, freehand2);

    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const canvas = document.getElementById("front-canvas");
        const prediction = predictState(canvas).toUpperCase();
        if (prediction) {
            sign.write(prediction);
            indicator.write("?");
        }
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        sign.clear();
        indicator.write("-");
    });

    // window.addEventListener("resize", () => {
    //     const canvasSize = calcFreehandSize();
    //     freehand1.width = freehand2.width = canvasSize;
    //     freehand1.height = freehand2.height = canvasSize;
    //     board.style.width = `${canvasSize}px`;
    //     board.style.height = `${canvasSize}px`;
    // });

    addFreehandShortcuts();

    return board;
};
