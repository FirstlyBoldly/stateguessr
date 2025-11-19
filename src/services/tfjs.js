import * as tf from "@tensorflow/tfjs";

const metadata = await fetch("/model/metadata.json").then((response) =>
    response.json(),
);
const model = await tf.loadGraphModel("/model/model.json");

export const predictState = (pixels) => {
    return new Promise((resolve) => {
        let tensor = tf.browser.fromPixels(pixels, 3);
        tensor = tensor.expandDims(0);
        tensor = tensor.resizeBilinear([224, 224]);

        const result = model.predict(tensor);

        const index = result.as1D().argMax().dataSync()[0];
        const state = metadata["class_names"][index];

        resolve(state);
    });
};
