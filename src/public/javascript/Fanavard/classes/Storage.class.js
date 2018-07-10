/**
 * @static
 * @class
 * Storage class is a wrapper for LocalStrage and manages setting and getting items from/to LocalStorage with type casting
 */
class Storage {

    /**
     * Returns a plain string of given key from localStorage
     * @param {string} key
     * @param {string|object} [default_value]
     * @returns {string | null | * | string}
     */
    static get(key, default_value) {
        default_value = typeof default_value === "undefined" ? "" : default_value;
        return localStorage.getItem(key) || default_value;
    }

    /**
     * Returns an integer of given key from localStorage
     * @param {string} key
     * @param {string} default_value [default_value]
     * @returns {number}
     */
    static getInt(key, default_value) {
        default_value = typeof default_value === "undefined" ? 0 : default_value;
        return Number(get(key, default_value));
    }

    /**
     * Returns an integer of given key from localStorage
     * @param key
     * @param default_value
     * @return {any}
     */
    static getJson(key, default_value) {
        default_value = typeof default_value === "undefined" ? {} : default_value;
        let data = Storage.get(key, false);
        return (!data) ? default_value : JSON.parse(data);
    }


    /**
     * Saves an object in localStorage
     * @param {string} key
     * @param {Object} value
     */
    static set(key, value) {
        if (typeof (value) === "object") {
            value = JSON.stringify(value);
        } else {
            value = value.toString();
        }

        localStorage.setItem(key, value)
    }
}
