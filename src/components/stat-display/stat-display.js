import "./stat-display.css";
import { Timer } from "../timer";
import { Display } from "../display";

export const openStatDisplay = (statContainer) => {
    statContainer.style.display = "grid";
    window.dispatchEvent(new Event("resize"));
    setTimeout(() => {
        statContainer.style.top = "0";
    }, 100);
};

export const closeStatDisplay = (statContainer) => {
    statContainer.style.top = "-100px";
    setTimeout(() => {
        statContainer.style.display = "none";
        window.dispatchEvent(new Event("resize"));
    }, 900);
};

export const StatDisplay = (parentElement) => {
    const container = document.createElement("div");
    container.id = "stat-container";

    const sharedOptions = {
        playSound: false,
        dotSize: 4,
        dotPadding: 1,
    };

    const roundIndicator = new Display(
        Object.assign({}, sharedOptions, { length: 2 }),
    );
    const timer = new Timer();
    const scoreIndicator = new Display(
        Object.assign({}, sharedOptions, { length: 3 }),
    );

    roundIndicator.canvas.classList.add(
        "display-container",
        "stat-display-item-1",
    );
    roundIndicator.write("#-");

    timer.canvas.classList.add("stat-display-item-2");

    scoreIndicator.canvas.classList.add(
        "display-container",
        "stat-display-item-3",
    );
    scoreIndicator.write("-/-");

    container.append(
        roundIndicator.canvas,
        timer.canvas,
        scoreIndicator.canvas,
    );

    parentElement.appendChild(container);

    const resize = (x) => {
        if (x.matches) {
            roundIndicator.resizeDot(2, 1);
            timer.resizeDot(3, 1);
            scoreIndicator.resizeDot(2, 1);
        } else {
            const newDotSize = 4;
            const newDotPadding = 1;
            const newDotOptions = [newDotSize, newDotPadding];
            roundIndicator.resizeDot(...newDotOptions);
            timer.resizeDot(...newDotOptions);
            scoreIndicator.resizeDot(...newDotOptions);
        }
    };

    const x = window.matchMedia("(max-width: 576px)");
    resize(x);
    x.addEventListener("change", () => {
        resize(x);
    });

    return [container, roundIndicator, timer, scoreIndicator];
};
