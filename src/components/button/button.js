import "./button.css";

export const Button = (text, onChange) => {
    const button = document.createElement("button");
    button.classList.add("button-class");
    button.innerText = text;

    let timeout = null;
    button.addEventListener("click", () => {
        if (timeout) {
            return;
        }

        onChange();

        timeout = setTimeout(() => {
            clearTimeout(timeout);
            timeout = null;
            button.classList.remove("button-clicked");
        }, 200);

        button.classList.add("button-clicked");
        button.addEventListener("transitionend", function handler() {
            button.removeEventListener("transitionend", handler);
            button.classList.remove("button-clicked");
        });
    });
    return button;
};
