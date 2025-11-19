import "./end-menu.css";
import { Button } from "../button";
import { MenuPrototype } from "../menu";

export class EndMenu extends MenuPrototype {
    constructor(initialState = "closed") {
        super(initialState);

        this.menu.id = "end-menu";
        this.menu.classList.add("stateguessr-background");
        this.contentWrapper.id = "end-menu-content-wrapper";

        const text = document.createElement("div");
        text.innerHTML = `
            <h1>Player Gallery</h1>
        `;

        this.gallery = document.createElement("div");
        this.gallery.id = "end-menu-player-gallery";

        this.contentWrapper.append(text, this.gallery);

        this.retryButton = Button("retry", () => {
            this.close();
        });
        this.retryButton.id = "end-menu-retry-button";

        this.closeButton.innerHTML = "sandbox";
        this.closeButton.id = "end-menu-sandbox-button";

        this.buttonWrapper.appendChild(this.retryButton);
        this.buttonWrapper.id = "end-menu-button-wrapper";
    }

    pushPlayerGallery(...playerImages) {
        for (const [state, imageSource] of playerImages) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("end-menu-player-gallery-item");

            const title = document.createElement("h2");
            title.innerText = state;

            const img = document.createElement("img");
            img.src = imageSource;

            wrapper.append(title, img);
            this.gallery.appendChild(wrapper);
        }
    };

    emptyPlayerGallery() {
        this.gallery.innerHTML = "";
    }
};
