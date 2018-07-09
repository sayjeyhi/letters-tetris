/* jshint browser: true */


const CONTROL_CODES = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

let isFirstRun=true;


/**
 * Delete node with animation
 * @param row
 * @param column
 */
function deleteNode(row , column){

    let deleteTiming = 0;
    let domToDelete = document.querySelector(`.row_${row} .column_${column} .charBlock`);
    let gameConfig = TetrisGame.config;

    if(gameConfig.useAnimationFlag) {
        let animateClass =  "animatedOneSecond";
        deleteTiming = gameConfig.simpleFallDownAnimateSpeed;
        if(gameConfig.level === 3){
            deleteTiming = gameConfig.expertFallDownAnimateSpeed;
            animateClass = "animated";
        }else if(gameConfig.level === 2){
            deleteTiming = gameConfig.mediumFallDownAnimateSpeed;
            animateClass = "animatedHalfSecond";
        }
        domToDelete.classList.add(animateClass , "zoomOutDown");
    }

    setTimeout(
        () => {
            domToDelete.parentNode.removeChild(domToDelete);
        }, deleteTiming
    );

}




//==================[WORD FINDING RELATED FUNCTIONS]=========================


//Row     -> y
//Column  -> x
function getRailingChars(matrix,y,x,direction){
    const width = matrix[0].length;
    const height = matrix.length;

    let railingChars='';
    // let from=-1,to=-1;//from and to determines location from
    let len=0;//Determines how much did we move in each direction to get to space or end of direction

    let i=1;//i is just the iterator in loops
    switch(direction){
        case 'R':
            //Go in Right direction
            //i starts with 1 because we dont want the current character
            //This loop will go to right until it reaches the border OR next character is ' '
            //Rest of cases are just like this method but with differnt direction
            // from=1+x;
            for(i=1;i+x<width && matrix[y][i+x]!==' ';i++){
                railingChars+=matrix[y][i+x];
                // to=i+x;
                len++;
            }
            break;
        case 'L':
            // from=x-1;
            for(i=1;x-i>=0 && matrix[y][x-i]!==' ';i++){
                railingChars=matrix[y][x-i] + railingChars;
                // to=x-i;
                len++;
            }
            break;
        case 'T':
            // from=y-1;
            for(i=1;y-i>=0 && matrix[y-i][x]!==' ';i++){
                railingChars+=matrix[y-i][x];
                // to=y-i;
                len++;
            }
            break;
        case 'D':
            // from=y+1;
            for(i=1;y+i<height && matrix[y+i][x]!==' ';i++){
                railingChars+=matrix[y+i][x];
                // to=y+i;
                len++;
            }
            break;
    }

    return {
        chars:railingChars,
        // to:to,
        // from:from,
        len:len
    }
}






/**
 Reversing strings containing especial unicode characters can cause problems using usual ways to reverse!
 For example this string: 'foo 𝌆 bar mañana mañana' will be corrupt if used string.split("").reverse().join("");
 We'll use following code from mathiasbynens to reverse a string properly
 https://github.com/mathiasbynens/esrever/blob/master/src/esrever.js
 */
function reverse(string) {
    let regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
    let regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;
    // Step 1: deal with combining marks and astral symbols (surrogate pairs)
    string = string
    // Swap symbols with their combining marks so the combining marks go first
        .replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
            // Reverse the combining marks so they will end up in the same order
            // later on (after another round of reversing)
            return reverse($2) + $1;
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

function checkSuccess(matrix,words,rowId,colId,successCallback){

    let rights = getRailingChars(matrix,rowId,colId,'R');
    let lefts = getRailingChars(matrix,rowId,colId,'L');
    let tops = getRailingChars(matrix,rowId,colId,'T');
    let downs = getRailingChars(matrix,rowId,colId,'D');

    // const sentenceLTR = excapeRegex(lefts + matrix[9][2] + rights);
    // const sentenceTTD = excapeRegex(tops  + matrix[9][2] + downs);
    // const sentenceRTL = excapeRegex(reverse(sentenceLTR));
    // const sentenceDDT = excapeRegex(reverse(sentenceTTD));
    const sentenceLTR = (lefts.chars + matrix[rowId][colId] + rights.chars);
    const sentenceTTD = (tops.chars  + matrix[rowId][colId] + downs.chars);
    const sentenceRTL = (reverse(sentenceLTR));
    const sentenceDTT = (reverse(sentenceTTD));
    // console.log(sentenceLTR);
    console.log(sentenceRTL);
    //
    // const regexLTR = new RegExp(sentenceLTR,'i');
    // const regexTTD = new RegExp(sentenceTTD,'i');
    // const regexRTL = new RegExp(sentenceRTL,'i');
    // const regexDDT = new RegExp(sentenceDDT,'i');

    let checkType={rtl:true,ltr:true,ttd:false,dtt:false};

    for(let i=0, len=words.length; i < len; i++){
        let pos,
            word = words[i].word
        ;
        if(checkType.ltr && (pos=sentenceLTR.indexOf(word)) !== -1){
            console.log("LTR: Found valid word:"+ word +" In:" + sentenceLTR);
            let startFrom = colId-lefts.len+pos;
            deleteCharacters(matrix,rowId,colId,'ltr',startFrom,word.length);
            Sound.playByKey('foundWord',TetrisGame.config.playEventsSound);
            //TODO: Increase Score
            //TODO: Remove Chars from TetrisGame.initValues.choosedWordsUsedChars
            //TODO: Remove Words from TetrisGame.initValues.choosedWords
        }else if(checkType.rtl && (pos=sentenceRTL.indexOf(word)) !== -1){
            console.log("RTL: Found valid word:"+ word +" In:" + sentenceRTL);

            let startFrom = colId+rights.len-pos;
            deleteCharacters(matrix,rowId,colId,'rtl',startFrom,word.length);
            Sound.playByKey('foundWord',TetrisGame.config.playEventsSound);

        }else if (checkType.rtl && sentenceRTL.indexOf(word) !== -1){
            console.log("Found valid word:"+ word +" In:" + sentenceRTL)
        }else if (checkType.dtt && sentenceDTT.indexOf(word) !== -1){
            console.log("Found valid word:"+ word +" In:" + sentenceDTT)
        }
    }
}



function deleteCharacters(matrix,rowId,colId,checkType,occurancePositionFrom,occurancePositionLenght){


    if(checkType==='ltr'){
        //Clear characters in matrix
        for(let c=0,i = occurancePositionFrom;i<occurancePositionFrom+occurancePositionLenght;i++,c++){
            matrix[rowId][i]=' ';

            setTimeout(()=>{deleteNode(rowId , i)},c*200);


            //Move upper blocks to bottom
            for(let upIndex=rowId;matrix[upIndex-1][i] !== ' ' && upIndex>=0;upIndex--){
                matrix[upIndex][i] = matrix[upIndex-1][i];
                matrix[upIndex-1][i] = ' ';
                //TODO: Apply falling animations for moving chars from [upIndex-1][i] to [upIndex][i]
            }
        }
    }else if (checkType==='rtl'){
        //Clear characters in matrix
        for(let c=0,i=occurancePositionFrom;i>occurancePositionFrom-occurancePositionLenght;--i,++c){
            matrix[rowId][i]=' ';

            setTimeout(()=>{deleteNode(rowId , i)},c*200);
            // deleteNode(rowId , i,c*200);

            //Move upper blocks to bottom
            for(let upIndex=rowId;matrix[upIndex-1][i] !== ' ' && upIndex>=0;upIndex--){
                matrix[upIndex][i] = matrix[upIndex-1][i];
                matrix[upIndex-1][i] = ' ';
                //TODO: Apply falling animations for moving chars from [upIndex-1][i] to [upIndex][i]
            }
        }
    }else if (checkType==='ttd'){
        //TODO
    }else if (checkType==='dtt'){
        //TODO
    }
}

//==================[END OF WORD FINDING RELATED FUNCTIONS]=====================













(function () {

    'use strict';

    let TetrisGame,blobTiming;

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
     */
    TetrisGame = {

        /**
         * Current version
         */
        version: '0.1.11',


        /**
         * Base config for game
         */
        config: {
            rows: 11,
            columnsMin: 6,
            columnsMax: 16,
            workingWordCount: 1,
            charSpeed: 1000,                 // 1 second - get division to level when making game harder
            checkInRow: true,
            checkInColumn: false,
            useLowercase: false,
            simpleFallDownAnimateSpeed : 700,
            mediumFallDownAnimateSpeed : 500,
            expertFallDownAnimateSpeed : 200,
            showGrids : true,

            // user setting values
            playBackgroundSound: true,
            playEventsSound: true,
            level: 1 ,                       // up to 3 - if it is big it is hard to play
            useAnimationFlag : false         // make animate or not
        },


        /**
         * Initialize variables
         */
        initValues: {
            paused: false,                  // is game paused
            finished: false,                // is game finished
            wordsFinished: false,           // do we run out of words
            chooseedWordKind: {},           // holds user words kind
            bgSound : null ,                // background sound instance


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
         * Game play board
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

                let moveTo = {},isBottomMove = false;


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

                        TetrisGame.matrix[moveTo.row-1][moveTo.column] = charBlock.name;
                        console.log(TetrisGame.matrix);

                        // stop interval and request new char
                        TetrisGame.interval.clear(charBlock.interval);

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

                // play move char
                Sound.playByKey('moveChar' , TetrisGame.config.playEventsSound);

            };


            // interval
            charBlock.interval = TetrisGame.interval.make(
                () => {
                    if (!TetrisGame.initValues.paused) {
                        charBlock.move(40);
                    }
                },
                TetrisGame.config.charSpeed / TetrisGame.config.level
            );


            // destroy current character
            charBlock.destroy = function (workingElement, outgoingAnimation) {
                let animateClass = TetrisGame.config.useAnimationFlag ? " animated " : "";
                workingElement.className += animateClass + outgoingAnimation;
                setTimeout(
                    () => {
                        // remove current char
                        workingElement.parentNode.removeChild(workingElement);
                    },
                    (TetrisGame.config.useAnimationFlag ? 200/TetrisGame.config.level : 0)
                );
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
            let animateClass = TetrisGame.config.useAnimationFlag ? " animated bounceIn" : "";

            upCommingCharHolder.innerHTML = '';
            upcommingCharEl.className = animateClass;
            upcommingCharEl.innerHTML = TetrisGame.initValues.nextChar || "";
            upCommingCharHolder.appendChild(upcommingCharEl);
        },


        /**
         * Choose random words in game build to work with
         */
        chooseWord: function () {
            let keys = Object.keys(window.TetrisWords);
            let randomKey = keys[keys.length * Math.random() << 0];
            let value = window.TetrisWords[randomKey] || "";


            // do we finished words ?
            if (value === "" && !TetrisGame.initValues.finished) {
                TetrisGame.initValues.wordsFinished = true;
                return false;
            }


            value.word = value.word.replace(/[^a-zA-Zآ-ی]/g, "");

            // use lower case of characters
            if(TetrisGame.config.useLowercase){
                value.word = value.word.toLowerCase();
            }

            log(value);

            // delete choosed word form list
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

            // plus 2 extra block than max word length
            columnsNumber += 2;
            columnsNumber = TetrisGame.config.columnsMax < columnsNumber ? TetrisGame.config.columnsMax : columnsNumber;
            return columnsNumber % 2 === 0 ? columnsNumber : columnsNumber + 1;
        },


        /**
         * Check if could find a success word
         * @param {charBlock} lastChar
         */
        checkWordSuccess: function (lastChar) {
            checkSuccess(TetrisGame.matrix,TetrisGame.initValues.choosedWords,lastChar.row,lastChar.column);
            // @todo: if okay : remove chars from Tetris.choosedWordsUsedChars and word from Tetris.choosedWords
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
            let animateClass = TetrisGame.config.useAnimationFlag ? " animated " : "";

            charBlock.style.background = char.color;
            charBlock.innerHTML = char.name;
            charBlock.className = "charBlock " + animateClass + (char.animateInClass || "");

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
            });
            gameBtnControl.querySelectorAll(hideClasses).forEach((item) => {
                item.style.display = "none";
            });
        },


        /**
         * Set settings from localStorage OR settings Object
         * @param settings
         */
        setSettings: function (settings) {


            if(typeof settings !== "undefined"){

                // save setting data
                Storage.set("settings" , settings);

            }else{
                settings = Storage.getJson('settings' , false);
                if(!settings){
                    return false;
                }
            }


            TetrisGame.config.useAnimationFlag = parseInt(settings.useAnimation) === 1;
            TetrisGame.config.playEventsSound = parseInt(settings.eventSounds) === 1;
            TetrisGame.config.playBackgroundSound = parseInt(settings.soundPlay) === 1;
            TetrisGame.config.showGrids = parseInt(settings.showGrids) === 1;
            TetrisGame.config.level = parseInt(settings.gameLevel) || 1;



            // pause/play background music
            if(!TetrisGame.config.playBackgroundSound){
                TetrisGame.initValues.bgSound.pause();
            }else{
                TetrisGame.initValues.bgSound.play();
            }


            // manage grids on play board
            log(TetrisGame.playBoard);
            if(TetrisGame.playBoard) {
                if (TetrisGame.config.showGrids) {
                    TetrisGame.playBoard.classList.add("showGrids");
                } else {
                    TetrisGame.playBoard.classList.remove("showGrids");
                }
            }

            // add level class to body AND do staffs about leveling
            let bodyClass = "";
            switch(settings.gameLevel){
                case 3:
                    bodyClass = "isExpert";

                    // use two word  same time at hard mode
                    TetrisGame.config.workingWordCount = 2;

                    break;
                case 2:
                    bodyClass = "isMedium";
                    break;
                default:
                    bodyClass = "isSimple";
            }
            document.body.classList.remove("isExpert" , "isMedium" , "isSimple");
            document.body.classList.add(bodyClass);
        },


        /**
         * Show game settings
         */
        showSetting: function () {

            // get defined settings
            let settings = Storage.getJson('settings' , {
                soundPlay : 1,
                eventSounds : 1,
                useAnimation : 1,
                gameLevel : 1,
                showGrids : 0
            });

            // pause game timer
            TetrisGame.timer.pause();

            // should we animate span ?
            let spanAnimationClass = (TetrisGame.config.useAnimationFlag ? " animatedSpan" : "");


            // create setting modal content
            let content =
                '<form id="settingForm" class="cssRadio ' + spanAnimationClass + '">' +
                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-music-note2"></i> ' + lang.backgroundMusic + '</div>' +
                        '<div class="formData">' +
                            '<input id="soundPlayYes" type="radio" name="soundPlay" value="1" ' + (settings.soundPlay === 1 ? "checked" : "") + ' />' +
                            '<label for="soundPlayYes"><span>' + lang.active + '</span></label>' +
                            '<input id="soundPlayNo" type="radio" name="soundPlay" value="0" ' + (settings.soundPlay === 0 ? "checked" : "") + ' />' +
                            '<label for="soundPlayNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-music-note"></i> ' + lang.eventsMusic + '</div>' +
                        '<div class="formData">' +
                            '<input id="eventSoundsYes" type="radio" name="eventSounds" value="1" ' + (settings.eventSounds === 1 ? "checked" : "") + ' />' +
                            '<label for="eventSoundsYes"><span>' + lang.active + '</span></label>' +
                            '<input id="eventSoundsNo" type="radio" name="eventSounds" value="0" ' + (settings.eventSounds === 0 ? "checked" : "") + ' />' +
                            '<label for="eventSoundsNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +


                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-magic-wand"></i> ' + lang.animation + '</div>' +
                        '<div class="formData">' +
                            '<input id="useAnimationYes" type="radio" name="useAnimation" value="1" ' + (settings.useAnimation === 1 ? "checked" : "") + ' />' +
                            '<label for="useAnimationYes"><span>' + lang.active + '</span></label>' +
                            '<input id="useAnimationNo" type="radio" name="useAnimation" value="0" ' + (settings.useAnimation === 0 ? "checked" : "") + ' />' +
                            '<label for="useAnimationNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-grid"></i> ' + lang.showGrids + '</div>' +
                        '<div class="formData">' +
                            '<input id="showGridsYes" type="radio" name="showGrids" value="1" ' + (settings.showGrids === 1 ? "checked" : "") + ' />' +
                            '<label for="showGridsYes"><span>' + lang.active + '</span></label>' +
                            '<input id="showGridsNo" type="radio" name="showGrids" value="0" ' + (settings.showGrids === 0 ? "checked" : "") + ' />' +
                            '<label for="showGridsNo"><span>' + lang.deActive + '</span></label>' +
                        '</div>' +
                    '</div>' +


                    '<div class="formRow">' +
                        '<div class="formLabel"><i class="linearicon linearicon-game"></i> ' + lang.gameLevel + '</div>' +
                        '<div class="formData">' +
                            '<input id="gameLevelEasy" type="radio" name="gameLevel" value="1" ' + (settings.gameLevel === 1 ? "checked" : "") + ' />' +
                            '<label for="gameLevelEasy"><span>'+ lang.simple + '</span></label>' +
                            '<input id="gameLevelMedium" type="radio" name="gameLevel" value="2" ' + (settings.gameLevel === 2 ? "checked" : "") + ' />' +
                            '<label for="gameLevelMedium"><span>'+ lang.medium + '</span></label>' +
                            '<input id="gameLevelExpert" type="radio" name="gameLevel" value="3" ' + (settings.gameLevel === 3 ? "checked" : "") + ' />' +
                            '<label for="gameLevelExpert"><span>' + lang.expert + '</span></label>' +
                        '</div>' +
                    '</div>' +

                '</form>';

            // show setting modal
            let settingModal = new Modal({
                animate : TetrisGame.config.useAnimationFlag,
                header : lang.settingModalTitle,
                content : content,
                onDestroy : function () {
                    // resume timer
                    TetrisGame.timer.resume();
                },
                buttons : [
                    {
                        text : lang.save,
                        isOk : true,
                        onclick : function () {

                            // start timer
                            TetrisGame.timer.resume();

                            // catch data
                            let settingForm = document.querySelector("#settingForm");
                            let settingData = {};
                            settingData.soundPlay = parseInt(settingForm.querySelector('[name="soundPlay"]:checked').value);
                            settingData.eventSounds = parseInt(settingForm.querySelector('[name="eventSounds"]:checked').value);
                            settingData.useAnimation = parseInt(settingForm.querySelector('[name="useAnimation"]:checked').value);
                            settingData.gameLevel = parseInt(settingForm.querySelector('[name="gameLevel"]:checked').value);
                            settingData.showGrids = parseInt(settingForm.querySelector('[name="showGrids"]:checked').value);

                            // apply setting and save it
                            TetrisGame.setSettings(settingData);

                            // remove modal
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
         * Start Game play
         */
        startGamePlay: function () {

            TetrisGame.playBoard = document.querySelector(".playBoard");

            // Get valid column length based on max json word length to create columns
            TetrisGame.initValues.validatedColumnsCount = TetrisGame.getValidColumnsNumber();

            // add class to have playBoard columns
            TetrisGame.playBoard.classList.add('is' + TetrisGame.initValues.validatedColumnsCount + 'Column');


            // show game play board girds
            if(TetrisGame.config.showGrids){
                TetrisGame.playBoard.classList.add("showGrids");
            }


            // create game columns and rows - matrix
            let playBoardTable = '';
            let matrixRowArray = [];
            for (let r = 0; r < TetrisGame.config.rows; r++) {
                let matrixColumn = [];
                playBoardTable += '<div class="isRow row_' + r + '">';
                for (let c = 0; c < TetrisGame.initValues.validatedColumnsCount; c++) {
                    playBoardTable += '<div class="isColumn column_' + c + '" data-row="' + r + '"></div>';
                    matrixColumn[c]=' ';
                }
                matrixRowArray[r] = matrixColumn;
                playBoardTable += '</div>';
            }

            TetrisGame.matrix = matrixRowArray;

            TetrisGame.playBoard.innerHTML = playBoardTable;


            // Choose n words from json to create rows and columns
            for (let i = 0; i < TetrisGame.config.workingWordCount; i++) {
                let choosedWord = TetrisGame.chooseWord();
                if(!choosedWord){
                    TetrisGame.finishGame("finishWords");
                }else {
                    TetrisGame.initValues.choosedWords.push(choosedWord);
                }
            }


            // start game timer
            TetrisGame.timer.start();


            // create first char block
            TetrisGame.characterFactory();


            // play start sound
            Sound.playByKey('start', TetrisGame.config.playEventsSound);

            // arrow keys press
            document.onkeydown = function (e) {
                if(!TetrisGame.initValues.paused) {
                    TetrisGame.initValues.activeChar.move(e.keyCode);
                }
            };

            TetrisGame.buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');
        },


        /**
         * Pause Game play
         */
        pauseGamePlay: function () {

            // playByKey resume sound
            Sound.playByKey('pause', TetrisGame.config.playEventsSound);

            // manage game buttons
            TetrisGame.buttonManager('.resumeGame,.restartGame', '.startGame,.pauseGame');

            // stop timer [will stop whole game]
            TetrisGame.timer.pause();
        },


        /**
         * Resume Game play
         */
        resumeGamePlay: function () {

            // playByKey resume sound
            Sound.playByKey('pause', TetrisGame.config.playEventsSound);

            // manage game buttons
            TetrisGame.buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');

            // resume timer [will resume whole game]
            TetrisGame.timer.resume();
        },


        /**
         * Reset Game play
         */
        restartGamePlay: function () {

            // kill all intervals
            TetrisGame.interval.clearAll();

            // make game variables that variables was on start
            TetrisGame.initValues = {
                paused: false,                 // is game paused
                finished: false,                // is game finished
                wordsFinished: false,           // do we run out of words
                chooseedWordKind: {
                    persianTitle: TetrisGame.initValues.chooseedWordKind.persianTitle,
                    englishTitle: TetrisGame.initValues.chooseedWordKind.englishTitle
                },
                bgSound : TetrisGame.initValues.bgSound ,


                validatedColumnsCount: 0,       // Count of columns which are validated
                nextChar: '',                   // Next character
                activeChar: {},                // Active character [not stopped] Object index
                choosedWords: [],               // Choosed words to work with them
                choosedWordsUsedChars: []      // Chars that used from choosed words
            };

            // play resume sound
            Sound.playByKey('pause' , TetrisGame.config.playEventsSound);

            //Remove old listener of keydown which causes multiple moves
            document.onkeydown =null;

            // re-build game
            TetrisGame.build();
        },


        /**
         * Game is finished [gameOver OR finishWords]
         * @param mode
         */
        finishGame: function (mode) {


            // play finish sound
            Sound.playByKey('finishGame', TetrisGame.config.playEventsSound);


            // manage game buttons
            TetrisGame.buttonManager('.restartGame', '.startGame,.pauseGame,.resumeGame');

            TetrisGame.initValues.finished = true;
            TetrisGame.timer.pause();

            let modalHeader = "", modalContent = "";
            let modalButtons = [];
            if (mode === "gameOver") {
                modalHeader = lang.gameOverModalTitle;
                modalContent = lang.gameOverModalContent;

                modalButtons.push({
                        text : lang.restartGame,
                        isOk : true,
                        onclick : function () {
                            modal.destroy();
                            TetrisGame.restartGamePlay();
                        }
                    },{
                        text : lang.modalOkButton,
                        onclick : function () {
                            modal.destroy();
                        }
                    }
                );
            } else {
                modalHeader = lang.noExtraWordModalTitle;
                modalContent = lang.noExtraWordModalContent;
                modalButtons.push({
                        text : lang.modalRefreshButton,
                        onclick : function () {
                            window.location.reload();
                        }
                    }
                );
            }

            let modal = new Modal({
                animate : TetrisGame.config.useAnimationFlag,
                header : modalHeader,
                content : modalContent,
                buttons : modalButtons
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


            TetrisGame.interval = new Interval();



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
                TetrisGame.initValues.bgSound = new Sound("background").play();
                isFirstRun = false;
            }

            // set game settings from local storage
            TetrisGame.setSettings();


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
