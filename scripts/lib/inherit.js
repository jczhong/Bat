define(['require'], function (require) {
    'use strict';

    Function.prototype.inherit = function (baseClass) {
        var f = function () { };
        f.prototype = baseClass.prototype;
        this.prototype = new f();
        this.prototype.constructor = this;
        this.prototype.base = baseClass.prototype;
    }

    return;
});