window.ExperimentsCreative.Hexagon = function Hexagon (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.config.angleAdded = 360 / this.config.points;
    this.config.extremities = [];
    this.points = [];
    this.gradient = new window.ExperimentsCreative.Gradient(this.config.colors, 100);
    this.selected = {
        end: null,
        start: null
    };
    this.setCanvas();
    this.initHexagon(0, 0);
};

window.ExperimentsCreative.Hexagon.prototype.setCanvas = function () {
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

window.ExperimentsCreative.Hexagon.prototype.initHexagon = function (i, angle) {
    'use strict';
    var newIndex = i,
        newAngle = angle;
    this.setStartPoint(this.getRadians(angle));
    newAngle += this.config.angleAdded;
    newIndex += 1;
    if (i < this.config.points - 1) {
        setTimeout(function () {
            this.initHexagon(newIndex, newAngle);
        }.bind(this), 200);
        return;
    }
    this.setAnimation();
};

window.ExperimentsCreative.Hexagon.prototype.setStartPoint = function (radians) {
    'use strict';
    var x = Math.sin(radians) * this.config.size + this.canvasSize.width / 2,
        y = Math.cos(radians) * this.config.size + this.canvasSize.height / 2,
        point = {
            color: this.getColor(x),
            x: x,
            y: y
        };
    this.points.push(point);
    this.config.extremities.push(point);
};

window.ExperimentsCreative.Hexagon.prototype.getColor = function (position) {
    'use strict';
    var current = position - (this.canvasSize.width / 2 - this.config.size);
    return this.gradient.colors[Math.floor(100 * (current / (this.config.size * 2)))];
};

window.ExperimentsCreative.Hexagon.prototype.setAnimation = function () {
    'use strict';
    this.selected.end = this.points[this.getRandom(this.points.length)];
    this.config.interval = setInterval(function () {
        this.animatePoint();
    }.bind(this), 0.0000001);
};

window.ExperimentsCreative.Hexagon.prototype.animatePoint = function () {
    'use strict';
    var selected = {},
        interval = {},
        points = this.config.extremities.slice(0);
    selected.start = this.selected.end;
    selected.end = points[this.getRandom(points.length)];
    this.selected = selected;
    interval = this.getInterval();
    this.selected.end = {
        color: this.getColor(interval.x),
        x: interval.x,
        y: interval.y
    };
    this.points.push(this.selected.end);
    if (this.points.length > 100000) {
        clearInterval(this.config.interval);
    }
};

window.ExperimentsCreative.Hexagon.prototype.getInterval = function () {
    'use strict';
    var minX = this.getExtremity('min', 'x'),
        minY = this.getExtremity('min', 'y');
    return {
        x: minX + (this.getExtremity('max', 'x') - minX) / 2,
        y: minY + (this.getExtremity('max', 'y') - minY) / 2
    };
};

window.ExperimentsCreative.Hexagon.prototype.getExtremity = function (extremity, position) {
    'use strict';
    return Math[extremity](this.selected.start[position], this.selected.end[position]);
};

window.ExperimentsCreative.Hexagon.prototype.getRadians = function (angle) {
    'use strict';
    return angle * (Math.PI/180);
};

window.ExperimentsCreative.Hexagon.prototype.getRandom = function (length) {
    'use strict';
    return Math.floor(Math.random() * length);
};

window.ExperimentsCreative.Hexagon.prototype.animate = function () {
    'use strict';
    var i = 0,
        length = this.points.length;
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    for (i; i < length; i += 1) {
        this.draw(this.points[i]);
    }
    this.animation = window.requestAnimationFrame(this.animate.bind(this));
};

window.ExperimentsCreative.Hexagon.prototype.draw = function (point) {
    'use strict';
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.config.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = point.color;
    this.ctx.fill();
};
