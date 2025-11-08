import "./global.css";
import { Board } from "./components/board";
import { DisplayContainer } from "./components/display-container";

const app = document.getElementById("app");
if (app) {
    DisplayContainer(app);
    Board(app);
} else {
    console.error("No element to append onto.");
}
