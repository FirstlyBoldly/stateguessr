import "./global.css";
import { StartMenu } from "./components/start-menu";
import { Board } from "./components/board";
import { DisplayContainer } from "./components/display-container";

// Yes yes, magic number I know...
const NUMBER_OF_ROUNDS = 7;
const app = document.getElementById("app");
if (app) {
    DisplayContainer(app);

    const startMenu = StartMenu();
    app.append(startMenu);

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", () => {
        const board = Board();
        app.appendChild(board);
        while (true) {
            for (let round = 0; round < NUMBER_OF_ROUNDS; round++) {

            }
        }
    });
} else {
    console.error("No element to append onto.");
}
