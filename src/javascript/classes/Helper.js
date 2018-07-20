/**
 * @module
 */

/**
 *  @class
 *  Helper
 *  This class holds some helper methods which are useful in many cases
 */
export default class Helper {
	/**
	 * Wrapper for query selector
	 * @param selector
	 * @param holder
	 * @return {null | object}
	 */
	static _(selector, holder) {
		holder = typeof holder === 'undefined' ? document : holder;
		return holder.querySelector(selector) || null;
	}


	/**
	 * Vibrate device, If it's mobile
	 * @param timeMs
	 */
	static vibrate(timeMs) {
		if (Helper.isMobile()) {
			try {
				window.navigator.vibrate(timeMs);
			} catch (e) {
				// Who cares?
			}
		}
	}

	/**
	 * Removes a dom :|
	 * @param dom
	 */
	static removeDom(dom) {
		dom.parentNode.removeChild(dom);
	}


	/**
	 * Checks if device is mobile
	 * @returns {boolean} - Return true if device is mobile
	 */
	static isMobile() {
		return typeof window.orientation !== 'undefined';
	}


	/**
	 * Reversing strings containing especial unicode characters can cause problems using usual ways to reverse!
	 * For example this string: 'foo 𝌆 bar mañana mañana' will be corrupt if used string.split("").reverse().join("");
	 * We'll use following code from mathiasbynens to reverse a string properly
	 * {@link https://github.com/mathiasbynens/esrever/blob/master/src/esrever.js repo source}
	 *
	 * @param string - An string to reverse
	 *
	 * @example
	 *  let str = 'foo 𝌆 bar mañana mañana';
	 *  let correctlyReversed = reverse(str); // 'anãnam anañam rab 𝌆 oof'
	 *  let corruptedReverse  = str.split("").reverse().join(""); // 'anãnam anañam rab �� oof'
	 * @returns {string}
	 */
	static reverse(string) {
		const regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
		const regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;
		// Step 1: deal with combining marks and astral symbols (surrogate pairs)
		string = string
		// Swap symbols with their combining marks so the combining marks go first
			.replace(regexSymbolWithCombiningMarks, ($0, $1, $2) => {
				// Reverse the combining marks so they will end up in the same order
				// later on (after another round of reversing)
				return Helper.reverse($2) + $1;
			})
			// Swap high and low surrogates so the low surrogates go first
			.replace(regexSurrogatePair, '$2$1');
		// Step 2: reverse the code units in the string
		const result = [];
		let index = string.length;
		while (index--) {
			result.push(string.charAt(index));
		}
		return result.join('');
	}

	/**
	 *
	 * @param possibleFunction - Argument to check if it is a function ro not
	 * @returns {boolean} True if input is a function otherwise false
	 */
	static isFunction(possibleFunction) {
		return typeof (possibleFunction) === typeof (Function);
	}

	/**
	 * @param {Object} obj - Object to log
	 */
	static log(obj) {
		console.log(obj);
	}


	/**
	 * Gets Json resource using fetch API
	 * @param url
	 * @returns {Promise<any>}
	 */
	static fetchJson(url) {
		return new Promise((resolve, reject) => {
			fetch(url).then(response => response.json())
				.then(json => resolve(json))
				.catch(error => reject(error));
		});
	}

	/**
	 * Gets Json resources using fetch API
	 * @param urls
	 * @returns {Promise<any>}
	 */
	static fetchAllJson(urls) {
		return new Promise((resolve, reject) => {
			Promise.all(urls.map(url => Helper.fetchJson(url)))
				.then(result => {
					resolve(result);
				})
				.catch(err => {
					reject(err);
				});
		});
	}


	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	static getRandomArbitrary(min, max) {
		return (Math.random() * (max - min)) + min;
	}

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	static getRandomInt(min, max) {
		return Math.floor((Math.random() * (max - min + 1))) + min;
	}

	/**
	 * Checks to see if it's night or not :}
	 * @returns {boolean}
	 */
	static isDay() {
		const hours = new Date().getHours();
		return hours > 6 && hours < 20;
	}


	/**
	 * Get X-Y positi`on of dom
	 * @param dom
	 * @returns {{y, x}}
	 */
	static getYX(dom) {
		const YX = dom.closest('.isColumn').id.replace('grid', '').split('_');
		return { y: Helper.int(YX[0]), x: Helper.int(YX[1]) };
	}

	/**
	 * Simple shortcut for parseInt
	 * @param any
	 * @returns {number}
	 */
	static int(any) {
		return Number(any);
	}


	static skippableIndexOf(str, substr, starCharacter) {
		const len = str.length;
		const sublen = substr.length;
		let count = 0;
		if (sublen > len) {
			return -1;
		}
		for (let i = 0; i < len - sublen + 1; i++) {
			for (let j = 0; j < sublen; j++) {
				if (str[j + i] === substr[j] || str[j + i] === starCharacter) {
					count++;
					if (count === sublen) {
						return i;
					}
				} else {
					count = 0;
					break;
				}
			}
		}
		return -1;
	}


	/**
	 * Shuffles an array
	 * @param array
	 */
	static shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}
