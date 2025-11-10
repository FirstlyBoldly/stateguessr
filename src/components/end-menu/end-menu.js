import "./end-menu.css";
import { Menu } from "../menu";
import { Button } from "../button";

export const EndMenu = () => {
    const [menu, menuContentWrapper, menuButtonWrapper] = Menu();
    menu.classList.add("end-menu");

    const text = document.createElement("div");
    text.innerText = "bleh...";

    menuContentWrapper.append(text);

    const sandboxHandler = () => {
        menu.removeEventListener("transitionend", sandboxHandler);
        menu.remove();
    };

    const startAgainHandler = () => {
        menu.removeEventListener("transitionend", startAgainHandler);
        menu.style.pointerEvents = "none";
        menu.style.display = "none";
        menu.classList.remove("closed");
    };

    const onChange = (handler) => {
        menu.classList.remove("opened");
        menu.classList.add("closed");
        menu.addEventListener("transitionend", handler);
    };

    const startAgainOnChange = () => {
        onChange(startAgainHandler);
    }

    const sandboxOnChange = () => {
        onChange(sandboxHandler);
    }

    const startAgainButton = Button("Start Again", startAgainOnChange);
    startAgainButton.id = "start-again-button";

    const sandboxModeButton = Button("Sandbox Mode", sandboxOnChange);
    sandboxModeButton.id = "sandbox-mode-button";

    menuButtonWrapper.classList.add("end-menu-button-wrapper");
    menuButtonWrapper.append(startAgainButton, sandboxModeButton);

    return menu;
};
