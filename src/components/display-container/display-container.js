import "./display-container.css";
import { Display } from "../display";

export const DisplayContainer = (app) => {
    const container = document.createElement("div");
    container.id = "display-container";

    const sign = new Display({ changeWithViewport: true }, "STATEGUESSR");
    sign.canvas.id = "display-sign";
    const indicator = new Display({ length: 1, playSound: false }, "!");
    indicator.canvas.id = "display-indicator";

    container.append(sign.canvas, indicator.canvas);
    app.appendChild(container);

    const containerBaseWidth = container.getBoundingClientRect().width;
    const signBaseClientWidth = sign.canvas.clientWidth;
    const signCanvasBaseWidth = sign.canvas.width;

    const resizeSign = () => {
        const viewportWidth = document.getElementById("wrapper").clientWidth;
        const difference = Math.max(containerBaseWidth - viewportWidth, 0);

        if (difference === 0) return;

        const newContainerWidth = containerBaseWidth - difference;
        const newCanvasStyleWidth = signBaseClientWidth - difference;
        const newCanvasWidth = newCanvasStyleWidth * signCanvasBaseWidth / signBaseClientWidth;

        sign.canvas.width = newCanvasWidth;
        sign.canvas.style.width = `${newCanvasStyleWidth}px`;
        container.style.width = `${newContainerWidth}px`;

        sign.render();
    };

    window.addEventListener("resize", () => {
        resizeSign();
    });

    resizeSign();
    return [sign, indicator];
};
