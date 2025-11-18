import "./global.css";
import { predictState } from "./services/tfjs";
import { EndMenu } from "./components/end-menu";
import { RoundMenu } from "./components/round-menu";
import { StartMenu } from "./components/start-menu";
import { ImageShow } from "./components/image-show";
import { canvasEvents } from "./components/freehand";
import { Board, resetFreehand } from "./components/board";
import { DisplayContainer } from "./components/display-container";
import { getUniqueValueFromObject, loadStates } from "./helpers";

const app = document.getElementById("app");

// Need direct manipulation of the instances.
const [, sign, indicator] = DisplayContainer(app);

const board = Board();
app.appendChild(board);

const endMenu = new EndMenu();
app.appendChild(endMenu.menu);

const [imageShow, imageShowDisplayImage, imageShowCloseButton] = ImageShow();
app.appendChild(imageShow);

const startMenu = new StartMenu();
app.append(startMenu.menu);

startMenu.closeButton.addEventListener("click", () => {
    // Get rid of the start menu.
    startMenu.closeButton.disabled = true;
    startMenu.close(() => {
        startMenu.menu.remove();
    });

    // Variables of the game loop.
    const MAX_ROUNDS = 5;
    const ROUND_DURATION_IN_SECONDS = 20;
    const INTERMISSION_DURATION_IN_SECONDS = 2;
    const ROUND_STARTING_NUMBER = 0;

    let roundNumber = ROUND_STARTING_NUMBER;
    let roundTimeout = null;
    let roundInterval = null;

    // This will collect the final player drawing at end of each round.
    let playerImages = {};

    const states = loadStates();
    let state = null;

    const endGame = () => {
        clearInterval(roundInterval);
        clearTimeout(roundTimeout);

        // Make sure the board is not interactable until another round/game starts.
        board.style.pointerEvents = "none";

        // Insert all the round images onto the end menu.
        endMenu.pushPlayerGallery(...Object.entries(playerImages));
        playerImages = {};

        sign.unlock();
        indicator.unlock();
        sign.write("time-is-up", {
            onColor: "#BC0000",
        });
        indicator.write("!", {
            onColor: "#BC0000",
        });
        sign.lock();
        indicator.lock();

        endMenu.open();
    };

    const endRound = () => {
        imageShowCloseButton.click();
        board.style.pointerEvents = "none";
        playerImages[state] = resetFreehand();

        sign.unlock();
        indicator.unlock();
        sign.reset();
        indicator.write("-");
        sign.lock();
        indicator.lock();

        round();
    };

    const round = () => {
        ++roundNumber;
        if (roundNumber > MAX_ROUNDS) {
            endGame();
            return;
        }

        sign.unlock();
        indicator.unlock();
        sign.write(`round:${roundNumber}`);
        indicator.write("-");
        sign.lock();
        indicator.lock();

        state = getUniqueValueFromObject(states, Object.keys(playerImages));

        states[state]().then(module => {
            imageShowDisplayImage.src = module.default;
            const roundMenu = new RoundMenu(state, module.default);

            app.append(roundMenu.menu);
            roundMenu.open();

            setTimeout(() => {
                roundMenu.close(() => {
                    roundMenu.menu.remove();
                });
                board.style.pointerEvents = "auto";

                sign.unlock();
                indicator.unlock();
                sign.write("stateguessr");
                indicator.write("!");

                let remainingSeconds = ROUND_DURATION_IN_SECONDS;
                roundInterval = setInterval(() => {
                    --remainingSeconds;
                    if (remainingSeconds === 0) {
                        clearInterval(roundInterval);
                        endRound();
                    }
                }, 1000);
            }, INTERMISSION_DURATION_IN_SECONDS * 1000);
        });
    };

    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const canvas = document.getElementById("front-canvas");
        predictState(canvas).then(
            (prediction) => {
                if (prediction) {
                    sign.write(prediction);
                    indicator.write("?");

                    console.log(prediction, state);
                    if (prediction === state) {
                        alert("You got it!");
                        endRound();
                    }
                }
            }
        );
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        sign.reset();
        indicator.write("-");
    });

    endMenu.retryButton.addEventListener("click", () => {
        roundNumber = ROUND_STARTING_NUMBER;
        board.style.pointerEvents = "auto";

        endMenu.close(() => {
            endMenu.emptyPlayerGallery();
        });

        sign.unlock();
        indicator.unlock();
        sign.write("stateguessr");
        indicator.write("!");

        round();
    });

    endMenu.closeButton.addEventListener("click", () => {
        document.getElementById("goal-display-button").remove();
        board.style.pointerEvents = "auto";

        endMenu.close();

        sign.unlock();
        indicator.unlock();
        sign.write("sandbox");
        indicator.write("-");
    });

    round();
});
