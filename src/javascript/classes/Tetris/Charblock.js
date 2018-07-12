/**
 * @module
 */

import TetrisGame from "./TetrisGame"
import Gameplay from "./Gameplay"
import Sound from "../Sound"
import WordsHelper from "./WordsHelper"
import MaterialColor from "../MaterialColor"
import Explosion from "../Explosion";
import Timeout from "../Timeout";
import Matrix from "../Matrix";


export default class Charblock {

    /**
     * Create new char block
     * @return {*}
     */
    static getNew() {

        let initValues = TetrisGame.initValues;
        let config = TetrisGame.config;


        // if game is finished
        if (initValues.finished) {
            initValues.upComingCharEl.innerHTML = "";
            return false;
        }


        this.column = Math.random() * initValues.validatedColumnsCount << 0;
        this.row = 0;                                   // top is 0 and bottom is max
        this.char = initValues.nextChar === "" ? WordsHelper.chooseChar() : initValues.nextChar;
        this.color = MaterialColor.getRandomColor();    // random material color
        this.element = null;                            // holds our character element


        // interval
        this.interval = TetrisGame.interval.make(
            () => {
                if (!initValues.paused) {
                    this.move(40);
                }
            },
            config.charSpeed / config.level
        );


        // create and show up coming char
        this._showUpComingChar();

        // add this char as active char
        initValues.activeChar = this;

        return this;
    }



    /**
     * Move char block
     * @param eventKeyCode
     * @param position
     * @return {boolean}
     */
    static move(eventKeyCode , position) {

        let initValues = TetrisGame.initValues;
        let config = TetrisGame.config;
        let isBottomMove = TetrisGame.controlCodes.DOWN === eventKeyCode;


        let moveTo = this._generateMove(eventKeyCode, position);

        // if move to is out of range
        if (!moveTo || moveTo.column >= initValues.validatedColumnsCount || moveTo.column < 0) {
            return false;
        }

        let destinationEl = this._getEl(moveTo.row, moveTo.column) || null;
        if (moveTo.row >= config.rows || (destinationEl.innerText.trim() !== "")) {


            if (isBottomMove) {

                // stop interval
                TetrisGame.interval.clear(this.interval);

                // Apply character in our matrix
                // TetrisGame.matrix.setCharacter(moveTo.row -1,moveTo.column,this.char);

                // console.log(Matrix.matrix);

                // check words
                TetrisGame.checkWordSuccess(this);

                if (this.row !== 0) {

                    if (initValues.wordsFinished) {
                        Gameplay.finish("finishWords");
                    } else {



                        // add new char
                        Charblock.factory();
                    }
                } else {
                    Gameplay.finish("gameOver");
                }
            }

        } else {

            // remove char with animation
            this._destroy(this.element, moveTo.animateOutClass);

            // update current char info
            this.row = moveTo.row;
            this.column = moveTo.column;
            this.animateInClass = moveTo.animateInClass;

            // add our char in destination
            Charblock.factory(this, destinationEl);
        }

        // play move char
        Sound.playByKey('moveChar' , config.playEventsSound);
    }


    /**
     * Factory of character
     * @param charblock
     * @param initializeElement
     */
    static factory(charblock, initializeElement) {

        // if char is not supplied create new one
        if (typeof charblock === "undefined") {

            charblock = Charblock.getNew();

            if (Object.keys(charblock).length !== 0) {
                initializeElement = this._getEl(charblock.row, charblock.column);
            } else {
                return false;
            }
        }

        let charBlockEl = document.createElement('span');
        let animateClass = TetrisGame.config.useAnimationFlag ? " animated " : "";

        charBlockEl.style.background = charblock.color;
        charBlockEl.innerHTML = charblock.char;
        charBlockEl.className = "charBlock " + animateClass + (charblock.animateInClass || "");

        charblock.element = charBlockEl;

        initializeElement.innerHTML = '';
        initializeElement.appendChild(charBlockEl);

    }


    /**
     * Fall node with animation
     * @param oldRow {Number}
     * @param oldColumn {Number}
     * @param newRow {Number}
     * @param newColumn {Number}
     */
    static fallNodeAnimate(oldRow, oldColumn, newRow, newColumn){
        let deleteTiming = 0;
        let domToDelete = this._getEl(oldRow , oldColumn , true);
        let gameConfig = TetrisGame.config;
        let oldChar = domToDelete.innerText;
        let oldColor = domToDelete.style.backgroundColor;
        let domParent = domToDelete.parentNode;
        let isFallingDown = (newRow !== null && newColumn !== null);

        if(gameConfig.useAnimationFlag) {
            let animateClass;
            switch (gameConfig.level){
                case 3:
                    deleteTiming = gameConfig.expertFallDownAnimateSpeed;
                    animateClass = "fallDownExpert";
                    break;
                case 2:
                    deleteTiming = gameConfig.mediumFallDownAnimateSpeed;
                    animateClass = "fallDownCharMedium";
                    break;
                default:
                    animateClass =  "fallDownSimple";
                    deleteTiming = gameConfig.simpleFallDownAnimateSpeed;
            }
            domToDelete.classList.add(animateClass , isFallingDown ? "fadeOutDown" : "zoomOutDown");


            // create explosion effect
            if(!isFallingDown){
                Explosion.explode(domParent , 35 , 10);
            }
        }

        Timeout.request(
            () => {
                domParent.removeChild(domToDelete);
            }, deleteTiming
        );


        // animate up char to down
        if(isFallingDown) {
            this.factory(
                {
                    color: oldColor,
                    char: oldChar,
                    animateInClass: "fadeInDown"
                }, this._getEl(newRow , newColumn)
            );
        }
    }


    /**
     * Gets an element from cache or create it
     * @param row
     * @param column
     * @param charBlock
     * @return {*}
     * @private
     */
    static _getEl(row, column , charBlock){

        let charBlockString = "";
        if(typeof charBlock !== "undefined" && charBlock){
            charBlockString = " .charBlock";
        }


        let cachedRow = TetrisGame.initValues.cachedRows[row] || false;
        if(Object.keys(cachedRow) > 0){
            return TetrisGame.initValues.cachedRows[row].querySelector('.column_' + column + charBlockString);
        }else {
            let rowElement = TetrisGame.playBoard.querySelector('.row_' + row);
            if (rowElement) {
                TetrisGame.initValues.cachedRows[row] = rowElement;
                return rowElement.querySelector('.column_' + column + charBlockString);
            }else{
                return null;
            }
        }
    }


    /**
     * Generate charBlock movement
     *
     * @param keyCode
     * @param position
     * @return {*}
     * @private
     */
    static _generateMove(keyCode , position){
        let moveTo;
        let row = this.row;
        let column = this.column;

        switch (keyCode) {
            case TetrisGame.controlCodes.LEFT:  // left
                moveTo = {
                    row: row,
                    column: column + 1,
                    animateOutClass: (lang.rtl ? "fadeOutLeft" : "fadeOutRight"),
                    animateInClass: (lang.rtl ? "fadeInRight" : "fadeInLeft")
                };
                break;
            case TetrisGame.controlCodes.RIGHT:  // right
                moveTo = {
                    row: row,
                    column: column - 1,
                    animateOutClass: (lang.rtl ? "fadeOutRight" : "fadeOutLeft"),
                    animateInClass: (lang.rtl ? "fadeInLeft" : "fadeInRight")
                };
                break;
            case TetrisGame.controlCodes.DOWN:  // down
                moveTo = {
                    row: row + 1,
                    column: column,
                    animateOutClass: "fadeOutDown",
                    animateInClass: "fadeInDown"
                };
                break;
            default:
                return false;
        }

        return moveTo;
    }



    /**
     * Create and show upcoming character
     * @private
     */
    static _showUpComingChar() {

        TetrisGame.initValues.nextChar = WordsHelper.chooseChar();

        let upComingCharHolder = TetrisGame.initValues.upComingCharEl;
        let upcommingCharEl = document.createElement('span');
        let animateClass = TetrisGame.config.useAnimationFlag ? " animated bounceIn" : "";

        upComingCharHolder.innerHTML = '';
        upcommingCharEl.className = animateClass;
        upcommingCharEl.innerHTML = TetrisGame.initValues.nextChar || "";
        upComingCharHolder.appendChild(upcommingCharEl);
    }


    /**
     * Destroy char block
     * @param workingElement
     * @param outgoingAnimation
     * @private
     */
    static _destroy(workingElement, outgoingAnimation) {
        let config = TetrisGame.config;
        let animateClass = config.useAnimationFlag ? " animated " : "";

        workingElement.className += animateClass + outgoingAnimation;
        Timeout.request(
            () => {
                // remove current char
                workingElement.parentNode.removeChild(workingElement);
            },
            (config.useAnimationFlag ? 200/ config.level : 0)
        );
    }
}
