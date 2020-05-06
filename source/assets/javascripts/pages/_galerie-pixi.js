/* global Hammer, PIXI */
/* eslint-disable new-cap */
window.ExperimentsCreative.GaleriePixi = function GaleriePixi (container, config) {
    'use strict';
    var initValue = { x: 0, y: 0 };
    this.container = container;
    this.config = config;
    this.config.pan = true;
    this.config.image = {};
    this.images = [];
    this.pan = {
        active: false,
        center: initValue,
        current: initValue,
        delta: initValue,
        sens: initValue,
        speed: initValue,
        start: initValue,
        tmp: initValue
    };
    this.elements = [];
    this.setCanvas();
    this.setController();
    this.initGrid();
    this.getImages();
    this.initElements();
};

window.ExperimentsCreative.GaleriePixi.prototype.setController = function () {
    'use strict';
    this.mc = new Hammer.Manager(this.canvas);
    this.mc.add(new Hammer.Tap());
    this.mc.add(new Hammer.Pan());
    this.mc.add(new Hammer.Press());
    this.mc.on('panstart', this.panStartEvent.bind(this));
    this.mc.on('press', this.pressEvent.bind(this));
    this.mc.on('pan', this.panEvent.bind(this));
    this.mc.on('panend pancancel pressup', this.panEndEvent.bind(this));
};

window.ExperimentsCreative.GaleriePixi.prototype.pressEvent = function (ev) {
    'use strict';
    // This.config.pan = !this.config.pan;
    // This.config.image = ev.center;
};

window.ExperimentsCreative.GaleriePixi.prototype.panStartEvent = function (ev) {
    'use strict';
    if (this.pan.active || !this.config.pan) {
        return;
    }
    this.pan.active = true;
    this.pan.start = ev.center;
    this.pan.center = ev.center;
};

window.ExperimentsCreative.GaleriePixi.prototype.panEvent = function (ev) {
    'use strict';
    var tmp = {
        x: ev.center.x - this.pan.start.x + this.pan.current.x,
        y: ev.center.y - this.pan.start.y + this.pan.current.y
    };
    if (!this.pan.active || !this.config.pan) {
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
    this.pan.speed = { x: this.pan.speed.x + this.pan.delta.x, y: this.pan.speed.y + this.pan.delta.y };
    this.pan.tmp = tmp;
    this.pan.center = ev.center;
};

window.ExperimentsCreative.GaleriePixi.prototype.panEndEvent = function (ev) {
    'use strict';
    this.pan.active = false;
    this.pan.current = {
        x: ev.center.x - this.pan.start.x + this.pan.current.x,
        y: ev.center.y - this.pan.start.y + this.pan.current.y
    };
    this.pan.delta = { x: 0, y: 0 };
    this.pan.speed = { x: 0, y: 0 };
    this.pan.center = ev.center;
};

window.ExperimentsCreative.GaleriePixi.prototype.getImages = function () {
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

window.ExperimentsCreative.GaleriePixi.prototype.shuffleArray = function (array) {
    'use strict';
    array.sort(function () {
        return Math.random() - 0.5;
    });
};

window.ExperimentsCreative.GaleriePixi.prototype.setCanvas = function () {
    'use strict';
    this.canvas = this.container.querySelector('#canvas');
    this.canvasSize = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
    this.app = new PIXI.Application({
        autoStart: true,
        height: this.canvasSize.height,
        transparent: true,
        view: this.canvas,
        width: this.canvasSize.width
    });
    this.slidesContainer = new PIXI.Container();
    this.app.stage.addChild(this.slidesContainer);
    this.app.stage.filters = [];
    this.setFilter('clouds', this.container.querySelector('.js-clouds').src);
    this.clouds.sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.setBlur();
    this.app.ticker.add(this.animate.bind(this));
};

window.ExperimentsCreative.GaleriePixi.prototype.setBlur = function () {
    'use strict';
    this.zoomBlur = {
        filter: new PIXI.filters.ZoomBlurFilter({ innerRadius: 0, strength: 0 }),
        strength: {
            delta: 0,
            position: 0,
            target: 0,
            v: 0
        }
    };
    this.app.stage.filters.push(this.zoomBlur.filter);
};

window.ExperimentsCreative.GaleriePixi.prototype.setFilter = function (name, texture) {
    'use strict';
    var sprite = new PIXI.Sprite.from(texture);
    this[name] = {
        filter: new PIXI.filters.DisplacementFilter(sprite),
        scale: {
            delta: 0,
            position: 0.5,
            target: 0.5,
            v: 0
        },
        sprite: sprite,
        x: {
            delta: 0,
            position: 0,
            target: 0,
            v: 0
        },
        y: {
            delta: 0,
            position: 0,
            target: 0,
            v: 0
        }
    };
    this[name].filter.autoFit = true;
    this.app.stage.filters.push(this[name].filter);
    this.app.stage.addChild(sprite);
};

window.ExperimentsCreative.GaleriePixi.prototype.initGrid = function () {
    'use strict';
    this.config.size = {
        width: this.canvasSize.width / this.config.grid.x
    };
    this.config.size.height = this.config.size.width * 1280 / 1920;
    this.config.grid.y = Math.round(this.canvasSize.height / this.config.size.height);
};

window.ExperimentsCreative.GaleriePixi.prototype.initElements = function () {
    'use strict';
    this.config.easing = {
        easing: 0.55 + Math.random() * 0.065,
        friction: 0.09 + Math.random() * 0.05
    };
    this.setElements();
};

window.ExperimentsCreative.GaleriePixi.prototype.setElements = function () {
    'use strict';
    var i = 0,
        x = -this.config.delta,
        y = -this.config.delta,
        element,
        texture,
        sprite,
        xElement,
        yElement,
        maxDelta = this.config.delta * 2,
        length = (this.config.grid.y + maxDelta) * (this.config.grid.x + maxDelta);
    for (i; i < length; i += 1) {
        xElement = x * this.config.size.width;
        yElement = y * this.config.size.height;
        texture = new PIXI.Texture.from(this.images[i].src);
        sprite = new PIXI.Sprite(texture);
        sprite.x = xElement;
        sprite.y = yElement;
        sprite.width = this.config.size.width;
        sprite.height = this.config.size.height;
        element = {
            img: this.images[i],
            sprite: sprite,
            x: {
                delta: 0,
                position: xElement,
                target: xElement,
                v: 0
            },
            y: {
                delta: 0,
                position: yElement,
                target: yElement,
                v: 0
            }
        };
        this.elements.push(element);
        this.slidesContainer.addChild(sprite);
        y += 1;
        if (y >= this.config.grid.y + this.config.delta) {
            x += 1;
            y = -this.config.delta;
        }
    }
};

window.ExperimentsCreative.GaleriePixi.prototype.animate = function () {
    'use strict';
    var i = 0,
        length = this.elements.length;
    for (i; i < length; i += 1) {
        this.updateImage(this.elements[i]);
    }
    this.clouds.x.target += Math.floor(Math.random() * 2);
    this.clouds.y.target += Math.floor(Math.random() * 2);
    this.updateElement(this.clouds);
    this.updateBlur();
};

window.ExperimentsCreative.GaleriePixi.prototype.updateImage = function (element) {
    'use strict';
    this.updateAxe(element, 'x');
    this.updateAxe(element, 'y');
    element.sprite.renderable = false;
    if (
        this.checkIsInViewport(element.x.position, this.config.size.width, this.canvasSize.width) &&
        this.checkIsInViewport(element.y.position, this.config.size.height, this.canvasSize.height)) {
        this.loadImage(element);
        element.sprite.renderable = true;
    }
};

window.ExperimentsCreative.GaleriePixi.prototype.checkImageIsClicked = function () {
    'use strict';
};

window.ExperimentsCreative.GaleriePixi.prototype.updateBlur = function () {
    'use strict';
    var strength = Math.abs(this.pan.delta.x) + Math.abs(this.pan.delta.y);
    this.zoomBlur.strength.target = strength * 0.5 / 150;
    this.ease(this.zoomBlur.strength);
    this.zoomBlur.filter.center = this.pan.center;
    this.zoomBlur.filter.strength = this.zoomBlur.strength.position;
};

window.ExperimentsCreative.GaleriePixi.prototype.loadImage = function (element) {
    'use strict';
    var loader;
    if (element.img.getAttribute('data-loaded') === 'true') {
        return;
    }
    loader = new PIXI.Loader();
    element.img.setAttribute('data-loaded', 'true');
    loader.add(element.img.getAttribute('data-src'));
    loader.onComplete.add(function () {
        var newTexture = loader.resources[element.img.getAttribute('data-src')].texture;
        element.img.src = element.img.getAttribute('data-src');
        element.sprite.texture = newTexture;
    });
    loader.load();
};

window.ExperimentsCreative.GaleriePixi.prototype.updateElement = function (element) {
    'use strict';
    var i = 0,
        axes = ['x', 'y', 'scale'],
        axe,
        length = axes.length;

    for (i; i < length; i += 1) {
        axe = axes[i];
        if (element[axe]) {
            this.ease(element[axe]);
            if (axe === 'scale') {
                element.sprite[axe].x = element[axe].position;
                element.sprite[axe].y = element[axe].position;
            } else {
                element.sprite[axe] = element[axe].position;
            }
        }
    }
};

window.ExperimentsCreative.GaleriePixi.prototype.checkIsInViewport = function (position, size, canvasSize) {
    'use strict';
    return position > -size && position < canvasSize + size;
};

window.ExperimentsCreative.GaleriePixi.prototype.updateAxe = function (element, direction) {
    'use strict';
    var size = direction === 'x' ? 'width' : 'height',
        min = -this.config.size[size] * this.config.delta,
        max = this.config.size[size] * (this.config.grid[direction] + this.config.delta),
        delta = this.config.size[size] * (this.config.grid[direction] + this.config.delta * 2),
        axe = element[direction],
        value;

    axe.target += this.pan.delta[direction];
    this.ease(axe);

    if (axe.position >= max) {
        value = delta - axe.target;
        axe.target = -value;
        axe.position = -value - axe.delta;
        this.ease(axe);
    }
    if (axe.position <= min) {
        value = delta + axe.target;
        axe.target = value;
        axe.position = value - axe.delta;
        this.ease(axe);
    }
    element.sprite[direction] = element[direction].position;
};

window.ExperimentsCreative.GaleriePixi.prototype.ease = function (axe) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * this.config.easing.easing;
    axe.v *= this.config.easing.friction;
    axe.position += axe.v;
};
