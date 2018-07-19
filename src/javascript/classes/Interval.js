/** @module */

import TetrisGame from "./Tetris/TetrisGame";
import Charblock from "./Tetris/Charblock";

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
        this.delay = 100;
        this.fn = () => {};

		// requestAnimationFrame() shim by Paul Irish
		window.requestAnimFrame = (function() {
			return  window.requestAnimationFrame   ||
				window.webkitRequestAnimationFrame ||
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

		this.delay = delay;
		this.fn = fn;
		this.wait = false;


		if( !window.requestAnimationFrame       &&
			!window.webkitRequestAnimationFrame )
			return window.setInterval(fn, delay);

		let myReq;

		const loop = () => {
			let current = new Date().getTime(),
				delta = current - this.start;

			if(delta >= this.delay && !this.wait) {
				this.fn.call(true);
				this.start = new Date().getTime();
			}else{
				this.wait = false;
			}

			myReq = requestAnimFrame(loop);
		};

		myReq = requestAnimFrame(loop);

		return myReq;
	}

	/**
	 * Reset animation frame
	 */
	reset(intervalData){

		// update fn and delay
		this.update(intervalData);

		this.start = new Date().getTime();
		this.wait = true;
	}

	/**
	 * Update our rAF interval
	 * @param intervalData
	 */
	update(intervalData){
		this.fn = intervalData.fn;
		this.delay = intervalData.delay;
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

		this.start = new Date().getTime();
		const newInterval = this.request(usedFunction , delay);

		console.log(newInterval);
        this.intervals[newInterval] = true;
        return newInterval;
    }


	/**
	 * Removes an interval from list
	 * @param index
	 * @private
	 */
	_removeIndex(index) {
		delete this.intervals[index];
	}


	/**
	 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
	 * @param {int|object} handle The callback function
	 */
	clear(handle) {

		console.log(handle);

		window.cancelAnimationFrame ? window.cancelAnimationFrame(handle) :
			window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle) :
				clearInterval(handle);

		this._removeIndex(handle);

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
