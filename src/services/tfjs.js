import * as tf from "@tensorflow/tfjs";

const metadata = await fetch("/model/metadata.json").then((response) =>
    response.json(),
);
const model = await tf.loadGraphModel("/model/model.json");

const warmup = () => {
    const dummy = tf.zeros([1, 224, 224, 3]);
    tf.tidy(() => {
        model.predict(dummy);
    });
};

warmup();

export const predictState = (pixels) => {
    return new Promise((resolve) => {
        let tensor = tf.browser.fromPixels(pixels, 3);
        tensor = tensor.expandDims(0).cast("float32");

        const result = model.predict(tensor);

        const index = result.as1D().argMax().dataSync()[0];
        const state = metadata["class_names"][index];

        resolve(state);
    });
};
