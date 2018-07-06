

/**
 * Storage Class
 * @static
 * @class Storage
 *
 *
 */
class Storage {

    /**
     * Returns a plain string of given key from localStorage
     * @param {string} key
     * @param {string} [default_value]
     * @returns {string | null | * | string}
     */
    static get(key, default_value) {
        default_value = default_value || "";
        return localStorage.getItem(key) || default_value;
    }

    /**
     * Returns an integer of given key from localStorage
     * @param {string} key
     * @param {string} default_value [default_value]
     * @returns {number}
     */
    static getInt(key, default_value) {
        default_value = default_value || 0;
        return Number(get(key, default_value));
    }

    /**
     * Returns an array of given key from localStorage
     * @param {string} key
     * @param {string} default_value [default_value]
     * @returns {array}
     */
    static getArray(key, default_value) {
        default_value = default_value || [];
        return JSON.parse(get(key), default_value);
    }

    /**
     * Returns an integer of given key from localStorage
     * @param {string} key
     * @param {string} default_value [default_value]
     * @returns {Object}
     */
    static getJson(key, default_value) {
        default_value = default_value || {};
        return JSON.parse(get(key), default_value);
    }

    /**
     * Saves an object in localStorage
     * @param {string} key
     * @param {Object} value
     */
    static set(key, value) {
        if (typeof (value) === "object") {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value)
    }
}
