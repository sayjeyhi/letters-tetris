/**
 * @module Matrix
 */

import Helper from './Helper';
import MapStack from './MapStack';

/**
 * This class will hold values of characters, find successful created words, delete them and etc
 */
const
	IS_NOT_VALID=-1,
	IS_EMPTY=-2,
	IS_OK = -3;

export default class Matrix {
	/**
     * @param matrix {Array} Matrix of characters
     * @property matrix {Array} Matrix of characters
     * @property width {Number} - Width of matrix
     * @property height {Number} - Height of matrix
     * @example
     *  let matrix = new Matrix([[' ',' ',' ',' '],
     *      [' ',' ',' ',' '],
     *      [' ',' ',' ',' '],
     *      [' ',' ',' ',' ']]
     *  );
     */
	constructor(matrix) {
		this.matrix = matrix;
		this.height = matrix.length;
		this.width = matrix[0].length;
		this.filledCharacters = 0;
	}


	/**
     * Set character on matrix
     * @param y {Number} - Column of matrix
     * @param x {Number} - Row of matrix
     * @param char {String} - Character to place in matrix
     */
	setCharacter(y, x, char) {
		this.matrix[y][x] = char;
		this.filledCharacters++;
	}


	/**
     * Deletes a single cell in Matrix
     * @param y {Number} - Column of matrix
     * @param x {Number} - Row of matrix
     */
	fastDeleteCharacter(y, x) {
		this.matrix[y][x]= ' ';
		this.filledCharacters--;
	}


	/**
     * Deletes a single cell in Matrix safely
     * @param y {Number}
     * @param x  {Number}
     */
	safeDeleteCharacter(y, x) {
		// If character is out of matrix size or empty, don't do anything
		if (!this.isValidPosition(y, x)) return IS_NOT_VALID;
		else if (this.isEmpty(y, x)) return IS_EMPTY;
		this.fastDeleteCharacter(y, x);
		return IS_OK;
	}


	/**
     * Checks if a position is valid in our matrix
     * @param y {Number} - Row ID of character
     * @param x {Number} - Column ID of character
     */
	isValidPosition(y, x) {
		return !(y<0 ||y >= this.height || x<0 || x>=this.width);
	}

	/**
     * Checks if character is Empty
     * @param y {Number} - Row ID of character
     * @param x {Number} - Column ID of character
     * @returns {boolean} - Returns true if character is empty
     */
	isEmpty(y, x) {
		return this.matrix[y][x] === ' ';
	}

	/**
     * Gets a character at position
     * @param y {Number} - Row ID of character
     * @param x {Number} - Column ID of character
     * @returns {String}
     */
	getCharacter(y, x) {
	    return this.matrix[y][x];
	}

	/**
     * Checks if character is Empty
     * @param y {Number} - Row ID of character
     * @param x {Number} - Column ID of character
     * @returns {boolean} - Returns true if character is empty
     */
	isNotEmpty(y, x) {
		return !this.isEmpty(y, x);
	}


	/**
     * Check word happens
     * @param {String[]} words - To search in strings
     * @param {Object} lastChar - Last character that has been set
     * @param {CheckTypes} checkType to search for strings in matrix from x,y point can have any of these values: L|R|T|D
     * @param {Function} successCallback - Returns founded characters, Falling characters and
     */
	checkWords(words, lastChar, checkType, successCallback) {
	    this.lastChar = lastChar;
	    const rowId = lastChar.row,
			colId = lastChar.column,
			char = lastChar.char;

		if (lastChar.type && lastChar.type==='bomb') {
			this._explode(rowId, colId, lastChar.typeSize, successCallback);
			return;
		}

		this.setCharacter(rowId, colId, char);
		const rights = this._getRailingChars(rowId, colId, 'R');
		const lefts = this._getRailingChars(rowId, colId, 'L');
		const tops = this._getRailingChars(rowId, colId, 'T');
		const downs = this._getRailingChars(rowId, colId, 'D');

		const sentenceLTR = (lefts.chars + this.matrix[rowId][colId] + rights.chars); // Create valid sentence from left characters + current character + right characters
		const sentenceTTD = (tops.chars + this.matrix[rowId][colId] + downs.chars); // Create valid sentence from left characters + current character + right characters
		const sentenceRTL = (Helper.reverse(sentenceLTR)); // Reverse it to get
		const sentenceDTT = (Helper.reverse(sentenceTTD));

		let foundHappened = false;
		for (let i = 0, len = words.length; i < len; i++) {
			if (!words[i]) continue;
			let pos,
				checkPlace,
				startFrom;
			const word = words[i].word;

			if (checkType.ltr && (pos = sentenceLTR.indexOf(word)) !== -1) {
				Helper.log(`LTR--> Found valid word:${word} In:${sentenceLTR}`);
				startFrom = colId - lefts.len + pos;
				foundHappened = true;
				checkPlace = {
					ltr: true
				};
			} else if (checkType.rtl && (pos = sentenceRTL.indexOf(word)) !== -1) {
				Helper.log(`RTL--> Found valid word:${word} In:${sentenceRTL}`);
				startFrom = colId + rights.len - pos;
				foundHappened = true;
				checkPlace = {
					rtl: true
				};
			} else if (checkType.ttd && (pos = sentenceTTD.indexOf(word)) !== -1) {
				Helper.log(`TTD--> Found valid word:${word} In:${sentenceTTD}`);
				startFrom = rowId - tops.len + pos;
				foundHappened = true;
				checkPlace = {
					ttd: true
				};
			} else if (checkType.dtt && (pos = sentenceDTT.indexOf(word)) !== -1) {
				Helper.log(`DTT--> Found valid word:${word} In:${sentenceDTT}`);
				startFrom = rowId + downs.len - pos;
				foundHappened = true;
				checkPlace = {
					dtt: true
				};
			}

			if (foundHappened) {
				this._deleteCharacters(rowId, colId, i, checkPlace, startFrom, word.length, successCallback);
				break;
			}
		}
		if (!foundHappened) {
			// No word has been found, call the callback, without param
			successCallback(this.lastChar);
		}
	}


	/**
     * @typedef {Object} RailingChars
     * @property {Number} len  - Length to show how much did we walked in each direction to either reach to border or whiteSpace
     * @property {String} chars - String which shows which chars did we found
     */

	/**
     * @return {RailingChars}
     * @param {Number} y - Index of row in matrix
     * @param {Number} x - Index of column in matrix
     * @param {String} direction to search for strings in matrix from x,y point can have any of these values: L|R|T|D
     */
	_getRailingChars(y, x, direction) {
		let railingChars='';// Found characters in each directions
		let len=0;// Determines how much did we move in each direction to get to space or end of direction

		let i=1;// it is just the iterator in loops
		switch (direction) {
		case 'R':
			// Go in Right direction
			// i starts with 1 because we dont want the current character
			// This loop will go to right until it reaches the border OR next character is ' '
			// Rest of cases are just like this method but with differnt direction
			// from=1+x;
			for (i=1; i+x<this.width && this.isNotEmpty(y, i+x); i++) {
				railingChars+=this.matrix[y][i+x];
				len++;
			}
			break;
		case 'L':
			for (i=1; x-i>=0 && this.isNotEmpty(y, x-i); i++) {
				railingChars=this.matrix[y][x-i] + railingChars;
				len++;
			}
			break;
		case 'T':
			for (i=1; y-i>=0 && this.isNotEmpty(y-i, x); i++) {
				railingChars+=this.matrix[y-i][x];
				len++;
			}
			break;
		case 'D':
			for (i=1; y+i<this.height && this.isNotEmpty(y+i, x); i++) {
				railingChars+=this.matrix[y+i][x];
				len++;
			}
			break;
		}

		return {
			chars: railingChars,
			len
		};
	}


	/**
     * @typedef {Object} CheckTypes - An object representing in which direction should function search for words
     * @property {Boolean} rtl - Determines if should check Right To Left direction
     * @property {Boolean} ltr - Determines if should check Left To Right direction
     * @property {Boolean} ttd - Determines if should check Top To Down direction
     * @property {Boolean} dtt - Determines if should check Down To Top direction
     */

	/**
     * Delete characters from matrix
     * @param rowId {Number} - Row id of last checking character in matrix
     * @param colId {Number} - col id of last checking character in matrix
     * @param wordId {Number} - Id of founded word
     * @param checkType {CheckTypes} - An checkType Object to find direction
     * @param occurancePositionFrom {Number} - Start position of word
     * @param occurancePositionLenght {Number} - Length of word
     * @param successCallBack {Function} - Function to callback when foundWord and Falling words has been found
     */
	_deleteCharacters(rowId, colId, wordId, checkType, occurancePositionFrom, occurancePositionLenght, successCallBack) {
		// Determines if we need to store date to call the callback function if it exists
		const hasCallback = Helper.isFunction(successCallBack);


		const callbackObject = {
			wordId,
			wordCharacterPositions: [], // Array of {x,y}
			fallingCharacters: new MapStack(), // Array of {oldX,oldY,newX,newY}
			direction: Object.keys(checkType)[0]
		};

		if (checkType.ltr) {
			// Clear characters in matrix
			for (let c=0, i = occurancePositionFrom; i<occurancePositionFrom+occurancePositionLenght; i++, c++) {
				this.fastDeleteCharacter(rowId, i);
				if (hasCallback) {
					callbackObject.wordCharacterPositions.push({ y: rowId, x: i });
				}

				// Move upper blocks to bottom
				for (let upIndex=rowId; this.isNotEmpty(upIndex-1, i) && upIndex>=0; upIndex--) {
					this.matrix[upIndex][i] = this.matrix[upIndex-1][i];
					this.fastDeleteCharacter(upIndex-1, i);
					if (hasCallback) {
						callbackObject.fallingCharacters.append(i, { x: i, oldY: upIndex-1, newY: upIndex });
					}
				}
			}
		} else if (checkType.rtl) {
			// Clear characters in matrix
			for (let c=0, i=occurancePositionFrom; i>occurancePositionFrom-occurancePositionLenght; --i, ++c) {
				this.fastDeleteCharacter(rowId, i);
				if (hasCallback) {
					callbackObject.wordCharacterPositions.push({ y: rowId, x: i });
				}


				// Move upper blocks to bottom
				for (let upIndex=rowId; this.isNotEmpty(upIndex-1, i) && upIndex>=0; upIndex--) {
					this.matrix[upIndex][i] = this.matrix[upIndex-1][i];
					this.fastDeleteCharacter(upIndex-1, i);
					if (hasCallback) {
						callbackObject.fallingCharacters.append(i, { x: i, oldY: upIndex-1, newY: upIndex });
					}
				}
			}
		} else if (checkType.ttd) {
			for (let c=0, i = occurancePositionFrom; i<occurancePositionFrom+occurancePositionLenght; i++, c++) {
				this.fastDeleteCharacter(i, colId);
				if (hasCallback) {
					callbackObject.wordCharacterPositions.push({ y: i, x: colId });
				}
			}

			// Move upper blocks to bottom
			for (let upIndex=occurancePositionFrom-occurancePositionLenght; upIndex>0 && this.isNotEmpty(upIndex-1, colId); upIndex--) {
				this.matrix[upIndex+occurancePositionLenght-1][colId] = this.matrix[upIndex-1][colId];
				this.fastDeleteCharacter(upIndex-1, colId);
				if (hasCallback) {
					callbackObject.fallingCharacters.append(colId, { x: colId, oldY: upIndex-1, newY: upIndex+occurancePositionLenght-1 });
				}
			}
		} else if (checkType.dtt) {
			for (let c=0, i=occurancePositionFrom; i>occurancePositionFrom-occurancePositionLenght; --i, ++c) {
				this.fastDeleteCharacter(i, colId);
				if (hasCallback) {
					callbackObject.wordCharacterPositions.push({ y: i, x: colId });
				}
			}


			// Move upper blocks to bottom
			for (let upIndex=occurancePositionFrom; upIndex-occurancePositionLenght>=0 &&this.isNotEmpty(upIndex-occurancePositionLenght, colId); upIndex--) {
				this.matrix[upIndex-occurancePositionLenght][colId] = this.matrix[upIndex][colId];
				this.fastDeleteCharacter(upIndex, colId);
				if (hasCallback) {
					callbackObject.fallingCharacters.append(colId, { x: colId, oldY: upIndex, newY: upIndex-occurancePositionLenght });
				}
			}
		}

		successCallBack(this.lastChar, callbackObject);
	}


	/**
     * Explodes area near a bomb character
     * @param rowID {Number} - Row id of bomb
     * @param colID {Number} - Column id of bomb
     * @param power {Number} - Power of bomb to explode chars near it
     * @param successCallBack {function} - Callback function
     */
	_explode(rowID, colID, power, successCallBack) {
		const callbackObject = {
			explodedChars: [{ y: rowID, x: colID }],
			fallingCharacters: new MapStack()
		};

		for (let startX = -power, xPos=colID+startX; startX <= power && xPos < this.width; startX++, xPos++) {
			let firstNonEmptyCharacterOnTopYIndex = IS_NOT_VALID;
			if (this.isValidPosition(rowID-power-1, xPos) && this.isNotEmpty(rowID-power-1, xPos)) {
				firstNonEmptyCharacterOnTopYIndex = rowID-power-1;
			}

			for (let startY = -power, yPos = startY+rowID; startY <= power && yPos < this.height; startY++, yPos++) {
				// if(xPos===colID)
				//     continue; // This block is where bomb has been placed, So we should check it's Ups
				const characterDeleteResult = this.safeDeleteCharacter(yPos, xPos);

				if (characterDeleteResult === IS_OK) {
					// Add Deleted chars
					callbackObject.explodedChars.push({ y: yPos, x: xPos });
				}
				if (startY === power || yPos+1 === this.height) { // Last Row
					if (firstNonEmptyCharacterOnTopYIndex === IS_NOT_VALID) {
						break;
					}
					// We've reached end of columns
					// Move upper blocks to Bottom
					// callbackObject.fallDownCharacters.push()
					const occurancePositionLenght = yPos - firstNonEmptyCharacterOnTopYIndex;
					for (let upIndex=yPos; upIndex-occurancePositionLenght>=0 && this.isNotEmpty(upIndex-occurancePositionLenght, xPos); upIndex--) {
						this.matrix[upIndex][xPos] = this.matrix[upIndex-occurancePositionLenght][xPos];
						this.fastDeleteCharacter(upIndex-occurancePositionLenght, xPos);
						callbackObject.fallingCharacters.append(xPos, { x: xPos, oldY: upIndex-occurancePositionLenght, newY: upIndex });
					}
					break;
				}
			}
		}


		successCallBack(this.lastChar, callbackObject);
	}
}
