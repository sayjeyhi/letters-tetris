/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Helper from '../Helper';
import Animate from './Animate';
import Explosion from '../Explosion';


/**
 * @class Words Helper to choose word and char
 */
export default class WordsHelper {
	/**
	 * Choose random words in game build to work with
	 */
	static chooseWord() {

		const initValues = TetrisGame.initValues;
		const key = initValues.comingWordIndex;
		const value = window.TetrisWords[key] || '';



		// do we finished words ?
		if (value === '') {
			initValues.wordsFinished = true;
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
		initValues.choosedWords.push(value);

		TetrisGame.showShuffledWords();

		initValues.comingWordIndex++;

		Helper.log(value);
		return value;
	}


	/**
	 * Choose a char of choosed words
	 */
	static chooseChar() {
		const initValues	= TetrisGame.initValues;
		const config		= TetrisGame.config;
		let choosedWord,choosedChar;

		if (config.enable_special_characters) {
			// Dont bomb empty field :|
			if (TetrisGame.matrix.filledCharacters > 1) {

				//TODO: Create a clear random method for this shit :|
				const randRange100 = Helper.getRandomInt(0, 100);
				if (config.level === 1) {
					if (randRange100 > 90) {
						const roll = Helper.getRandomInt(0, 20);
						let bombSize=1;
						if (roll===20) {
							bombSize=3;
						} else if (roll>=16) {
							bombSize=2;
						}
						return WordsHelper.giveMeABomb(bombSize);
					} else if (randRange100 > 85) {
						return WordsHelper.giveMeAnSkull(Helper.getRandomInt(1, 3));
					} else if (randRange100 > 50) {
						return WordsHelper.giveMeAnStar();
					}
				} else if (config.level=== 2) {
					if (randRange100 > 93) {
						const roll = Helper.getRandomInt(0, 20);
						let bombSize=1;
						if (roll >= 19) {
							bombSize=2;
						}
						return WordsHelper.giveMeABomb(bombSize);
					} else if (randRange100 > 87) {
						return WordsHelper.giveMeAnSkull(Helper.getRandomInt(1, 3));
					}
				} else if (config.level=== 3) {
					if (randRange100 > 96) {
						const roll = Helper.getRandomInt(0, 20);
						let bombSize=1;
						if (roll === 20) {
							bombSize = 2;
						}
						return WordsHelper.giveMeABomb(bombSize);
					} else if (randRange100 > 85) {
						return WordsHelper.giveMeAnSkull(Helper.getRandomInt(1, 3));
					}
				}
			}
		}


		for(let w = 0 ; w < initValues.choosedWords.length;w++) {
			if(!initValues.choosedWords[w].finished){
				choosedWord = initValues.choosedWords[w];
				break;
			}
		}

		let availableChars = choosedWord.word || '';

		// remove used chars for this choosed word
		initValues.choosedWordsUsedChars.forEach(value => {
			availableChars = availableChars.replace(value, '');
		});

		if (availableChars.length === 0) {

			console.log("reset sdasdasd !!!!");

			// reset user chars for this word
			TetrisGame.initValues.choosedWordsUsedChars = [];

			// get new word and show it
			const newWord = this.chooseWord();
			if (newWord !== false) {
				TetrisGame.showShuffledWords();
				return this.chooseChar();
			}

		} else {
			choosedChar = availableChars.split('').sort(() => {return 0.5 - Math.random()}).pop();
			TetrisGame.initValues.choosedWordsUsedChars.push(choosedChar);

			return choosedChar;
		}
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
		bombCharacter.dataset.size = size.toString();
		bombCharacter.typeSize = size;
		bombCharacter.type = 'bomb';
		bombCharacter.special = 'true';
		return bombCharacter;
	}


	/**
	 * Gives us an skull character
	 * @param clickCount
	 * @return {HTMLElement}
	 */
	static giveMeAnSkull(clickCount) {
		Helper.log(`Skull click needs: ${clickCount}`);
		const skullCharacter = document.createElement('i');
		skullCharacter.className = 'skull animated icon-skelete';
		skullCharacter.dataset.clicks = clickCount;
		skullCharacter.type = 'skull';
		skullCharacter.special = 'true';
		return skullCharacter;
	}


	/**
	 * Gives us an Start character which matches any thing
	 * @return {HTMLElement}
	 */
	static giveMeAnStar() {
		Helper.log(`An Start is coming`);
		const starCharacter = document.createElement('i');
		starCharacter.className = 'star animated icon-star';
		starCharacter.type = 'star';
		starCharacter.special = 'true';
		return starCharacter;
	}

}
