/* global PIXI */
window.ExperimentsCreative.BackgroundShader = function BackgroundShader (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.easing = {
        easing: 0.55 + Math.random() * 0.065,
        friction: 0.09 + Math.random() * 0.05
    };
    this.init();
};

window.ExperimentsCreative.BackgroundShader.prototype.init = function () {
    'use strict';
    this.canvas = this.container.querySelector('#canvas');
    this.resize();
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
    this.app = new PIXI.Application({
        antialias: true,
        autoResize: true,
        autoStart: true,
        height: this.size.height,
        resolution: window.devicePixelRatio,
        transparent: true,
        view: this.canvas,
        width: this.size.width
    });
    window.addEventListener('resize', this.resize.bind(this));
    this.app.ticker.add(this.animate.bind(this));
    this.image = new window.ExperimentsCreative.BackgroundShaderImage(this.container.querySelector('.js-image'), this.app, this.size);
};

window.ExperimentsCreative.BackgroundShader.prototype.resize = function () {
    'use strict';
    this.size = {
        height: window.innerHeight,
        width: window.innerWidth
    };

    if (this.app) {
        this.app.renderer.resize(this.size.width, this.size.height);
    }

    if (this.image && this.image.loaded) {
        this.image.resize(this.size);
    }
};

window.ExperimentsCreative.BackgroundShader.prototype.animate = function () {
    'use strict';
    if (this.image && this.image.loaded) {
        this.image.animate();
    }
};
