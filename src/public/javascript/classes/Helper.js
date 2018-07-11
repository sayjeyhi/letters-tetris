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
        let regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
        let regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;
        // Step 1: deal with combining marks and astral symbols (surrogate pairs)
        string = string
        // Swap symbols with their combining marks so the combining marks go first
            .replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
                // Reverse the combining marks so they will end up in the same order
                // later on (after another round of reversing)
                return Helper.reverse($2) + $1;
            })
            // Swap high and low surrogates so the low surrogates go first
            .replace(regexSurrogatePair, '$2$1');
        // Step 2: reverse the code units in the string
        let result = [];
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
        return typeof(possibleFunction) === typeof(Function);
    }

    /**
     * @param {Object} obj - Object to log
     */
    static log(obj) {
        console.log(obj)
    }


    /**
     * Gets Json resource using fetch API
     * @param url
     * @returns {Promise<any>}
     */
    static fetchJson(url) {
        return new Promise((resolve,reject)=>{
            fetch(url).then(response=> response.json())
                .then(json=>resolve(json))
                .catch(error=>reject(error))
        });
    }

    /**
     * Gets Json resources using fetch API
     * @param urls
     * @returns {Promise<any>}
     */
    static fetchAllJson(urls) {
        return new Promise((resolve,reject)=>{
            Promise.all(urls.map(url => Helper.fetchJson(url)))
                .then(result => {
                    resolve(result);
                })
                .catch(err=>{
                    reject(err)
                });
        });
    }

}
