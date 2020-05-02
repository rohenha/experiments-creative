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
                    end: '#FA709A',
                    start: '#21D4FD'
                },
                interval: 0.05,
                points: 3,
                size: 350,
                stroke: 2
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
