/**
 * @module
 */

import Timeout from './Timeout';

/**
 *  @class
 *  Explosion
 *  Animate explosion when found word
 */
export default class Explosion {
	/**
	 * Create canvas on given element x and y
	 * then render it to display a magical
	 * explosion effect
	 *
	 * @param element
	 * @param x
	 * @param y
	 */
	static explode(element, x, y) {
		const bubbles = 10;

		const c = document.createElement('canvas');
		const ctx = c.getContext('2d');
		const ratio = window.devicePixelRatio;
		const particles = [];

		element.appendChild(c);

		c.style.position = 'absolute';
		c.style.left = `${x - 50}px`;
		c.style.top = `${y - 50}px`;
		c.style.pointerEvents = 'none';
		c.style.width = `${100}px`;
		c.style.height = `${100}px`;
		c.width = 200 * ratio;
		c.height = 200 * ratio;


		for (let i=0; ++i<bubbles;) {
			particles.push(this._particle(c));
		}


		(function renderLoop() {
			requestAnimationFrame(renderLoop);
			Explosion._render(particles, ctx, c);
		}());

		Timeout.request(
			() => {
				if (c.parentElement === element) {
					element.removeChild(c);
				}
			}, 200
		);
	}


	/**
	 * Create particles of our explosion
	 * @param c
	 * @return {{x: number, y: number, radius: *, color: string, rotation: *, speed: *, friction: number, opacity: *, yVel: number, gravity: number}}
	 * @private
	 */
	static _particle(c) {
		const r = function(a, b, c) {
			return parseFloat(
				((Math.random()*((a?a:1)-(b?b:0))) + (b?b:0)).toFixed(c?c:0)
			);
		};

		return {
			x: c.width / 2,
			y: c.height / 2,
			radius: r(20, 30),
			color: `rgb(${[r(0, 255), r(0, 255), r(0, 255)].join(',')})`,
			rotation: r(0, 360, true),
			speed: r(8, 12),
			friction: 0.9,
			opacity: r(0, 0.5, true),
			yVel: 0,
			gravity: 0.1
		};
	}


	/**
	 * Render particles explosion on canvas
	 * @param particles
	 * @param ctx
	 * @param c
	 * @private
	 */
	static _render(particles, ctx, c) {
		ctx.clearRect(0, 0, c.width, c.height);

		particles.forEach(p => {
			Explosion._moveOnAngle(p, p.speed);

			p.opacity -= 0.01;
			p.speed *= p.friction;
			p.radius *= p.friction;

			p.yVel += p.gravity;
			p.y += p.yVel;

			if (p.opacity < 0) return;
			if (p.radius < 0) return;

			ctx.beginPath();
			ctx.globalAlpha = p.opacity;
			ctx.fillStyle = p.color;
			ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
			ctx.fill();
		});
	}


	/**
	 * Gets one of frames distance
	 * @param t
	 * @param n
	 * @return {{x: number, y: number}}
	 * @private
	 */
	static _getOneFrameDistance(t, n) {
		return {
			x: n * Math.cos(t.rotation * Math.PI / 180),
			y: n * Math.sin(t.rotation * Math.PI / 180)
		};
	}

	/**
	 * Move angle
	 * @param t
	 * @param n
	 * @private
	 */
	static _moveOnAngle(t, n) {
		const a = this._getOneFrameDistance(t, n);
		t.x += a.x;
		t.y += a.y;
	}
}
