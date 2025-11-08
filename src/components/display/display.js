import "./display.css";
import { Fonts } from "./font";

const displayOn = new Audio("/sounds/display-on.mp3");

export class Display {
    static defaultOnColor = "#FF9001";
    static defaultOffColor = "#4B4B4B";
    static defaultBackgroundColor = "#000000";

    constructor(options = {}, text = "") {
        this.options = {
            length: options.length ?? 14,
            canvasPaddingInDots: options.canvasPadding ?? 1,
            dotSize: options.dotSize ?? 12,
            dotPadding: options.dotPadding ?? 2,
            charWidthInDots: options.charWidth ?? 5,
            charHeightInDots: options.charHeight ?? 7,
            onColor: options.onColor ?? Display.defaultOnColor,
            offColor: options.offColor ?? Display.defaultOffColor,
            backgroundColor: options.backgroundColor ?? Display.defaultBackgroundColor,
            playSound: options.playSound ?? true,
            changeWithViewport: options.changeWithViewport ?? false,
            textScroll: options.textScroll ?? false,
            textScrollGapInDots: options.textScrollGapInDots ?? 3,
            scrollIntervalDelay: options.scrollIntervalDelay ?? 1000,
        };

        this.scrollTimeout = null;

        this.charMarginCumulative = 0;
        this.fullDotLength = this.options.dotSize + this.options.dotPadding * 2;
        this.charWidth = this.options.charWidthInDots * this.fullDotLength;
        this.charHeight = this.options.charHeightInDots * this.fullDotLength;

        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("display");

        const totalCharBufferWidth = (this.options.length - 1) * this.fullDotLength;
        this.canvas.width = this.charWidth * this.options.length + totalCharBufferWidth + this.options.canvasPaddingInDots * 2 * this.fullDotLength;
        this.canvas.height = this.charHeight + this.options.canvasPaddingInDots * 2 * this.fullDotLength;

        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext("2d");
        } else {
            this.ctx = null;
            this.canvas.innerText = "";
        }

        this.text = text;
        if (this.text) {
            this.render();
        }
    }

    clear() {
        this.charMarginCumulative = 0;

        const patternCanvas = document.createElement("canvas");
        patternCanvas.width = this.fullDotLength;
        patternCanvas.height = this.fullDotLength;

        const patternCtx = patternCanvas.getContext("2d");

        patternCtx.fillStyle = this.options.backgroundColor;
        patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

        patternCtx.fillStyle = this.options.offColor;
        const x = (patternCanvas.width - patternCanvas.width / 2) / 2;
        const y = (patternCanvas.height - patternCanvas.height / 2) / 2;

        patternCtx.fillRect(x, y, patternCanvas.width / 2, patternCanvas.height / 2);

        const pattern = this.ctx.createPattern(patternCanvas, "repeat");
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    reset() {
        this.clear();
        this.text = "";
    }

    drawDot(x, y) {
        this.ctx.shadowBlur = this.options.shadowBlur || 15;
        this.ctx.shadowColor = this.options.shadowColor || "#FF4200";
        this.ctx.fillStyle = this.options.fillStyle || this.options.onColor;
        this.ctx.fillRect(x, y, this.options.dotSize, this.options.dotSize);
    }

    drawChar(charIndex, char) {
        const dotArray = Fonts[char];
        if (!dotArray) {
            console.error(`Char ${char} is not a supported.`);
            return;
        }

        const firstDot = charIndex * this.charWidth + 1 * this.fullDotLength + this.options.dotPadding + this.charMarginCumulative;
        if (firstDot + this.fullDotLength * this.options.charWidthInDots > this.canvas.width) {
            return false;
        }

        for (let rowIndex = 0; rowIndex < dotArray.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < dotArray[rowIndex].length; columnIndex++) {
                if (dotArray[rowIndex][columnIndex]) {
                    const x = charIndex * this.charWidth + (columnIndex + 1) * this.fullDotLength + this.options.dotPadding + this.charMarginCumulative;
                    const y = (rowIndex + 1) * this.fullDotLength + this.options.dotPadding;
                    this.drawDot(x, y);
                }
            }
        }

        this.charMarginCumulative += this.fullDotLength;
        return true;
    }

    render() {
        this.clear();
        for (let i = 0; i < this.text.length; i++) {
            if (!this.drawChar(i, this.text[i])) {
                this.setScroll(i);
                return;
            }
        }

        if (this.options.textScroll) {
            this.setScroll();
        } else {
            this.clearScroll();
        }
    }

    clearScroll() {
        clearInterval(this.scrollTimeout);
    }

    setScroll(stopIndex) {
        this.clearScroll();
        let scrollText = this.text + " ".repeat(this.options.textScrollGapInDots);
        this.scrollTimeout = setInterval(() => {
            this.clear();
            for (let i = 0; i < stopIndex; i++) {
                this.drawChar(i, scrollText[i]);
            }

            let firstChar = scrollText[0];
            scrollText = scrollText.slice(1) + firstChar;
        }, this.options.scrollIntervalDelay);
    }

    write(text, options = {}) {
        if (!this.ctx) {
            this.canvas.innerText = text;
            return;
        }

        if (options) {
            for (const [key, value] of Object.entries(options)) {
                this.options[key] = value;
            }
        }

        if (this.text !== text) {
            this.text = text;
            if (this.options.playSound) {
                displayOn.play();
            }
        }

        this.render();
    };
}
