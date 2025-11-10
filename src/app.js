import "./global.css";
import { StartMenu } from "./components/start-menu";
import { EndMenu } from "./components/end-menu/end-menu";
import { DisplayContainer } from "./components/display-container";
import { Board, resetFreehand } from "./components/board";
import { ImageShow } from "./components/image-show/image-show";

const app = document.getElementById("app");
if (app) {
    const [, sign, indicator] = DisplayContainer(app);

    const startMenu = StartMenu();
    app.append(startMenu);

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", () => {
        startButton.disabled = true;

        const board = Board();
        const endMenu = EndMenu();
        const [imageShow, img] = ImageShow();

        app.append(board, imageShow, endMenu);

        const roundDurationInSeconds = 3;
        const maxRounds = 1;
        let roundNumber = 0;
        let roundTimeout = null;
        let roundInterval = null;

        let gameImages = [];
        const states = import.meta.glob("/src/assets/states/*.jpg");

        const choice = () => {
            const keys = Object.keys(states)
            const size = keys.length;
            if (size === 0) {
                return null;
            }

            const i = Math.trunc(Math.random() * size);
            return keys[i];
        };

        const getUniqueGameState = () => {
            const imgPath = choice();
            while (true) {
                if (imgPath in Object.keys(gameImages)) {
                    imgPath = choice();
                } else {
                    gameImages.push(imgPath);
                    return imgPath;
                }
            }
        };

        const endGame = () => {
            resetFreehand();

            sign.write("DONE");
            indicator.write("!");

            sign.lock();
            indicator.lock();

            clearInterval(roundInterval);
            clearTimeout(roundTimeout);

            board.style.pointerEvents = "none";
            endMenu.style.pointerEvents = "auto";
            endMenu.style.display = "inline";
            endMenu.classList.add("opened");

            gameImages = [];
        };

        const endRound = () => {
            board.style.pointerEvents = "none";
            resetFreehand();

            sign.write(`ROUND:${roundNumber}`);
            indicator.write("-");
            sign.lock();
            indicator.lock();
            round();
        };

        const round = () => {
            sign.unlock();
            indicator.unlock();
            sign.write("STATEGUESSR");
            indicator.write("!");

            roundNumber++;

            const statePath = getUniqueGameState();
            states[statePath]().then(module => {
                img.src = module.default;
            });

            setTimeout(() => {
                board.style.pointerEvents = "auto";
                let remainingSeconds = roundDurationInSeconds;
                roundInterval = setInterval(() => {
                    remainingSeconds--;
                    if (remainingSeconds === 0) {
                        clearInterval(roundInterval);
                        if (roundNumber > maxRounds) {
                            endGame();
                            return;
                        } else {
                            endRound();
                        }
                    }
                }, 1000);
            }, 2000);
        };

        document.getElementById("start-again-button").addEventListener("click", () => {
            board.style.pointerEvents = "auto";
            roundNumber = 0;

            sign.unlock();
            indicator.unlock();

            round();
        });

        document.getElementById("sandbox-mode-button").addEventListener("click", () => {
            const goalDisplayButton = document.getElementById("goal-display-button");
            goalDisplayButton.style.pointerEvents = "none";
            goalDisplayButton.style.display = "none";

            board.style.pointerEvents = "auto";

            sign.unlock();
            indicator.unlock();

            sign.write("SANDBOX MODE");
            indicator.write("-");
        });

        round();
    });
} else {
    console.error("No element to append onto.");
}
