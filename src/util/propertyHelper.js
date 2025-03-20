class PropertyHelper {
    static hasUndefinedProperty(obj, properties) {
        if (!obj || typeof obj !== "object") {
            return false;
        }

        for (const prop of properties) {
            if (obj[prop] === undefined) {
                return true;
            }
        }
        return false;
    }
}

module.exports = PropertyHelper;