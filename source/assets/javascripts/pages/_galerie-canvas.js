/* global Hammer */
window.ExperimentsCreative.GalerieCanvas = function GalerieCanvas (container, config) {
    'use strict';
    var initValue = { x: 0, y: 0 };
    this.container = container;
    this.config = config;
    this.images = [];
    this.pan = {
        active: false,
        current: initValue,
        delta: initValue,
        sens: initValue,
        start: initValue,
        tmp: initValue
    };
    this.elements = [];
    this.setCanvas();
    this.setController();
};

window.ExperimentsCreative.GalerieCanvas.prototype.setController = function () {
    'use strict';
    this.mc = new Hammer.Manager(this.canvas);
    this.mc.add(new Hammer.Tap());
    this.mc.add(new Hammer.Pan());
    this.mc.on('panstart', this.panStartEvent.bind(this));
    this.mc.on('pan', this.panEvent.bind(this));
    this.mc.on('panend pancancel pressup', this.panEndEvent.bind(this));
};

window.ExperimentsCreative.GalerieCanvas.prototype.panStartEvent = function (ev) {
    'use strict';
    if (this.pan.active) {
        return;
    }
    this.pan.active = true;
    this.pan.start = ev.center;
};

window.ExperimentsCreative.GalerieCanvas.prototype.panEvent = function (ev) {
    'use strict';
    var tmp = {
        x: ev.center.x - this.pan.start.x + this.pan.current.x,
        y: ev.center.y - this.pan.start.y + this.pan.current.y
    };
    if (!this.pan.active) {
        return;
    }
    this.pan.sens = {
        x: ev.center.x - this.pan.start.x < 0,
        y: ev.center.y - this.pan.start.y < 0
    };

    this.pan.delta = {
        x: (tmp.x - this.pan.tmp.x) * 3,
        y: (tmp.y - this.pan.tmp.y) * 3
    };

    this.pan.tmp = tmp;
};

window.ExperimentsCreative.GalerieCanvas.prototype.panEndEvent = function (ev) {
    'use strict';
    this.pan.active = false;
    this.pan.current = {
        x: ev.center.x - this.pan.start.x + this.pan.current.x,
        y: ev.center.y - this.pan.start.y + this.pan.current.y
    };
    this.pan.delta = {
        x: 0,
        y: 0
    };
};

window.ExperimentsCreative.GalerieCanvas.prototype.getImages = function () {
    'use strict';
    var i = 0,
        images = this.container.querySelector('.js-images').querySelectorAll('img'),
        length = images.length,
        maxDelta = this.config.delta * 2,
        copyArray,
        lengthImages,
        imagesArray = [];

    for (i; i < length; i += 1) {
        imagesArray.push(images[i]);
    }
    this.images = imagesArray;
    i = 0;
    lengthImages = (this.config.grid.y + maxDelta) * (this.config.grid.x + maxDelta);
    length = Math.floor(lengthImages / images.length);
    for (i; i < length; i += 1) {
        copyArray = imagesArray.slice();
        this.shuffleArray(copyArray);
        this.images = this.images.concat(copyArray);
    }
};

window.ExperimentsCreative.GalerieCanvas.prototype.shuffleArray = function (array) {
    'use strict';
    array.sort(function () {
        return Math.random() - 0.5;
    });
};

window.ExperimentsCreative.GalerieCanvas.prototype.setCanvas = function () {
    'use strict';
    this.canvas = this.container.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvasSize = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
    this.initGrid();
    this.getImages();
    this.initElements();
    this.animate();
};

window.ExperimentsCreative.GalerieCanvas.prototype.initGrid = function () {
    'use strict';
    this.config.size = {
        width: this.canvasSize.width / this.config.grid.x
    };
    this.config.size.height = this.config.size.width * 1280 / 1920;
    this.config.grid.y = Math.round(this.canvasSize.height / this.config.size.height);
};

window.ExperimentsCreative.GalerieCanvas.prototype.initElements = function () {
    'use strict';
    this.config.easing = {
        easing: 0.55 + Math.random() * 0.065,
        friction: 0.09 + Math.random() * 0.05
    };
    this.setElements();
};

window.ExperimentsCreative.GalerieCanvas.prototype.setElements = function () {
    'use strict';
    var i = 0,
        x = -this.config.delta,
        y = -this.config.delta,
        maxDelta = this.config.delta * 2,
        length = (this.config.grid.y + maxDelta) * (this.config.grid.x + maxDelta);
    for (i; i < length; i += 1) {
        this.elements.push({
            img: this.images[i],
            x: {
                delta: 0,
                position: x * this.config.size.width,
                target: x * this.config.size.width,
                v: 0
            },
            y: {
                delta: 0,
                position: y * this.config.size.height,
                target: y * this.config.size.height,
                v: 0
            }
        });
        y += 1;
        if (y >= this.config.grid.y + this.config.delta) {
            x += 1;
            y = -this.config.delta;
        }
    }
};

window.ExperimentsCreative.GalerieCanvas.prototype.animate = function () {
    'use strict';
    var i = 0,
        element,
        length = this.elements.length,
        pixels = this.ctx.getImageData(0, 0, this.canvasSize.width, this.canvasSize.height).data;
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    for (i; i < length; i += 1) {
        element = this.elements[i];
        this.updateAxe(element.x, 'x');
        this.updateAxe(element.y, 'y');
        if (
            this.checkIsInViewport(element.x.position, this.config.size.width, this.canvasSize.width) &&
            this.checkIsInViewport(element.y.position, this.config.size.height, this.canvasSize.height)) {
            this.loadImage(element);
            this.draw(element);
        }
    }

    this.animation = window.requestAnimationFrame(this.animate.bind(this));
};

window.ExperimentsCreative.GalerieCanvas.prototype.loadImage = function (element) {
    'use strict';
    var img;
    if (element.img.getAttribute('data-loaded') === 'true') {
        return;
    }
    element.img.setAttribute('data-loaded', 'true');
    img = new Image();
    img.src = element.img.getAttribute('data-src');
    img.onload = function () {
        element.img.src = element.img.getAttribute('data-src');
    }.bind(this);
};

window.ExperimentsCreative.GalerieCanvas.prototype.checkIsInViewport = function (position, size, canvasSize) {
    'use strict';
    return position > -size && position < canvasSize + size;
};

window.ExperimentsCreative.GalerieCanvas.prototype.updateAxe = function (axe, direction) {
    'use strict';
    var size = direction === 'x' ? 'width' : 'height',
        min = -this.config.size[size] * this.config.delta,
        max = this.config.size[size] * (this.config.grid[direction] + this.config.delta),
        delta = this.config.size[size] * (this.config.grid[direction] + this.config.delta * 2),
        value;

    axe.target += this.pan.delta[direction];
    this.ease(axe);

    if (axe.position >= max) {
        value = delta - axe.target;
        axe.target = -value;
        axe.position = -value - axe.delta;
        this.ease(axe);
        return;
    }
    if (axe.position <= min) {
        value = delta + axe.target;
        axe.target = value;
        axe.position = value - axe.delta;
        this.ease(axe);
    }
};

window.ExperimentsCreative.GalerieCanvas.prototype.ease = function (axe) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * this.config.easing.easing;
    axe.v *= this.config.easing.friction;
    axe.position += axe.v;
};

window.ExperimentsCreative.GalerieCanvas.prototype.draw = function (element) {
    'use strict';
    this.ctx.drawImage(element.img, element.x.position, element.y.position, this.config.size.width, this.config.size.height);
};
