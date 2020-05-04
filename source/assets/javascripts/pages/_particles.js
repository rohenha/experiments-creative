window.ExperimentsCreative.Particles = function Particles (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.gradient = new window.ExperimentsCreative.Gradient(this.config.colors, 10);
    this.particles = [];
    this.cursor = {
        x: 0,
        y: 0
    };
    this.container.addEventListener('mousemove', this.updateCursor.bind(this));
    this.container.addEventListener('click', this.clickEvent.bind(this));
    this.setCanvas();
};

window.ExperimentsCreative.Particles.prototype.setCanvas = function () {
    'use strict';
    this.canvas = this.container.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvasSize = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
    this.animate();
};

window.ExperimentsCreative.Particles.prototype.animate = function () {
    'use strict';
    var i = 0,
        particle,
        length = this.particles.length,
        toRemove = [];
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    for (i; i < length; i += 1) {
        particle = this.particles[i];
        this.ease(particle.y);
        this.ease(particle.x);
        this.ease(particle.scale);
        this.ease(particle.opacity);
        this.draw(particle);
        if (particle.opacity.position < 0.1) {
            toRemove.push(i);
        }
    }
    length = toRemove.length;
    i = toRemove.length - 1;
    for (i; i >= 0; i -= 1) {
        this.checkToDestroy(toRemove[i]);
    }
    this.animation = window.requestAnimationFrame(this.animate.bind(this));
};

window.ExperimentsCreative.Particles.prototype.checkToDestroy = function (index) {
    'use strict';
    this.particles.splice(index, 1);
};

window.ExperimentsCreative.Particles.prototype.ease = function (axe) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * axe.easing;
    axe.v *= axe.friction;
    axe.position += axe.v;
};

window.ExperimentsCreative.Particles.prototype.clickEvent = function (event) {
    'use strict';
    var i = 0,
        length = 15;

    for (i; i < length; i += 1) {
        this.updateCursor(event);
    }
};

window.ExperimentsCreative.Particles.prototype.updateCursor = function (event) {
    'use strict';
    var toX = Math.floor(Math.random() * 100) - 25,
        toY = Math.floor(Math.random() * 100) - 25,
        scale = Math.floor(Math.random() * 10) + 1,
        positionEase = {
            easing: 0.45 + Math.random() * 0.065,
            friction: 0.19 + Math.random() * 0.05
        };
    this.cursor.x = event.clientX;
    this.cursor.y = event.clientY;
    this.particles.push({
        color: this.gradient.colors[Math.floor(Math.random() * this.gradient.colors.length)],
        opacity: {
            delta: 0,
            easing: 0.45 + Math.random() * 0.065,
            friction: 0.09 + Math.random() * 0.05,
            position: 3,
            target: 0,
            v: 0
        },
        scale: {
            delta: 0,
            easing: 0.45 + Math.random() * 0.065,
            friction: 0.09 + Math.random() * 0.05,
            position: 0,
            target: scale,
            v: 0
        },
        x: {
            delta: 0,
            easing: positionEase.easing,
            friction: positionEase.friction,
            position: event.clientX,
            target: event.clientX + toX,
            v: 0
        },
        y: {
            delta: 0,
            easing: positionEase.easing,
            friction: positionEase.friction,
            position: event.clientY,
            target: event.clientY + toY,
            v: 0
        }
    });
};

window.ExperimentsCreative.Particles.prototype.draw = function (point) {
    'use strict';
    this.ctx.beginPath();
    this.ctx.globalAlpha = point.opacity.position;
    this.ctx.arc(point.x.position, point.y.position, point.scale.position, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = point.color;
    this.ctx.fill();
};
