/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Storage from '../Storage';
import Modal from '../Modal';
import Helper from '../Helper';
import Charblock from "./Charblock";

/**
 * @class Settings to show and set game settings
 */
export default class Settings {
	/**
     * Set settings from localStorage OR settings Object
     * @param settings
     */
	static set(settings) {
		if (typeof settings !== 'undefined') {
			// save setting data
			Storage.set('settings', settings);
		} else {
			settings = this.getDefaultSettings();
		}

		const config = TetrisGame.config;

		config.useAnimationFlag = parseInt(settings.useAnimation) === 1;
		config.playEventsSound = parseInt(settings.eventSounds) === 1;
		config.playBackgroundSound = parseInt(settings.soundPlay) === 1;
		config.showGrids = parseInt(settings.showGrids) === 1;
		config.level = parseInt(settings.gameLevel) || 1;
		config.do_vibrate = parseInt(settings.vibration) === 1;
		config.colorMode = parseInt(settings.colorMode);


		// Apply setting for music
		Settings._setMusicSetting();

		// Apply setting for grids
		Settings._setGridsSetting();

		// Apply setting for level
		Settings._setLevelSetting(settings.gameLevel);

		// set color mode to page
		Settings._setColorMode(config.colorMode);
	}


	/**
     * Show game settings
     */
	static show() {

		console.log(TetrisGame.config);
		// get defined settings
		const settings = this.getDefaultSettings();

		// was game paused already
		const wasPausedFlag = TetrisGame.initValues.paused === true;

		// pause game timer
		if (!wasPausedFlag) {
			TetrisGame.timer.pause();
		}

		// should we animate span ?
		const spanAnimationClass = (TetrisGame.config.useAnimationFlag ? ' animatedSpan' : '');


		// create setting modal content
		const content =
			`<form id="settingForm" class="cssRadio ${spanAnimationClass}">
                <div class="formRow">
                    <div class="formLabel"><i class="icon-sound2"></i> ${window.lang.backgroundMusic}</div>
                    <div class="formData">
                        <input id="soundPlayYes" type="radio" class="soundPlay" name="soundPlay" value="1" ${settings.soundPlay === 1 ? 'checked' : ''} />
                        <label for="soundPlayYes"><span>${window.lang.activeSound}</span></label>
                        <input id="soundPlayNo" type="radio" class="soundPlay" name="soundPlay" value="0" ${settings.soundPlay === 0 ? 'checked' : ''} />
                        <label for="soundPlayNo"><span>${window.lang.deActiveSound}</span></label>
                    </div>
                </div>
                <div class="formRow">
                    <div class="formLabel"><i class="icon-sound1"></i> ${window.lang.eventsMusic}</div>
                    <div class="formData">
                        <input id="eventSoundsYes" type="radio" class="eventSounds" name="eventSounds" value="1" ${settings.eventSounds === 1 ? 'checked' : ''} />
                        <label for="eventSoundsYes"><span>${window.lang.activeSound}</span></label>
                        <input id="eventSoundsNo" type="radio" class="eventSounds" name="eventSounds" value="0" ${settings.eventSounds === 0 ? 'checked' : ''} />
                        <label for="eventSoundsNo"><span>${window.lang.deActiveSound}</span></label>
                    </div>
                </div>
    
                <div class="formRow">
                    <div class="formLabel"><i class="icon-magic"></i> ${window.lang.animation}</div>
                    <div class="formData">
                        <input id="useAnimationYes" type="radio" class="useAnimation" name="useAnimation" value="1" ${settings.useAnimation === 1 ? 'checked' : ''} />
                        <label for="useAnimationYes"><span>${window.lang.active}</span></label>
                        <input id="useAnimationNo" type="radio" class="useAnimation" name="useAnimation" value="0" ${settings.useAnimation === 0 ? 'checked' : ''} />
                        <label for="useAnimationNo"><span>${window.lang.deActive}</span></label>
                    </div>
                </div>
    
                <div class="formRow">
                    <div class="formLabel"><i class="icon-borders"></i> ${window.lang.showGrids}</div>
                    <div class="formData">
                        <input id="showGridsYes" type="radio" class="showGrids" name="showGrids" value="1" ${settings.showGrids === 1 ? 'checked' : ''} />
                        <label for="showGridsYes"><span>${window.lang.active}</span></label>
                        <input id="showGridsNo" type="radio" class="showGrids" name="showGrids" value="0" ${settings.showGrids === 0 ? 'checked' : ''} />
                        <label for="showGridsNo"><span>${window.lang.deActive}</span></label>
                    </div>
                </div>
    
    
                <div class="formRow isVibrateControl">
                    <div class="formLabel"><i class="icon-mobile"></i> ${window.lang.vibration}</div>
                    <div class="formData">
                        <input id="vibrationYes" type="radio" class="vibration" name="vibration" value="1" ${settings.vibration === 1 ? 'checked' : ''} />
                        <label for="vibrationYes"><span>${window.lang.activeVibrate}</span></label>
                        <input id="vibrationNo" type="radio" class="vibration" name="vibration" value="0" ${settings.vibration === 0 ? 'checked' : ''} />
                        <label for="vibrationNo"><span>${window.lang.deActiveVibrate}</span></label>
                    </div>
                </div>
    
    
                <div class="formRow">
                    <div class="formLabel"><i class="icon-colorPelete"></i> ${window.lang.colorMode}</div>
                    <div class="formData">
                        <input id="colorModeDay" type="radio" class="colorMode" name="colorMode" value="0" ${(!settings.colorMode  ? 'checked' : '')} />
                        <label for="colorModeDay"><span>${window.lang.activeDay}</span></label>
                        <input id="colorModeNight" type="radio" class="colorMode" name="colorMode" value="1" ${(settings.colorMode ? 'checked' : '')} />
                        <label for="colorModeNight"><span>${window.lang.activeNight}</span></label>
                    </div>
                </div>
    
                <div class="formRow">
                    <div class="formLabel"><i class="icon-packMan"></i> ${window.lang.gameLevel}</div>
                    <div class="formData">
                        <input id="gameLevelEasy" type="radio" class="gameLevel" name="gameLevel" value="1" ${settings.gameLevel === 1 ? 'checked' : ''} />
                        <label for="gameLevelEasy"><span>${window.lang.simple}</span></label>
                        <input id="gameLevelMedium" type="radio" class="gameLevel" name="gameLevel" value="2" ${settings.gameLevel === 2 ? 'checked' : ''} />
                        <label for="gameLevelMedium"><span>${window.lang.medium}</span></label>
                        <input id="gameLevelExpert" type="radio" class="gameLevel" name="gameLevel" value="3" ${settings.gameLevel === 3 ? 'checked' : ''} />
                        <label for="gameLevelExpert"><span>${window.lang.expert}</span></label>
                    </div>
                </div>
            </form>`;

		// show setting modal
		const settingModal = new Modal({
			animate: TetrisGame.config.useAnimationFlag,
			header: window.lang.settingModalTitle,
			content,
			dark: settings.colorMode,
			onDestroy() {
				if (!wasPausedFlag) {
					// resume timer
					TetrisGame.timer.resume();
				}
			}
		}, window.lang.rtl);
		settingModal.show();


		// changing setting values
		settingModal.modal.querySelectorAll('input').forEach(input => {
			input.onchange = function() {
				// catch data
				const modalItSelf = settingModal.modal;
				const settingForm = Helper._('#settingForm', modalItSelf);
				const settingData = Settings._getIntValue(
					settingForm ,
					['soundPlay' , 'eventSounds' , 'useAnimation' , 'gameLevel' , 'showGrids' , 'vibration' , 'colorMode']
				);

				if (settingData.colorMode === 1) {
					modalItSelf.classList.add('dark');
				} else {
					modalItSelf.classList.remove('dark');
				}

				// apply setting and save it
				Settings.set(settingData);
			};
		});
	}


	/**
	 * Get default settings Or saved settings
	 * @return {any}
	 */
	static getDefaultSettings(){
		const config = TetrisGame.config;

		// get defined settings
		return Storage.getObject('settings', {
			soundPlay: config.playBackgroundSound,
			eventSounds: config.playEventsSound,
			useAnimation: config.useAnimationFlag,
			gameLevel: config.level,
			showGrids: config.showGrids,
			vibration: config.do_vibrate,
			colorMode: config.colorMode
		});
	}


	/**
	 * Get int value of some form elements
	 * @param settingForm
	 * @param names
	 * @return {{}}
	 * @private
	 */
	static _getIntValue(settingForm, names) {

		let settingData = {};
		names.forEach( item => {
			let input = Helper._(`.${item}:checked`, settingForm);
			settingData[item] = (input ? parseInt(input.value) : 0);
		});
		return settingData;
	}


	/**
     * Pause/play background music
     * @private
     */
	static _setMusicSetting() {
		if (!TetrisGame.config.playBackgroundSound) {
			TetrisGame.initValues.bgSound.pause();
		} else {
			TetrisGame.initValues.bgSound.play();
		}
	}


	/**
     * Manage grids on play board
     * @private
     */
	static _setGridsSetting() {
		const playBoard = TetrisGame.playBoard;
		if (playBoard) {
			if (TetrisGame.config.showGrids) {
				playBoard.classList.add('showGrids');
			} else {
				playBoard.classList.remove('showGrids');
			}
		}
	}


	/**
     * Add level class to body AND do staffs about leveling
     * @param gameLevel
     * @private
     */
	static _setLevelSetting(gameLevel) {
		let bodyClass = '';
		let config = TetrisGame.config;

		// update interval speed
		TetrisGame.interval.update(Charblock.getInterval());

		switch (gameLevel) {
		case 3:
			bodyClass = 'isExpert';

			// use two word same time at hard mode
			config.workingWordCount = 2;

			// Update animation timing and delete timing
			TetrisGame.initValues.animateConfig = {
				animateClass: 'fallDownExpert',
				deleteTiming: config.expertFallDownAnimateSpeed
			};

			break;
		case 2:
			bodyClass = 'isMedium';

			TetrisGame.initValues.animateConfig = {
				animateClass: 'fallDownCharMedium',
				deleteTiming: config.mediumFallDownAnimateSpeed
			};
			break;
		default:
			bodyClass = 'isSimple';

			TetrisGame.initValues.animateConfig = {
				animateClass: 'fallDownSimple',
				deleteTiming: config.simpleFallDownAnimateSpeed
			};
		}
		document.body.classList.remove('isExpert', 'isMedium', 'isSimple');
		document.body.classList.add(bodyClass);
	}


	/**
	 * Set color mode to page
	 * @param isNight
	 * @private
	 */
	static _setColorMode(isNight){
		if(isNight){
			document.body.classList.add("isNightMode");
		}else{
			document.body.classList.remove("isNightMode");
		}
	}
}
