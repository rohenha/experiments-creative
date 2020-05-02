window.ExperimentsCreative.Triangle = function Triangle (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.config.angleAdded = 360 / this.config.points;
    this.config.extremities = [];
    this.max = 500;
    this.gradient = new window.ExperimentsCreative.Gradient(this.config.colors, this.config.points);
    this.index = 0;
    this.lines = [];
    this.setCanvas();
    this.initTriangle();
    this.animateLines();
};

window.ExperimentsCreative.Triangle.prototype.setCanvas = function () {
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

window.ExperimentsCreative.Triangle.prototype.initTriangle = function () {
    'use strict';
    var i = 0,
        line = {},
        angle = 0;

    for (i; i < this.config.points; i += 1) {
        line = {
            color: this.gradient.colors[i % this.config.points],
            end: this.setStartPoint(this.getRadians(angle + this.config.angleAdded)),
            start: this.setStartPoint(this.getRadians(angle))
        };
        this.lines.push(line);
        angle += this.config.angleAdded;
    }
};

window.ExperimentsCreative.Triangle.prototype.animateLines = function () {
    'use strict';
    this.interval = setInterval(function () {
        this.setLine();
        if (this.index > this.max) {
            clearInterval(this.interval);
        }
    }.bind(this), 0.001);
};

window.ExperimentsCreative.Triangle.prototype.setLine = function () {
    'use strict';
    var line = {
        color: this.gradient.colors[this.index % this.config.points],
        end: this.getPointOnLine(this.lines[this.index + 1]),
        start: this.lines[this.lines.length - 1].end
    };

    this.index += 1;
    this.lines.push(line);
};

window.ExperimentsCreative.Triangle.prototype.getPointOnLine = function (line) {
    'use strict';
    var interval = this.getInterval(line, this.config.interval);
    return {
        x: this.addIntervalOnLine(line.start.x, line.end.x, interval.x),
        y: this.addIntervalOnLine(line.start.y, line.end.y, interval.y)
    };
};
window.ExperimentsCreative.Triangle.prototype.getInterval = function (line, percent) {
    'use strict';
    return {
        x: (Math.max(line.start.x, line.end.x) - Math.min(line.start.x, line.end.x)) * percent,
        y: (Math.max(line.start.y, line.end.y) - Math.min(line.start.y, line.end.y)) * percent
    };
};

window.ExperimentsCreative.Triangle.prototype.addIntervalOnLine = function (start, end, interval) {
    'use strict';
    var value = end > start ? interval : interval * -1;
    return start + value;
};

window.ExperimentsCreative.Triangle.prototype.getRadians = function (angle) {
    'use strict';
    return angle * (Math.PI/180);
};

window.ExperimentsCreative.Triangle.prototype.setStartPoint = function (radians) {
    'use strict';
    return {
        x: Math.sin(radians) * this.config.size + this.canvasSize.width / 2,
        y: Math.cos(radians) * this.config.size + this.canvasSize.height / 2
    };
};

window.ExperimentsCreative.Triangle.prototype.animate = function () {
    'use strict';
    var i = 0,
        length = this.lines.length;
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    for (i; i < length; i += 1) {
        this.draw(this.lines[i]);
    }
    this.animation = window.requestAnimationFrame(this.animate.bind(this));
};

window.ExperimentsCreative.Triangle.prototype.draw = function (line) {
    'use strict';
    this.ctx.beginPath();
    this.ctx.lineWidth = this.config.stroke;
    this.ctx.strokeStyle = line.color;
    this.ctx.moveTo(line.start.x, line.start.y);
    this.ctx.lineTo(line.end.x, line.end.y);
    this.ctx.stroke();
};
