import "./menu.css";
import { Button } from "../button";

export const Menu = () => {
    const menu = document.createElement("div");
    menu.id = "menu";

    const title = document.createElement("h1");
    title.innerHTML = "<strong>StateGuessr</strong>";

    const text = document.createElement("p");
    text.innerHTML = `
        Draw a state of the <strong>United States of America</strong> and see if an AI model can guess it!
        </br>
        <strong>Ctrl+q</strong> to reset if on browser.
        </br>
        <small>P.S. <i>Very much WIP...</i></small>
    `;

    const startButton = Button("START", () => {
        menu.classList.add("read");
    });
    startButton.id = "start-button";

    menu.append(title, text, startButton);

    return menu;
}
