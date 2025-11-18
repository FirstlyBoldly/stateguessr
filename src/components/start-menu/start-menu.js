import "./start-menu.css";
import { MenuPrototype } from "../menu";


export class StartMenu extends MenuPrototype {
    // Courtesy of Aria Noorghorbani, accessed from https://stackoverflow.com/questions/77506413/detecting-if-the-user-is-on-desktop-or-mobile-in-the-browser.
    // static isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    constructor(initialState = "opened") {
        super(initialState);

        this.menu.id = "start-menu";

        const summary = document.createElement("div");
        summary.id = "start-menu-summary";
        summary.innerHTML = `
            <h1>Basically</h1>
            <p>
                Draw a <strong>US state</strong> and</br>
                see if the model can guess it correctly!
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
