import "./round-menu.css";
import { Menu } from "../menu";

export const RoundMenu = (state, imageSource) => {
    const [menu, menuContentWrapper, menuButtonWrapper] = Menu();
    menu.id = "round-menu";

    const text = document.createElement("p");
    text.id = "round-menu-text";
    text.innerText = `Draw the state of ${state}!`;

    const img = document.createElement("img");
    img.id = "round-menu-img";
    img.src = imageSource;

    menuContentWrapper.append(text, img);

    return menu;
};
