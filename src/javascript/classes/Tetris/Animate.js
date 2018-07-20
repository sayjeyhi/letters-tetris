/**
 * @module
 */

import TetrisGame from './TetrisGame';
import Charblock from './Charblock';
import Timeout from '../Timeout';
import Sound from '../Sound';
// import Helper from './Helper';
import Explosion from '../Explosion';
import Helper from '../Helper';

/**
 *  @class
 *  Explosion
 *  Animate explosion when found word
 */
export default class Animate {
	/**
	 * Fall node with animation
	 * @param oldRow {Number}
	 * @param oldColumn {Number}
	 * @param newRow {Number}
	 * @param newColumn {Number}
	 */
	static fallNodeAnimate(oldRow, oldColumn, newRow, newColumn) {
		const animateConfig = TetrisGame.initValues.animateConfig;
		const deleteTiming = animateConfig.deleteTiming;
		const domToDelete = Charblock._getEl(oldRow, oldColumn, true);
		if (!domToDelete || typeof domToDelete ==='undefined') return false;
		const gameConfig = TetrisGame.config;
		const oldChar = domToDelete.innerHTML;
		const oldColor = domToDelete.style.backgroundColor;
		// const oldType = domToDelete.dataset.type || 'regualar';
		const domParent = domToDelete.parentNode;
		const isFallingDown = (newRow !== null && newColumn !== null);

		if (gameConfig.useAnimationFlag) {
			const animateClass = animateConfig.animateClass;
			domToDelete.classList.add(animateClass, isFallingDown ? 'fadeOutDown' : 'zoomOutDown');

			// create explosion effect
			if (!isFallingDown) {
				Explosion.explode(domParent, 35, 10);
			}
		}


		Timeout.request(
			() => {
				if (domToDelete.parentElement === domParent) domParent.removeChild(domToDelete);
			}, deleteTiming
		);


		// animate up char to down
		if (isFallingDown) {
			Charblock.factory(
				{
					color: oldColor,
					char: oldChar,
					type: 'regualar',
					animateInClass: 'fadeInDown'
				}, Charblock._getEl(newRow, newColumn)
			);
		}
	}


	/**
	 * Animate found characters
	 * @param wordCharacterPositions
	 * @param successAnimationIterationDuration
	 */
	static animateFoundedCharacters(wordCharacterPositions, successAnimationIterationDuration) {
		// play founded word sound
		Sound.playByKey('foundWord', TetrisGame.config.playEventsSound);

		// Animate FadingOut founded characters
		wordCharacterPositions.map((item, index) => {
			Timeout.request(
				() => {
					Animate.fallNodeAnimate(item.y, item.x, null, null);
				}, index * successAnimationIterationDuration
			);
		});
	}

	/**
	 * Animate fall characters
	 * @param fallingCharacters
	 * @param successAnimationIterationDuration
	 * @param after
	 */
	static animateFallCharacters(fallingCharacters, successAnimationIterationDuration, after) {
		let index = 0;
		for (const [_, value] of fallingCharacters.entries()) {
			for (const item of value) {
				Timeout.request(
					() => {
						Animate.fallNodeAnimate(item.oldY, item.x, item.newY, item.x);
					}, (index++) * successAnimationIterationDuration
				);
			}
		}

		if (Helper.isFunction(after)) {
			Timeout.request(after, ((index-1)*(successAnimationIterationDuration)) + TetrisGame.initValues.animateConfig.deleteTiming);
		}
	}


	/**
	 * This function will shake a Dom
	 * @param element {HTMLElement} - Dom to shake
	 * @param magnitude {Number} [16] - magnitude of earthquake
	 * @param angular {Boolean} [false] - angular of shaking
	 */
	static shake(element, magnitude = 16, angular = false) {
		const shakingElements = [];

		// First set the initial tilt angle to the right (+1)
		let tiltAngle = 1;

		// A counter to count the number of shakes
		let counter = 1;

		// The total number of shakes (there will be 1 shake per frame)
		const numberOfShakes = 15;

		// Capture the element's position and angle so you can
		// restore them after the shaking has finished
		const startX = 0,
			startY = 0,
			startAngle = 0;

		// Divide the magnitude into 10 units so that you can
		// reduce the amount of shake by 10 percent each frame
		const magnitudeUnit = magnitude / numberOfShakes;

		// The `randomInt` helper function
		const randomInt = (min, max) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		// The `upAndDownShake` function
		const upAndDownShake= () => {
			// Shake the element while the `counter` is less than
			// the `numberOfShakes`
			if (counter < numberOfShakes) {
				// Reset the element's position at the start of each shake
				element.style.transform = `translate(${startX}px, ${startY}px)`;

				// Reduce the magnitude
				magnitude -= magnitudeUnit;

				// Randomly change the element's position
				const randomX = randomInt(-magnitude, magnitude);
				const randomY = randomInt(-magnitude, magnitude);

				element.style.transform = `translate(${randomX}px, ${randomY}px)`;

				// Add 1 to the counter
				counter += 1;

				requestAnimationFrame(upAndDownShake);
			}

			// When the shaking is finished, restore the element to its original
			// position and remove it from the `shakingElements` array
			if (counter >= numberOfShakes) {
				element.style.transform = `translate(${startX}, ${startY})`;
				shakingElements.splice(shakingElements.indexOf(element), 1);
			}
		};

		// The `angularShake` function
		const angularShake = () => {
			if (counter < numberOfShakes) {
				console.log(tiltAngle);
				// Reset the element's rotation
				element.style.transform = `rotate(${startAngle}deg)`;

				// Reduce the magnitude
				magnitude -= magnitudeUnit;

				// Rotate the element left or right, depending on the direction,
				// by an amount in radians that matches the magnitude
				const angle = Number(magnitude * tiltAngle).toFixed(2);
				console.log(angle);
				element.style.transform = `rotate(${angle}deg)`;
				counter += 1;

				// Reverse the tilt angle so that the element is tilted
				// in the opposite direction for the next shake
				tiltAngle *= -1;

				requestAnimationFrame(angularShake);
			}

			// When the shaking is finished, reset the element's angle and
			// remove it from the `shakingElements` array
			if (counter >= numberOfShakes) {
				element.style.transform = `rotate(${startAngle}deg)`;
				shakingElements.splice(shakingElements.indexOf(element), 1);
				// console.log("removed")
			}
		};
		// Add the element to the `shakingElements` array if it
		// isn't already there
		if (shakingElements.indexOf(element) === -1) {
			// console.log("added")
			shakingElements.push(element);

			// Add an `updateShake` method to the element.
			// The `updateShake` method will be called each frame
			// in the game loop. The shake effect type can be either
			// up and down (x/y shaking) or angular (rotational shaking).
			if (angular) {
				angularShake();
			} else {
				upAndDownShake();
			}
		}
	}


	/**
	 * Shows found word with animation
	 * @param word
	 * @param positions
	 */
	static showFoundWordAnimated(word, positions) {
		const charLength = positions.length - 1,
			rowAverage = (positions[0].y + positions[charLength].y) / 2,
			columnAverage = (positions[0].x + positions[charLength].x) / 2,
			hidedWord = Charblock.getBlockPosition(parseInt(rowAverage), parseInt(columnAverage)),
			foundWordDisplayEl = Helper._('.foundWordAnimation', TetrisGame.playBoard),
			fixerDistance = (charLength % 2 === 1) ? 0 : (hidedWord.width/4) * -1;

		console.log(`want to show : ${word} - show place : ${rowAverage} - ${columnAverage}`);

		foundWordDisplayEl.innerHTML = word;
		foundWordDisplayEl.style.display = 'block';
		foundWordDisplayEl.style.left = `${hidedWord.left - fixerDistance}px`;
		foundWordDisplayEl.style.top = `${hidedWord.top - 10}px`;

		if (TetrisGame.config.useAnimationFlag) {
			foundWordDisplayEl.classList.add('animatedOneSecond', 'jackInTheBox');
		} else {
			foundWordDisplayEl.classList.remove('animatedOneSecond', 'jackInTheBox');
		}

		Timeout.request(
			() => {
				foundWordDisplayEl.style.display = 'none';
			}, 1200
		);
	}
}
