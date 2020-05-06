/* global PIXI */
/* eslint-disable new-cap */
window.ExperimentsCreative.ImagesWebgl = function ImagesWebgl (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.config.easing = {
        easing: 0.55 + Math.random() * 0.065,
        friction: 0.09 + Math.random() * 0.05
    };
    this.config.scroll = {
        delta: 0,
        position: window.pageYOffset
    };
    this.elements = [];
    this.setCanvas();
    this.setImages();
};


window.ExperimentsCreative.ImagesWebgl.prototype.setCanvas = function () {
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
    this.app.ticker.add(this.animate.bind(this));
};

window.ExperimentsCreative.ImagesWebgl.prototype.animate = function () {
    'use strict';
    var scrollPosition = window.pageYOffset,
        i = 0,
        element,
        length = this.elements.length;
    this.clouds.x.target += Math.floor(Math.random() * 2);
    this.clouds.y.target += Math.floor(Math.random() * 2);
    this.updateElement(this.clouds);
    this.config.scroll.delta = scrollPosition - this.config.scroll.position;
    this.config.scroll.position = scrollPosition;
    for (i; i < length; i += 1) {
        element = this.elements[i];
        element.y.position -= this.config.scroll.delta;
        element.sprite.y = element.y.position;
        this.loadImage(element);
    }
};

window.ExperimentsCreative.ImagesWebgl.prototype.loadImage = function (element) {
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

window.ExperimentsCreative.ImagesWebgl.prototype.setFilter = function (name, texture) {
    'use strict';
    var sprite = new PIXI.Sprite.from(texture);
    this[name] = {
        filter: new PIXI.filters.DisplacementFilter(sprite),
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

window.ExperimentsCreative.ImagesWebgl.prototype.updateElement = function (element) {
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

window.ExperimentsCreative.ImagesWebgl.prototype.setImages = function () {
    'use strict';
    var i = 0,
        images = this.container.querySelectorAll('.js-image'),
        image,
        imageContent,
        texture,
        sprite,
        bounding,
        length = images.length;

    for (i; i < length; i += 1) {
        image = images[i];
        imageContent = image.querySelector('img');
        bounding = image.getBoundingClientRect();
        texture = new PIXI.Texture.from(imageContent.src);
        sprite = new PIXI.Sprite(texture);
        sprite.x = bounding.left;
        sprite.y = bounding.top;
        sprite.width = bounding.width;
        sprite.height = bounding.height;
        image.style.width = bounding.width + 'px';
        image.style.height = bounding.height + 'px';
        image.classList.add('disabled');
        this.elements.push({
            img: imageContent,
            sprite: sprite,
            x: {
                delta: 0,
                position: bounding.left,
                target: bounding.left,
                v: 0
            },
            y: {
                delta: 0,
                position: bounding.top,
                target: bounding.top,
                v: 0
            }
        });
        this.slidesContainer.addChild(sprite);
    }
};

window.ExperimentsCreative.ImagesWebgl.prototype.ease = function (axe) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * this.config.easing.easing;
    axe.v *= this.config.easing.friction;
    axe.position += axe.v;
};
