import "./end-menu.css";
import { Menu } from "../menu";
import { Button } from "../button";

export const insertPlayerGallery = (playerImages) => {
    const gallery = document.createElement("div");
    gallery.id = "end-menu-player-gallery";

    console.log(playerImages);
    for (const [state, imageSource] of Object.entries(playerImages)) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("end-menu-gallery-wrapper");

        const title = document.createElement("h3");
        title.innerText = state;

        const img = document.createElement("img");
        img.src = imageSource;

        wrapper.append(title, img);

        gallery.appendChild(wrapper);
    }

    const endMenuContentWrapper = document.getElementById("end-menu-content-wrapper");
    endMenuContentWrapper.appendChild(gallery);
};

export const EndMenu = () => {
    const [menu, menuContentWrapper, menuButtonWrapper] = Menu();
    menu.id = "end-menu";
    menuContentWrapper.id = "end-menu-content-wrapper";

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
        menu.classList.remove("closed");
        menu.style.display = "none";
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

    menuButtonWrapper.id = "end-menu-button-wrapper";
    menuButtonWrapper.append(startAgainButton, sandboxModeButton);

    return menu;
};
