/* jshint browser: true */

var TetrisGame;
(function () {

    'use strict';

    var blobTiming, timerWorker = null;

    let controlCodes = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    };

    TetrisGame = {

        /**
         * Current version
         */
        version : '0.1.9',


        /**
         * Base config for game
         */
        config: {
            rows: 11,
            columnsMin : 6,
            columnsMax : 12,
            workingWordCount : 2,
            charSpeed : 1000,  // 1 second
            checkInRow: true,
            checkInColumn : false,
            animateHiding: true,
            playSoundOnSuccess : false,
            playSoundOnFailure : false,
            useLowercase : false,
            animateCharSpeed : 20
        },


        /**
         * Initialize variables
         */
        initValues : {
            paused : false,                 // is game paused 
            finished: false,                // is game finished
            wordsFinished: false,           // do we run out of words
            
            validatedColumnsCount: 0,       // Count of columns which are validated
            nextChar: '',                   // Next character
            activeChar : {},                // Active character [not stopped] Object index
            choosedWords: [],               // Choosed words to work with them
            choosedWordsUsedChars : []      // Chars that used from choosed words
        },


        /**
         * Are we in browser env
         */
        isBrowser : (typeof window !== 'undefined'),


        /**
         * Game play board
         */
        playBoard : null,



        /**
         * Class Use to add new coming block
         */
        charBlock: function() {


            // if game is finished
            if(TetrisGame.initValues.finished){
                document.querySelector(".showUpComingLetter").innerHTML = "";
                return false;
            }

            let charBlock = {};

            // choose random column to init char
            charBlock.column = Math.random() * TetrisGame.initValues.validatedColumnsCount << 0;
            charBlock.row = 0;                               // top is 0 and bottom is max
            charBlock.name = TetrisGame.initValues.nextChar === "" ? TetrisGame.chooseChar() : TetrisGame.initValues.nextChar;        // char value
            charBlock.color = TetrisGame.materialColor();    // random material color
            charBlock.active = true;                         // character is animating on air
            charBlock.element = null;                        // holds our character element


            // move char
            charBlock.move = function(eventKeyCode){

                var moveTo = {};
                var isBottomMove = false;


                switch (eventKeyCode){
                    case controlCodes.LEFT:  // left
                        moveTo = {
                            row : charBlock.row ,
                            column : charBlock.column + 1,
                            animateOutClass : (lang.rtl ? "fadeOutLeft" : "fadeInRight"),
                            animateInClass : (lang.rtl ? "fadeInRight" : "fadeInLeft")
                        };
                        break;
                    case controlCodes.RIGHT:  // right
                        moveTo = {
                            row : charBlock.row ,
                            column : charBlock.column - 1,
                            animateOutClass : (lang.rtl ? "fadeOutRight" : "fadeInLeft"),
                            animateInClass : (lang.rtl ? "fadeInLeft" : "fadeInRight")
                        };
                        break;
                    case controlCodes.DOWN:  // down
                        moveTo = {
                            row : charBlock.row + 1 ,
                            column : charBlock.column,
                            animateOutClass : "fadeOutDown",
                            animateInClass : "fadeInDown"
                        };
                        isBottomMove = true;
                        break;
                    default:
                        return false;
                }


                // if move to is out of range
                if(moveTo.column >= TetrisGame.initValues.validatedColumnsCount || moveTo.column < 0){
                    return false;
                }


                var destinationEl = TetrisGame.playBoard.querySelector(".row_" + moveTo.row + " .column_" + moveTo.column) || null;
                if(moveTo.row >= TetrisGame.config.rows || (destinationEl.innerText.trim() !== "")){

                    if(isBottomMove) {

                        // stop interval and request new char
                        clearInterval(charBlock.interval);

                        // check words
                        TetrisGame.checkWordSuccess(charBlock);

                        if(charBlock.row !== 0) {

                            if(TetrisGame.initValues.wordsFinished){
                                TetrisGame.finishGame("finishWords");
                            }else {
                                // add new char
                                TetrisGame.characterFactory();
                            }
                        }else{
                            TetrisGame.finishGame("gameOver");
                        }
                    }

                }else{

                    // remove char with animation
                    charBlock.destroy(charBlock.element , moveTo.animateOutClass);

                    // update current char info
                    charBlock.row = moveTo.row;
                    charBlock.column = moveTo.column;
                    charBlock.animateInClass = moveTo.animateInClass;

                    // add our char in destination
                    TetrisGame.characterFactory(charBlock, destinationEl);
                }
            };


            // interval
            charBlock.interval = setInterval(function () {
                if(!TetrisGame.initValues.paused) {
                    charBlock.move(40);
                }
            } , TetrisGame.config.charSpeed);


            // destroy current character
            charBlock.destroy = function (workingElement , outgoingAnimation) {
                workingElement.className += " animated " + outgoingAnimation;
                setTimeout(function () {
                    // remove current char
                    workingElement.parentNode.removeChild(workingElement);
                } , 200);
            };


            // create and show up coming char
            TetrisGame.initValues.nextChar = TetrisGame.chooseChar();
            document.querySelector(".showUpComingLetter").innerHTML = TetrisGame.initValues.nextChar || "";

            // add this char to active chars
            TetrisGame.initValues.activeChar = charBlock;

            return charBlock;
        },


        /**
         * Choose a char of choosed words
         */
        chooseChar: function () {

            var choosedChar;
            var availableChars = TetrisGame.initValues.choosedWords.map(function(e){
                return e ? e.word : ""
            }).join('');

            TetrisGame.initValues.choosedWordsUsedChars.forEach(function (value) {
                availableChars = availableChars.replace(value , '');
            });

            if(availableChars.length === 0){
                let newWord = TetrisGame.chooseWord();
                if(newWord !== false) {
                    TetrisGame.initValues.choosedWords.push(newWord);
                    return TetrisGame.chooseChar();
                }
            }else {
                choosedChar = availableChars[Math.random() * availableChars.length << 0];
                TetrisGame.initValues.choosedWordsUsedChars.push(choosedChar);

                return choosedChar;
            }
        },


        /**
         * Choose random words in game build to work with
         */
        chooseWord: function () {
            var keys = Object.keys(window.TetrisWords);
            var randomKey = keys[ keys.length * Math.random() << 0];
            var value = window.TetrisWords[randomKey];

            if(typeof value === "undefined" && !TetrisGame.initValues.finished){
                TetrisGame.initValues.wordsFinished = true;
                return false;
            }
            log(value);

            delete window.TetrisWords[randomKey];
            return value;
        },



        /**
         * Get a valid column number [min-max]
         */
        getValidColumnsNumber: function () {
            var columnsNumber = TetrisGame.config.columnsMin;
            for (var i = Object.keys(window.TetrisWords).length - 1; i >= 0; i--) {
                var thisWordLength = window.TetrisWords[i].word.length;
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
        checkWordSuccess: function (lastChar) {

            log("check word happens");
            // @todo : if okay : remove chars from Tetris.choosedWordsUsedChars and word from Tetris.choosedWords
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


        /**
         * LocalStorage Helper Class
         */
        storage: function() {
            let storage = {};

            storage.get = function (key, default_value) {
                default_value = default_value || "";
                return localStorage.getItem(key) || default_value;
            };
            storage.getInt = function (key, default_value) {
                default_value = default_value || 0;
                return Number(storage.get(key , default_value));
            };
            storage.set = function (key, value) {
                localStorage.setItem(key, value)
            };

            storage.setArray = function (key, value) {
                return localStorage.setItem(key, value.join(","))
            };

            return storage;
        },


        /**
         * Game timer manager class
         */
        timer : function () {

            var timer = {};

            timer.start = function () {

                // change paused status
                TetrisGame.initValues.paused = false;

                var timerDisplayEl = document.querySelector(".timerDisplay");
                if (typeof(Worker) !== "undefined") {


                    if (timerWorker === null) {
                        timerWorker = new Worker(window.URL.createObjectURL(blobTiming));
                    }else{
                        // stop timer if running already
                        TetrisGame.timer().stop();
                    }

                    timerWorker.onmessage = function(event) {
                        timerDisplayEl.innerHTML = TetrisGame.timer().beautifySecond(event.data);
                        TetrisGame.storage().set('seconds',event.data);
                    };

                } else {
                    timerDisplayEl.innerHTML = lang.webWorkerNotSupported;
                }
            };


            timer.pause = function () {
                TetrisGame.initValues.paused = true;
                timerWorker.postMessage({'pause_flag': true});
            };


            timer.resume = function () {
                TetrisGame.initValues.paused = false;
                timerWorker.postMessage({'pause_flag': false});
            };


            // make time beautiful
            timer.beautifySecond = function(s){
                if (s > 3600) {
                    // 1 hour and 34 min
                    return (Math.ceil(s / 3600) + lang.hour + lang.and + s % 3600 + lang.min);
                } else if (s > 60 && s <= 3600) {
                    // 4 min and 3 s
                    return (Math.ceil(s / 60) + lang.minute + lang.and + s % 60 + lang.second);
                } else {
                    return (s + lang.second);
                }
            };

            return timer;

        },


        /**
         * Factory of character
         * @param char
         * @param initializeElement
         */
        characterFactory: function (char , initializeElement) {

            // if char is not supplied create new one
            if(typeof char === "undefined") {

                char = new TetrisGame.charBlock();

                if(Object.keys(char).length !== 0){
                    initializeElement = TetrisGame.playBoard.querySelector(".row_" + char.row + " .column_" + char.column);
                }else{
                    return false;
                }
            }

            var charBlock = document.createElement('span');
            charBlock.style.background = char.color;
            charBlock.innerHTML = char.name;
            charBlock.className = "charBlock animated " + (char.animateInClass || "");

            char.element = charBlock;

            initializeElement.innerHTML = '';
            initializeElement.appendChild(charBlock);

        },


        /**
         * Start Game play
         */
        startGamePlay: function () {

            TetrisGame.playBoard = document.querySelector(".playBoard");

            // Get valid column length based on max json word length to create columns
            TetrisGame.initValues.validatedColumnsCount = TetrisGame.getValidColumnsNumber();

            // add class to have playBoard columns
            TetrisGame.playBoard.classList.add('is' + TetrisGame.initValues.validatedColumnsCount + 'Column');


            // create game columns and rows
            var playBoardTable = '';
            for(var r = 0;r < TetrisGame.config.rows; r++) {
                playBoardTable += '<div class="isRow row_' + r + '">';
                for (var c = 0; c < TetrisGame.initValues.validatedColumnsCount; c++) {
                    playBoardTable += '<div class="isColumn column_' + c + '" data-row="' + r + '"></div>';
                }
                playBoardTable += '</div>';
            }
            TetrisGame.playBoard.innerHTML = playBoardTable;


            // Choose n words from json to create rows and columns
            for(var i = 0; i < TetrisGame.config.workingWordCount;i++) {
                TetrisGame.initValues.choosedWords.push(TetrisGame.chooseWord());
            }

            // start game timer
            TetrisGame.timer().start();


            // create first char block
            TetrisGame.characterFactory();



            // arrow keys press
            document.addEventListener("keydown" , function (e) {
                TetrisGame.initValues.activeChar.move(e.keyCode);
            });


            let gameBtnControl = document.querySelector(".gameControlButtons");
            gameBtnControl.querySelector(".startGame").style.display = "none";
            gameBtnControl.querySelector(".pauseGame").style.display = "inline-block";
        },


        /**
         * Pause Game play
         * @todo : add resumeGamePlay
         */
        pauseGamePlay: function () {

            let gameBtnControl = document.querySelector(".gameControlButtons");
            gameBtnControl.querySelector(".pauseGame").style.display = "none";
            gameBtnControl.querySelector(".resumeGame").style.display = "inline-block";

            // stop timer [will stop whole game]
            TetrisGame.timer().pause();
        },


        /**
         * Resume Game play
         */
        resumeGamePlay: function () {

            let gameBtnControl = document.querySelector(".gameControlButtons");
            gameBtnControl.querySelector(".resumeGame").style.display = "none";
            gameBtnControl.querySelector(".pauseGame").style.display = "inline-block";

            // resume timer [will resume whole game]
            TetrisGame.timer().resume();
        },


        /**
         * Reset Game play
         */
        restartGamePlay: function () {
            TetrisGame.initValues = {
                paused : false,                 // is game paused
                finished: false,                // is game finished
                wordsFinished: false,           // do we run out of words

                validatedColumnsCount: 0,       // Count of columns which are validated
                nextChar: '',                   // Next character
                activeChar : {},                // Active character [not stopped] Object index
                choosedWords: [],               // Choosed words to work with them
                choosedWordsUsedChars : []      // Chars that used from choosed words
            };
            TetrisGame.build();
        },


        /**
         * Game is finished [gameOver OR finishWords]
         * @param mode
         */
        finishGame: function (mode) {

            let gameBtnControl = document.querySelector(".gameControlButtons");
            gameBtnControl.querySelector(".startGame,.pauseGame,.resumeGame").style.display = "none";
            gameBtnControl.querySelector(".restartGame").style.display = "inline-block";

            TetrisGame.initValues.finished = true;
            TetrisGame.timer().pause();


            if(mode === "gameOver"){
                alert("Game Over!");
            }else{
                alert("Finished words.");
            }


            // @todo : show modal

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
            let ltrClass = "";
            if(!lang.rtl){
                ltrClass = "isLtr";

                // In LTR languages, Left and Right should be swapped
                let tmp = controlCodes.LEFT;
                controlCodes.LEFT = controlCodes.RIGHT;
                controlCodes.RIGHT= tmp;
            }



            // add main html to page
            document.querySelector("#container").innerHTML =
                `<div class="gameHolder ${ltrClass}">
                    <div class="behindPlayBoard">
                       <div class="showUpComingLetter" title="${lang.nextLetter}:"></div>
                       <div class="gameControlButtons" >
                            <div onclick="TetrisGame.startGamePlay();" class="startGame">${lang.startGame}</div>
                            <div onclick="TetrisGame.pauseGamePlay();" class="pauseGame" style="display: none">${lang.pauseGame}</div>
                            <div onclick="TetrisGame.resumeGamePlay();" class="resumeGame" style="display: none">${lang.resumeGame}</div>
                            <div onclick="TetrisGame.restartGamePlay();" class="restartGame" style="display: none">${lang.restartGame}</div>
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