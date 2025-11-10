import "./image-show.css";
import { calcFreehandSize } from "../board";
import { Button } from "../button";

export const ImageShow = () => {
    const imageShow = document.createElement("div");
    imageShow.id = "image-show";

    const img = document.createElement("img");
    img.id = "image-show-display-image";

    const resizeImageShow = () => {
        const size = calcFreehandSize();
        imageShow.style.width = `${size}px`;
        imageShow.style.height = `${size}px`;

        const displayContainer = document.getElementById("display-container")
        const displayContainerRect = displayContainer.getBoundingClientRect();
        const displayContainerStyle = window.getComputedStyle(displayContainer);
        imageShow.style.top = `${displayContainerRect.bottom + parseFloat(displayContainerStyle.marginBottom)}px`;
    };

    const closeButton = Button("X", () => {
        imageShow.classList.remove("opened");
        imageShow.addEventListener("transitionend", function handler() {
            imageShow.removeEventListener("transitionend", handler);
            imageShow.style.display = "none";
        });
    });
    closeButton.id = "image-show-close-button";

    imageShow.addEventListener("resize", resizeImageShow);

    imageShow.append(closeButton, img);

    resizeImageShow();
    return [imageShow, img];
};
