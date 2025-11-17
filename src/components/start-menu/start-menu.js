import "./start-menu.css";
import { MenuPrototype } from "../menu";


export class StartMenu extends MenuPrototype {
    // Courtesy of Aria Noorghorbani, accessed from https://stackoverflow.com/questions/77506413/detecting-if-the-user-is-on-desktop-or-mobile-in-the-browser.
    // static isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    constructor(initialState = "opened") {
        super(initialState);

        const summary = document.createElement("div");
        summary.id = "start-menu-summary";
        summary.innerHTML = `
            <h1>Welcome</h1>
            <p>
                Draw a state of the <strong>United States of America</strong></br>
                and see if an AI model can guess it!
            </p>
        `;

        let tips = "";
        tips = document.createElement("div");
        tips.id = "start-menu-player-tips";
        tips.innerHTML = `
            <h1>Useful Commands</h1>
            <ul>
                <li>Ctrl+q or [RESET-ICON]: Reset Canvas</li>
                <li>[FLAG-ICON]: See goal</li>
            </ul>
        `;

        this.closeButton.innerText = "start";
        this.closeButton.id = "start-button";

        this.contentWrapper.append(summary, tips);
    }
};
