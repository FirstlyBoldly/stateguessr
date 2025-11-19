import "./round-menu.css";
import { MenuPrototype } from "../menu";

export class RoundMenu extends MenuPrototype {
    constructor(state, imageSource, initialState = "closed") {
        super(initialState);

        this.menu.id = "round-menu";
        this.contentWrapper.id = "round-menu-content-wrapper";
        this.buttonWrapper.id = "round-menu-button-wrapper";

        this.closeButton.innerText = "draw";
        this.closeButton.id = "round-menu-close-button";

        const text = document.createElement("h2");
        text.id = "round-menu-text";
        text.innerText = `Draw the state of ${state}!`;

        const img = document.createElement("img");
        img.id = "round-menu-img";
        img.src = imageSource;

        this.contentWrapper.append(text, img);
    }
}
