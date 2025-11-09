import "./start-menu.css";
import { Menu } from "../menu";
import { Button } from "../button";

// Courtesy of Aria Noorghorbani, accessed from https://stackoverflow.com/questions/77506413/detecting-if-the-user-is-on-desktop-or-mobile-in-the-browser.
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const StartMenu = () => {
    const [menu, menuContentWrapper, menuButtonWrapper] = Menu();

    const introduction = document.createElement("div");
    introduction.classList.add("introduction");
    introduction.innerHTML = `
        <p>
            Draw a state of the
            <strong>United States of America</strong></br>
            and see if an AI model can guess it!
        </p>
    `;

    let tips = "";
    if (!isMobile) {
        tips = document.createElement("div");
        tips.classList.add("tips");
        tips.innerHTML = `
            <h2>Useful Commands</h2>
            <ul>
                <li>Ctrl+q: Reset Canvas</li>
            </ul>
        `;
    }

    const startButton = Button("OK, LET'S START!", () => {
        menu.classList.add("read");
        menu.addEventListener("transitionend", () => {
            menu.remove();
        });
    });
    startButton.id = "start-button";

    menuButtonWrapper.appendChild(startButton);
    menuContentWrapper.append(introduction, tips);

    return menu;
};
