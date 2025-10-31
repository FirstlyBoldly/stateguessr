import "./display.css";

export const Display = (text = "") => {
    const textContainer = document.createElement("div");
    textContainer.classList.add("display");
    textContainer.innerText = text;
    return textContainer;
};
