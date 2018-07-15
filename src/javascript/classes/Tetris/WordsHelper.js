/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Helper from '../Helper';
import Sound from '../Sound';


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
        value.word = value.word.replace(/[^\u4e00-\u9fff\u3400-\u4dff\uf900-\ufaffA-Za-zآابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/g, '');

        // use lower case of characters
        if (TetrisGame.config.useLowercase) {
            value.word = value.word.toLowerCase();
        }


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
    static giveMeABomb(size){
        Helper.log(`BombSize: ${size}`)
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
        let choosedChar,
            initValues = TetrisGame.initValues;


        console.log(TetrisGame.config.level );
        if(TetrisGame.config.level === 1){
            if (Math.random() > 0.85){
                let roll = Helper.getRandomInt(0,20);
                let bombSize=1;
                if(roll===20){
                    bombSize=3;
                }else if(roll>=16){
                    bombSize=2;
                }
                return WordsHelper.giveMeABomb(bombSize);
            }
        }else if(TetrisGame.config.level=== 2){
            if (Math.random() > 0.90){
                let roll = Helper.getRandomInt(0,20);
                let bombSize=1;
                if(roll>=19){
                    bombSize=2;
                }
                return WordsHelper.giveMeABomb(bombSize);
            }
        }else if(TetrisGame.config.level=== 3){
            if (Math.random() > 0.96){
                let roll = Helper.getRandomInt(0,20);
                let bombSize=1;
                if(roll===20){
                    bombSize=2;
                }
                return WordsHelper.giveMeABomb(bombSize);
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
                TetrisGame._AddCurrentWord(TetrisGame.initValues.choosedWords.push(newWord)-1);
                return this.chooseChar();
            }
        } else {
            choosedChar = availableChars[Math.random() * availableChars.length << 0];
            TetrisGame.initValues.choosedWordsUsedChars.push(choosedChar);

            return choosedChar;
        }
    }
}
