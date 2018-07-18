/**
 * @module
 */

/**
 * @class Timeout - rAF version of setTimeout for make better performance
 */
export default class Timeout {
    /**
	 * Add animation frame to windows
	 * requestAnimationFrame() shim by
	 * @author : Paul Irish
	 */
    static addAnimeFrame() {
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| window.msRequestAnimationFrame
				|| function(callback) {
				    window.setTimeout(callback, 1000 / 60);
				};
        }());
    }


    /**
	 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
	 * @param {function} fn The callback function
	 * @param {int} delay The delay in milliseconds
	 */
    static request(fn, delay) {
        if (!window.requestAnimationFrame
			&& !window.webkitRequestAnimationFrame
			&& !(window.mozRequestAnimationFrame
				&& window.mozCancelRequestAnimationFrame)
			&& !window.oRequestAnimationFrame
			&& !window.msRequestAnimationFrame) return window.setTimeout(fn, delay);

        const start = new Date().getTime(),
            handle = {};

        const loop = () => {
            const current = new Date().getTime(),
                delta = current - start;

            delta >= delay ? fn.call() : handle.value = window.requestAnimFrame(loop);
        };

        handle.value = window.requestAnimFrame(loop);
        return handle;
    }


    /**
	 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
	 * @param {int|object} handle The callback function
	 */
    static clear(handle) {
        window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value)
            : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value)
                : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) /* Support for legacy API */
                    : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value)
                        : window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value)
                            : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value)
                                : clearTimeout(handle);
    }
}
