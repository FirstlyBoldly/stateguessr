export const choice = (object) => {
    const keys = Object.keys(object)
    const size = keys.length;
    if (size === 0) {
        return null;
    }

    const i = Math.trunc(Math.random() * size);
    return keys[i];
};

export const getUniqueValueFromObject = (object, uniqueValues) => {
    const imgPath = choice(object);
    while (true) {
        if (imgPath in uniqueValues) {
            imgPath = choice();
        } else {
            return imgPath;
        }
    }
};
