/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Gameplay from './Gameplay';
import Sound from '../Sound';
import WordsHelper from './WordsHelper';
import MaterialColor from '../MaterialColor';
import Explosion from '../Explosion';
import Timeout from '../Timeout';
import Matrix from '../Matrix';
import Helper from '../Helper';


export default class Charblock {

	/**
     * Create new char block
     * @return {*}
     */
	static getNew() {
		const initValues = TetrisGame.initValues;
		const config = TetrisGame.config;


		// if game is finished
		if (initValues.finished) {
			initValues.upComingCharEl.innerHTML = '';
			return false;
		}


		this.column = Math.random() * initValues.validatedColumnsCount << 0;
		this.row = 0; // top is 0 and bottom is max
        this.char = initValues.nextChar === '' ? WordsHelper.chooseChar() : initValues.nextChar;


        // is character special ?
        if(typeof this.char === "object" && this.char.special === "true"){
            this.type = this.char.type;
            this.typeSize = 1;
        }else{
            this.type = "regular";
        }


		this.color = MaterialColor.getRandomColor(); // random material color
		this.element = null; // holds our character element


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
	static move(eventKeyCode, position) {
		const initValues = TetrisGame.initValues;
		const config = TetrisGame.config;
		const isBottomMove = TetrisGame.controlCodes.DOWN === eventKeyCode;


		const moveTo = this._generateMove(eventKeyCode, position);

		// if move to is out of range
		if (!moveTo || moveTo.column >= initValues.validatedColumnsCount || moveTo.column < 0) {
			return false;
		}

		const destinationEl = this._getEl(moveTo.row, moveTo.column) || null;
		if (moveTo.row >= config.rows || (destinationEl.innerText.trim() !== '')) {
			if (isBottomMove) {
				// stop interval
				TetrisGame.interval.clear(this.interval);

				// check words
				TetrisGame.checkWordSuccess(this);

				if (this.row !== 0) {
					if (initValues.wordsFinished) {
						Gameplay.finish('finishWords');
					} else {
						// add new char
						Charblock.factory();
					}
				} else {
					Gameplay.finish('gameOver');
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
		Sound.playByKey('moveChar', config.playEventsSound);
	}


	/**
     * Factory of character
     * @param charblock
     * @param initializeElement
     */
	static factory(charblock, initializeElement) {
		// if char is not supplied create new one
		if (typeof charblock === 'undefined') {
			charblock = Charblock.getNew();

			if (Object.keys(charblock).length !== 0) {
				initializeElement = this._getEl(charblock.row, charblock.column);
			} else {
				return false;
			}
		}

		const charBlockEl = document.createElement('span');
		let animateClass = TetrisGame.config.useAnimationFlag ? ' animated ' : '';

		if(charblock.type === "regular") {
            charBlockEl.style.background = charblock.color;
            charBlockEl.innerHTML = charblock.char;
        }else{
            charBlockEl.style.background = "#fff";
		    charBlockEl.style.fontSize = "2rem";
            charBlockEl.appendChild(charblock.char);
        }

		charBlockEl.className = `charBlock ${animateClass}${charblock.animateInClass || ''}`;

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
	static fallNodeAnimate(oldRow, oldColumn, newRow, newColumn) {
		let deleteTiming = 0;
		const domToDelete = this._getEl(oldRow, oldColumn, true);
		if (!domToDelete) return false;
		const gameConfig = TetrisGame.config;
		const oldChar = domToDelete.innerText;
		const oldColor = domToDelete.style.backgroundColor;
		const domParent = domToDelete.parentNode;
		const isFallingDown = (newRow !== null && newColumn !== null);

		if (gameConfig.useAnimationFlag) {
			let animateClass;
			switch (gameConfig.level) {
				case 3:
					deleteTiming = gameConfig.expertFallDownAnimateSpeed;
					animateClass = 'fallDownExpert';
					break;
				case 2:
					deleteTiming = gameConfig.mediumFallDownAnimateSpeed;
					animateClass = 'fallDownCharMedium';
					break;
				default:
					animateClass = 'fallDownSimple';
					deleteTiming = gameConfig.simpleFallDownAnimateSpeed;
			}
			domToDelete.classList.add(animateClass, isFallingDown ? 'fadeOutDown' : 'zoomOutDown');


			// create explosion effect
			if (!isFallingDown) {
				Explosion.explode(domParent, 35, 10);
			}
		}

		Timeout.request(
			() => {
				if (domToDelete.parentElement === domParent) domParent.removeChild(domToDelete);
			}, deleteTiming
		);


		// animate up char to down
		if (isFallingDown) {
			this.factory(
				{
					color: oldColor,
					char: oldChar,
                    type: 'regular',
					animateInClass: 'fadeInDown'
				}, this._getEl(newRow, newColumn)
			);
		}
	}


	static getBlockPosition(row, column) {
		const blockElement = this._getEl(row, column);
		return {
			top: blockElement.offsetTop,
			left: blockElement.offsetLeft,
			width: blockElement.offsetWidth
		};
	}


	/**
     * Gets an element from cache or create it
     * @param row
     * @param column
     * @param charBlock
     * @return {*}
     * @private
     */
	static _getEl(row, column, charBlock) {
		let charBlockString = '';
		if (typeof charBlock !== 'undefined' && charBlock) {
			charBlockString = ' .charBlock';
		}

		const cachedRow = TetrisGame.initValues.cachedRows[row] || false;
		if (Object.keys(cachedRow) > 0) {
			return Helper._(`.column_${column}${charBlockString}`, TetrisGame.initValues.cachedRows[row]);
		} else {
			const rowElement = Helper._(`.row_${row}`, TetrisGame.playBoard);
			if (rowElement) {
				TetrisGame.initValues.cachedRows[row] = rowElement;
				return Helper._(`.column_${column}${charBlockString}`, rowElement);
			} else {
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
	static _generateMove(keyCode, position) {
		let moveTo;
		const row = this.row;
		const column = this.column;

		switch (keyCode) {
			case TetrisGame.controlCodes.LEFT: // left
				moveTo = {
					row,
					column: column + 1,
					animateOutClass: (lang.rtl ? 'fadeOutLeft' : 'fadeOutRight'),
					animateInClass: (lang.rtl ? 'fadeInRight' : 'fadeInLeft')
				};
				break;
			case TetrisGame.controlCodes.RIGHT: // right
				moveTo = {
					row,
					column: column - 1,
					animateOutClass: (lang.rtl ? 'fadeOutRight' : 'fadeOutLeft'),
					animateInClass: (lang.rtl ? 'fadeInLeft' : 'fadeInRight')
				};
				break;
			case TetrisGame.controlCodes.DOWN: // down
				moveTo = {
					row: row + 1,
					column,
					animateOutClass: 'fadeOutDown',
					animateInClass: 'fadeInDown'
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

	    let initValues = TetrisGame.initValues;

		initValues.nextChar = WordsHelper.chooseChar();

		const upComingCharHolder = initValues.upComingCharEl;
		const upcomingCharEl = document.createElement('span');
		const animateClass = TetrisGame.config.useAnimationFlag ? ' animated bounceIn' : '';

		upComingCharHolder.innerHTML = '';
        upcomingCharEl.className = animateClass;

		if(typeof initValues.nextChar === "object"){
            upcomingCharEl.appendChild(initValues.nextChar);
        }else{
            upcomingCharEl.innerHTML = initValues.nextChar || '';
        }

		upComingCharHolder.appendChild(upcomingCharEl);
	}


	/**
     * Destroy char block
     * @param workingElement
     * @param outgoingAnimation
     * @private
     */
	static _destroy(workingElement, outgoingAnimation) {
		const config = TetrisGame.config;
		const animateClass = config.useAnimationFlag ? ' animated ' : '';

		workingElement.className += animateClass + outgoingAnimation;
		Timeout.request(
			() => {
				// remove current char
				if (workingElement.parentNode) {
					workingElement.parentNode.removeChild(workingElement);
				}
			},
			(config.useAnimationFlag ? 200/ config.level : 0)
		);
	}
}
