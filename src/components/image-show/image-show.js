import "./image-show.css";
import { Button } from "../button";
import { calcFreehandSize } from "../board";

export const ImageShow = () => {
    const imageShow = document.createElement("div");
    imageShow.id = "image-show";

    const img = document.createElement("img");
    img.id = "image-show-display-image";

    const resize = () => {
        const size = calcFreehandSize();
        imageShow.style.width = `${size}px`;
        imageShow.style.height = `${size}px`;
        img.width = size;
        img.height = size;

        const displayContainer = document.getElementById("text-display");
        const displayContainerRect = displayContainer.getBoundingClientRect();
        const displayContainerStyle = window.getComputedStyle(displayContainer);
        imageShow.style.top = `${displayContainerRect.bottom + parseFloat(displayContainerStyle.marginBottom)}px`;
    };

    const closeButton = Button("X", () => {
        imageShow.style.display = "none";
    });
    closeButton.id = "image-show-close-button";

    window.addEventListener("resize", resize);

    imageShow.append(closeButton, img);

    resize();

    return [imageShow, img, closeButton];
};
