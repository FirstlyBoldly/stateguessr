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
    startMenu.close(startMenu.menu.remove);

    enableFreehandShortcuts();

    openStatDisplay(statContainer);

    // Variables of the game loop.
    const MAX_ROUNDS = 5;
    const ROUND_STARTING_NUMBER = 0;
    const ROUND_DURATION_IN_SECONDS = 20;
    const INTERMISSION_DURATION_IN_SECONDS = 2;

    let roundNumber = ROUND_STARTING_NUMBER;
    // Reference to the one second interval per each round.
    let roundInterval = null;

    // This will collect the final player drawing at end of each round.
    let playerImages = {};

    // Loads a state:stateUrl pair object.
    const states = loadStates();

    // Target state of the round.
    let state = null;

    // Game session tally.
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

        // Indicate end of game.
        // Why do we have to lock/unlock the `Display` objects?
        // ... because I suck at defining harmonic event dispatches and event listeners duh!
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

        // Show player performance.
        endMenu.setStats(correctGuesses, MAX_ROUNDS);
        endMenu.open();
    };

    const endRound = () => {
        disableFreehandShortcuts();
        clearInterval(roundInterval);

        imageShowCloseButton.click();
        board.style.pointerEvents = "none";

        // Get final snapshot at end of round.
        // We do this for data collection purposes.
        const canvas = document.getElementById("front-canvas");
        const processedCanvas = preprocess(canvas);

        // Only bother uploading if the canvas isn't blank.
        // I don't want to lose any more money that I have, in pursuit of this stupid idea...
        if (processedCanvas) {
            upload(roundNumber, state, processedCanvas);
        }

        // Reset the canvas and save the final snapshot for player gallery purposes.
        // The reason we have two separate instances canvas data collection?
        // 1. I suck at programming.
        // 2. The images are completely different in use case/format.
        playerImages[state] = resetFreehand();

        sign.unlock();
        indicator.unlock();
        sign.reset();
        indicator.write("-");
        sign.lock();
        indicator.lock();

        // And again we start!
        startRound();
    };

    const winRound = (state) => {
        disableFreehandShortcuts();
        clearInterval(roundInterval);
        clearInterval(timer.interval);

        board.style.pointerEvents = "none";

        // TODO: Formalize the colors.
        // Some are in rgb, some in hex.
        // Honestly, they should be tucked away in their on files really.
        sign.unlock();
        indicator.unlock();
        sign.write(state, { onColor: "#34b518", shadowColor: "#2b7705" });
        indicator.write("!", { onColor: "#34b518", shadowColor: "#2b7705" });
        sign.lock();
        indicator.lock();

        // Respond to player win immediately.
        ++correctGuesses;
        scoreIndicator.write(`${correctGuesses}/${MAX_ROUNDS}`);

        // Show the green display for a bit before ending the round properly.
        setTimeout(endRound, INTERMISSION_DURATION_IN_SECONDS * 1000);
    };

    const round = () => {
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
    };

    const startRound = () => {
        // This is our base case!
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

        // Get a new target state for this round.
        // Must not overlap with previous rounds!
        state = getUniqueValueFromObject(states, Object.keys(playerImages));

        // The actual image data is loaded onto memory lazily...
        states[state]().then((module) => {
            timer.write("--/--");

            // Prepare the target display
            imageShowDisplayImage.src = module.default;

            // New instance of the round menu.
            // Maybe we should just keep one instance going...
            // I don't know, too lazy to benchmark performance.
            const roundMenu = new RoundMenu(state, module.default);

            app.append(roundMenu.menu);
            roundMenu.open();

            // Give the player some time to look at the target state silhouette.
            setTimeout(() => {
                roundMenu.close(roundMenu.menu.remove);
                round();
            }, INTERMISSION_DURATION_IN_SECONDS * 1000);
        });
    };

    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const canvas = document.getElementById("front-canvas");
        const processedCanvas = preprocess(canvas);

        // Only proceed if the canvas has data in it (i.e., not blank).
        if (processedCanvas) {
            // Upload for data collection purposes.
            upload(roundNumber, state, processedCanvas);

            // The meat of the game.
            predictState(processedCanvas).then((prediction) => {
                if (prediction) {
                    sign.write(prediction);
                    indicator.write("?");
                    if (prediction === state) {
                        winRound(prediction);
                    }
                }
            });
        }
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        sign.reset();
        indicator.write("-");
    });

    endMenu.retryButton.addEventListener("click", () => {
        // Reset everything to their initial state.
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

        startRound();
    });

    // Sandbox mode.
    // There is no target state for the model to guess towards.
    // This is purely for the fun of the game.
    // Without the stress of a timer...
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

    // Entrypoint.
    startRound();
});
