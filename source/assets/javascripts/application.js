//= require_self
//= require hammerjs/hammer.min
//= require pixi.js/dist/pixi.min
//= require pixi-filters/dist/pixi-filters
//= require_tree ./components
//= require_tree ./pages
//= require _app

window.ExperimentsCreative = {};

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    window.ExperimentsCreative.App.init();
});
