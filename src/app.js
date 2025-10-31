import "./style.css";
import { Board } from "./components/board";

const app = document.getElementById("app");
if (app) {
    const board = Board();
    app.appendChild(board);
} else {
    console.error("No port element of entry detected!");
}
