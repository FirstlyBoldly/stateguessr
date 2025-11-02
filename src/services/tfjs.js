import * as tf from "@tensorflow/tfjs";
import metadata from "/model/metadata";

const model = await tf.loadLayersModel("/model/model.json");

export const predictState = (pixels) => {
    let tensor = tf.browser.fromPixels(pixels, 3);
    tensor = tensor.expandDims(0);
    tensor = tensor.resizeBilinear([224, 224]);
    const result = model.predict(tensor);
    const maxValue = Math.max(...result.as1D().dataSync());
    console.log(maxValue);
    const index = result.as1D().argMax().dataSync()[0];
    return metadata["class_names"][index];
};
