import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

let prevRound = null;
let roundId = null;
let imageIndex = 0;

let prevDataUrl = null;

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

export const upload = (round, state, canvas) => {
    if (canvasIsBlank(canvas)) {
        return;
    }

    if (round !== prevRound) {
        roundId = uuidv4();
        prevRound = round;
        imageIndex = 0;
    }

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
    tempCtx.drawImage(canvas, 0, 0, 224, 224);
    tempCtx.filter = "none";
    tempCtx.restore();

    const imageRef = ref(
        storage,
        `/states/${state}/${roundId}/${imageIndex}.jpg`,
    );
    imageIndex++;

    const metadata = {
        contentType: "image/jpeg",
    };

    const dataUrl = temp.toDataURL("image/jpeg", 1.0);

    if (prevDataUrl !== dataUrl) {
        prevDataUrl = dataUrl;
        uploadString(imageRef, dataUrl, "data_url", metadata).then(
            (snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log(downloadURL);
                });
            },
        );
    }
};
