import "./global.css";
import { StartMenu } from "./components/start-menu";
import { Board } from "./components/board";
import { DisplayContainer } from "./components/display-container";
import { EndMenu } from "./components/end-menu/end-menu";

// Yes yes, magic number I know...
const NUMBER_OF_ROUNDS = 1;
const app = document.getElementById("app");
if (app) {
    DisplayContainer(app);

    const startMenu = StartMenu();
    app.append(startMenu);

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", () => {
        const board = Board();
        app.appendChild(board);

        const endMenu = EndMenu();
        app.appendChild(endMenu);

        const round = (roundNumber) => {
            console.log(`[TEST] ROUND: ${roundNumber + 1}`);
        }

        const game = () => {
            for (let i = 0; i < NUMBER_OF_ROUNDS; i++) {
                round(i);
            }

            endMenu.style.pointerEvents = "auto";
            endMenu.style.display = "inline";
            endMenu.classList.remove("closed");
            endMenu.classList.add("opened");
        };

        document.getElementById("start-again-button").addEventListener("click", () => {
            game();
        });

        document.getElementById("sandbox-mode-button").addEventListener("click", () => {
            const goalDisplayButton = document.getElementById("goal-display-button");
            goalDisplayButton.style.display = "none";
            goalDisplayButton.style.pointerEvents = "none";
        });

        game();
    });
} else {
    console.error("No element to append onto.");
}
