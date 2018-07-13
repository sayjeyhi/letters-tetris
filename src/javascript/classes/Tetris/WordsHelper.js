/**
 * @module
 */

/**
 * @class Words Helper to choose word and char
 */


import TetrisGame from "./TetrisGame";
import Helper from "../Helper";

export default class WordsHelper {

    /**
     * Choose random words in game build to work with
     */
    static chooseWord() {
        let keys = Object.keys(window.TetrisWords);
        let randomKey = keys[keys.length * Math.random() << 0];
        let value = window.TetrisWords[randomKey] || "";

        // do we finished words ?
        if (value === "") {
            TetrisGame.initValues.wordsFinished = true;
            return false;
        }

        // normalize word chars
        value.word = value.word.replace(/[^a-zA-Zآ-ی]/g, "");

        // use lower case of characters
        if(TetrisGame.config.useLowercase){
            value.word = value.word.toLowerCase();
        }

        Helper.log(value);

        // delete choosed word form list
        delete window.TetrisWords[randomKey];
        return value;
    }


    /**
     * Choose a char of choosed words
     */
    static chooseChar() {

        let choosedChar,
            initValues = TetrisGame.initValues;

        let availableChars = initValues.choosedWords.map(function (e) {
            return e ? e.word : ""
        }).join('');

        initValues.choosedWordsUsedChars.forEach(function (value) {
            availableChars = availableChars.replace(value, '');
        });

        if (availableChars.length === 0) {
            let newWord = this.chooseWord();
            if (newWord !== false) {
                TetrisGame.initValues.choosedWords.push(newWord);
                return this.chooseChar();
            }
        } else {
            choosedChar = availableChars[Math.random() * availableChars.length << 0];
            TetrisGame.initValues.choosedWordsUsedChars.push(choosedChar);

            return choosedChar;
        }
    }
}
