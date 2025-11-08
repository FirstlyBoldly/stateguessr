import "./global.css";
import { Board } from "./components/board";
import { canvasEvents } from "./components/freehand";
import { predictState } from "./services/tfjs";
import { DisplayContainer } from "./components/display-container";

const app = document.getElementById("app");
if (app) {
    const [sign, indicator] = DisplayContainer(app);
    Board(app);

    window.addEventListener(canvasEvents.canvasUpdated, () => {
        const canvas = document.getElementById("front-canvas");
        const prediction = predictState(canvas).toUpperCase();
        if (prediction) {
            sign.write(prediction);
            indicator.write("?");
        }
    });

    window.addEventListener(canvasEvents.canvasCleared, () => {
        sign.reset();
        indicator.write("-");
    });

} else {
    console.error("No element to append onto.");
}
