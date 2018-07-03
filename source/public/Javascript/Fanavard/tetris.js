/* jshint browser: true */

var TetrisGame;
(function () {

    'use strict';

    var blobTiming , timerWorker = null;

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
            columnsMin : 6,
            columnsMax : 12,
            workingWordCount : 2,
            charSpeed : 1000,  // 1 second
            checkInRow: true,
            checkInColumn : false,
            animateHiding: true,
            playSoundOnSuccess : false,
            playSoundOnFailure : false
        },


        /**
         * Count of columns which are validated
         */
        validatedColumnsCount:0,


        /**
         * Objects of char blocks
         */
        aliveChars : [],


        /**
         * Next character
         */
        nextChar : '',

        
        /**
         * Active character [not stopped] Object index
         */
        activeCharIndex : 0,


        /**
         * Choosed words to work with them
         */
        choosedWords : [],


        /**
         * Chars that used from choosed words
         */
        choosedWordsUsedChars : [],

        /**
         * Game play board
         */
        playBoard : null,


        /**
         * Class Use to add new coming block
         */
        charBlock: function() {

            var self = {};

            // choose random column to init char
            self.column = Math.random() * TetrisGame.validatedColumnsCount << 0;
            self.row = 0;                               // top is 0 and bottom is max
            self.name = TetrisGame.nextChar === "" ? TetrisGame.chooseChar() : TetrisGame.nextChar;        // char value
            self.color = TetrisGame.materialColor();    // random material color
            self.active = true;                         // character is animating on air


            // move char
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

            self.checkMoveAvailability = function (direction) {
                if(true){

                }
            };

            self.interval = setInterval(function () {
                self.move(40);
            } , TetrisGame.config.charSpeed);

            // create and show up coming char
            document.querySelector(".showUpComingLetter").innerHTML = TetrisGame.nextChar = TetrisGame.chooseChar();

            // add this char to alive chars
            TetrisGame.activeCharIndex = TetrisGame.aliveChars.push(self);

            return self;
        },


        /**
         * Choose a char of choosed words
         */
        chooseChar: function () {
            var availableChars = TetrisGame.choosedWords.map(function(e){return e.word}).join('');
            TetrisGame.choosedWordsUsedChars.forEach(function (value) {
                availableChars.replace(value , '');
            });

            return availableChars[Math.random() * availableChars.length << 0];
        },


        /**
         * Choose random words in game build to work with
         */
        chooseWord: function () {
            var keys = Object.keys(TetrisGame.words);
            var randomKey = keys[ keys.length * Math.random() << 0];
            var value = TetrisGame.words[randomKey];
            delete TetrisGame.words[randomKey];
            return value;
        },



        /**
         * Get a valid column number [min-max]
         */
        getValidColumnsNumber: function () {
            var columnsNumber = TetrisGame.config.columnsMin;
            for (var i = Object.keys(TetrisGame.words).length - 1; i >= 0; i--) {
                var thisWordLength = TetrisGame.words[i].word.length;
                if(thisWordLength > columnsNumber){
                    columnsNumber = thisWordLength;
                }
            }
            columnsNumber = TetrisGame.config.columnsMax < columnsNumber ? TetrisGame.config.columnsMax : columnsNumber;
            return columnsNumber%2 === 0 ? columnsNumber : columnsNumber +1;
        },



        /**
         * Check if could find a success word
         */
        checkWordSuccess: function () {

            // @todo : if okaye : remove chars from Tetris.choosedWordsUsedChars and word from Tetris.choosedWords
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
                "#1e88e5",
                "#1976d2",
                "#1565c0",
                "#0d47a1",
                "#2979ff",
                "#2962ff",
                "#0288d1",
                "#0277bd",
                "#01579b",
                "#0091ea",
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
            var random = Math.random() * colors.length << 0;
            return colors[random];
        },


        // start game timer
        startTimer: function () {
            var timerDisplayEl = document.querySelector(".timerDisplay");
            if (typeof(Worker) !== "undefined") {

                // stop timer if running already
                TetrisGame.stopTimer();

                if (timerWorker === null) {
                    timerWorker = new Worker(window.URL.createObjectURL(blobTiming));
                }

                timerWorker.onmessage = function(event) {
                    // @todo : add to local storage
                    timerDisplayEl.innerHTML = TetrisGame.beautifySecond(event.data);
                };

            } else {
                timerDisplayEl.innerHTML = lang.webWorkerNotSupported;
            }
        },


        // stop timer
        stopTimer: function() {
            if (timerWorker === null) {
                timerWorker = new Worker(window.URL.createObjectURL(blobTiming));
            }
            timerWorker.terminate();
            timerWorker = null;
        },


        // make time beautiful
        beautifySecond: function(s){
            if (s > 3600) {
                // 1 hour and 34 min
                return (Math.ceil(s / 3600) + lang.hour + lang.and + s % 3600 + lang.min);
            } else if (s > 60 && s <= 3600) {
                // 4 min and 3 s
                return (Math.ceil(s / 60) + lang.minute + lang.and + s % 60 + lang.second);
            } else {
                return (s + lang.second);
            }
        },


        addCharacter: function () {

            var char = new TetrisGame.charBlock();
            var initializeElement = TetrisGame.playBoard.querySelector(".row_" + char.row + " .column_" + char.column);

            initializeElement.innerHTML = '<span style="background: ' + char.color + '" class="charBlock">' + char.name + '</span>';

        },


        /**
         * Start Game play
         */
        startGamePlay: function () {

            TetrisGame.playBoard = document.querySelector(".playBoard");

            // Get valid column length based on max json word length to create columns
            TetrisGame.validatedColumnsCount = TetrisGame.getValidColumnsNumber();

            // add class to have playBoard columns
            TetrisGame.playBoard.classList.add('is' + TetrisGame.validatedColumnsCount + 'Column');


            // create game columns and rows
            var playBoardTable = '';
            for(var r = 0;r < TetrisGame.config.rows; r++) {
                playBoardTable += '<div class="isRow row_' + r + '">';
                for (var c = 0; c < TetrisGame.validatedColumnsCount; c++) {
                    playBoardTable += '<div class="isColumn column_' + c + '" data-row="' + r + '"></div>';
                }
                playBoardTable += '</div>';
            }
            TetrisGame.playBoard.innerHTML = playBoardTable;


            // Choose n words from json to create rows and columns
            for(var i = 0; i < TetrisGame.config.workingWordCount;i++) {
                TetrisGame.choosedWords.push(TetrisGame.chooseWord());
            }


            // create first char block
            TetrisGame.addCharacter();


            TetrisGame.startTimer();


            // arrow keys press
            document.addEventListener("keydown" , function (e) {
                TetrisGame.aliveChars[TetrisGame.activeCharIndex - 1].move(e.keyCode);
            });
        },


        /**
         * Pause Game play
         * @todo : add resumeGamePlay
         */
        pauseGamePlay: function () {

            // stop timer
            TetrisGame.stopTimer();

            //      2. pause adding new chars
            //      3. clear active char setTimeout
        },



        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        build : function () {

            // blob for timer
            blobTiming = new Blob([
                document.querySelector('#workerTiming').textContent
            ], { type: "text/javascript" });


            // make ltr if used lang is ltr
            var ltrClass = "";
            if(!lang.rtl){
                ltrClass = "isLtr";
            }

            // add main html to page
            document.querySelector("#container").innerHTML =
                `<div class="gameHolder ${ltrClass}">
                    <div class="behindPlayBoard">
                       <div class="showUpComingLetter" title="${lang.nextLetter}:"></div>
                       <div class="gameControlButtons" >
                            <div onclick="TetrisGame.startGamePlay();" class="startGame">${lang.startGame}</div>
                            <div onclick="TetrisGame.pauseGamePlay();" class="pauseGame hide">${lang.pauseGame}</div>
                       </div>
                       <div class="courseArea"> 
                           <div ><i class="linearicon linearicon-bag-pound"></i> ${lang.score} : 0</div> 
                           <div ><i class="linearicon linearicon-mustache-glasses"></i> ${lang.createdWords} : 0</div> 
                           <div ><i class="linearicon linearicon-clock"></i> ${lang.spentTime} : <span class="timerDisplay">0</span></div> 
                       </div>
                   </div>
                   <div class="playBoard"><span class="emptyPlayBoard">${lang.clickStartGame}</span></div>
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