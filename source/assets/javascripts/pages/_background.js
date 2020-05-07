/* eslint-disable new-cap */
/* global PIXI */
window.ExperimentsCreative.Background = function Background (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.mouse = {
        active: false,
        delta: {
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
        },
        position: { x: 0, y: 0 }
    };
    this.config.easing = {
        easing: 0.55 + Math.random() * 0.065,
        friction: 0.09 + Math.random() * 0.05
    };
    this.config.easingMouse = {
        easing: 0.95 + Math.random() * 0.065,
        friction: 0.29 + Math.random() * 0.05
    };
    this.setCanvas();
    this.setFilter();
    this.setImage();
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
};

window.ExperimentsCreative.Background.prototype.setCanvas = function () {
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
    this.app.ticker.add(this.animate.bind(this));
};

window.ExperimentsCreative.Background.prototype.setFilter = function () {
    'use strict';
    this.filter = {
        blue: this.setPosition(),
        filter: new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]),
        green: this.setPosition(),
        red: this.setPosition()
    };
    this.app.stage.filters.push(this.filter.filter);
};

window.ExperimentsCreative.Background.prototype.setPosition = function () {
    'use strict';
    var speed = Math.floor(Math.random() * 6 - 3);
    return {
        x: {
            delta: 0,
            position: 0,
            speed: speed,
            target: 0,
            v: 0
        },
        y: {
            delta: 0,
            position: 0,
            speed: speed,
            target: 0,
            v: 0
        }
    };
};

window.ExperimentsCreative.Background.prototype.setImage = function () {
    'use strict';
    var image = this.container.querySelector('.js-image'),
        imageContent = image.querySelector('img'),
        loader,
        texture,
        sprite;
    loader = new PIXI.Loader();
    loader.add(imageContent.src);
    texture = new PIXI.Texture.from(imageContent.src);
    loader.onComplete.add(function () {
        var newTexture = loader.resources[imageContent.src].texture;
        sprite = new PIXI.Sprite(newTexture);
        sprite.anchor.set(0.5);
        sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.image = {
            img: imageContent,
            ratio: sprite.width / sprite.height,
            sprite: sprite,
            texture: texture
        };
        this.loadImage(this.image);
        this.slidesContainer.addChild(sprite);
        this.onResize();
    }.bind(this));
    loader.load();
};

window.ExperimentsCreative.Background.prototype.loadImage = function (element) {
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

window.ExperimentsCreative.Background.prototype.onResize = function () {
    'use strict';
    this.canvasSize = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    this.app.renderer.resize(this.canvasSize.width, this.canvasSize.height);
    this.image.sprite.x = this.canvasSize.width / 2;
    this.image.sprite.y = this.canvasSize.height / 2;
    if (this.canvasSize.width / this.canvasSize.height > this.image.ratio) {
        this.image.sprite.width = this.canvasSize.width;
        this.image.sprite.height = this.canvasSize.width / this.image.ratio;
    } else {
        this.image.sprite.height = this.canvasSize.height;
        this.image.sprite.width = this.canvasSize.height * this.image.ratio;
    }
};

window.ExperimentsCreative.Background.prototype.onMouseMove = function (event) {
    'use strict';
    var xPosition = event.clientX - this.mouse.position.x,
        yPosition = event.clientY - this.mouse.position.y;

    this.mouse.delta.x.position = xPosition;
    this.mouse.delta.y.position = yPosition;
    this.mouse.position = {
        x: event.clientX,
        y: event.clientY
    };
};

window.ExperimentsCreative.Background.prototype.ease = function (axe, easing) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * easing.easing;
    axe.v *= easing.friction;
    axe.position += axe.v;
};

window.ExperimentsCreative.Background.prototype.animate = function () {
    'use strict';
    var i = 0,
        colors = ['red', 'blue'],
        color,
        colorsLength = colors.length;
    this.ease(this.mouse.delta.x, this.config.easingMouse);
    this.ease(this.mouse.delta.y, this.config.easingMouse);
    for (i; i < colorsLength; i += 1) {
        color = this.filter[colors[i]];
        color.x.target = this.mouse.delta.x.position * color.x.speed;
        color.y.target = this.mouse.delta.y.position * color.y.speed;
        this.ease(color.x, this.config.easing);
        this.ease(color.y, this.config.easing);
        this.filter.filter[colors[i]] = [color.x.position, color.y.position];

    }
};
