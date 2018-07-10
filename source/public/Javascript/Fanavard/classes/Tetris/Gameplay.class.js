/**
 * @class Gameplay sub class of Tetris game
 */

'use strict';

class Gameplay extends TetrisGame {

    /**
     * Start Game play
     */
    static start() {

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
                playBoardTable += '<div id="grid' + r + '_' + c +  '" class="isColumn column_' + c + '" data-row="' + r + '"></div>';
                matrixColumn[c]=' ';
            }
            matrixRowArray[r] = matrixColumn;
            playBoardTable += '</div>';
        }

        TetrisGame.matrix = new Matrix(matrixRowArray);

        TetrisGame.playBoard.innerHTML = playBoardTable;


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
        document.onkeydown = function (e) {
            if(!TetrisGame.initValues.paused) {
                TetrisGame.initValues.activeChar.move(e.keyCode);
            }
        };

        // mobile swipe detect
        TetrisGame.swipe = new Swipe(TetrisGame.playBoard , function (dir) {

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
        });


        this.buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');
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
        this.buttonManager('.resumeGame,.restartGame', '.startGame,.pauseGame');
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
        this.buttonManager('.pauseGame,.restartGame', '.startGame,.resumeGame');

    }


    /**
     * Reset Game play
     */
    static restart() {

        // kill all intervals
        TetrisGame.interval.clearAll();

        // make game variables that variables was on start
        TetrisGame.initValues = {
            paused: false,
            finished: false,
            wordsFinished: false,
            isFirstRun: false,              // it is not first run
            chooseedWordKind: {
                persianTitle: TetrisGame.initValues.chooseedWordKind.persianTitle,
                englishTitle: TetrisGame.initValues.chooseedWordKind.englishTitle
            },
            bgSound : TetrisGame.initValues.bgSound ,


            validatedColumnsCount: 0,       // Count of columns which are validated
            nextChar: '',                   // Next character
            activeChar: {},                 // Active character [not stopped] Object index
            choosedWords: [],               // Choosed words to work with them
            choosedWordsUsedChars: []       // Chars that used from choosed words
        };

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

        // play finish sound
        Sound.playByKey('finishGame', TetrisGame.config.playEventsSound);

        // manage game buttons
        this.buttonManager('.restartGame', '.startGame,.pauseGame,.resumeGame');

        TetrisGame.initValues.finished = true;
        TetrisGame.timer.pause();

        let modalHeader = "", modalContent = "";
        let modalButtons = [];
        if (mode === "gameOver") {
            modalHeader = lang.gameOverModalTitle;
            modalContent = lang.gameOverModalContent;

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
            animate : TetrisGame.config.useAnimationFlag,
            header : modalHeader,
            content : modalContent,
            buttons : modalButtons
        }, lang.rtl );

        setTimeout(() => {
            modal.show();
        } , 300);

    }


    /**
     * Manage btn parts buttons
     * @param showClassed
     * @param hideClasses
     */
    static buttonManager(showClassed, hideClasses) {
        let gameBtnControl = document.querySelector(".gameControlButtons");
        gameBtnControl.querySelectorAll(showClassed).forEach((item) => {
            item.style.display = "inline-block";
        });
        gameBtnControl.querySelectorAll(hideClasses).forEach((item) => {
            item.style.display = "none";
        });
    }

}
