export const choice = (object) => {
    const keys = Object.keys(object)
    const size = keys.length;
    if (size === 0) {
        return null;
    }

    const i = Math.trunc(Math.random() * (size - 1));
    return keys[i];
};

export const getUniqueValueFromObject = (object, uniqueValues) => {
    let value = choice(object);
    while (true) {
        if (uniqueValues.includes(value)) {
            value = choice(object);
        } else {
            return value;
        }
    }
};
