export const getFilename = (path) => {
    const lastOfSlash =
        Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\")) + 1;
    const lastOfDot = path.lastIndexOf(".");

    return path.substr(lastOfSlash, lastOfDot - lastOfSlash);
};

export const loadStates = () => {
    const states = import.meta.glob("/src/assets/states/*.jpg");
    for (const oldKey of Object.keys(states)) {
        const newKey = getFilename(oldKey);
        delete Object.assign(states, { [newKey]: states[oldKey] })[oldKey];
    }

    return states;
};
