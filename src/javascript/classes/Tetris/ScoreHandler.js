/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Storage from '../Storage';
import Modal from '../Modal';
import Helper from '../Helper';
import Timeout from '../Timeout';
import Gameplay from './Gameplay';


/**
 * @class Settings to show and set game settings
 */

export default class ScoreHandler {
	/**
     * Display score submiter modal and let user submit his score
     * @param gamingInfo
     * @param showScore
     * @param gamingTime
     */
	static submit(gamingInfo, showScore, gamingTime) {

		const config = TetrisGame.config;
		const submitScoreContent = `
            <div class="submitScore">
                <input type="text" name="enterName" id="enterName" placeholder="${lang.enterName}" />
                ${gamingInfo}
            </div>
        `;

		// show new modal to submit score
		const submitScore = new Modal({
			animate: config.useAnimationFlag,
			dark: (config.level === 3),
			type: 'primary',
			header: lang.submitScore,
			content: submitScoreContent,
            onShow: () => {
			    // focus on name input
			    Helper._("#enterName" , submitScore.modal).focus();
            },
			buttons: [
				{
					text: lang.saveScore,
					isOk: true,
					onclick() {
                        submitScore.destroy();
					    ScoreHandler._saveScore({
                            userName : Helper._('#enterName', submitScore.modal).value || "--",
                            score : showScore ,
                            time : gamingTime
                        });
					}
				}, {
					text: lang.restartGame,
					isOk: true,
					onclick() {
						submitScore.destroy();
						Gameplay.restart();
					}
				}
			]
		}, lang.rtl);

		Timeout.request(
			() => {
				submitScore.show();
			}, 1000
		);
	}


    /**
     * Show scores modal
     */
	static showScores(){
        const config = TetrisGame.config;
        const submitted = ScoreHandler._getSubmitted('sort');

        let content = `<div class="scoresTable">`;
        if(submitted.length > 0) {
            submitted.forEach((item) => {
                content += `<div class="scoreRow">
                <div class="userName">${item.userName}</div>
                <div class="scoreAmount">${item.score}</div>
                <div class="timeValue">${item.time}</div>
            </div>`;
            });
        }else{
            content += `<div class="scoreRow">${lang.noSubmittedScore}</div>`;
        }
        content += `</div>`;

        // show scores list modal
        const submitScore = new Modal({
            animate: config.useAnimationFlag,
            dark: (config.level === 3),
            type: 'info',
            header: lang.last10Record,
            content: content,
            buttons: [
                {
                    text: lang.modalOkButton,
                    isOk: true,
                    onclick() {
                        submitScore.destroy();
                    }
                }
            ]
        }, lang.rtl);
        submitScore.show();
    }


    /**
     * Save user gained score
     * @private
     */
    static _saveScore(scoreData){

        const config = TetrisGame.config;
        let submitted = ScoreHandler._getSubmitted();

        // we just hold 10 last scores
        submitted = submitted.slice(-9);
        submitted.push(scoreData);
        Storage.setObject('scores', submitted);


        // show success message
        const submitScoreResult = new Modal({
            animate: config.useAnimationFlag,
            dark: (config.level === 3),
            onShow: () => {
                Timeout.request(
                    () => {submitScoreResult.destroy()}, 2000
                )
            },
            header: lang.saveOperation,
            content: lang.saveOperationDone
        }, lang.rtl);

        submitScoreResult.show();
    }


	/**
     * Get submitted scores
     * @param sort
     * @return {string|*}
     */
	static _getSubmitted(sort) {
		let scores = Storage.getObject('scores', []);
		if(sort){
		    scores.sort((a, b) => {
                return parseInt(b.score) - parseInt(a.score);
            });
        }

        return scores;
	}



    /**
     * Get score of user from Storage
     * @returns {number}
     */
    static _getScore() {
        let score;
        if (TetrisGame.config.do_encryption) {
            score = Storage.getEncrypted('score', TetrisGame.initValues.encryptionKey);
        } else {
            score = Storage.getInt('score', 0);
        }
        return score;
    }


    /**
     * Updates stats of game
     * @param word
     * @param direction
     */
    static _updateStats(word, direction) {

        let initValues = TetrisGame.initValues;
        // Update stats related to word

        console.log(initValues.wordsLengthTotal);
        if (direction!=='exploded') {
            initValues.wordsFounded++;
            initValues.wordsLengthTotal += word.length;
        }
        console.log(initValues.wordsLengthTotal);
        initValues.wordDirectionCounter[direction]++;
        // console.log(initValues.wordsLengthTotal);

        console.log(initValues.wordsFounded);
        Helper._('.wordCounterHolder').innerHTML = Math.round(initValues.wordsFounded);
    }


    /**
     * Update game score in UI and Data
     * @param word
     * @private
     */
    static _updateScore(word) {

        let initValues = TetrisGame.initValues;

        // Get encrypted value of Score with our random generated key
        let score = ScoreHandler._getScore();

        // Increase value by scoreCalculator from config
        score += TetrisGame.config.scoreCalculator(word);

        // Update our fake score variable to let hacker think they are dealing with real variable
        initValues.score = score;

        // Update & encrypt score in Storage
        if (TetrisGame.config.do_encryption) {
            Storage.setEncrypted('score', score, initValues.encryptionKey);
        } else {
            Storage.set('score', score);
        }
        Helper._('.scoreHolder').innerHTML = Math.round(score);
    }


    /**
     * Update score and set it to panel
     * @param word
     * @param direction
     */
    static _updateScoreAndStats(word, direction) {
        this._updateStats(word, direction);
        this._updateScore(word);
    }

}
