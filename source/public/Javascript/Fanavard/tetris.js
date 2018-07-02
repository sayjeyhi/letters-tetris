/* jshint browser: true */

var TetrisGame;
(function () {

    /**
     *
     * @param options
     * @constructor
     */
    TetrisGame = function (options) {

        'use strict';

        /**
         * Default options of emoji manager
         * @type {{selector: string, draggable: boolean, title: string, background: string, textColor: string, kindOfSearch: string, afterMenuShow: afterMenuShow, afterChoose: afterChoose, afterClose: afterClose, rtl: boolean, debug: boolean}}
         */
        var defaultOptions = {
            selector: '.tetrisGame',
            title: 'انتخاب شکلک',
            background: '#F00000',
            textColor: '#fff',
            kindOfSearch: 'all',   // first , end
            afterMenuShow: function () {
            },
            afterChoose: function () {
            },
            afterClose: function () {
            },
            rtl: true,
            position: 'absolute',    // fixed-top-left , fixed-top-right , fixed-bottom-left , fixed-bottom-right
            debug: false
        };

        var TetrisGame = this;
        var jsonOfWords = window.jsonOfWords;


        /**
         * Extend object
         *
         * @param out
         * @returns {*|{}}
         */
        this.deepExtend = function (out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = TetrisGame.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        };


        /**
         * Use to add new comming block
         */
        this.charBlock = function () {

        };


        this.checkWordSuccess = function () {

        };

        /*
        Overload default settings on user options
         */
        this.settings = this.deepExtend({}, defaultOptions, options);
        this.firstRun = true;

        this.isBrowser = (typeof window !== 'undefined');




        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        this.build = function () {

            document.querySelector("#container").innerHTML =
                `<div id="gameHolder">
                    <div class="behindPlayBoard">
                       <div class="courseArea"> 
                           <div ><i class="linearicon linearicon-bag-pound"></i> langEmtiza : 123</div> 
                           <div ><i class="linearicon linearicon-mustache-glasses"></i> langCreatedWords : 22</div> 
                           <div ><i class="linearicon linearicon-clock"></i> langSpentTime : 1:41</div> 
                       </div>
                       <div class="showUpComingLetter" title="langNextLetter">ح</div>
                       <div class="gameControlButtons" >
                            <div class="startGame">langStartGame</div>
                            <div class="pauseGame">langPauseGame</div>
                       </div>
                   </div>
                   <div class="playBoard"> 
                       <div class="charBlock" >ت</div>
                    </div>
                </div>
                <footer class="page-footer">
                    <div class="container">
                        <i class="linearicon linearicon-brain"></i>  ${lang.copyRight}
                    </div>
                </footer>`;

        };


        /**
         * Build emojiManger
         */
        this.build();

    };


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = TetrisGame;
    } else if (TetrisGame.isBrowser) {
        window.TetrisGame = TetrisGame;
    }

})();