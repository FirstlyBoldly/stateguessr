import "./board.css";
import { Button } from "../button";
import { Freehand, clearCanvas } from "../freehand";

const rippingPaperSoundEffect = new Audio("/sounds/ripping-paper.mp3");
let freehandIsTransitioning = false;

const calcFreehandSize = () => {
    const displayContainer = document.getElementById("display-container");
    const displayContainerStyle = window.getComputedStyle(displayContainer);
    const displayContainerViewportOffsets = displayContainer.getBoundingClientRect();
    const wrapperClientWidth = document.getElementById("wrapper").clientWidth;
    const newFreehandSize = Math.max(
        window.innerHeight - displayContainerViewportOffsets.bottom - parseInt(displayContainerStyle.marginBottom) * 2,
        224
    );
    return newFreehandSize > wrapperClientWidth ? wrapperClientWidth : newFreehandSize;
};

const resetFreehand = () => {
    if (freehandIsTransitioning) return;
    freehandIsTransitioning = true;

    let front = document.getElementById("front-canvas");
    let back = document.getElementById("back-canvas");

    front.addEventListener("transitionend", function handle() {
        this.removeEventListener("transitionend", handle);
        this.classList.remove("dropped");

        this.id = "back-canvas";
        back.id = "front-canvas";

        freehandIsTransitioning = false;
    });

    clearCanvas(
        front.getContext("2d"),
        front.width,
        front.height
    );
    front.classList.add("dropped");
    rippingPaperSoundEffect.play();
}

const resetFreehandButton = () => {
    const button = Button(
        "",
        () => { resetFreehand(); }
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

export const Board = (app) => {
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

    window.addEventListener("resize", () => {
        const canvasSize = calcFreehandSize();

        const frontCanvas = document.getElementById("front-canvas");
        const frontCanvasCtx = frontCanvas.getContext("2d");

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = frontCanvas.width;
        tempCanvas.height = frontCanvas.height;
        tempCtx.drawImage(frontCanvas, 0, 0);

        freehand1.width = freehand2.width = canvasSize;
        freehand1.height = freehand2.height = canvasSize;
        board.style.width = `${canvasSize}px`;
        board.style.height = `${canvasSize}px`;

        frontCanvasCtx.drawImage(tempCanvas, 0, 0);
    });

    addFreehandShortcuts();

    app.appendChild(board);
};
