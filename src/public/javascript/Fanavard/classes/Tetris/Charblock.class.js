/**
 * @class Charblock
 */

'use strict';

class Charblock {


    /**
     * Create new char block
     * @return {*}
     */
    static getNew() {

        let initValues = TetrisGame.initValues;
        let config = TetrisGame.config;


        // if game is finished
        if (initValues.finished) {
            document.querySelector(".showUpComingLetter").innerHTML = "";
            return false;
        }


        this.column = Math.random() * initValues.validatedColumnsCount << 0;
        this.row = 0;                               // top is 0 and bottom is max
        this.char = initValues.nextChar === "" ? WordsHelper.chooseChar() : initValues.nextChar;        // char value
        this.color = MaterialColor.getRandomColor();    // random material color
        this.active = true;                         // character is animating on air
        this.element = null;                        // holds our character element


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


        let moveTo = this._generateMove(eventKeyCode , position , this.row , this.column);

        // if move to is out of range
        if (moveTo.column >= initValues.validatedColumnsCount || moveTo.column < 0) {
            return false;
        }

        //let destinationEl = document.getElementById("grid" + moveTo.row + "_" + moveTo.column) || null;
        let destinationEl = TetrisGame.playBoard.querySelector(".row_" + moveTo.row + " .column_" + moveTo.column) || null;
        if (moveTo.row >= config.rows || (destinationEl.innerText.trim() !== "")) {

            //Apply character in our matrix
            TetrisGame.matrix.setCharacter(moveTo.row - 1,moveTo.column,this.char);

            if (isBottomMove) {

                // stop interval and request new char
                TetrisGame.interval.clear(this.interval);

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
                initializeElement = TetrisGame.playBoard.querySelector(".row_" + charblock.row + " .column_" + charblock.column);
            } else {
                return false;
            }
        }

        let charBlock = document.createElement('span');
        let animateClass = TetrisGame.config.useAnimationFlag ? " animated " : "";

        charBlock.style.background = charblock.color;
        charBlock.innerHTML = charblock.char;
        charBlock.className = "charBlock " + animateClass + (charblock.animateInClass || "");

        charblock.element = charBlock;

        initializeElement.innerHTML = '';
        initializeElement.appendChild(charBlock);

    }


    /**
     * Generate charBlock movement
     *
     * @param keyCode
     * @param position
     * @param row
     * @param column
     * @return {*}
     * @private
     */
    static _generateMove(keyCode , position , row , column){
        let moveTo;

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

        return moveTo;
    }



    /**
     * Create and show upcoming character
     */
    static _showUpComingChar() {

        TetrisGame.initValues.nextChar = WordsHelper.chooseChar();

        let upCommingCharHolder = document.querySelector(".showUpComingLetter");
        let upcommingCharEl = document.createElement('span');
        let animateClass = TetrisGame.config.useAnimationFlag ? " animated bounceIn" : "";

        upCommingCharHolder.innerHTML = '';
        upcommingCharEl.className = animateClass;
        upcommingCharEl.innerHTML = TetrisGame.initValues.nextChar || "";
        upCommingCharHolder.appendChild(upcommingCharEl);
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
        setTimeout(
            () => {
                // remove current char
                workingElement.parentNode.removeChild(workingElement);
            },
            (config.useAnimationFlag ? 200/ config.level : 0)
        );
    }
}
