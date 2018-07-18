/**
 * @module
 */

import Timer from '../Timer';
import Interval from '../Interval';
import Sound from '../Sound';
import Settings from './Settings';
import Storage from '../Storage';
import Charblock from './Charblock';
import Timeout from '../Timeout';
import Helper from '../Helper';
import MapStack from '../MapStack';
import ScoreHandler from './ScoreHandler';

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
 * @property vibrationDuration=200 {Number} - Duration of vibration when bomb is exploded
 * @property successAnimationIterationDuration=100 {Number} Duration between animation of exploding chars when characters found
 * @property playBackgroundSound=true {Boolean} Option to disable music in background
 * @property playEventsSound=true {Boolean} Option to disable sound of events
 * @property level=1 {Number} - Up to 3 if it is big it is hard to play
 * @property useAnimationFlag=true {Boolean} - Make animate or not :|
 * @property showGrids=true {Boolean} - show grids flag
 * @property do_encryption=true {Boolean} - Enables encryption when saving score
 * @property do_vibrate=true {Boolean} - Enables vibrating phone when bomb explodes
 * @property do_shake=true {Boolean} - Enables vibrating the page when bomb explodes
 * @property encryptionKeySize=16 {Number} - Size of key used in encryption
 * @property scoreCalculator=(word)=>{Math.pow(1.3,word.length)} - Function to calculate score based on word. Larger words will have better score using Math.pow(1.3,word.length)
 */


/**
 * Main class of
 */
export default class TetrisGame {
    /**
     *
     * @returns {TetrisGame}
     */
    static init(config) {
        /**
         * Base config for game
         */
        this.config = {
            rows: 10,
            mobileRows: 8,
            columnsMin: 6,
            columnsMax: 16,
            workingWordCount: 1,
            charSpeed: 800, // 1 second - get division to level when making game harder
            useLowercase: false,
            simpleFallDownAnimateSpeed: 700,
            mediumFallDownAnimateSpeed: 500,
            expertFallDownAnimateSpeed: 200,
            successAnimationIterationDuration: 100,
            vibrationDuration: 200,
            do_vibrate: true,
            do_shake: true,
            do_encryption: true, // Enables encryption when saving score
            encryptionKeySize: 16, // Size of key Used in encryption
            directionWordChecks: {
                ltr: true, // check left to right
                rtl: true, // check right to left
                ttd: true, // check top top down
                dtt: false // check down to top
            },
            scoreCalculator: word => {
                return Math.pow(word.length, 1.3); // Larger words will have better score
            },
            chooseedWordKind: {},


            // user setting values
            playBackgroundSound: true,
            playEventsSound: true,
            level: 1, // Up to 3 - if it is big it is hard to play
            useAnimationFlag: true, // Make animate or not
            showGrids: true // Show grids flag
        };

        // Extend config from user
        Object.assign(this.config, config);


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
     * Select editor element with class search emoji
     * @type {HTMLElement | null}
     */
    static build() {
        const initValues = this.initValues;
        const config = this.config;

        if (config.do_encryption) {
            const encryptionKeySize = config.encryptionKeySize;
            for (let i=0; i<encryptionKeySize; ++i) initValues.encryptionKey.push(1+Math.floor(Math.random()*253));
            Storage.setEncrypted('score', 0, initValues.encryptionKey);
        } else {
            Storage.set('score', '0');
        }


        // blob for timer
        const blobTiming = new Blob([
            Helper._('#workerTiming').textContent
        ], { type: 'text/javascript' });


        // set Timer instance to current TetrisGame.timer
        this.timer = new Timer({
            blobTiming,
            onStart() {
                initValues.paused = false;
            },
            workerOnMessage() {
                // Storage.set('seconds', event.data);
            },
            onPause() {
                initValues.paused = true;
            },
            onResume() {
                initValues.paused = false;
            }
        });


        // set interval class
        this.interval = new Interval();


        // control key codes
        // In LTR languages, Left and Right should be swapped
        this.controlCodes = {
            LEFT: (!window.lang.rtl) ? window.CONTROL_CODES.RIGHT : window.CONTROL_CODES.LEFT,
            RIGHT: (!window.lang.rtl) ? window.CONTROL_CODES.LEFT : window.CONTROL_CODES.RIGHT,
            DOWN: window.CONTROL_CODES.DOWN
        };

        const ltrClass = (!window.lang.rtl) ? 'isLtr' : '';


        if (initValues.isFirstRun) {
            initValues.bgSound = Sound.playByKey('background', true);
            initValues.isFirstRun = false;
        }


        // set game settings from local storage
        Settings.set();


        // add main html to page
        Helper._('#container').innerHTML = `
            <div class="gameHolder ${ltrClass}">
                <div class="behindPlayBoard">
                    <div class="gamingKind" onclick="Gameplay.restart();ArshLoader.build();"><span class="persian">${config.chooseedWordKind.persianTitle}</span><span class="english">${config.chooseedWordKind.englishTitle}</span><span class="japanese">${config.chooseedWordKind.japaneseTitle}</span></div>
                    <div class="showUpComingLetter" title="${window.lang.nextLetter}:"></div>
                    <div class="gameControlButtons" >
                        <div onclick="Gameplay.start();" class="startGame">${window.lang.startGame}</div>
                        <div onclick="Gameplay.pause();" class="pauseGame" style="display: none">${window.lang.pauseGame}</div>
                        <div onclick="Gameplay.resume();" class="resumeGame" style="display: none">${window.lang.resumeGame}</div>
                        <div onclick="Gameplay.restart();" class="restartGame" style="display: none">${window.lang.restartGame}</div>
                    </div>
                   <div class="courseArea">
                       <div class="setting" onclick="Settings.show();"><i class="linearicon linearicon-cog"></i> ${window.lang.settings}</div>
                       <div ><i class="linearicon linearicon-bag-pound"></i> ${window.lang.score} : <span class="scoreHolder"> 0 </span> &nbsp;|&nbsp; <span class="showScoresList" onclick="ScoreHandler.showScores();" ><i class="linearicon linearicon-shovel"></i> ${window.lang.records}</span> </div>
                       <div ><i class="linearicon linearicon-mustache-glasses"></i> ${window.lang.createdWords} : <span class="wordCounterHolder">0</span> </div>
                       <div ><i class="linearicon linearicon-clock"></i> ${window.lang.spentTime} : <span class="timerDisplay">0</span></div>
                   </div>
               </div>
               <div class="playBoard"><span class="emptyPlayBoard">${window.lang.clickStartGame}</span></div>
            </div>
            
            <!--Lazy load bomb Gif-->
            <img src="assets/img/bomb.gif" alt="bombChar" width="0" />
            
            <footer class="page-footer">
                <div class="container">
                    <i class="linearicon linearicon-brain"></i> ${window.lang.copyRight}
                </div>
            </footer>
        `;
    }


    /**
     * Sets default values of this.initValues
     * @param firstCall
     */
    static setDefaultValues(firstCall) {
        this.initValues = {
            paused: false, // is game paused
            finished: false, // is game finished
            wordsFinished: false, // do we run out of words
            isFirstRun: firstCall, // it is not first run
            bgSound: (firstCall ? {} : this.initValues.bgSound), // is this my first run
            cachedRows: (firstCall ? {} : this.initValues.cachedRows), // cache rows here
            upComingCharEl: null,
            score: 0, // This is fake, We will never show anything related to this to user
            encryptionKey: [], // key of variables encryption
            validatedColumnsCount: 0, // Count of columns which are validated
            nextChar: '', // Next character
            activeChar: {}, // Active character [not stopped] charBlock object
            choosedWords: [], // Choosed words to work with them
            choosedWordsUsedChars: [], // Chars that used from choosed words
            wordsLengthTotal: 0, // Average length of words founded in games
            wordsFounded: 0, // Counter to hold count of words found in game
            wordDirectionCounter: { // Counter of founded word in each direction
                rtl: 0,
                ltr: 0,
                ttd: 0,
                dtp: 0,
                exploded: 0
            },
            isMobile: Helper.isMobile(),
            falledStack: new MapStack(),
            animateConfig: {
                animateClass: 'fallDownSimple',
                deleteTiming: TetrisGame.config.simpleFallDownAnimateSpeed
            }
        };
    }


    /**
     * Get a valid column number [min-max]
     */
    static getValidColumnsNumber() {
        const config = this.config;
        let columnsNumber = config.columnsMin;

        for (let i = Object.keys(window.TetrisWords).length - 1; i >= 0; i--) {
            if (window.TetrisWords[i]) {
                const thisWordLength = window.TetrisWords[i].word.length;
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
     * @param {Charblock} lastChar
     */
    static checkWordSuccess(lastChar) {
        // pause game while checking and animating
        this.initValues.paused = true;

        // check word happens and then call checkWordsResult fn
        this.matrix.checkWords(
            this.initValues.choosedWords,
            lastChar,
            this.config.directionWordChecks,
            this.checkWordsResult
        );
    }


    /**
     * Calls after word success check
     * @param lastChar
     * @param successObject
     */
    static checkWordsResult(lastChar, successObject) {
        const config = TetrisGame.config;
        const initValues = TetrisGame.initValues;

        initValues.paused = true;

        if (!successObject) {
            // no words has been found, resume the game
            TetrisGame.checkSuccessWordStack();
            return;
        } else if (lastChar.type === 'bomb') {
            // todo: where is lastChar :|
            Helper.log('BOOOOOOM');
            TetrisGame._animateExplode(successObject, lastChar);
            return;
        }

        const word = initValues.choosedWords[successObject.wordId].word;

        // Update score
        ScoreHandler._updateScoreAndStats(word, successObject.direction);
        TetrisGame._removeWordAndCharacters(word, successObject.wordId);

        // animate found word
        TetrisGame.showFoundWordAnimated(word, successObject.wordCharacterPositions);

        TetrisGame._animateFoundedCharacters(successObject.wordCharacterPositions, config.successAnimationIterationDuration);

        initValues.falledStack.merge(successObject.fallingCharacters);

        Timeout.request(
            () => {
                TetrisGame.animateFallCharacters(
                    successObject.fallingCharacters, // MapStack of falling characters
                    config.successAnimationIterationDuration, // Delay between falling
                    TetrisGame.checkSuccessWordStack
                );
            },
            // (successObject.fallingCharacters.length * 200) + config.successAnimationIterationDuration
            // successObject.wordCharacterPositions.length * config.successAnimationIterationDuration
            (successObject.wordCharacterPositions.length-1)*(config.successAnimationIterationDuration) + TetrisGame.initValues.animateConfig.deleteTiming
        );
    }


    /**
     * Check words success of stack after an explosion success
     * we check if we have another completed words
     */
    static checkSuccessWordStack() {
        const initValues = TetrisGame.initValues;
        const config = TetrisGame.config;

        const falledCharacter = initValues.falledStack.popItem();
        if (falledCharacter === false) {
            // Stack is empty, resume the game
            console.log('Stack is empty');
            initValues.paused=false;
            return;
        }
        const x = falledCharacter.x;
        const y = falledCharacter.newY;
        // console.log(`checking y: ${y}  x: ${x}`);
        if (TetrisGame.matrix.isNotEmpty(y, x)) TetrisGame.matrix.checkWords(
            initValues.choosedWords,
            {
                row: y,
                column: x,
                char: TetrisGame
                    .matrix.getCharacter(y, x)
            },
            config.directionWordChecks,
            TetrisGame.checkWordsResult
        );
        else {
            TetrisGame.checkSuccessWordStack();
        }
    }


    /**
     * Shows found word with animation
     * @param word
     * @param wordCharacterPositions
     */
    static showFoundWordAnimated(word, wordCharacterPositions) {
        const wordFound = wordCharacterPositions,
            charLength = wordFound.length - 1,
            rowAverage = (wordFound[0].y + wordFound[charLength].y) / 2,
            columnAverage = (wordFound[0].x + wordFound[charLength].x) / 2,
            hidedWord = Charblock.getBlockPosition(parseInt(rowAverage), parseInt(columnAverage)),
            foundWordDisplayEl = Helper._('.foundWordAnimation', TetrisGame.playBoard),
            fixerDistance = (charLength % 2 === 1) ? 0 : (hidedWord.width/4) * -1;


        foundWordDisplayEl.innerHTML = word;
        foundWordDisplayEl.style.display = 'block';
        foundWordDisplayEl.style.left = `${hidedWord.left - fixerDistance}px`;
        foundWordDisplayEl.style.top = `${hidedWord.top - 10}px`;

        if (this.config.useAnimationFlag) {
            foundWordDisplayEl.classList.add('animatedOneSecond', 'jackInTheBox');
        } else {
            foundWordDisplayEl.classList.remove('animatedOneSecond', 'jackInTheBox');
        }

        Timeout.request(
            () => {
                foundWordDisplayEl.style.display = 'none';
            }, 1200
        );
    }


    /**
     * Adds current words to top of gamePlay
     * this words plus with random words of
     * current category
     */
    static showShuffledWords() {
        const parent = Helper._('.currentWorkingWords');
        const displayFiveWords = window.TetrisWords
            .concat(TetrisGame.initValues.choosedWords)
            .sort(() => { return 0.5 - Math.random(); })
            .slice(0, 5);

        // make working words empty
        parent.innerHTML = '';
        displayFiveWords.forEach(item => {
            const currentWord = document.createElement('span');
            currentWord.innerText = item.word;
            currentWord.className = 'currentWords';
            parent.appendChild(currentWord);
        });
    }


    /**
     * Animate found characters
     * @param wordCharacterPositions
     * @param successAnimationIterationDuration
     */
    static _animateFoundedCharacters(wordCharacterPositions, successAnimationIterationDuration) {
        // play founded word sound
        Sound.playByKey('foundWord', TetrisGame.config.playEventsSound);

        // Animate FadingOut founded characters
        wordCharacterPositions.map((item, index) => {
            Timeout.request(
                () => {
                    Charblock.fallNodeAnimate(item.y, item.x, null, null);
                }, index * successAnimationIterationDuration
            );
        });
    }


    /**
     * Animate fall characters
     * @param fallingCharacters
     * @param successAnimationIterationDuration
     * @param after
     */
    static animateFallCharacters(fallingCharacters, successAnimationIterationDuration, after) {
        let index = 0;
        for (const [_, value] of fallingCharacters.entries()) {
            for (const item of value) {
                Timeout.request(
                    () => {
                        Charblock.fallNodeAnimate(item.oldY, item.x, item.newY, item.x);
                    }, (index++) * successAnimationIterationDuration
                );
            }
        }

        if (Helper.isFunction(after)) {
            Timeout.request(after, ((index-1)*(successAnimationIterationDuration)) + TetrisGame.initValues.animateConfig.deleteTiming);
        }
    }


    /**
     * Animate explode
     * @param successObject
     * @param lastChar
     */
    static _animateExplode(successObject, lastChar) {
        const config = TetrisGame.config;

        // explode sound play
        Sound.playByKey('explode', config.playEventsSound);

        if (config.do_shake) {
            Helper.shake(TetrisGame.playBoard, lastChar.typeSize*16);
        }
        if (config.do_vibrate) {
            Helper.vibrate(config.vibrationDuration);
        }

        // Explode the characters
        successObject.explodedChars.map(item => {
            Charblock.fallNodeAnimate(item.y, item.x, null, null);
        });

        // Update score after other blocks falled down
        ScoreHandler._updateScoreAndStats(successObject.explodedChars, 'exploded');


        TetrisGame.initValues.falledStack.merge(successObject.fallingCharacters);

        // Fall characters at top of exploded chars
        TetrisGame.animateFallCharacters(
            successObject.fallingCharacters,
            config.successAnimationIterationDuration,
            () => {
                TetrisGame.checkSuccessWordStack();
            }
        );
    }


    /**
     * Remove words and characters which we found or explode
     * @param word
     * @param wordId
     */
    static _removeWordAndCharacters(word, wordId) {
        // Remove word from choosed words
        TetrisGame.initValues.choosedWords.splice(wordId, 1);

        // Remove characters from choosed characters
        word.split('').map(char => {
            const index = TetrisGame.initValues.choosedWordsUsedChars.indexOf(char);
            if (index !== -1) {
                TetrisGame.initValues.choosedWordsUsedChars.splice(index, 1);
            }
        });
    }
}
