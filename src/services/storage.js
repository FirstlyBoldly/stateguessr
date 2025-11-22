import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

let prevRound = null;
let roundId = null;
let imageIndex = 0;

let prevDataUrl = null;

export const upload = (round, state, canvas, winningDoodle = false) => {
    if (round !== prevRound) {
        roundId = uuidv4();
        prevRound = round;
        imageIndex = 0;
    }

    const imageRef = ref(
        storage,
        `/states/${state}/${roundId}/${imageIndex}.jpg`,
    );
    imageIndex++;

    const metadata = {
        contentType: "image/jpeg",
        customMetadata: {
            winningDoodle: winningDoodle,
        },
    };

    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);

    if (prevDataUrl !== dataUrl) {
        prevDataUrl = dataUrl;
        uploadString(imageRef, dataUrl, "data_url", metadata);
    }
};
