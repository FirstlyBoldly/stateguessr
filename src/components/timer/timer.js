import "./timer.css";
import { Display } from "../display";

export class Timer extends Display {
    constructor(options = {
        length: 5,
        playSound: false,
        dotSize: 4,
        dotPadding: 1,
    }) {
        super(options);
        this.canvas.classList.add("display-container");
        this.write("--:--");
    }

    startFrom(seconds) {
        if (seconds < 0) {
            return;
        }

        const getFormattedTime = () => {
            const format = new Intl.NumberFormat("en", {
                    minimumIntegerDigits: 4,
                    useGrouping: false,
            }).format(seconds);

            return format.slice(0, 2) + ":" + format.slice(2, format.length);
        };

        this.write(getFormattedTime());
        let interval = setInterval(() => {
            --seconds;
            this.write(getFormattedTime());
            if (seconds === 0) {
                clearInterval(interval);
                return;
            }
        }, 1000);
    }
}
