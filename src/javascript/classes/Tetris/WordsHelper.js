/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Helper from '../Helper';


/**
 * @class Words Helper to choose word and char
 */
export default class WordsHelper {
	/**
	 * Choose random words in game build to work with
	 */
	static chooseWord() {
		const keys = Object.keys(window.TetrisWords);
		const randomKey = keys[keys.length * Math.random() << 0];
		const value = window.TetrisWords[randomKey] || '';

		// do we finished words ?
		if (value === '') {
			TetrisGame.initValues.wordsFinished = true;
			return false;
		}

		// normalize word chars
		if (window.lang.name === 'ja') {
			value.word = value.word.replace(/[\x00-\x7F]/g, '');
		} else {
			value.word = value.word.replace(/[^A-Za-zآابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/g, '');
		}

		// use lower case of characters
		if (TetrisGame.config.useLowercase) {
			value.word = value.word.toLowerCase();
		}


		// add word to active words array
		TetrisGame.initValues.choosedWords.push(value);

		Helper.log(value);

		// delete choosed word form list
		delete window.TetrisWords[randomKey];
		return value;
	}


	/**
	 * Be careful! It'll give you a bomb
	 * @param size {Number} - size of bomb
	 * @returns {HTMLImageElement} (Actually it's a bomb)
	 */
	static giveMeABomb(size) {
		Helper.log(`BombSize: ${size}`);
		const bombCharacter = document.createElement('img');
		bombCharacter.src = '/assets/img/bomb.gif';
		bombCharacter.className = 'bomb';
		bombCharacter.type = 'bomb';
		bombCharacter.typeSize = size;
		bombCharacter.special = 'true';
		return bombCharacter;
	}


	/**
	 * Choose a char of choosed words
	 */
	static chooseChar() {
		let choosedChar;
		const initValues	= TetrisGame.initValues;
		const config		= TetrisGame.config;
		if (config.enable_bomb) {
			// Dont bomb empty field :|
			if (TetrisGame.matrix.filledCharacters > 0) {
				if (config.level === 1) {
					if (Math.random() > 0.85) {
						const roll = Helper.getRandomInt(0, 20);
						let bombSize=1;
						if (roll===20) {
							bombSize=3;
						} else if (roll>=16) {
							bombSize=2;
						}
						return WordsHelper.giveMeABomb(bombSize);
					}
				} else if (config.level=== 2) {
					if (Math.random() > 0.90) {
						const roll = Helper.getRandomInt(0, 20);
						let bombSize=1;
						if (roll>=19) {
							bombSize=2;
						}
						return WordsHelper.giveMeABomb(bombSize);
					}
				} else if (config.level=== 3) {
					if (Math.random() > 0.96) {
						const roll = Helper.getRandomInt(0, 20);
						let bombSize=1;
						if (roll===20) {
							bombSize=2;
						}
						return WordsHelper.giveMeABomb(bombSize);
					}
				}
			}
		}

		let availableChars = initValues.choosedWords.map(e => {
			return e ? e.word : '';
		}).join('');

		initValues.choosedWordsUsedChars.forEach(value => {
			availableChars = availableChars.replace(value, '');
		});

		if (availableChars.length === 0) {
			const newWord = this.chooseWord();
			if (newWord !== false) {
				TetrisGame.showShuffledWords();
				return this.chooseChar();
			}
		} else {
			choosedChar = availableChars[Math.random() * availableChars.length << 0];
			TetrisGame.initValues.choosedWordsUsedChars.push(choosedChar);

			return choosedChar;
		}
	}
}
