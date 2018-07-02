/* jshint browser: true */

var TetrisGame;
(function () {

    'use strict';

    TetrisGame = {


        /**
         * Object of game words
         */
        jsonOfWords : window.jsonOfWords,



        /**
         * Use to add new comming block
         */
        charBlock: function() {

        },


        checkWordSuccess: function () {

        },

        /*
        Overload default settings on user options
         */
        firstRun : true,

        isBrowser : (typeof window !== 'undefined'),




        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        build : function () {


            // get max json word length [min:8 - max:12] to create columns
            log(jsonOfWords);

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

        }


        /**
         * Build emojiManger
         */

    };


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = TetrisGame;
    } else if (TetrisGame.isBrowser) {
        window.TetrisGame = TetrisGame;
    }

})();