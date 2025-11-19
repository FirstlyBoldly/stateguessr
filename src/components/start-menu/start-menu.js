import "./start-menu.css";
import { Button } from "../button";
import { MenuPrototype } from "../menu";

export class StartMenu extends MenuPrototype {
    // Courtesy of Aria Noorghorbani, accessed from https://stackoverflow.com/questions/77506413/detecting-if-the-user-is-on-desktop-or-mobile-in-the-browser.
    static isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
        );

    constructor(initialState = "opened") {
        super(initialState);

        this.menu.id = "start-menu";
        this.menu.classList.add("stateguessr-background");

        const summary = document.createElement("div");
        summary.id = "start-menu-summary";
        summary.innerHTML = `
            <h1>Basically...</h1>
            <p>
                Draw a <strong>US state</strong> and</br>
                see if the model can <strong>recognize</strong> it!
            </p>
        `;

        let tips = "";
        tips = document.createElement("div");
        tips.id = "start-menu-player-tips";
        tips.innerHTML = `
            <h1>Tips</h1>
            <ul>
                <li>[ <span id="reset-icon-placeholder">Reset Icon</span> ${StartMenu.isMobile ? "" : "or Ctrl+q"} ] <wbr>Reset Canvas</li>
                <li>[ <span id="flag-icon-placeholder">Flag Icon</span> ] <wbr>Preview Target State</li>
            </ul>
        `;

        const dummyButton1 = Button();
        dummyButton1.classList.add("dummy-button", "reset-button");

        const resetLogo = document
            .getElementById("refresh-logo")
            .cloneNode(true);
        resetLogo.setAttribute("width", "36px");
        resetLogo.setAttribute("height", "36px");

        dummyButton1.appendChild(resetLogo);

        const dummyButton2 = Button();
        dummyButton2.classList.add("dummy-button");

        const targetFlagLogo = document
            .getElementById("target-flag-logo")
            .cloneNode(true);
        targetFlagLogo.setAttribute("width", "28px");
        targetFlagLogo.setAttribute("height", "28px");

        dummyButton2.appendChild(targetFlagLogo);

        const resetIconPlaceholder = tips.querySelector(
            "#reset-icon-placeholder",
        );
        resetIconPlaceholder.replaceWith(dummyButton1);

        const flagIconplaceholder = tips.querySelector(
            "#flag-icon-placeholder",
        );
        flagIconplaceholder.replaceWith(dummyButton2);

        this.closeButton.innerText = "start";
        this.closeButton.id = "start-button";

        this.contentWrapper.append(summary, tips);
    }
}
