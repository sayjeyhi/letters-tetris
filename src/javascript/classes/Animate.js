/**
 * @module
 */

import TetrisGame from './Tetris/TetrisGame';
import Charblock from './Tetris/Charblock';
import Timeout from './Timeout';
import Sound from './Sound';
// import Helper from './Helper';
import Explosion from './Explosion';

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
        const oldChar = domToDelete.innerText;
        const oldColor = domToDelete.style.backgroundColor;
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
                    type: 'regular',
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
    static _animateFoundedCharacters(wordCharacterPositions, successAnimationIterationDuration) {
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
}
