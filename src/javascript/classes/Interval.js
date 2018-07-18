/** @module */

/**
 *  Interval setting control - Better way to manage setInterval and make it easily to destroy
 */
export default class Interval {
    /**
     * Constructor of interval class - register intervals field here.
     */
    constructor() {
        // to keep a reference to all the intervals
        this.intervals = {};

		// requestAnimationFrame() shim by Paul Irish
		window.requestAnimFrame = (function() {
			return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(/* function */ callback, /* DOMElement */ element){
					window.setTimeout(callback, 1000 / 60);
				};
		})();
    }


	/**
	 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
	 * @param {function} fn The callback function
	 * @param {int} delay The delay in milliseconds
	 */
	request(fn, delay) {
		if( !window.requestAnimationFrame       &&
			!window.webkitRequestAnimationFrame &&
			!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
			!window.oRequestAnimationFrame      &&
			!window.msRequestAnimationFrame )
			return window.setInterval(fn, delay);

		let start = new Date().getTime(),
			handle = {};

		const loop = () => {
			let current = new Date().getTime(),
				delta = current - start;

			if(delta >= delay) {
				fn.call(true);
				start = new Date().getTime();
			}

			handle.value = requestAnimFrame(loop);
		};

		handle.value = requestAnimFrame(loop);
		return handle.value;
	}

	/**
	 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
	 * @param {int|object} handle The callback function
	 */
	clear(handle) {

		console.log(handle);
		this._removeIndex(handle);

		window.cancelAnimationFrame ? window.cancelAnimationFrame(handle) :
			window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle) :
				window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle) : /* Support for legacy API */
					window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle) :
						window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle) :
							window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle) :
								clearInterval(handle);
	}


    /**
     * Create another interval
     * @param usedFunction
     * @param delay
     * @return {number}
     */
    make(usedFunction, delay) {
        // see explanation after the code
        // const newInterval = setInterval.apply(
        //     window,
        //     [usedFunction, delay].concat([].slice.call(arguments, 2))
        // );

		const newInterval = this.request(usedFunction , delay);

        this.intervals[newInterval] = true;
        return newInterval;
    }


    // /**
    //  * Clear a single interval
    //  * @param id
    //  */
    // clear(id) {
    //     this._removeIndex(id);
    //     return clearInterval(id);
    // }


    /**
     * Removes an interval from list
     * @param index
     * @private
     */
    _removeIndex(index) {
        delete this.intervals[index];
    }


    /**
     * Clear all intervals
     */
    clearAll() {
        const all = Object.keys(this.intervals);
        let len = all.length;

        while (len-- > 0) {
            const itemIndex = all.shift();
            this.clear(itemIndex);
            this._removeIndex(itemIndex);
        }
    }
}
