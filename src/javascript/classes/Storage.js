/**
 * @module
 */

/**
 * @static
 * @class
 * Storage class is a wrapper for LocalStrage and manages setting and getting items from/to LocalStorage with type casting
 */

import * as AesJs from "aes-js";

export default class Storage {

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
     * Returns a json of given key from localStorage
     * @param key
     * @param default_value
     * @return {any}
     */
    static getObject(key, default_value) {
        default_value = typeof default_value === "undefined" ? {} : default_value;
        let data = Storage.get(key, false);
        return (!data) ? default_value : JSON.parse(data);
    }

    /**
     * Set a json from given key to localStorage
     * @param key {String}
     * @param value {Object}
     */
    static setObject(key, value) {
        this.set(key,JSON.stringify(value))
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


    /**
     * Set's an object to Storage with AES Encryption
     * @param key {String} - Object key
     * @param value {Object} - Object to encrypt And Store
     * @param encryptionKey {Array} - Array must be 128 bits (16 bytes), 192 bits (24 bytes) or 256 bits (32 bytes) long
     */
    static setEncrypted(key,value,encryptionKey){
        //Convert anyObject to JSON to be able store it
        value = AesJs.utils.utf8.toBytes(JSON.stringify(value));

        const Encryptor = new AesJs.ModeOfOperation.ctr(encryptionKey);
        value = Encryptor.encrypt(value); //Encrypts data to bytes

        //Convert bytes to Hex, to be able save data in storage
        value = AesJs.utils.hex.fromBytes(value);

        this.set(key,value);
    }

    /**
     * Gets an object from storage with AES encryption
     * @param key {String} - Key of Object in storage
     * @param encryptionKey {Array} - Array must be 128 bits (16 bytes), 192 bits (24 bytes) or 256 bits (32 bytes) long
     * @returns {Object}
     */
    static getEncrypted(key,encryptionKey){
        let value = this.get(key);
        //Convert data back from hex to Bytes
        value = AesJs.utils.hex.toBytes(value);
        const Decryptor = new AesJs.ModeOfOperation.ctr(encryptionKey);
        value = Decryptor.decrypt(value);
        value = AesJs.utils.utf8.fromBytes(value);
        if(value!=="")
            value = JSON.parse(value);
        return value;

    }

}
