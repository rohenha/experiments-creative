/* eslint-disable new-cap */
window.ExperimentsCreative.BackgroundShaderNoise = function BackgroundShaderNoise (app, size) {
    'use strict';
    this.app = app;
    this.canvas = document.createElement('canvas');
    this.canvas = document.querySelector('#canvasNoise');
    this.ctx = this.canvas.getContext('2d');
    this.resize(size);
    this.rayon = 50;
    this.circles = [];
    this.mouse = {
        x: this.getAttribute(),
        y: this.getAttribute()
    };
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
};

window.ExperimentsCreative.BackgroundShaderNoise.prototype.getAttribute = function () {
    'use strict';
    return {
        delta: 0,
        position: null
    };
};

window.ExperimentsCreative.BackgroundShaderNoise.prototype.resize = function (size) {
    'use strict';
    this.size = size;
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
};

window.ExperimentsCreative.BackgroundShaderNoise.prototype.draw = function () {
    'use strict';
    var i = 0,
        length = this.circles.length,
        toRemove = [],
        single;
    this.ctx.clearRect(0, 0, this.size.width, this.size.height);

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.size.width, this.size.height);
    
    
    for (i; i < length; i += 1) {
        single = this.circles[i];
        this.ease(single.opacity);
        this.ctx.beginPath();
        this.ctx.globalAlpha = single.opacity.position;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.arc(single.x, single.y, this.rayon, 0, 2 * Math.PI);
        this.ctx.fill();
        if (single.opacity.position < 0.01) {
            toRemove.push(i);
        }
    }

    // this.ctx.filter = 'blur(4px)';
    length = toRemove.length;
    i = toRemove.length - 1;
    for (i; i >= 0; i -= 1) {
        this.destroyParticle(toRemove[i]);
    }
    console.log(this.circles.length);
};

window.ExperimentsCreative.BackgroundShaderNoise.prototype.destroyParticle = function (index) {
    'use strict';
    this.circles.splice(index, 1);
};

window.ExperimentsCreative.BackgroundShaderNoise.prototype.onMouseMove = function (event) {
    'use strict';
    this.circles.push({
        dateTime: new Date(),
        opacity: {
            delta: 0,
            easing: 0.55 + Math.random() * 0.065,
            friction: 0.09 + Math.random() * 0.05,
            position: 1,
            target: 0,
            v: 0
        },
        x: event.clientX,
        y: event.clientY
    });
};

window.ExperimentsCreative.BackgroundShaderNoise.prototype.ease = function (axe) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * axe.easing;
    axe.v *= axe.friction;
    axe.position += axe.v;
};
