import "./display-container.css";
import { Display } from "../display";

export const DisplayContainer = (app) => {
    const container = document.createElement("div");
    container.id = "text-display";
    container.classList.add("display-container");

    const sign = new Display({}, "STATEGUESSR");
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
        const difference = containerBaseWidth - viewportWidth;

        const newContainerWidth = containerBaseWidth - difference;
        const newCanvasStyleWidth = signBaseClientWidth - difference;
        const newCanvasWidth =
            (newCanvasStyleWidth * signCanvasBaseWidth) / signBaseClientWidth;

        sign.canvas.width = newCanvasWidth;
        sign.canvas.style.width = `${newCanvasStyleWidth}px`;
        container.style.width = `${newContainerWidth}px`;

        sign.render();
    };

    const resizeDot = (x) => {
        if (x.matches) {
            sign.options.dotSize = 4;
            sign.options.dotPadding = 1;
            sign.calcRect();

            indicator.options.dotSize = 4;
            indicator.options.dotPadding = 1;
            indicator.calcRect();

            resizeSign();
            indicator.render();
        } else {
            sign.options.dotSize = 8;
            sign.options.dotPadding = 2;
            sign.calcRect();

            indicator.options.dotSize = 8;
            indicator.options.dotPadding = 2;
            indicator.calcRect();

            resizeSign();
            indicator.render();
        }
    };

    const x = window.matchMedia("(max-width: 576px)");
    x.addEventListener("change", () => {
        resizeDot(x);
    });

    window.addEventListener("resize", resizeSign);

    resizeDot(x);
    resizeSign();
    return [container, sign, indicator];
};
