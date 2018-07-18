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
     * Shuffles dom childs
     * @param parentDom {HTMLElement}
     */
	static ShuffleDom(parentDom) {
		for (let i = parentDom.children.length; i >= 0; i--) {
			parentDom.appendChild(parentDom.children[Math.random() * i | 0]);
		}
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
     * This function will shake a Dom
     * @param element {HTMLElement} - Dom to shake
     * @param magnitude {Number} [16] - magnitude of earthquake
     * @param angular {Boolean} [false] - angular of shaking
     */
	static shake(element, magnitude = 16, angular = false) {
		const shakingElements = [];

		// First set the initial tilt angle to the right (+1)
		let tiltAngle = 1;

		// A counter to count the number of shakes
		let counter = 1;

		// The total number of shakes (there will be 1 shake per frame)
		const numberOfShakes = 15;

		// Capture the element's position and angle so you can
		// restore them after the shaking has finished
		const startX = 0,
			startY = 0,
			startAngle = 0;

		// Divide the magnitude into 10 units so that you can
		// reduce the amount of shake by 10 percent each frame
		const magnitudeUnit = magnitude / numberOfShakes;

		// The `randomInt` helper function
		const randomInt = (min, max) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		// The `upAndDownShake` function
		const upAndDownShake= () => {
			// Shake the element while the `counter` is less than
			// the `numberOfShakes`
			if (counter < numberOfShakes) {
				// Reset the element's position at the start of each shake
				element.style.transform = `translate(${startX}px, ${startY}px)`;

				// Reduce the magnitude
				magnitude -= magnitudeUnit;

				// Randomly change the element's position
				const randomX = randomInt(-magnitude, magnitude);
				const randomY = randomInt(-magnitude, magnitude);

				element.style.transform = `translate(${randomX}px, ${randomY}px)`;

				// Add 1 to the counter
				counter += 1;

				requestAnimationFrame(upAndDownShake);
			}

			// When the shaking is finished, restore the element to its original
			// position and remove it from the `shakingElements` array
			if (counter >= numberOfShakes) {
				element.style.transform = `translate(${startX}, ${startY})`;
				shakingElements.splice(shakingElements.indexOf(element), 1);
			}
		};

		// The `angularShake` function
		const angularShake = () => {
			if (counter < numberOfShakes) {
				console.log(tiltAngle);
				// Reset the element's rotation
				element.style.transform = `rotate(${startAngle}deg)`;

				// Reduce the magnitude
				magnitude -= magnitudeUnit;

				// Rotate the element left or right, depending on the direction,
				// by an amount in radians that matches the magnitude
				const angle = Number(magnitude * tiltAngle).toFixed(2);
				console.log(angle);
				element.style.transform = `rotate(${angle}deg)`;
				counter += 1;

				// Reverse the tilt angle so that the element is tilted
				// in the opposite direction for the next shake
				tiltAngle *= -1;

				requestAnimationFrame(angularShake);
			}

			// When the shaking is finished, reset the element's angle and
			// remove it from the `shakingElements` array
			if (counter >= numberOfShakes) {
				element.style.transform = `rotate(${startAngle}deg)`;
				shakingElements.splice(shakingElements.indexOf(element), 1);
				// console.log("removed")
			}
		};
		// Add the element to the `shakingElements` array if it
		// isn't already there
		if (shakingElements.indexOf(element) === -1) {
			// console.log("added")
			shakingElements.push(element);

			// Add an `updateShake` method to the element.
			// The `updateShake` method will be called each frame
			// in the game loop. The shake effect type can be either
			// up and down (x/y shaking) or angular (rotational shaking).
			if (angular) {
				angularShake();
			} else {
				upAndDownShake();
			}
		}
	}
}
