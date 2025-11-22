import { ref, uploadString } from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { storage, db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

let imageIndex = 0;

let prevRound = null;
let prevDataUrl = null;

let roundId = null;
let roundIdRef = null;

export const upload = (round, state, canvas, winningDoodle = false) => {
    if (round !== prevRound) {
        roundId = uuidv4();

        // This will contain metadata for said round ID.
        // Basically, if there is indeed a winning image,
        // I want said round directory to be queryable.
        roundIdRef = doc(db, state, roundId);
        setDoc(roundIdRef, {
            roundWon: false,
        });

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

    // Update round status.
    if (winningDoodle) {
        updateDoc(roundIdRef, {
            roundWon: true,
        });
    }
};
