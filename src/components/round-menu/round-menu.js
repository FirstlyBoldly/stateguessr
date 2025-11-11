import "./round-menu.css";
import { MenuPrototype } from "../menu";

export class RoundMenu extends MenuPrototype {
    constructor(state, imageSource, initialState = "closed") {
        super(initialState);

        this.menu.id = "round-menu";

        const text = document.createElement("p");
        text.id = "round-menu-text";
        text.innerText = `Draw the state of ${state}!`;

        const img = document.createElement("img");
        img.id = "round-menu-img";
        img.src = imageSource;

        this.contentWrapper.append(text, img);
    }
};
