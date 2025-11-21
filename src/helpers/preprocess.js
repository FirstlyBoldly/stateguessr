import trimCanvas from "trim-canvas";

// Sourced from:
// https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
const canvasIsBlank = (canvas) => {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            return false;
        }
    }

    return true;
};

export const preprocess = (canvas) => {
    if (canvasIsBlank(canvas)) {
        return;
    }

    const copy = document.createElement("canvas");
    copy.width = canvas.width;
    copy.height = canvas.height;
    copy.getContext("2d").drawImage(canvas, 0, 0);

    trimCanvas(copy);

    const temp = document.createElement("canvas");
    const tempCtx = temp.getContext("2d");

    temp.width = 224;
    temp.height = 224;
    tempCtx.fillStyle = "#000000";
    tempCtx.fillRect(0, 0, temp.width, temp.height);

    tempCtx.fillStyle = "#FFFFFF";

    // Black magic!?!
    tempCtx.save();
    tempCtx.filter = "invert(1)";
    tempCtx.drawImage(copy, 0, 0, 224, 224);
    tempCtx.filter = "none";
    tempCtx.restore();

    return temp;
};
