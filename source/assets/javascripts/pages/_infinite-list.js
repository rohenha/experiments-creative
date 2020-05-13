/* global Hammer */
window.ExperimentsCreative.InfiniteList = function InfiniteList (container, config) {
    'use strict';
    this.container = container;
    this.config = config;
    this.config.easing = {
        easing: 0.55 + Math.random() * 0.065,
        friction: 0.09 + Math.random() * 0.05
    };
    this.canvasSize = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    this.listContainer = this.container.querySelector('.js-list');
    this.isMobile = window.innerWidth < 768;
    this.config.size = this.isMobile ? this.config.grid.mobile : this.config.grid.desktop;
    this.config.space = this.canvasSize.height * this.config.size.space;
    this.images = [];
    this.initImages();
    if (this.isMobile) {
        this.setTouchControls();
    } else {
        this.setWheelControls();
    }
    this.animate();
};

window.ExperimentsCreative.InfiniteList.prototype.setWheelControls = function () {
    'use strict';
    this.wheel = {
        active: false,
        delta: 0,
        position: 0,
        target: 0,
        v: 0
    };
    window.addEventListener('wheel', this.wheelEvent.bind(this));
};

window.ExperimentsCreative.InfiniteList.prototype.setTouchControls = function () {
    'use strict';
    var initValue = { x: 0, y: 0 };
    this.pan = {
        active: false,
        current: initValue,
        delta: initValue,
        sens: initValue,
        start: initValue,
        tmp: initValue
    };
    this.mc = new Hammer.Manager(this.listContainer);
    this.mc.add(new Hammer.Tap());
    this.mc.add(new Hammer.Pan());
    this.mc.on('panstart', this.panStartEvent.bind(this));
    this.mc.on('pan', this.panEvent.bind(this));
    this.mc.on('panend pancancel pressup', this.panEndEvent.bind(this));
};


window.ExperimentsCreative.InfiniteList.prototype.panStartEvent = function (ev) {
    'use strict';
    if (this.pan.active) {
        return;
    }
    this.pan.active = true;
    this.pan.start = ev.center;
};

window.ExperimentsCreative.InfiniteList.prototype.panEvent = function (ev) {
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

window.ExperimentsCreative.InfiniteList.prototype.panEndEvent = function (ev) {
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

window.ExperimentsCreative.InfiniteList.prototype.wheelEvent = function (event) {
    'use strict';
    this.wheel.position = event.deltaY;
};

window.ExperimentsCreative.InfiniteList.prototype.initImages = function () {
    'use strict';
    var i = 0,
        images = this.container.querySelector('.js-images').querySelectorAll('img'),
        height,
        length = images.length;

    for (i; i < length; i += 1) {
        height = (this.config.size.height + this.config.space) * (i - 1);
        this.images.push({
            element: this.createElement(images[i]),
            image: images[i],
            init: false,
            loaded: false,
            rendered: false,
            x: {
                delta: 0,
                position: this.canvasSize.width / 2 - this.config.size.width / 2,
                target: this.canvasSize.width / 2 - this.config.size.width / 2,
                v: 0
            },
            y: {
                delta: 0,
                position: height,
                target: height,
                v: 0
            }
        });
    }
};

window.ExperimentsCreative.InfiniteList.prototype.createElement = function (image) {
    'use strict';
    var li = document.createElement('li');
    li.appendChild(image.cloneNode());
    return li;
};


window.ExperimentsCreative.InfiniteList.prototype.animate = function () {
    'use strict';
    var i = 0,
        image,
        visible,
        length = this.images.length;

    if (!this.isMobile) {
        this.ease(this.wheel);
    }

    for (i; i < length; i += 1) {
        image = this.images[i];
        this.updatePosition(image);
        visible = this.checkIsInViewport(image.y.position, this.config.size.height, this.canvasSize.height);
        if (image.rendered && !visible) {
            this.listContainer.removeChild(image.element);
            image.rendered = false;
        }
        if (!image.rendered && visible) {
            this.listContainer.appendChild(image.element);
            this.loadImage(image);
            image.rendered = true;
        }
        if (image.rendered && image.y.position !== image.y.target || image.rendered && !image.init) {
            image.element.style.transform = 'translate3d(' + image.x.position + 'px, ' + image.y.position + 'px, 0)';
        }
    }
    this.requestAnimation = window.requestAnimationFrame(this.animate.bind(this));
};

window.ExperimentsCreative.InfiniteList.prototype.updatePosition = function (image) {
    'use strict';
    var size = this.config.size.height + this.config.space,
        min = -size,
        max = size * (this.images.length - 1),
        delta = size * this.images.length,
        value,
        position = this.isMobile ? this.pan.delta.y : this.wheel.position;
    image.y.target += position;
    this.ease(image.y);

    if (image.y.position >= max) {
        value = delta - image.y.target;
        image.y.target = -value;
        image.y.position = -value - image.y.delta;
        this.ease(image.y);
    }
    if (image.y.position <= min) {
        value = delta + image.y.target;
        image.y.target = value;
        image.y.position = value - image.y.delta;
        this.ease(image.y);
    }
};

window.ExperimentsCreative.InfiniteList.prototype.loadImage = function (element) {
    'use strict';
    var img;
    if (element.image.getAttribute('data-loaded') === 'true') {
        return;
    }
    element.image.setAttribute('data-loaded', 'true');
    img = new Image();
    img.src = element.image.getAttribute('data-src');
    img.onload = function () {
        element.image.src = element.image.getAttribute('data-src');
        element.element.querySelector('img').src = element.image.getAttribute('data-src');
    }.bind(this);
};

window.ExperimentsCreative.InfiniteList.prototype.checkIsInViewport = function (position, size, canvasSize) {
    'use strict';
    return position > -size && position < canvasSize + size;
};

window.ExperimentsCreative.InfiniteList.prototype.ease = function (axe) {
    'use strict';
    axe.delta = axe.target - axe.position;
    axe.v += axe.delta * this.config.easing.easing;
    axe.v *= this.config.easing.friction;
    axe.position += axe.v;
};
