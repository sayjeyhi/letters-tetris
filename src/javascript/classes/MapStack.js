/**
 * @module EasyMap
 */


/**
 * This class is a wrapper for Map with an additional method to append to Map
 * Since extending built-in classes is not supported, We'll have to create a wrapper
 * @extends Map
 */
export default class MapStack {
	/**
     * @constructor
     */
	constructor() {
		this.map = new Map();
	}

	/**
     *  If key exists, It'll append to array with given key
     *  Otherwise, It'll create object with given key and push value as array
     * @param key {Object}
     * @param value {Object}
     */
	append(key, value) {
		if (this.map.has(key)) this.map.get(key).push(value);
		else this.map.set(key, [value]);
	}

	entries() {
		return this.map.entries();
	}

	merge(easyMap) {
		for (const [key, value] of easyMap.entries()) {
			this.append(key, value);
		}
	}


	popItems() {
		for (const [key, value] of this.map.entries()) { // Since it's a generator, it's not performance killer
			const anItemOfAnyX = value;
			this.map.delete(key);
			return anItemOfAnyX;
		}
		// If we reached here, Map is Empty
		return false;
	}

	popItem() {
		for (const [key, value] of this.map.entries()) { // Since it's a generator, it's not performance killer
			const anItemOfAnyX = value.pop()[0];
			if (value.length === 0) {
				this.map.delete(key);
			}
			return anItemOfAnyX;
		}
		// If we reached here, Map is Empty
		return false;
	}


	// Optimize
	reduce() {
		// TODO: IDK :|
	}
}
