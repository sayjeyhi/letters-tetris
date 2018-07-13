/**
 * @module
 */

/**
 * @class Gameplay
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
        TetrisGame.playBoard.classList.add('is' + TetrisGame.initValues.validatedColumnsCount + 'Column');


        // show game play board girds
        if(TetrisGame.config.showGrids){
            TetrisGame.playBoard.classList.add("showGrids");
        }


        // create game columns and rows - matrix
        TetrisGame.matrix = new Matrix(
            this._makeGameBoard()
        );


        // Choose n words from json to create rows and columns
        for (let i = 0; i < TetrisGame.config.workingWordCount; i++) {
            let choosedWord = WordsHelper.chooseWord();
            if(!choosedWord){
                Gameplay.finish("finishWords");
            }else {
                TetrisGame.initValues.choosedWords.push(choosedWord);
            }
        }


        // start game timer
        TetrisGame.timer.start();


        // create first char block
        Charblock.factory();


        // play start sound
        Sound.playByKey('start', TetrisGame.config.playEventsSound);

        // arrow keys press
        this._makeMovingEvents();

        this._buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');
    }



    /**
     * Pause Game play
     */
    static pause() {

        // playByKey resume sound
        Sound.playByKey('pause', TetrisGame.config.playEventsSound);

        // stop timer [will stop whole game]
        TetrisGame.timer.pause();

        // manage game buttons
        this._buttonManager('.resumeGame,.restartGame', '.startGame,.pauseGame');
    }


    /**
     * Resume Game play
     */
    static resume() {

        // playByKey resume sound
        Sound.playByKey('pause', TetrisGame.config.playEventsSound);

        // resume timer [will resume whole game]
        TetrisGame.timer.resume();

        // manage game buttons
        this._buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');

    }


    /**
     * Reset Game play
     */
    static restart() {

        // kill all intervals
        TetrisGame.interval.clearAll();

        // make game variables that variables was on start
        TetrisGame.setDefaultValues(false);

        // destroy swiper
        TetrisGame.swipe.destroy();

        // play resume sound
        Sound.playByKey('pause' , TetrisGame.config.playEventsSound);

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

        let config = TetrisGame.config;
        let initValues = TetrisGame.initValues;

        // play game over sound
        if(mode === "gameOver") {
            Sound.playByKey('finishGame', config.playEventsSound);
        }

        // manage game buttons
        this._buttonManager('.restartGame', '.startGame,.pauseGame,.resumeGame');

        initValues.finished = true;
        TetrisGame.timer.pause();




        let wordsAverageLength = initValues.wordsLengthTotal / initValues.wordsFounded;
        //TODO: Jafar Rezayi, use this variables when showing user scoreboard
        // wordsAverageLength
        // initValues.wordDirectionCounter
        // initValues.wordsFounded
        console.log(wordsAverageLength,initValues.wordDirectionCounter,initValues.wordsFounded);




        let modalHeader,modalContent,modalType;
        let modalButtons = [];
        if (mode === "gameOver") {
            modalHeader = lang.gameOverModalTitle;
            modalContent = lang.gameOverModalContent;

            modalType = "danger";
            modalButtons.push(
                {
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
            modalType = "success";
            modalButtons.push(
                {
                    text : lang.modalRefreshButton,
                    onclick : function () {
                        window.location.reload();
                    }
                }
            );
        }

        let modal = new Modal({
            animate : config.useAnimationFlag,
            dark : (config.level === 3),
            type : modalType,
            header : modalHeader,
            content : modalContent,
            buttons : modalButtons
        }, lang.rtl );

        Timeout.request(
            () => {
                modal.show();
            } , 300
        );

    }


    /**
     * Make game board
     * @return {Array}
     * @private
     */
    static _makeGameBoard(){
        let playBoardTable = '';
        let matrixRowArray = [];

        let rowsCount = TetrisGame.initValues.isMobile ? 9 : TetrisGame.config.rows;

        for (let r = 0; r < rowsCount; r++) {
            let matrixColumn = [];
            playBoardTable += '<div class="isRow row_' + r + '">';
            for (let c = 0; c < TetrisGame.initValues.validatedColumnsCount; c++) {
                playBoardTable += '<div id="grid' + r + '_' + c +  '" class="isColumn column_' + c + '" data-row="' + r + '"></div>';
                matrixColumn[c]=' ';
            }
            matrixRowArray[r] = matrixColumn;
            playBoardTable += '</div>';
        }

        playBoardTable += '<div class="foundWordAnimation animatedMaxTime jackInTheBox"></div>';
        TetrisGame.playBoard.innerHTML = playBoardTable;

        return matrixRowArray;
    }


    /**
     * Make events for moving charBlocks
     * @private
     */
    static _makeMovingEvents(){

        // fire on arrow keys down
        document.onkeydown = function (e) {
            if(!TetrisGame.initValues.paused && [37 , 39 , 40].indexOf(e.keyCode) > -1) {
                TetrisGame.initValues.activeChar.move(e.keyCode);
            }
        };

        // mobile swipe detect
        TetrisGame.swipe = new Swipe(
            TetrisGame.playBoard,
            function (dir) {
                // simulate arrow press on swipe
                switch (dir){
                    case "left":
                        TetrisGame.initValues.activeChar.move(CONTROL_CODES.LEFT);
                        break;
                    case "right":
                        TetrisGame.initValues.activeChar.move(CONTROL_CODES.RIGHT);
                        break;
                    case "down":
                        TetrisGame.initValues.activeChar.move(CONTROL_CODES.DOWN);
                        break;
                }
            } , {
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
        let gameBtnControl = Helper._(".gameControlButtons");
        gameBtnControl.querySelectorAll(showClassed).forEach((item) => {
            item.style.display = "inline-block";
        });
        gameBtnControl.querySelectorAll(hideClasses).forEach((item) => {
            item.style.display = "none";
        });
    }

}
