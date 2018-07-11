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


/**
 *
 */
export default class TetrisGame {

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
            successAnimationIterationDuration: 100,

            // user setting values
            playBackgroundSound: true,
            playEventsSound: true,
            level: 1 ,                       // up to 3 - if it is big it is hard to play
            useAnimationFlag : true,         // make animate or not
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
            cachedRows : {},                // cache rows here
            upComingCharEl : null,          // up coming showe element

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

        let config = TetrisGame.config;
        let initValues = TetrisGame.initValues;

        const callBack = (successObject)=>{
            let word = initValues.choosedWords[successObject.wordId].word;


            //Remove word from choosed words
            initValues.choosedWords.splice(successObject.wordId,1);

            //Remove characters from choosed characters
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

            Timeout.request(
                () => {
                    successObject.fallingCharacters.map((item,index) => {
                        console.log(item);
                        Timeout.request(
                            ()=>{
                                Charblock.fallNodeAnimate(item.oldY,item.oldX,item.newY,item.newX)
                            }, index * config.successAnimationIterationDuration
                        );
                    });
                }, successObject.wordCharacterPositions.length * config.successAnimationIterationDuration
            )

        };

        let checkTypes = {ltr:true,rtl:true,ttd:false,dtt:false};
        TetrisGame.matrix.checkWords(initValues.choosedWords,lastChar.row,lastChar.column,checkTypes,callBack);
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
