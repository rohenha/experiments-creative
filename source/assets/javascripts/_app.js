window.ExperimentsCreative.App = {
    init: function () {
        'use strict';
        var container = document.querySelector('#page'),
            experiment = container.getAttribute('data-experience');
        switch (experiment) {
        case 'hexagon':
            new window.ExperimentsCreative.Hexagon(container, {
                colors: {
                    end: '#4A00E0',
                    start: '#FEE140'
                },
                points: 3,
                radius: 2,
                size: 350
            });
            break;
        case 'triangle':
            new window.ExperimentsCreative.Triangle(container, {
                colors: {
                    end: '#4A00E0',
                    start: '#FEE140'
                },
                interval: 0.05,
                points: 5,
                size: 350,
                stroke: 2
            });
            break;
        case 'particles':
            new window.ExperimentsCreative.Particles(container, {
                colors: {
                    end: '#4A00E0',
                    start: '#FEE140'
                }
            });
            break;
        case 'galerie':
            new window.ExperimentsCreative.Galerie(container, {
                delta: 2,
                grid: {
                    x: 5
                }
            });
            break;
        default:
        }
    },

    invoke: function () {
        'use strict';
        return {
            init: this.init.bind(this)
        };
    }

}.invoke();
