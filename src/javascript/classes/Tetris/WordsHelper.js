/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Helper from '../Helper';


// We'll use this weighted random generator to generate Special characters based on level
const RANDOM_GENERATOR = {
	LEVEL1: {
		type: Helper.weightedRand({
			'star':	0.11,
			'bomb':	0.05,
			'skull':	0.03,
			'regular':	0.81
		}),
		bombSize: Helper.weightedRand({
			'1':	0.8,
			'2':	0.2
		}),
		skullSize: Helper.weightedRand({
			'1':	0.7,
			'2':	0.3
		})
	},
	LEVEL2: {
		type:	Helper.weightedRand({
			'star':	0.05,
			'bomb':	0.03,
			'skull':	0.04,
			'regular':	0.88
		}),
		bombSize: Helper.weightedRand({
			'1':	0.95,
			'2':	0.05
		}),
		skullSize: Helper.weightedRand({
			'1':	0.2,
			'2':	0.6,
			'3':	0.2
		})
	},
	LEVEL3: {
		type: Helper.weightedRand({
			'star':	0.02,
			'bomb':	0.02,
			'skull':	0.08,
			'regular':	0.88
		}),
		bombSize: Helper.weightedRand({
			'1':	0.98,
			'2':	0.02
		}),
		skullSize: Helper.weightedRand({
			'2':	0.5,
			'3':	0.3,
			'4':	0.2
		})
	}
};


/**
 * @class Words Helper to choose word and char
 */
export default class WordsHelper {


	/**
	 * Decides if next Char should be Special character and it's attributes based on level
	 * @param level
	 * @returns {*}
	 */
	static getSpecial(level) {
		const levelGenerator	= RANDOM_GENERATOR[`LEVEL${level}`];
		const type				= levelGenerator.type();
		if (type==='regular') return 'regular';
		switch (type) {
		case 'star':
			return WordsHelper.giveMeAnStar();
		case 'bomb':
			return WordsHelper.giveMeABomb(levelGenerator.bombSize());
		case 'skull':
			return WordsHelper.giveMeAnSkull(levelGenerator.skullSize());
		}
	}


	/**
	 * Choose random words in game build to work with
	 */
	static chooseWord() {
		const initValues = TetrisGame.initValues;
		const key = initValues.comingWordIndex;
		const value = window.TetrisWords[key] || '';


		// do we finished words ?
		if (value === '') {
			if (initValues.choosedWords.length === 0) {
				initValues.wordsFinished = true;
			}
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
		let choosedWord, choosedChar;

		if (config.enable_special_characters) {
			// Dont bomb empty field :|
			if (TetrisGame.matrix.filledCharacters > 1) {
				const decider = WordsHelper.getSpecial(config.level);
				if(decider !== 'regular'){
					return decider;
				}
			}
		}


		for (let w = 0; w < initValues.choosedWords.length; w++) {
			if (!initValues.choosedWords[w].finished) {
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
			console.log('reset sdasdasd !!!!');

			// reset user chars for this word
			TetrisGame.initValues.choosedWordsUsedChars = [];

			// get new word and show it
			const newWord = this.chooseWord();
			if (newWord !== false) {
				TetrisGame.showShuffledWords();
				return this.chooseChar();
			}
		} else {
			choosedChar = availableChars.split('').sort(() => { return 0.5 - Math.random(); }).pop();
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
		Helper.log('An Start is coming');
		const starCharacter = document.createElement('i');
		starCharacter.className = 'star animated icon-star';
		starCharacter.type = 'star';
		starCharacter.special = 'true';
		return starCharacter;
	}
}
