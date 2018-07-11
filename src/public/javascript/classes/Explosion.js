/**
 * @module
 */

/**
 *  @class
 *  Explosion
 *  Animate explosion when found word
 */
export default class Explosion {


    static explode(e) {
        const bubbles = 25;

        let x = e.clientX;
        let y = e.clientY;
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        let ratio = window.devicePixelRatio;
        let particles = [];

        document.body.appendChild(c);

        c.style.position = 'absolute';
        c.style.left = (x - 60) + 'px';
        c.style.top = (y - 60) + 'px';
        c.style.pointerEvents = 'none';
        c.style.width = 120 + 'px';
        c.style.height = 120 + 'px';
        c.width = 200 * ratio;
        c.height = 200 * ratio;


        for(let i=0; ++i<bubbles;) {
            particles.push(this._particle(c))
        }

        console.log(particles[0])



        (function renderLoop(){
            requestAnimationFrame(renderLoop);
            this._render(ctx , c)
        })();

        setTimeout(function() {
            document.body.removeChild(c)
        }, 3000)
    }


    static  _particle(c) {

        let r = function(a,b,c){
            return parseFloat((Math.random()*((a?a:1)-(b?b:0))+(b?b:0)).toFixed(c?c:0));
        };

        return {
            x: c.width / 2,
            y: c.height / 2,
            radius: r(20,30),
            color: 'rgb(' + [r(0,255), r(0,255), r(0,255)].join(',') + ')',
            rotation: r(0,360, true),
            speed: r(8,12),
            friction: 0.9,
            opacity: r(0,0.5, true),
            yVel: 0,
            gravity: 0.1
        }
    }

    static _render(ctx , c) {
        ctx.clearRect(0, 0, c.width, c.height);

        particles.forEach(function(p, i) {

            this._angleTools.moveOnAngle(p, p.speed)

            p.opacity -= 0.01
            p.speed *= p.friction
            p.radius *= p.friction

            p.yVel += p.gravity
            p.y += p.yVel

            if(p.opacity < 0) return
            if(p.radius < 0) return

            ctx.beginPath()
            ctx.globalAlpha = p.opacity
            ctx.fillStyle = p.color
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false)
            ctx.fill()
        })
    }

    static _angleTools() {
        return {
            getAngle: function (t, n) {
                let a = n.x - t.x, e = n.y - t.y;
                return Math.atan2(e, a) / Math.PI * 180
            },
            getDistance: function (t, n) {
                let a = t.x - n.x, e = t.y - n.y;
                return Math.sqrt(a * a + e * e)
            },
            moveOnAngle: function (t, n) {
                let a = this.getOneFrameDistance(t, n);
                t.x += a.x, t.y += a.y
            },
            getOneFrameDistance: function (t, n) {
                return {x: n * Math.cos(t.rotation * Math.PI / 180), y: n * Math.sin(t.rotation * Math.PI / 180)}
            }
        }
    };


}

