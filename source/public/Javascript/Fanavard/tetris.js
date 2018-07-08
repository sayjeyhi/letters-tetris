/* jshint browser: true */


const CONTROL_CODES = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

let isFirstRun=true;

(function () {

    'use strict';

    let TetrisGame,blobTiming, timer, matrix;

    /**
     * //TODO: Execute this before anything else
     * Create Object.assign method if it's not supported by default
     */
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                let to = Object(target);
                for (let i = 1; i < arguments.length; i++) {
                    let nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }
                    nextSource = Object(nextSource);

                    let keysArray = Object.keys(nextSource);
                    for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        let nextKey = keysArray[nextIndex];
                        let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }


    /**
     * Tetris game
     * @type {{version: string, config: {rows: number, columnsMin: number, columnsMax: number, workingWordCount: number, charSpeed: number, checkInRow: boolean, checkInColumn: boolean, animateHiding: boolean, playSoundOnSuccess: boolean, playSoundOnFailure: boolean, useLowercase: boolean, animateCharSpeed: number}, initValues: {paused: boolean, finished: boolean, wordsFinished: boolean, chooseedWordKind: {}, validatedColumnsCount: number, nextChar: string, activeChar: {}, choosedWords: Array, choosedWordsUsedChars: Array}, isBrowser: boolean, playBoard: null, charBlock: charBlock, showUpCommingChar: showUpCommingChar, chooseChar: chooseChar, chooseWord: chooseWord, getValidColumnsNumber: getValidColumnsNumber, checkWordSuccess: checkWordSuccess, characterFactory: characterFactory, buttonManager: buttonManager, startGamePlay: startGamePlay, pauseGamePlay: pauseGamePlay, resumeGamePlay: resumeGamePlay, restartGamePlay: restartGamePlay, finishGame: finishGame, build: build}}
     */
    TetrisGame = {

        /**
         * Current version
         */
        version: '0.1.9',


        /**
         * Base config for game
         */
        config: {
            rows: 11,
            columnsMin: 6,
            columnsMax: 12,
            workingWordCount: 2,
            charSpeed: 1000,  // 1 second
            checkInRow: true,
            checkInColumn: false,
            animateHiding: true,
            playSoundOnSuccess: false,
            playSoundOnFailure: false,
            useLowercase: false,
            level: 1 ,                      // up to 3 - if it is big it is hard to play
            useAnimationFlag : true         // make animate or not
        },


        /**
         * Initialize variables
         */
        initValues: {
            paused: false,                  // is game paused
            finished: false,                // is game finished
            wordsFinished: false,           // do we run out of words
            chooseedWordKind: {},           // holds user words kind

            validatedColumnsCount: 0,       // Count of columns which are validated
            nextChar: '',                   // Next character
            activeChar: {},                 // Active character [not stopped] Object index
            choosedWords: [],               // Choosed words to work with them
            choosedWordsUsedChars: []       // Chars that used from choosed words
        },


        /**
         * Are we in browser env
         */
        isBrowser: (typeof window !== 'undefined'),


        /**
         * Game playByKey board
         */
        playBoard: null,



        /**
         * Class Use to add new coming block
         */
        charBlock: function () {


            // if game is finished
            if (TetrisGame.initValues.finished) {
                document.querySelector(".showUpComingLetter").innerHTML = "";
                return false;
            }

            let charBlock = {};

            // choose random column to init char
            charBlock.column = Math.random() * TetrisGame.initValues.validatedColumnsCount << 0;
            charBlock.row = 0;                               // top is 0 and bottom is max
            charBlock.name = TetrisGame.initValues.nextChar === "" ? TetrisGame.chooseChar() : TetrisGame.initValues.nextChar;        // char value
            charBlock.color = MaterialColor.getRandomColor();    // random material color
            charBlock.active = true;                         // character is animating on air
            charBlock.element = null;                        // holds our character element


            // move char
            charBlock.move = function (eventKeyCode , position) {

                let moveTo = {};
                let isBottomMove = false;


                switch (eventKeyCode) {
                    case TetrisGame.controlCodes.LEFT:  // left
                        moveTo = {
                            row: charBlock.row,
                            column: charBlock.column + 1,
                            animateOutClass: (lang.rtl ? "fadeOutLeft" : "fadeOutRight"),
                            animateInClass: (lang.rtl ? "fadeInRight" : "fadeInLeft")
                        };
                        break;
                    case TetrisGame.controlCodes.RIGHT:  // right
                        moveTo = {
                            row: charBlock.row,
                            column: charBlock.column - 1,
                            animateOutClass: (lang.rtl ? "fadeOutRight" : "fadeOutLeft"),
                            animateInClass: (lang.rtl ? "fadeInLeft" : "fadeInRight")
                        };
                        break;
                    case TetrisGame.controlCodes.DOWN:  // down
                        moveTo = {
                            row: charBlock.row + 1,
                            column: charBlock.column,
                            animateOutClass: "fadeOutDown",
                            animateInClass: "fadeInDown"
                        };
                        isBottomMove = true;
                        break;
                    default:

                        // do we have forced position
                        if(typeof position !== "undefined"){
                            moveTo = {
                                row: position.x,
                                column: position.y ,
                                animateOutClass: "fadeOutDown",
                                animateInClass: "fadeInDown"
                            };
                        }else {
                            console.log("Unable to determine move !");
                            return false;
                        }
                }


                // if move to is out of range
                if (moveTo.column >= TetrisGame.initValues.validatedColumnsCount || moveTo.column < 0) {
                    return false;
                }


                let destinationEl = TetrisGame.playBoard.querySelector(".row_" + moveTo.row + " .column_" + moveTo.column) || null;
                if (moveTo.row >= TetrisGame.config.rows || (destinationEl.innerText.trim() !== "")) {

                    if (isBottomMove) {
                        log(moveTo);
                        TetrisGame.matrix[moveTo.row-1][moveTo.column] = charBlock.name;
                        console.log(TetrisGame.matrix);

                        // stop interval and request new char
                        clearInterval(charBlock.interval);

                        // check words
                        TetrisGame.checkWordSuccess(charBlock);

                        if (charBlock.row !== 0) {

                            if (TetrisGame.initValues.wordsFinished) {
                                TetrisGame.finishGame("finishWords");
                            } else {
                                // add new char
                                TetrisGame.characterFactory();
                            }
                        } else {
                            TetrisGame.finishGame("gameOver");
                        }
                    }

                } else {

                    // remove char with animation
                    charBlock.destroy(charBlock.element, moveTo.animateOutClass);

                    // update current char info
                    charBlock.row = moveTo.row;
                    charBlock.column = moveTo.column;
                    charBlock.animateInClass = moveTo.animateInClass;

                    // add our char in destination
                    TetrisGame.characterFactory(charBlock, destinationEl);
                }

                // playByKey move char
                Sound.playByKey('moveChar');

            };


            // interval
            charBlock.interval = setInterval(() => {
                if (!TetrisGame.initValues.paused) {
                    charBlock.move(40);
                }
            }, TetrisGame.config.charSpeed);


            // destroy current character
            charBlock.destroy = function (workingElement, outgoingAnimation) {
                workingElement.className += " animated " + outgoingAnimation;
                setTimeout(() => {
                    // remove current char
                    workingElement.parentNode.removeChild(workingElement);
                }, 200);
            };


            // create and show up coming char
            TetrisGame.showUpCommingChar();

            // add this char to active chars
            TetrisGame.initValues.activeChar = charBlock;

            return charBlock;
        },


        /**
         * Create and show upcoming character
         */
        showUpCommingChar: function () {

            TetrisGame.initValues.nextChar = TetrisGame.chooseChar();

            let upCommingCharHolder = document.querySelector(".showUpComingLetter");
            let upcommingCharEl = document.createElement('span');

            upCommingCharHolder.innerHTML = '';
            upcommingCharEl.className = "animated bounceIn";
            upcommingCharEl.innerHTML = TetrisGame.initValues.nextChar || "";
            upCommingCharHolder.appendChild(upcommingCharEl);
        },


        /**
         * Choose random words in game build to work with
         */
        chooseWord: function () {
            let keys = Object.keys(window.TetrisWords);
            let randomKey = keys[keys.length * Math.random() << 0];
            let value = window.TetrisWords[randomKey];
            value.word = value.word.replace(/[^a-zA-Zآ-ی]/g, "");


            // use lower case of characters
            if(TetrisGame.config.useLowercase){
                value.word = value.word.toLowerCase();
            }

            if (typeof value === "undefined" && !TetrisGame.initValues.finished) {
                TetrisGame.initValues.wordsFinished = true;
                return false;
            }
            log(value);

            delete window.TetrisWords[randomKey];
            return value;
        },


        /**
         * Choose a char of choosed words
         */
        chooseChar: function () {

            let choosedChar;
            let availableChars = TetrisGame.initValues.choosedWords.map(function (e) {
                return e ? e.word : ""
            }).join('');

            TetrisGame.initValues.choosedWordsUsedChars.forEach(function (value) {
                availableChars = availableChars.replace(value, '');
            });

            if (availableChars.length === 0) {
                let newWord = TetrisGame.chooseWord();
                if (newWord !== false) {
                    TetrisGame.initValues.choosedWords.push(newWord);
                    return TetrisGame.chooseChar();
                }
            } else {
                choosedChar = availableChars[Math.random() * availableChars.length << 0];
                TetrisGame.initValues.choosedWordsUsedChars.push(choosedChar);

                return choosedChar;
            }
        },




        /**
         * Get a valid column number [min-max]
         */
        getValidColumnsNumber: function () {
            let columnsNumber = TetrisGame.config.columnsMin;
            for (let i = Object.keys(window.TetrisWords).length - 1; i >= 0; i--) {
                if(window.TetrisWords[i]) {
                    let thisWordLength = window.TetrisWords[i].word.length;
                    if (thisWordLength > columnsNumber) {
                        columnsNumber = thisWordLength;
                    }
                }
            }
            columnsNumber = TetrisGame.config.columnsMax < columnsNumber ? TetrisGame.config.columnsMax : columnsNumber;
            return columnsNumber % 2 === 0 ? columnsNumber : columnsNumber + 1;
        },


        /**
         * Check if could find a success word
         * @param lastChar
         */
        checkWordSuccess: function (lastChar) {
            log("check word happens");
            // @todo : if okay : remove chars from Tetris.choosedWordsUsedChars and word from Tetris.choosedWords
        },


        /**
         * Factory of character
         * @param char
         * @param initializeElement
         */
        characterFactory: function (char, initializeElement) {

            // if char is not supplied create new one
            if (typeof char === "undefined") {

                char = new TetrisGame.charBlock();

                if (Object.keys(char).length !== 0) {
                    initializeElement = TetrisGame.playBoard.querySelector(".row_" + char.row + " .column_" + char.column);
                } else {
                    return false;
                }
            }

            let charBlock = document.createElement('span');
            charBlock.style.background = char.color;
            charBlock.innerHTML = char.name;
            charBlock.className = "charBlock animated " + (char.animateInClass || "");

            char.element = charBlock;

            initializeElement.innerHTML = '';
            initializeElement.appendChild(charBlock);

        },


        /**
         * Manage btn parts buttons
         * @param showClassed
         * @param hideClasses
         */
        buttonManager: function (showClassed, hideClasses) {
            let gameBtnControl = document.querySelector(".gameControlButtons");
            gameBtnControl.querySelectorAll(showClassed).forEach((item) => {
                item.style.display = "inline-block";
            })
            gameBtnControl.querySelectorAll(hideClasses).forEach((item) => {
                item.style.display = "none";
            })
        },


        /**
         * Show game settings
         */
        showSetting: function () {

            let content =
                '<form id="settingForm" class="cssRadio">' +
                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-music-note2"></i> ' + lang.backgroundMusic + '</div>' +
                        '<div class="formData">' +
                            '<input id="soundPlayYes" type="radio" name="soundPlay" value="1" checked />' +
                            '<label for="soundPlayYes"><span>' + lang.active + '</span></label>' +
                            '<input id="soundPlayNo" type="radio" name="soundPlay" value="1"/>' +
                            '<label for="soundPlayNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-music-note"></i> ' + lang.eventsMusic + '</div>' +
                        '<div class="formData">' +
                            '<input id="eventSoundsYes" type="radio" name="eventSounds" value="1" checked />' +
                            '<label for="eventSoundsYes"><span>' + lang.active + '</span></label>' +
                            '<input id="eventSoundsNo" type="radio" name="eventSounds" value="1"/>' +
                            '<label for="eventSoundsNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-magic-wand"></i> ' + lang.animation + '</div>' +
                        '<div class="formData">' +
                            '<input id="useAnimationYes" type="radio" name="useAnimation" value="1" checked />' +
                            '<label for="useAnimationYes"><span>' + lang.active + '</span></label>' +
                            '<input id="useAnimationNo" type="radio" name="useAnimation" value="1"/>' +
                            '<label for="useAnimationNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-game"></i> ' + lang.gameLevel + '</div>' +
                        '<div class="formData">' +
                            '<input id="gameLevelEasy" type="radio" name="gameLevel" value="1" checked />' +
                            '<label for="gameLevelEasy"><span>'+ lang.simple + '</span></label>' +
                            '<input id="gameLevelMedium" type="radio" name="gameLevel" value="2"/>' +
                            '<label for="gameLevelMedium"><span>'+ lang.medium + '</span></label>' +
                            '<input id="gameLevelExpert" type="radio" name="gameLevel" value="3"/>' +
                            '<label for="gameLevelExpert"><span>' + lang.expert + '</span></label>' +
                        '</div>' +
                    '</div>' +

                '</form>';

            let settingModal = new Modal({
                header : lang.settingModalTitle,
                content : content,
                buttons : [
                    {
                        text : lang.save,
                        isOk : true,
                        onclick : function () {

                            // @todo : save setting form serialize and write it on Storage

                            settingModal.destroy();
                        }
                    },
                    {
                        text : lang.close,
                        onclick : function () {
                            settingModal.destroy();
                        }
                    }
                ]
            }, lang.rtl );

            settingModal.show();
        },


        /**
         * Start Game playByKey
         */
        startGamePlay: function () {

            TetrisGame.playBoard = document.querySelector(".playBoard");

            // Get valid column length based on max json word length to create columns
            TetrisGame.initValues.validatedColumnsCount = TetrisGame.getValidColumnsNumber();

            // add class to have playBoard columns
            TetrisGame.playBoard.classList.add('is' + TetrisGame.initValues.validatedColumnsCount + 'Column');


            // create game columns and rows - matrix
            let playBoardTable = '';
            let rowArray = [];
            for (let r = 0; r < TetrisGame.config.rows; r++) {
                let row = [];
                playBoardTable += '<div class="isRow row_' + r + '">';
                for (let c = 0; c < TetrisGame.initValues.validatedColumnsCount; c++) {
                    playBoardTable += '<div class="isColumn column_' + c + '" data-row="' + r + '"></div>';
                    row[c]='';
                }
                rowArray[r] = row;
                playBoardTable += '</div>';
            }

            TetrisGame.matrix = rowArray;

            TetrisGame.playBoard.innerHTML = playBoardTable;


            // Choose n words from json to create rows and columns
            for (let i = 0; i < TetrisGame.config.workingWordCount; i++) {
                TetrisGame.initValues.choosedWords.push(TetrisGame.chooseWord());
            }

            // start game timer
            TetrisGame.timer.start();


            // create first char block
            TetrisGame.characterFactory();

            // playByKey start sound
            Sound.playByKey('start');

            // arrow keys press
            document.onkeydown = function (e) {
                if(!TetrisGame.initValues.paused) {
                    TetrisGame.initValues.activeChar.move(e.keyCode);
                }
            };

            TetrisGame.buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');
        },


        /**
         * Pause Game playByKey
         */
        pauseGamePlay: function () {

            // playByKey resume sound
            Sound.playByKey('pause');

            // manage game buttons
            TetrisGame.buttonManager('.resumeGame,.restartGame', '.startGame,.pauseGame');

            // stop timer [will stop whole game]
            TetrisGame.timer.pause();
        },


        /**
         * Resume Game playByKey
         */
        resumeGamePlay: function () {

            // playByKey resume sound
            Sound.playByKey('pause');

            // manage game buttons
            TetrisGame.buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');

            // resume timer [will resume whole game]
            TetrisGame.timer.resume();
        },


        /**
         * Reset Game playByKey
         */
        restartGamePlay: function () {

            // make game variables that variables was on start
            TetrisGame.initValues = {
                paused: false,                 // is game paused
                finished: false,                // is game finished
                wordsFinished: false,           // do we run out of words
                chooseedWordKind: {
                    persianTitle: TetrisGame.initValues.chooseedWordKind.persianTitle,
                    englishTitle: TetrisGame.initValues.chooseedWordKind.englishTitle
                },

                validatedColumnsCount: 0,       // Count of columns which are validated
                nextChar: '',                   // Next character
                activeChar: {},                // Active character [not stopped] Object index
                choosedWords: [],               // Choosed words to work with them
                choosedWordsUsedChars: []      // Chars that used from choosed words
            };

            // playByKey resume sound
            Sound.playByKey('pause');

            //Remove old listener of keydown which causes multiple moves
            document.onkeydown=null;


            // re-build game
            TetrisGame.build();
        },


        /**
         * Game is finished [gameOver OR finishWords]
         * @param mode
         */
        finishGame: function (mode) {


            // play finish sound
            Sound.playByKey('finishGame');


            // manage game buttons
            TetrisGame.buttonManager('.restartGame', '.startGame,.pauseGame,.resumeGame');

            TetrisGame.initValues.finished = true;
            TetrisGame.timer.pause();

            let modalHeader = "", modalContent = "";
            if (mode === "gameOver") {
                modalHeader = lang.gameOverModalTitle;
                modalContent = lang.gameOverModalContent;
            } else {
                modalHeader = lang.noExtraWordModalTitle;
                modalContent = lang.noExtraWordModalContent;
            }

            let modal = new Modal({
                header : modalHeader,
                content : modalContent,
                buttons : [
                    {
                        text : lang.restartGame,
                        isOk : true,
                        onclick : function () {
                            modal.destroy();
                            TetrisGame.restartGamePlay();
                        }
                    },
                    {
                        text : lang.modalOkButton,
                        onclick : function () {
                            modal.destroy();
                        }
                    }
                ]
            }, lang.rtl );

            setTimeout(() => {
                modal.show();
            } , 300);

        },



        /**
         * Select editor element with class search emoji
         * @type {HTMLElement | null}
         */
        build: function () {

            // blob for timer
            blobTiming = new Blob([
                document.querySelector('#workerTiming').textContent
            ], { type: "text/javascript" });


            // set Timer instance to current TetrisGame.timer
            TetrisGame.timer = new Timer({
                blobTiming: blobTiming,
                onStart: function () {
                    TetrisGame.initValues.paused = false;
                },
                workerOnMessage: function (event) {
                    Storage.set('seconds', event.data);
                },
                onPause: function () {
                    TetrisGame.initValues.paused = true;
                },
                onResume: function () {
                    TetrisGame.initValues.paused = false;
                }
            });



            // make ltr if used lang is ltr
            let ltrClass = "";



            TetrisGame.controlCodes = {
                LEFT:   CONTROL_CODES.LEFT,
                RIGHT:  CONTROL_CODES.RIGHT,
                DOWN:   CONTROL_CODES.DOWN
            };


            if (!lang.rtl) {
                ltrClass = "isLtr";

                // In LTR languages, Left and Right should be swapped
                TetrisGame.controlCodes = {
                    RIGHT:  CONTROL_CODES.LEFT,
                    LEFT:   CONTROL_CODES.RIGHT,
                    DOWN:   CONTROL_CODES.DOWN
                }
            }


            if(isFirstRun){
                let sound = new Sound("background");
                sound.play();

                isFirstRun = false;
            }


            // add main html to page
            document.querySelector("#container").innerHTML =
                `<div class="gameHolder ${ltrClass}">
                    <div class="behindPlayBoard">
                        <div class="gamingKind"><span class="persian">${TetrisGame.initValues.chooseedWordKind.persianTitle}</span><span class="english">${TetrisGame.initValues.chooseedWordKind.englishTitle}</span></div>
                        <div class="showUpComingLetter" title="${lang.nextLetter}:"></div>
                        <div class="gameControlButtons" >
                            <div onclick="TetrisGame.startGamePlay();" class="startGame">${lang.startGame}</div>
                            <div onclick="TetrisGame.pauseGamePlay();" class="pauseGame" style="display: none">${lang.pauseGame}</div>
                            <div onclick="TetrisGame.resumeGamePlay();" class="resumeGame" style="display: none">${lang.resumeGame}</div>
                            <div onclick="TetrisGame.restartGamePlay();" class="restartGame" style="display: none">${lang.restartGame}</div>
                        </div>
                       <div class="courseArea">
                           <div class="setting" onclick="TetrisGame.showSetting();"><i class="linearicon linearicon-cog"></i> ${lang.settings}</div>
                           <div ><i class="linearicon linearicon-bag-pound"></i> ${lang.score} : 0</div>
                           <div ><i class="linearicon linearicon-mustache-glasses"></i> ${lang.createdWords} : 0</div>
                           <div ><i class="linearicon linearicon-clock"></i> ${lang.spentTime} : <span class="timerDisplay">0</span></div>
                       </div>
                   </div>
                   <div class="playBoard"><span class="emptyPlayBoard">${lang.clickStartGame}</span></div>
                </div>
                <footer class="page-footer">
                    <div class="container">
                        <i class="linearicon linearicon-brain"></i> ${lang.copyRight}
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
