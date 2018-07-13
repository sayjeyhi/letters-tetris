/**
 * @module
 */


/**
 * @class Swipe - Make it easily to manage swipe in devices
 * {@link http://www.javascriptkit.com/javatutors/touchevents2.shtml Library from here}
 * @example :
 *   new Swipe(document.getElementById("swipeZone") , function (direction) {
 *       alert("You swiped to : " + direction + " side !");
 *   });
 */

export default class Swipe {

    /**
     * Make swipe config to
     * @param element
     * @param callback
     * @param config
     * @return Swipe
     */
    constructor(element, callback , config){

        this.touchSurface = element;

        config = typeof config === "object" ? config : {
            threshold : 100,
            restraint : 100,
            allowedTime : 300,
            onTouchStart : () => {},
            whileTouch : () => {},
            onTouchEnd : () => {},
        };

        this.threshold = config.threshold;               // required min distance traveled to be considered swipe
        this.restraint = config.restraint;               // maximum distance allowed at the same time in perpendicular direction
        this.allowedTime = config.allowedTime;           // maximum time allowed to travel that distance
        this.handleSwipe = callback || ((swipedir) => {console.log(swipedir);});

        this.onTouchStartCallback = config.onTouchStart;
        this.whileTouchCallback = config.whileTouch;
        this.onTouchEndCallback = config.onTouchEnd;

        this.buildListeners(element);
        return this;
    }


    /**
     * Add touch listeners on element
     */
    buildListeners(){

        let startX,startY,distX,distY,startTime,elapsedTime,swipeDirection;


        // listen to touch start
        this.touchSurface.addEventListener('touchstart', (e) => {
            let touchObject = e.changedTouches[0];
            swipeDirection = 'none';
            //dist = 0;
            startX = touchObject.pageX;
            startY = touchObject.pageY;
            startTime = new Date().getTime();               // record time when finger first makes contact with surface
            this._onTouchStart(this.onTouchStartCallback);
            e.preventDefault();
        }, false);


        // listen touch move
        this.touchSurface.addEventListener('touchmove', (e) => {
            this._whileTouch(this.whileTouchCallback);
            e.preventDefault();     // prevent scrolling when inside DIV
        }, false);


        // listen touch end
        this.touchSurface.addEventListener('touchend', (e) => {
            let touchObject = e.changedTouches[0];
            distX = touchObject.pageX - startX;               // get horizontal dist traveled by finger while in contact with surface
            distY = touchObject.pageY - startY;               // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime;                     // get time elapsed
            if (elapsedTime <= this.allowedTime){                               // first condition for swipe met
                if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint){  // 2nd condition for horizontal swipe met
                    swipeDirection = (distX < 0)? 'left' : 'right';                       // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint){ // 2nd condition for vertical swipe met
                    swipeDirection = (distY < 0)? 'up' : 'down';                          // if dist traveled is negative, it indicates up swipe
                }
            }
            this.handleSwipe(swipeDirection);
            this._onTouchEnd(this.onTouchEndCallback);
            e.preventDefault();
        }, false);
    }


    /**
     * When user start touch
     * @param callback
     * @return {function|null}
     * @private
     */
    static _onTouchStart(callback){
        return callback || (() => {});
    }


    /**
     * While user is touched and moving
     * @param callback
     * @return {function|null}
     * @private
     */
    static _whileTouch(callback){
        return callback || (() => {});
    }

    /**
     * When user finished touch moving
     * @param callback
     * @return {function|null}
     * @private
     */
    static _onTouchEnd(callback){
        return callback || (() => {});
    }

    /**
     * Destroy instance of swipe class
     */
    destroy(){
        this.touchSurface.removeEventListener("touchstart touchmove touchend" , ()=>{} , false);
    }
}
