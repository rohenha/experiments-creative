window.ExperimentsCreative.Gradient = function Gradient (colors, steps) {
    'use strict';
    this.values = colors;
    this.steps = steps;
    this.stepsPerc = 100 / (this.steps + 1);
    this.colors = [];
    this.valuesProcess = {
        end: this.processHEX(this.values.end),
        start: this.processHEX(this.values.start)
    };
    this.init();
};

window.ExperimentsCreative.Gradient.prototype.init = function () {
    'use strict';
    this.valClampRGB = [
        this.valuesProcess.end[0] - this.valuesProcess.start[0],
        this.valuesProcess.end[1] - this.valuesProcess.start[1],
        this.valuesProcess.end[2] - this.valuesProcess.start[2]
    ];
    this.buildArray();
};

window.ExperimentsCreative.Gradient.prototype.buildArray = function () {
    'use strict';
    var i = 0,
        clampedR,
        clampedG,
        clampedB;

    for (i; i < this.steps; i += 1) {
        clampedR = this.valClampRGB[0] > 0
            ? this.pad(Math.round(this.valClampRGB[0] / 100 * (this.stepsPerc * (i + 1))).toString(16), 2)
            : this.pad(Math.round(this.valuesProcess.start[0] + this.valClampRGB[0] / 100 * (this.stepsPerc * (i + 1))).toString(16), 2);

        clampedG = this.valClampRGB[1] > 0
            ? this.pad(Math.round(this.valClampRGB[1] / 100 * (this.stepsPerc * (i + 1))).toString(16), 2)
            : this.pad(Math.round(this.valuesProcess.start[1] + this.valClampRGB[1] / 100 * (this.stepsPerc * (i + 1))).toString(16), 2);

        clampedB = this.valClampRGB[2] > 0
            ? this.pad(Math.round(this.valClampRGB[2] / 100 * (this.stepsPerc * (i + 1))).toString(16), 2)
            : this.pad(Math.round(this.valuesProcess.start[2] + this.valClampRGB[2] / 100 * (this.stepsPerc * (i + 1))).toString(16), 2);

        this.colors[i] = [
            '#',
            clampedR,
            clampedG,
            clampedB
        ].join('');
    }
};

window.ExperimentsCreative.Gradient.prototype.pad = function (n, width, z) {
    'use strict';
    var newZ = z || '0',
        newN = String(n);
    return newN.length >= width ? newN : new Array(width - newN.length + 1).join(newZ) + newN;
};

window.ExperimentsCreative.Gradient.prototype.processHEX = function (val) {
    'use strict';
    // Does the hex contain extra char?
    var hex = val.length >6 ? val.substr(1, val.length - 1): val,
        r,
        g,
        b;
    // Is it a six character hex?
    if (hex.length > 3) {
        // Scrape out the numerics
        r = hex.substr(0, 2);
        g = hex.substr(2, 2);
        b = hex.substr(4, 2);
        // If not six character hex,
        // Then work as if its a three character hex
    } else {
        // Just concat the pieces with themselves
        r = hex.substr(0, 1) + hex.substr(0, 1);
        g = hex.substr(1, 1) + hex.substr(1, 1);
        b = hex.substr(2, 1) + hex.substr(2, 1);
    }
    // Return our clean values
    return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16)
    ];
};
