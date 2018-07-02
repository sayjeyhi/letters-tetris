/* jshint browser: true */

var TetrisGame;
(function () {

    'use strict';

    TetrisGame = {

        /**
         * Is browser ?
         */
        isBrowser : (typeof window !== 'undefined'),


        /**
         * Json Of words
         */
        words : window.TetrisWords,

        /**
         * Base config for game
         */
        config: {
            rows: 10,
            columns : 5,
            charSpeed : 1,  // second
            checkInRow: true,
            checkInColumn : false,
            animateHiding: true,
            playSoundOnSuccess : false,
            playSoundOnFailure : false
        },


        /**
         * Objects of char blocks
         */
        aliveChars : [],

        
        /**
         * Active character [not stopped] Object index
         */
        activeCharIndex : 0,


        /**
         * Choosed words to work with them
         */
        choosedWords : [],



        /**
         * Class Use to add new coming block
         */
        charBlock: function() {


            var self = {};

            // get random char from choosed words
            var choosed = "ج";

            // choose random column to init char
            var initColumn = 2;


            // choose random color
            var color = "#ccc";


            self.column = initColumn;
            self.row = TetrisGame.config.rows;  // top is max
            self.name = choosed;
            self.color = color;



            // add this char to active chars


            self.move = function(eventKeyCode){


                switch (eventKeyCode){
                    case 37:  // left
                        alert("left");
                        break;
                    case 39:  // right
                        alert("right");
                        break;
                    case 40:  // down
                        alert("down");
                        break;
                }
            };

            TetrisGame.activeCharIndex = TetrisGame.aliveChars.push(self);

            return self;

        },


        /**
         * Get a valid column number [8-15]
         */
        getValidColumnsNumber: function () {

        },


        /**
         * Choose random words in game build to work with
         */
        chooseWords: function () {
            var result;
            var count = 0;
            for (var prop in TetrisGame.words)
                if (Math.random() < 1/++count)
                    result = prop;
            return TetrisGame.words[result];
        },


        /**
         * Check if could find a success word
         */
        checkWordSuccess: function () {

        },




        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        build : function () {


            // get max json word length [min:8 - max:12] to create columns
            log(TetrisGame.words);


            // get two words from json to create rows and columns
            log("random words");
            log(TetrisGame.chooseWords());


            // create first char block
            new TetrisGame.charBlock();


            document.addEventListener("keydown" , function (e) {
                TetrisGame.aliveChars[TetrisGame.activeCharIndex - 1].move(e.keyCode);
            });




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

    };


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = TetrisGame;
    } else if (TetrisGame.isBrowser) {
        window.TetrisGame = TetrisGame;
    }

})();