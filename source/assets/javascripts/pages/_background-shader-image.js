/* global PIXI */
/* eslint-disable new-cap */
window.ExperimentsCreative.BackgroundShaderImage = function BackgroundShaderImage (image, app, size) {
    'use strict';
    this.image = image;
    this.app = app;
    this.size = size;
    this.vertexShader = document.querySelector('#vertShader').innerHTML;
    this.fragmentShader = document.querySelector('#fragShader').innerHTML;
    this.thumbnail = this.image.src;
    this.hd = this.image.getAttribute('data-src');
    this.noise = new window.ExperimentsCreative.BackgroundShaderNoise(this.app, this.size);
    this.mouse = {
        x: 0,
        y: 0.5
    };
    this.blobSize = 4;
    this.turb = 6;
    this.loaded = false;
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.interactionManager = new PIXI.interaction.InteractionManager(this.app.renderer);
    this.loader = new PIXI.Loader();
    this.loadTexture([this.thumbnail, this.hd], this.init.bind(this, this.hd));
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.loadTexture = function (textures, callback) {
    'use strict';
    var i = 0,
        length = textures.length;
    if (callback instanceof Function) {
        this.loader.onComplete.add(callback);
    }
    for (i; i < length; i += 1) {
        this.loader.add(textures[i]);
    }
    this.loader.load();
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.init = function (textureUrl) {
    'use strict';
    this.texture = this.loader.resources[textureUrl].texture;
    this.setShader();
    this.geometry = new PIXI.Geometry();
    this.ratio = this.texture.orig.width / this.texture.orig.height;
    this.geometry.addAttribute('aVertexPosition',
        [0, 0,
            this.texture.orig.width, 0,
            this.texture.orig.width, this.texture.orig.height,
            0, this.texture.orig.height],
        2);
    this.geometry.addAttribute('aColor',
        [0, 0, 0,
            0, 1, 0,
            0, 0, 1,
            1, 0, 0],
        3);
    this.geometry.addAttribute('aUvs',
        [0, 0,
            1, 0,
            1, 1,
            0, 1],
        2);
    this.geometry.addIndex([0, 1, 2, 0, 2, 3]);
    this.sprite = new PIXI.Mesh(this.geometry, this.shader);
    this.container.addChild(this.sprite);
    this.resize(this.size);
    this.loaded = true;
    this.sprite.interactive = true;
    this.sprite.on('mousemove', this.onMouseMove.bind(this));
    // this.sprite.mousemove = this.onMouseMove.bind(this);
    // this.loadTexture(this.hd, this.setHDTexture.bind(this));
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.setHDTexture = function () {
    'use strict';
    this.texture = this.loader.resources[this.hd].texture;
    this.image.src = this.hd;
    this.sprite.texture = this.texture;
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.setShader = function () {
    'use strict';
    this.uniforms = {
        uCanvas: this.noise.ctx,
        uImage: this.texture,
        uMouse: this.mouse,
        uPR: window.devicePixelRatio,
        uRes: { x: window.innerWidth, y: window.innerHeight },
        uSize: this.blobSize,
        uTime: 0,
        uTurb: this.turb
    };
    this.shader = new PIXI.Shader.from(this.vertexShader, this.fragmentShader, this.uniforms);
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.resize = function (size) {
    'use strict';
    this.size = size;
    if (this.size.width / this.size.height < this.ratio) {
        this.sprite.width = this.size.width;
        this.sprite.height = this.size.width / this.ratio;
    } else {
        this.sprite.height = this.size.height;
        this.sprite.width = this.size.height * this.ratio;
    }
    this.sprite.x = this.size.width / 2 - this.sprite.width / 2;
    this.sprite.y = this.size.height / 2 - this.sprite.height / 2;
    this.noise.resize(this.size);
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.animate = function () {
    'use strict';
    this.noise.draw();
    this.sprite.shader.uniforms.uTime += 0.01;
    this.sprite.shader.uniforms.uMouse = this.mouse;
    this.sprite.shader.uniforms.uCanvas = this.noise.ctx;
};

window.ExperimentsCreative.BackgroundShaderImage.prototype.onMouseMove = function (event) {
    'use strict';
    this.mouse = {
        x: event.data.global.x / this.size.width * 2 - 1,
        y: -(event.data.global.y / this.size.height) * 2 + 1
    };
};
