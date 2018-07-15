/**
 * @module
 */

import TetrisGame from "./TetrisGame";
import Swipe from "../Swipe";
import Sound from "../Sound";
import Charblock from "./Charblock";
import WordsHelper from "./WordsHelper";
import Modal from "../Modal";
import Matrix from "../Matrix";
import Timeout from "../Timeout";
import Helper from "../Helper";
import ScoreHandler from "./ScoreHandler";

/**
 * @class Gameplay
 */
export default class Gameplay {
    /**
     * Start Game play
     */
    static start() {
        // cache most used elements on class
        TetrisGame.playBoard = Helper._(".playBoard");
        TetrisGame.initValues.upComingCharEl = Helper._(".showUpComingLetter");

        // Get valid column length based on max json word length to create columns
        TetrisGame.initValues.validatedColumnsCount = TetrisGame.getValidColumnsNumber();

        // add class to have playBoard columns
        TetrisGame.playBoard.classList.add(
            `is${TetrisGame.initValues.validatedColumnsCount}Column`
        );

        // show game play board girds
        if (TetrisGame.config.showGrids) {
            TetrisGame.playBoard.classList.add("showGrids");
        }

        // create game columns and rows - matrix
        TetrisGame.matrix = new Matrix(this._makeGameBoard());

        // Choose n words from json to create rows and columns
        for (let i = 0; i < TetrisGame.config.workingWordCount; i++) {
            const choosedWord = WordsHelper.chooseWord();
            if (!choosedWord) {
                Gameplay.finish("finishWords");
            } else {
                TetrisGame._addCurrentWord(
                    TetrisGame.initValues.choosedWords.push(choosedWord) - 1
                );
            }
        }

        // start game timer
        TetrisGame.timer.start();

        // create first char block
        Charblock.factory();

        // play start sound
        Sound.playByKey("start", TetrisGame.config.playEventsSound);

        // arrow keys press
        this._makeMovingEvents();

        this._buttonManager(
            ".pauseGame,.restartGame",
            ".startGame,.resumeGame"
        );
    }

    /**
     * Pause Game play
     */
    static pause() {
        // playByKey resume sound
        Sound.playByKey("pause", TetrisGame.config.playEventsSound);

        // stop timer [will stop whole game]
        TetrisGame.timer.pause();

        // manage game buttons
        this._buttonManager(
            ".resumeGame,.restartGame",
            ".startGame,.pauseGame"
        );
    }

    /**
     * Resume Game play
     */
    static resume() {
        // playByKey resume sound
        Sound.playByKey("pause", TetrisGame.config.playEventsSound);

        // resume timer [will resume whole game]
        TetrisGame.timer.resume();

        // manage game buttons
        this._buttonManager(
            ".pauseGame,.restartGame",
            ".startGame,.resumeGame"
        );
    }

    /**
     * Reset Game play
     */
    static restart() {
        if (TetrisGame.initValues.wordsFinished) {
            window.location.reload();
        }

        // kill all intervals
        TetrisGame.interval.clearAll();

        // make game variables that variables was on start
        TetrisGame.setDefaultValues(false);

        // destroy swiper
        TetrisGame.swipe.destroy();

        // play resume sound
        Sound.playByKey("pause", TetrisGame.config.playEventsSound);

        // remove old listener of keydown which causes multiple moves
        document.onkeydown = null;

        // re-build game
        TetrisGame.build();
    }

    /**
     * Game is finished [gameOver OR finishWords]
     * @param mode
     */
    static finish(mode) {
        const config = TetrisGame.config;
        const initValues = TetrisGame.initValues;

        // play game over sound
        if (mode === "gameOver") {
            Sound.playByKey("finishGame", config.playEventsSound);
        }

        // manage game buttons
        this._buttonManager(
            ".restartGame",
            ".startGame,.pauseGame,.resumeGame"
        );

        initValues.finished = true;
        TetrisGame.timer.pause();

        const wordsAverageLength = (initValues.wordsLengthTotal / initValues.wordsFounded) || 0;
        const showScore = Math.round(TetrisGame._getScore());
        const gamingTime = TetrisGame.timer.currentTime;

        const gamingInfo = `
             <div class="gameStatics">
                <div class="scorePart">${lang.sumScore} : ‌<span class="value">${showScore}</span></div>
                <div class="wordsFoundedPart">${lang.foundWords} :‌ <span class="value">${initValues.wordsFounded} ${lang.word}</span></div>
                <div class="averageLengthPart">${lang.wordLengthAverage} :‌<span class="value"> ${Math.round(wordsAverageLength)} ${lang.character}</span></div>
                <div class="timePart">${lang.spentTimeModal} :‌ <span class="value">${gamingTime}</span></div>
            </div>`;

        let scoreModal, modalHeader, modalContent, modalType;
        const modalButtons = [
            {
                text: lang.saveScore,
                isOk: true,
                onclick() {
                    // destroy score modal
                    scoreModal.destroy();

                    // display save score modal
                    ScoreHandler.submit(gamingInfo, showScore, gamingTime);
                }
            }
        ];

        if (mode === "gameOver") {
            modalHeader = lang.gameOverModalTitle;
            modalContent = lang.gameOverModalContent + gamingInfo;

            modalType = "danger";
            modalButtons.push(
                {
                    text: lang.restartGame,
                    isOk: true,
                    onclick() {
                        scoreModal.destroy();
                        Gameplay.restart();
                    }
                },
                {
                    text: lang.modalOkButton,
                    onclick() {
                        scoreModal.destroy();
                    }
                }
            );
        } else {
            modalHeader = lang.noExtraWordModalTitle;
            modalContent = lang.noExtraWordModalContent + gamingInfo;
            modalType = "success";
            modalButtons.push({
                text: lang.modalRefreshButton,
                onclick() {
                    window.location.reload();
                }
            });
        }

        scoreModal = new Modal(
            {
                animate: config.useAnimationFlag,
                dark: config.level === 3,
                type: modalType,
                header: modalHeader,
                content: modalContent,
                buttons: modalButtons
            },
            lang.rtl
        );

        Timeout.request(() => {
            scoreModal.show();
        }, 1300);
    }

    /**
     * Make game board
     * @return {Array}
     * @private
     */
    static _makeGameBoard() {
        let rowsCount = TetrisGame.config.rows,
            playBoardTable = `<div class="foundWordAnimation animatedMaxTime jackInTheBox"></div>
            <div class="currentWorkingWords"> </div>`;
        const matrixRowArray = [];

        // we have eight rows on mobile
        if (TetrisGame.initValues.isMobile) {
            TetrisGame.playBoard.style.minHeight = "350px";
            rowsCount = TetrisGame.config.rows = 8;
        }

        for (let r = 0; r < rowsCount; r++) {
            const matrixColumn = [];
            playBoardTable += `<div class="isRow row_${r}">`;
            for (
                let c = 0;
                c < TetrisGame.initValues.validatedColumnsCount;
                c++
            ) {
                playBoardTable += `<div id="grid${r}_${c}" class="isColumn column_${c}" data-row="${r}"></div>`;
                matrixColumn[c] = " ";
            }
            matrixRowArray[r] = matrixColumn;
            playBoardTable += "</div>";
        }

        TetrisGame.playBoard.innerHTML = playBoardTable;

        return matrixRowArray;
    }

    /**
     * Make events for moving charBlocks
     * @private
     */
    static _makeMovingEvents() {
        // fire on arrow keys down
        document.onkeydown = function(e) {
            if (
                !TetrisGame.initValues.paused &&
                [37, 39, 40].indexOf(e.keyCode) > -1
            ) {
                TetrisGame.initValues.activeChar.move(e.keyCode);
                e.preventDefault();
            }
        };

        // mobile swipe detect
        TetrisGame.swipe = new Swipe(
            TetrisGame.playBoard,
            dir => {
                // simulate arrow press on swipe
                switch (dir) {
                    case "left":
                        TetrisGame.initValues.activeChar.move(
                            CONTROL_CODES.LEFT
                        );
                        break;
                    case "right":
                        TetrisGame.initValues.activeChar.move(
                            CONTROL_CODES.RIGHT
                        );
                        break;
                    case "down":
                        TetrisGame.initValues.activeChar.move(
                            CONTROL_CODES.DOWN
                        );
                        break;
                }
            },
            {
                threshold: 70
            }
        );
    }

    /**
     * Manage btn parts buttons
     * @param showClassed
     * @param hideClasses
     * @private
     */
    static _buttonManager(showClassed, hideClasses) {
        const gameBtnControl = Helper._(".gameControlButtons");
        gameBtnControl.querySelectorAll(showClassed).forEach(item => {
            item.style.display = "inline-block";
        });
        gameBtnControl.querySelectorAll(hideClasses).forEach(item => {
            item.style.display = "none";
        });
    }
}
