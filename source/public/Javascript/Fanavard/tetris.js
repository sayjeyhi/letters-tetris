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
            var color = TetrisGame.materialColor();


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
            var columnsNumber = 8;
            for (var i = Object.keys(TetrisGame.words).length - 1; i >= 0; i--) {
                var thisWordLength = TetrisGame.words[i].word.length;
                if(thisWordLength > columnsNumber){
                    columnsNumber = thisWordLength;
                }
            }
            return columnsNumber;
        },


        /**
         * Choose random words in game build to work with
         */
        chooseWords: function () {
            var keys = Object.keys(TetrisGame.words)
            return TetrisGame.words[keys[ keys.length * Math.random() << 0]];
        },


        /**
         * Check if could find a success word
         */
        checkWordSuccess: function () {

        },


        /**
         * Get a random material color
         * @return {string}
         */
        materialColor: function () {
            // colors from https://github.com/egoist/color-lib/blob/master/color.json
            var colors = [
                "#ef5350",
                "#d32f2f",
                "#b71c1c",
                "#d50000",
                "#ec407a",
                "#e91e63",
                "#d81b60",
                "#c2185b",
                "#ad1457",
                "#880e4f",
                "#e91e63",
                "#f50057",
                "#c51162",
                "#ab47bc",
                "#9c27b0",
                "#8e24aa",
                "#7b1fa2",
                "#6a1b9a",
                "#4a148c",
                "#9c27b0",
                "#aa00ff",
                "#7e57c2",
                "#673ab7",
                "#5e35b1",
                "#512da8",
                "#4527a0",
                "#311b92",
                "#673ab7",
                "#7c4dff",
                "#651fff",
                "#6200ea",
                "#5c6bc0",
                "#3f51b5",
                "#3949ab",
                "#303f9f",
                "#283593",
                "#1a237e",
                "#3f51b5",
                "#536dfe",
                "#3d5afe",
                "#304ffe",
                "#2196f3",
                "#1e88e5",
                "#1976d2",
                "#1565c0",
                "#0d47a1",
                "#448aff",
                "#2979ff",
                "#2962ff",
                "#039be5",
                "#0288d1",
                "#0277bd",
                "#01579b",
                "#0091ea",
                "#00acc1",
                "#0097a7",
                "#00838f",
                "#006064",
                "#009688",
                "#00897b",
                "#00796b",
                "#00695c",
                "#004d40",
                "#4caf50",
                "#43a047",
                "#388e3c",
                "#2e7d32",
                "#7cb342",
                "#689f38",
                "#558b2f",
                "#33691e",
                "#9e9d24",
                "#ef6c00",
                "#e65100"
            ];
            var random = parseInt(Math.random() * colors.length);
            return colors[random];
        },


        /**
         * Start Game play
         */
        startGamePlay: function () {

            // get max json word length [min:8 - max:15] to create columns
            var validColumnsCount = TetrisGame.getValidColumnsNumber();
            log(validColumnsCount);

            // get two words from json to create rows and columns
            log("random words");
            log(TetrisGame.chooseWords());


            // create first char block
            var char = new TetrisGame.charBlock();
            log(char);

            document.addEventListener("keydown" , function (e) {
                TetrisGame.aliveChars[TetrisGame.activeCharIndex - 1].move(e.keyCode);
            });
        },


        /**
         * Pause Game play
         */
        pauseGamePlay: function () {
            // todo : 1. pause timer
            //      2. pause adding new chars
        },



        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        build : function () {

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
                            <div onclick="TetrisGame.startGamePlay();" class="startGame">langStartGame</div>
                            <div class="pauseGame">langPauseGame</div>
                       </div>
                   </div>
                   <div class="playBoard"> 
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
                       <div class="charBlock" >ت</div>
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