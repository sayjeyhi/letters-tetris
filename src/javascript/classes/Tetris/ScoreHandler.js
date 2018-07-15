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
			buttons: [
				{
					text: lang.saveScore,
					isOk: true,
					onclick() {
						new Modal({
							animate: config.useAnimationFlag,
							dark: (config.level === 3),
							header: lang.saveOperation,
							content: lang.saveOperationDone
						}, lang.rtl).show();


						const submitted = ScoreHandler.getSubmitted();
						const saveInfo = {};
						saveInfo.userName = Helper._('#enterName', submitScore.modal).value;
						saveInfo.score = showScore;
						saveInfo.time = gamingTime;

						submitted.push(saveInfo);
						Storage.set('scores', submitted);
						submitScore.destroy();
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
     * Get submitted scores
     * @return {string|*}
     */
	static getSubmitted() {
		return Storage.get('scores', []);
	}
}
