import "./stat-display.css";
import { Timer } from "../timer";
import { Display } from "../display";

export const StatDisplay = (parentElement) => {
    const container = document.createElement("div");
    container.id ="stat-container";

    const sharedOptions = {
        playSound: false,
        dotSize: 4,
        dotPadding: 1,
    };

    const roundIndicator = new Display(Object.assign({}, sharedOptions, { length: 2 }));
    const timer = new Timer();
    const scoreIndicator = new Display(Object.assign({}, sharedOptions, { length: 3 }));

    roundIndicator.canvas.classList.add("display-container", "stat-display-item-1");
    roundIndicator.write("#-");

    timer.canvas.classList.add("stat-display-item-2");

    scoreIndicator.canvas.classList.add("display-container", "stat-display-item-3");
    scoreIndicator.write("-/-");

    container.append(
        roundIndicator.canvas,
        timer.canvas,
        scoreIndicator.canvas,
    );

    parentElement.appendChild(container);
    return [container, roundIndicator, timer, scoreIndicator];
};
