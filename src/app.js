import "./global.css";
import { Board } from "./components/board";
import { DisplayContainer } from "./components/display-container";
import { Menu } from "./components/menu";

const app = document.getElementById("app");
if (app) {
    const menu = Menu();
    app.append(menu);

    DisplayContainer(app);
    Board(app);
} else {
    console.error("No element to append onto.");
}
