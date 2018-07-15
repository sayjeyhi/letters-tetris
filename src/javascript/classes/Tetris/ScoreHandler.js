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
						let submitted = ScoreHandler.getSubmitted();
						const saveInfo = {};
						saveInfo.userName = Helper._('#enterName', submitScore.modal).value;
						saveInfo.score = showScore;
						saveInfo.time = gamingTime;

						// we just hold 10 last scores
                        submitted = submitted.slice(Math.max(submitted.length - 9, 1));
						submitted.push(saveInfo);
						Storage.setObject('scores', submitted);
						submitScore.destroy();


						// show success message
                        const submitScoreResult = new Modal({
                            animate: config.useAnimationFlag,
                            dark: (config.level === 3),
                            onShow: () => {
                                Timeout.request(() => {submitScoreResult.destroy()} , 2000)
                            },
                            header: lang.saveOperation,
                            content: lang.saveOperationDone
                        }, lang.rtl);
                        submitScoreResult.show();

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
        const submitted = ScoreHandler.getSubmitted('sort');



        let content = `<div class="scoresTable">`;
        submitted.forEach((item) => {
            content += `<div class="scoreRow">
                <div class="userName">${item.userName}</div>
                <div class="scoreAmount">${item.score}</div>
                <div class="timeValue">${item.time}</div>
            </div>`;
        });
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
     * Get submitted scores
     * @param sort
     * @return {string|*}
     */
	static getSubmitted(sort) {
		let scores = Storage.getObject('scores', []);
		if(sort){
		    scores.sort((a, b) => {
                return parseInt(b.score) - parseInt(a.score);
            });
        }

        return scores;
	}
}
