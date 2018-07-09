/**
 * @class TetrisGame
 */

'use strict';


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




class TetrisGame {

    static init(){

        /**
         * Base config for game
         */
        this.config = {
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

            // user setting values
            playBackgroundSound: true,
            playEventsSound: true,
            level: 1 ,                       // up to 3 - if it is big it is hard to play
            useAnimationFlag : false,        // make animate or not
            showGrids : true                 // show grids flag
        };


        /**
         * We hold game variables here
         */
        this.initValues = {
            paused: false,                  // is game paused
            finished: false,                // is game finished
            wordsFinished: false,           // do we run out of words
            chooseedWordKind: {},           // holds user words kind
            bgSound : null ,                // background sound instance
            isFirstRun: true,               // is this my first run

            validatedColumnsCount: 0,       // Count of columns which are validated
            nextChar: '',                   // Next character
            activeChar: {},                 // Active character [not stopped] Object index
            choosedWords: [],               // Choosed words to work with them
            choosedWordsUsedChars: []       // Chars that used from choosed words
        };


        /**
         *  Global key codes config on window
         */
        window.CONTROL_CODES = {
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39
        };


        /**
         * Game play board
         */
        this.playBoard = null;


        return this;
    }


    /**
     * Get a valid column number [min-max]
     */
    static getValidColumnsNumber() {
        let config = this.config;
        let columnsNumber = config.columnsMin;

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
        columnsNumber = config.columnsMax < columnsNumber ? config.columnsMax : columnsNumber;
        return columnsNumber % 2 === 0 ? columnsNumber : columnsNumber + 1;
    }


    /**
     * Check if could find a success word
     * @param {charBlock} lastChar
     */
    static checkWordSuccess(lastChar) {
        checkSuccess(
            TetrisGame.matrix,
            TetrisGame.initValues.choosedWords,
            lastChar.row,
            lastChar.column
        );
        // @todo: if okay : remove chars from Tetris.choosedWordsUsedChars and word from Tetris.choosedWords
    }




    /**
     * Select editor element with class search emoji
     * @type {HTMLElement | null}
     */
    static build() {

        let initValues = this.initValues;

        // blob for timer
        window.blobTiming = new Blob([
            document.querySelector('#workerTiming').textContent
        ], { type: "text/javascript" });


        // set Timer instance to current TetrisGame.timer
        this.timer = new Timer({
            blobTiming: blobTiming,
            onStart: function () {
                initValues.paused = false;
            },
            workerOnMessage: function (event) {
                Storage.set('seconds', event.data);
            },
            onPause: function () {
                initValues.paused = true;
            },
            onResume: function () {
                initValues.paused = false;
            }
        });


        // set interval class
        this.interval = new Interval();


        // control key codes
        // In LTR languages, Left and Right should be swapped
        this.controlCodes = {
            LEFT:   (!lang.rtl) ? CONTROL_CODES.RIGHT : CONTROL_CODES.LEFT,
            RIGHT:  (!lang.rtl) ? CONTROL_CODES.LEFT : CONTROL_CODES.RIGHT,
            DOWN:   CONTROL_CODES.DOWN
        };

        let ltrClass = (!lang.rtl) ? "isLtr" : "";


        if(initValues.isFirstRun){
            initValues.bgSound = new Sound("background").play();
            initValues.isFirstRun = false;
        }


        // set game settings from local storage
        Settings.set();


        // add main html to page
        document.querySelector("#container").innerHTML =
            `<div class="gameHolder ${ltrClass}">
                    <div class="behindPlayBoard">
                        <div class="gamingKind"><span class="persian">${initValues.chooseedWordKind.persianTitle}</span><span class="english">${initValues.chooseedWordKind.englishTitle}</span></div>
                        <div class="showUpComingLetter" title="${lang.nextLetter}:"></div>
                        <div class="gameControlButtons" >
                            <div onclick="Gameplay.start();" class="startGame">${lang.startGame}</div>
                            <div onclick="Gameplay.pause();" class="pauseGame" style="display: none">${lang.pauseGame}</div>
                            <div onclick="Gameplay.resume();" class="resumeGame" style="display: none">${lang.resumeGame}</div>
                            <div onclick="Gameplay.restart();" class="restartGame" style="display: none">${lang.restartGame}</div>
                        </div>
                       <div class="courseArea">
                           <div class="setting" onclick="Settings.show();"><i class="linearicon linearicon-cog"></i> ${lang.settings}</div>
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
}
