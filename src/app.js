import "./global.css";
import { predictState } from "./services/tfjs";
import { EndMenu } from "./components/end-menu";
import { RoundMenu } from "./components/round-menu";
import { StartMenu } from "./components/start-menu";
import { ImageShow } from "./components/image-show";
import { canvasEvents } from "./components/freehand";
import { DisplayContainer } from "./components/display-container";
import {
    closeStatDisplay,
    openStatDisplay,
    StatDisplay,
} from "./components/stat-display";
import {
    enableFreehandShortcuts,
    Board,
    disableFreehandShortcuts,
    resetFreehand,
} from "./components/board";
import { getUniqueValueFromObject, loadStates, preprocess } from "./helpers";
import { upload } from "./services/storage";

const app = document.getElementById("app");

const [statContainer, roundIndicator, timer, scoreIndicator] = StatDisplay(app);

// Need direct manipulation of the instances.
const [, sign, indicator] = DisplayContainer(app);

const board = Board();
app.appendChild(board);

const [imageShow, imageShowDisplayImage, imageShowCloseButton] = ImageShow();
app.appendChild(imageShow);

const startMenu = new StartMenu();
app.append(startMenu.menu);

const endMenu = new EndMenu();
app.appendChild(endMenu.menu);

startMenu.closeButton.addEventListener("click", () => {
    // Get rid of the start menu.
    startMenu.closeButton.disabled = true;
    startMenu.close(() => {
        startMenu.menu.remove();
    });

    enableFreehandShortcuts();

    openStatDisplay(statContainer);

    // Variables of the game loop.
    const MAX_ROUNDS = 5;
    const ROUND_DURATION_IN_SECONDS = 20;
    const INTERMISSION_DURATION_IN_SECONDS = 2;
    const ROUND_STARTING_NUMBER = 0;

    let roundNumber = ROUND_STARTING_NUMBER;
    let roundInterval = null;

    // This will collect the final player drawing at end of each round.
    let playerImages = {};

    const states = loadStates();
    let state = null;

    let correctGuesses = 0;

    const endGame = () => {
        disableFreehandShortcuts();
        clearInterval(roundInterval);
        closeStatDisplay(statContainer);

        // Make sure the board is not interactable until another round/game starts.
        board.style.pointerEvents = "none";

        // Insert all the round images onto the end menu.
        endMenu.pushPlayerGallery(...Object.entries(playerImages));
        playerImages = {};

        sign.unlock();
        indicator.unlock();
        sign.write("finish", {
            onColor: "#BC0000",
        });
        indicator.write("!", {
            onColor: "#BC0000",
        });
        sign.lock();
        indicator.lock();

        endMenu.setStats(correctGuesses, MAX_ROUNDS);
        endMenu.open();
    };

    const endRound = () => {
        disableFreehandShortcuts();
        clearInterval(roundInterval);

        imageShowCloseButton.click();
        board.style.pointerEvents = "none";

        const canvas = document.getElementById("front-canvas");
        const processedCanvas = preprocess(canvas);
        if (processedCanvas) {
            upload(roundNumber, state, processedCanvas);
        }

        playerImages[state] = resetFreehand();

        sign.unlock();
        indicator.unlock();
        sign.reset();
        indicator.write("-");
        sign.lock();
        indicator.lock();

        round();
    };

    const winRound = (state) => {
        disableFreehandShortcuts();
        clearInterval(roundInterval);
        clearInterval(timer.interval);

        board.style.pointerEvents = "none";

        sign.unlock();
        indicator.unlock();
        sign.write(state, { onColor: "#34b518", shadowColor: "#2b7705" });
        indicator.write("!", { onColor: "#34b518", shadowColor: "#2b7705" });
        sign.lock();
        indicator.lock();

        correctGuesses++;
        scoreIndicator.write(`${correctGuesses}/${MAX_ROUNDS}`);
        setTimeout(endRound, 2000);
    };

    const round = () => {
        ++roundNumber;
        if (roundNumber > MAX_ROUNDS) {
            endGame();
            return;
        }

        sign.unlock();
        indicator.unlock();
        sign.write("next up...");
        indicator.write("-");
        sign.lock();
        indicator.lock();

        roundIndicator.write(`#${roundNumber}`);
        scoreIndicator.write(`${correctGuesses}/${MAX_ROUNDS}`);

        state = getUniqueValueFromObject(states, Object.keys(playerImages));

        states[state]().then((module) => {
            timer.write("--/--");

            imageShowDisplayImage.src = module.default;
            const roundMenu = new RoundMenu(state, module.default);

            app.append(roundMenu.menu);
            roundMenu.open();

            setTimeout(() => {
                roundMenu.close(() => {
                    roundMenu.menu.remove();
                });

                enableFreehandShortcuts();
                board.style.pointerEvents = "auto";

                sign.unlock();
                indicator.unlock();
                sign.write("stateguessr");
                indicator.write("!");

                timer.startFrom(ROUND_DURATION_IN_SECONDS);

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

    // We might need to do something about this nested mess...
    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const canvas = document.getElementById("front-canvas");
        const processedCanvas = preprocess(canvas);
        if (processedCanvas) {
            upload(roundNumber, state, processedCanvas);
        }

        predictState(processedCanvas).then((prediction) => {
            if (prediction) {
                sign.write(prediction);
                indicator.write("?");
                if (prediction === state) {
                    winRound(prediction);
                }
            }
        });
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        sign.reset();
        indicator.write("-");
    });

    endMenu.retryButton.addEventListener("click", () => {
        roundNumber = ROUND_STARTING_NUMBER;
        board.style.pointerEvents = "auto";

        openStatDisplay(statContainer);

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

        enableFreehandShortcuts();
    });

    round();
});
