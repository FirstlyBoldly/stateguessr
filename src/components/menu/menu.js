import "./menu.css";
import { Button } from "../button";

export class MenuPrototype {
    constructor(initialState = "opened") {
        this.menu = document.createElement("div");
        this.menu.classList.add("menu");

        this.menuWrapper = document.createElement("div");
        this.menuWrapper.classList.add("menu-wrapper");

        this.contentWrapper = document.createElement("div");
        this.contentWrapper.classList.add("menu-content-wrapper");

        this.buttonWrapper = document.createElement("div");
        this.buttonWrapper.classList.add("menu-button-wrapper");

        this.closeButton = Button("x", () => {
            this.close()
        });
        this.closeButton.classList.add("menu-close-button");
        this.buttonWrapper.appendChild(this.closeButton);

        this.menuWrapper.append(this.contentWrapper, this.buttonWrapper);
        this.menu.appendChild(this.menuWrapper);

        window.addEventListener("resize", () => {
            this.resize();
        });

        switch (initialState) {
            case "opened":
                this.menu.style.transform = "translateX(0%)";
                break;

            case "closed":
                this.menu.style.transform = "translateX(-100%)";
                break;

            default:
                this.menu.style.transform = "translateX(0%)";
                break;
        }

        this.resize();
    }

    resize = () => {
        const displayContainer = document.getElementById("text-display");
        const footer = document.getElementById("app-footer");
        const displayContainerStyleBottom = () => {
            const style = window.getComputedStyle(displayContainer);
            return displayContainer.getBoundingClientRect().bottom + window.scrollY + parseFloat(style.marginBottom);
        };

        const wrapper = document.getElementById("wrapper");
        const footerStyleTop = () => {
            const style = window.getComputedStyle(wrapper);
            return footer.getBoundingClientRect().top + window.scrollY - parseFloat(style.margin);
        };

        this.menu.style.top = `${displayContainerStyleBottom()}px`;
        this.menu.style.height = `${footerStyleTop() - displayContainerStyleBottom()}px`;
    }

    open = (onOpen) => {
        setTimeout(() => {
            this.menu.style.display = "inline";
            this.menu.style.transform = "translateX(0%)";
        }, 100);

        const handler = () => {
            setTimeout(() => {
                // this.menu.removeEventListener("transitionend", handler);
                this.menu.style.pointerEvents = "auto";
            }, 100);

            if (onOpen) {
                onOpen();
            }
        }

        // this.menu.addEventListener("transitionend", handler);

        setTimeout(() => {
            handler();
        }, 1000);
    }

    close = (onClose = null) => {
        setTimeout(() => {
            this.menu.style.pointerEvents = "none";
            this.menu.style.transform = "translateX(-100%)";
        }, 100);

        const handler = () => {
            setTimeout(() => {
                // this.menu.removeEventListener("transitionend", handler);
                this.menu.style.display = "none";
            }, 100);

            if (onClose) {
                onClose();
            }
        }

        // this.menu.addEventListener("transitionend", handler);

        setTimeout(() => {
            handler();
        }, 1000);
    }
}
