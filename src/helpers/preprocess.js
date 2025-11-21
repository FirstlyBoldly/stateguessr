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
    tempCtx.fillStyle = "#FFFFFF";
    tempCtx.fillRect(0, 0, temp.width, temp.height);

    // tempCtx.fillStyle = "#FFFFFF";

    // Black magic!?!
    // 2025/11/22: So, this doesn't work on Safari and
    // seemingly on the iPhone version of Firefox as well...
    // tempCtx.save();
    // tempCtx.filter = "invert(1)";
    // tempCtx.drawImage(copy, 0, 0, 224, 224);
    // tempCtx.filter = "none";
    // tempCtx.restore();

    // 1. Draw the image normally first
    tempCtx.drawImage(copy, 0, 0, 224, 224);

    // 2. Change the blending mode
    tempCtx.globalCompositeOperation = 'difference';

    // 3. Draw a white rectangle over the entire image
    // Since White is (255, 255, 255), the difference mode subtracts
    // the current pixel values from 255 (Inversion).
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, 224, 224);

    // 4. Reset the blending mode for future draws
    tempCtx.globalCompositeOperation = 'source-over';

    // // 1. Draw the image normally
    // tempCtx.drawImage(copy, 0, 0, 224, 224);

    // // 2. Get the raw pixel data
    // const imageData = tempCtx.getImageData(0, 0, 224, 224);
    // const data = imageData.data;

    // // 3. Loop through every pixel
    // // The array is arranged as [R, G, B, A, R, G, B, A...]
    // for (let i = 0; i < data.length; i += 4) {
    //     data[i]     = 255 - data[i];     // Invert Red
    //     data[i + 1] = 255 - data[i + 1]; // Invert Green
    //     data[i + 2] = 255 - data[i + 2]; // Invert Blue
    //     // We usually do NOT invert Alpha (i + 3), leave it as is
    // }

    // // 4. Put the modified data back onto the canvas
    // tempCtx.putImageData(imageData, 0, 0);

    return temp;
};
