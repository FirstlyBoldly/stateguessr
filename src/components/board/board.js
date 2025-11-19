import "./board.css";
import { Button } from "../button";
import { Freehand, clearCanvas } from "../freehand";

const rippingPaperSoundEffect = new Audio("/sounds/ripping-paper.mp3");
let freehandIsTransitioning = false;

let shortcutsEnabled = false;

const getCopyURL = (canvas) => {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    return tempCanvas.toDataURL();
};

export const calcFreehandSize = () => {
    const displayContainer = document.getElementById("text-display");
    const displayContainerStyle = window.getComputedStyle(displayContainer);
    const displayContainerViewportOffsets = displayContainer.getBoundingClientRect();
    const wrapperClientWidth = document.getElementById("wrapper").clientWidth;
    const newFreehandSize = Math.max(
        window.innerHeight - displayContainerViewportOffsets.bottom - parseInt(displayContainerStyle.marginBottom) * 2,
        224
    );
    return newFreehandSize > wrapperClientWidth ? wrapperClientWidth : newFreehandSize;
};

export const resetFreehand = () => {
    if (freehandIsTransitioning) {
        return;
    }

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

    const copy = getCopyURL(front);

    clearCanvas(
        front.getContext("2d"),
        front.width,
        front.height
    );
    front.classList.add("dropped");
    rippingPaperSoundEffect.play();

    return copy;
}

const resetFreehandButton = () => {
    const button = Button(
        "Reset",
        resetFreehand
    );
    button.classList.add("reset-button");
    const refreshLogo = document.getElementById("refresh-logo").cloneNode(true);
    refreshLogo.setAttribute("width", "32px");
    refreshLogo.setAttribute("height", "32px");
    if (refreshLogo) {
        button.innerHTML = "";
        button.appendChild(refreshLogo);
    }

    return button;
};

const displayGoalButton = () => {
    const button = Button(
        "Goal",
        () => {
            const imageShow = document.getElementById("image-show");
            imageShow.style.display = "inline";
        }
    );
    button.id = "goal-display-button";
    const targetFlagLogo = document.getElementById("target-flag-logo").cloneNode(true);
    targetFlagLogo.setAttribute("width", "24px");
    targetFlagLogo.setAttribute("height", "24px");
    if (targetFlagLogo) {
        button.innerHTML = "";
        button.appendChild(targetFlagLogo);
    }

    return button;
}

const resetFreehandShortcut = (e) => {
    if ((e.ctrlKey && e.key === "q") && shortcutsEnabled) {
        const buttons = document.getElementsByClassName("reset-button");
        for (let i = 0; i < buttons.length; i++) {
            buttons.item(i).click();
        }

        resetFreehand();
    }
}

export const addFreehandShortcuts = () => {
    document.addEventListener("keydown", resetFreehandShortcut);
};

export const enableFreehandShortcuts = () => {
    shortcutsEnabled = true;
};

export const disableFreehandShortcuts = () => {
    shortcutsEnabled = false;
};

export const Board = () => {
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
    const displayGoal = displayGoalButton();

    board.append(resetCanvas, displayGoal, freehand1, freehand2);

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

    return board;
};
