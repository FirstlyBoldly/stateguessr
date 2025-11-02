import "./button.css";

export const Button = (text, onChange) => {
    const button = document.createElement("button");
    button.classList.add("button-class");
    button.innerText = text;
    button.addEventListener("click", () => {
        onChange();
    });
    return button;
};
