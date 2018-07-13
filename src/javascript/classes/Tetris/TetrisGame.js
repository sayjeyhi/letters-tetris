/**
 * @module
 */

'use strict';

import Timer from "../Timer";
import Interval from "../Interval";
import Sound from "../Sound";
import Settings from "./Settings";
import Storage from "../Storage";
import Charblock from "./Charblock";
import Timeout from "../Timeout";
import Helper from "../Helper";


/**
 * @typedef {Object} TetrisGameConfig
 *
 * @property rows=11 {Number} - Rows of the game
 * @property columnsMin=6 {Number} - Columns of the game
 * @property columnsMax=16 {Number} - Max size of columns of the game
 * @property workingWordCount=1 {Number} - Count of words to work with
 * @property charSpeed=1000 {Number} Miniseconds to wait to fall new character
 * @property directionWordChecks="ltr:true,rtl:true,ttd:false,dtt:false" {module:Matrix~CheckTypes}  Directions to search for words
 * @property useLowercase=false {Boolean} Force use lowercase when selecting words
 * @property simpleFallDownAnimateSpeed=700 {Number} Duration of animation when characters are falling down in simple mode
 * @property mediumFallDownAnimateSpeed=500 {Number} Duration of animation when characters are falling down in medium mode
 * @property expertFallDownAnimateSpeed=200 {Number} Duration of animation when characters are falling down in expert mode
 * @property successAnimationIterationDuration=100 {Number} Duration between animation of exploding chars when characters found
 * @property playBackgroundSound=true {Boolean} Option to disable music in background
 * @property playEventsSound=true {Boolean} Option to disable sound of events
 * @property level=1 {Number} - Up to 3 if it is big it is hard to play
 * @property useAnimationFlag=true {Boolean} - Make animate or not :|
 * @property showGrids=true {Boolean} - show grids flag
 * @property do_encryption=true {Boolean} - Enables encryption when saving score
 * @property encryptionKeySize=16 {Number} - Size of key used in encryption
 * @property scoreCalculator=(word)=>{Math.pow(1.3,word.length)} - Function to calculate score based on word. Larger words will have better score using Math.pow(1.3,word.length)
 */



/**
 *
 */
export default class TetrisGame {

    /**
     *
     * @returns {TetrisGame}
     */
    static init(config){

        /**
         * Base config for game
         */
        this.config = {
            rows: 11,
            columnsMin: 6,
            columnsMax: 16,
            workingWordCount: 1,
            charSpeed: 1000,               // 1 second - get division to level when making game harder
            useLowercase: false,
            simpleFallDownAnimateSpeed : 700,
            mediumFallDownAnimateSpeed : 500,
            expertFallDownAnimateSpeed : 200,
            successAnimationIterationDuration: 100,
            do_encryption: true,            // Enables encryption when saving score
            encryptionKeySize: 16,          // Size of key Used in encryption
            directionWordChecks: {
                ltr:true,                   // check left to right
                rtl:true,                   // check right to left
                ttd:true,                   // check top top down
                dtt:false                   // check down to top
            },
            scoreCalculator: (word) => {
                return Math.pow(1.3, word.length);      // Larger words will have better score
            },
            chooseedWordKind: {},


            // user setting values
            playBackgroundSound: true,
            playEventsSound: true,
            level: 1 ,                      // Up to 3 - if it is big it is hard to play
            useAnimationFlag : true,        // Make animate or not
            showGrids : true                // Show grids flag
        };

        //Extend config from user
        Object.assign(this.config,config);


        /**
         * We hold game values here
         */
        this.setDefaultValues(true);


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
     * Sets default values of this.initValues
     * @param firstCall
     */
    static setDefaultValues(firstCall){
        this.initValues = {
            paused: false,                                      // is game paused
            finished: false,                                    // is game finished
            wordsFinished: false,                               // do we run out of words
            isFirstRun: firstCall,                              // it is not first run
            bgSound: (firstCall ? {} : this.initValues.bgSound),          // is this my first run
            cachedRows: (firstCall ? {} : this.initValues.cachedRows) ,   // cache rows here
            upComingCharEl: null,
            score : 0 ,                                         // This is fake, We will never show anything related to this to user
            encryptionKey: [],                                  // key of variables encryption
            validatedColumnsCount: 0,                           // Count of columns which are validated
            nextChar: '',                                       // Next character
            activeChar: {},                                     // Active character [not stopped] charBlock object
            choosedWords: [],                                   // Choosed words to work with them
            choosedWordsUsedChars: [],                          // Chars that used from choosed words
            wordsLengthTotal: 0,                                // Average length of words founded in games
            wordsFounded: 0,                                    // Counter to hold count of words found in game
            wordDirectionCounter: {                             // Counter of founded word in each direction
                rtl: 0,
                ltr: 0,
                ttd: 0,
                dtp: 0
            },
            isMobile : (typeof window.orientation !== 'undefined')
        }
    }


    /**
     * Check if could find a success word
     * @param {Charblock} lastChar
     */
    static checkWordSuccess(lastChar) {
        let config = TetrisGame.config;
        let initValues = TetrisGame.initValues;

        const callBack = (successObject)=> {

            if(!successObject) {
                //no words has been found, resume the game
                TetrisGame.initValues.paused=false;
                return;
            }


            let word = initValues.choosedWords[successObject.wordId].word;

            // Remove word from choosed words
            initValues.choosedWords.splice(successObject.wordId, 1);

            // animate found word
            TetrisGame.showFoundWordAnimated(word , successObject);




            // Update score
            this._updateScore(successObject , word);

            // Remove characters from choosed characters
            word.split("").map((char)=>{
                let index = initValues.choosedWordsUsedChars.indexOf(char);
                if(index!==-1){
                    initValues.choosedWordsUsedChars.splice(index, 1);
                }
            });

            Sound.playByKey('foundWord',config.playEventsSound);

            //Animate FadingOut founded characters
            successObject.wordCharacterPositions.map((item,index) => {
                Timeout.request(
                    () => {
                        Charblock.fallNodeAnimate(item.y, item.x, null, null)
                    }, index * config.successAnimationIterationDuration
                );
            });

            TetrisGame.initValues.paused = false;

            Timeout.request(
                () => {
                    successObject.fallingCharacters.map((item,index) => {
                        Timeout.request(
                            () => {
                                Charblock.fallNodeAnimate(item.oldY, item.oldX, item.newY, item.newX)
                            }, index * config.successAnimationIterationDuration
                        );
                    });

                    Timeout.request(
                        () => {
                            //Resume game after all animations has been finished
                            TetrisGame.initValues.paused = false;
                        }, successObject.fallingCharacters.length * config.successAnimationIterationDuration
                    );

                }, successObject.wordCharacterPositions.length * config.successAnimationIterationDuration
            )
        };
        TetrisGame.initValues.paused = true;


        TetrisGame.matrix.checkWords(
            initValues.choosedWords,
            lastChar,
            this.config.directionWordChecks,
            callBack
        );
    }


    /**
     * Shows found word with animation
     * @param word
     * @param successObject
     */
    static showFoundWordAnimated(word , successObject){

        let wordFound = successObject.wordCharacterPositions,
            charLength = wordFound.length - 1,
            rowAverage = (wordFound[0].y + wordFound[charLength].y) / 2,
            columnAverage = (wordFound[0].x + wordFound[charLength].x) / 2,
            hidedWord = Charblock.getBlockPosition(parseInt(rowAverage), parseInt(columnAverage)),
            foundWordDisplayEl = Helper._(".foundWordAnimation" , TetrisGame.playBoard),
            plusFixerDistance = (charLength % 2 === 1) ? 0 : - (hidedWord.width/4);

        foundWordDisplayEl.innerHTML = word;
        foundWordDisplayEl.style.display = "block";
        foundWordDisplayEl.style.left = (hidedWord.left - plusFixerDistance) + "px";
        foundWordDisplayEl.style.top = (hidedWord.top - 10) + "px";

        if(this.config.useAnimationFlag) {
            foundWordDisplayEl.classList.add("animatedOneSecond", "jackInTheBox");
        }else{
            foundWordDisplayEl.classList.remove("animatedOneSecond", "jackInTheBox");
        }

        Timeout.request(
            () => {
                foundWordDisplayEl.style.display = "none";
            }, 1200
        );
    }



    /**
     * Get score of user from Storage
     * @returns {number}
     */
    static _getScore() {
        let score;
        if (this.config.do_encryption){
            score = Storage.getEncrypted("score", this.initValues.encryptionKey);
        }else{
            score = Storage.getInt("score",0);
        }
        return score;
    }

    /**
     * Update score and set it to panel
     * @param successObject
     * @param word
     * @private
     */
    static _updateScore(successObject, word) {

        //Update stats related to word
        this.initValues.wordsFounded++;
        this.initValues.wordDirectionCounter[successObject.direction]++;
        this.initValues.wordsLengthTotal += word.length;

        //Get encrypted value of Score wtih our random generated key
        let score = TetrisGame._getScore();

        //Increase value by scoreCalculator from config
        score += this.config.scoreCalculator(word);

        //Update our fake score variable to let hacker think they are dealing with real variable
        this.initValues.score = score;

        //Update & encrypt score in Storage
        if (this.config.do_encryption) {
            Storage.setEncrypted("score", score, this.initValues.encryptionKey);
        }else{
            Storage.set("score", score);
        }

        Helper._(".scoreHolder").innerHTML = Math.round(score);
    }



    /**
     * Select editor element with class search emoji
     * @type {HTMLElement | null}
     */
    static build() {

        let initValues = this.initValues;
        let config = this.config;

        if(config.do_encryption){
            const encryptionKeySize = config.encryptionKeySize;
            for(let i=0;i<encryptionKeySize;++i)
                initValues.encryptionKey.push(1+Math.floor(Math.random()*253));
            Storage.setEncrypted("score", 0, initValues.encryptionKey);
        }else{
            Storage.set("score", "0");
        }


        // blob for timer
        window.blobTiming = new Blob([
            Helper._('#workerTiming').textContent
        ], { type: "text/javascript" });


        // set Timer instance to current TetrisGame.timer
        this.timer = new Timer({
            blobTiming: blobTiming,
            onStart: function () {
                initValues.paused = false;
            },
            workerOnMessage: function (event) {
                // Storage.set('seconds', event.data);
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
            initValues.bgSound = Sound.playByKey("background" , true);
            initValues.isFirstRun = false;
        }


        // set game settings from local storage
        Settings.set();


        // add main html to page
        let gameHtmlContent =
            `<div class="gameHolder ${ltrClass}">
                <div class="behindPlayBoard">
                    <div class="gamingKind"><span class="persian">${config.chooseedWordKind.persianTitle}</span><span class="english">${config.chooseedWordKind.englishTitle}</span></div>
                    <div class="showUpComingLetter" title="${lang.nextLetter}:"></div>
                    <div class="gameControlButtons" >
                        <div onclick="Gameplay.start();" class="startGame">${lang.startGame}</div>
                        <div onclick="Gameplay.pause();" class="pauseGame" style="display: none">${lang.pauseGame}</div>
                        <div onclick="Gameplay.resume();" class="resumeGame" style="display: none">${lang.resumeGame}</div>
                        <div onclick="Gameplay.restart();" class="restartGame" style="display: none">${lang.restartGame}</div>
                    </div>
                   <div class="courseArea">
                       <div class="setting" onclick="Settings.show();"><i class="linearicon linearicon-cog"></i> ${lang.settings}</div>
                       <div ><i class="linearicon linearicon-bag-pound"></i> ${lang.score} : <span class="scoreHolder"> 0 </span> </div>
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


        Helper._("#container").innerHTML = gameHtmlContent;
    }

}
