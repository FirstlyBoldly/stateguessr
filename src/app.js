import "./style.css";
import { Board } from "./components/board";
import { Display } from "./components/display";

const app = document.getElementById("app");
if (app) {
    const displayContainer = document.createElement("div");
    displayContainer.id = "display-container";
    const sign = new Display({}, "STATEGUESSR");
    const indicator = new Display({ length: 1, playSound: false }, "!");

    displayContainer.append(sign.canvas, indicator.canvas);
    app.appendChild(displayContainer);

    const board = Board(sign, indicator);
    app.appendChild(board);
} else {
    console.error("No port element of entry detected!");
}
