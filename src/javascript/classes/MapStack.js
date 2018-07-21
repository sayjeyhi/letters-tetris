/**
 * @module
 */


/**
 *
 * @class MapStack
 *
 * @property map {Map} - Holds a map for implementing MapStack
 * This class is a wrapper for Map with an additional method to append to Map
 * Since extending built-in classes is not supported, We'll have to create a wrapper
 */
export default class MapStack {

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

	/**
	 * Gets all values of MapStack
	 * @returns {IterableIterator}
	 */
	entries() {
		return this.map.entries();
	}


	/**
	 * Merges another mapStack items to this istance
	 * @param mapStack
	 */
	merge(mapStack) {
		for (const [key, value] of mapStack.entries()) {
			this.append(key, value);
		}
	}


	/**
	 * Pops a group of a key
	 * @returns {*}
	 */
	popItems() {
		for (const [key, value] of this.map.entries()) { // Since it's a generator, it's not performance killer
			const anItemOfAnyX = value;
			this.map.delete(key);
			return anItemOfAnyX;
		}
		// If we reached here, Map is Empty
		return false;
	}

	/**
	 * Pop's an item from start of array
	 * @returns {*}
	 */
	popItem() {
		let entries =  this.map.entries();
		if(entries.length === 0)
			return false;
		for (let [key, value] of entries) { // Since it's a generator, it's not performance killer
			const anItemOfAnyX = value.pop();
			if(typeof anItemOfAnyX ==='undefined'){
				return false;
			}
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
		// TODO: IDK :| xD
	}
}
