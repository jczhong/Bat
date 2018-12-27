define(["require", "inherit", "app/sprite"], function (require, inherit, Sprite) {
    'use strite';

    function Background(game) {
        this.base.constructor.call(this, game);
        this.context = this.game.context;

        this.tree = {
            x: 0,
            y: 190,
            w: 256,
            h: 256,
        }
        this.tree.image = new Image();
        this.tree.image.src = "images/tree.png";
        this.bgImage = new Image();
        this.bgImage.src = "images/bg.png";

        this.bgAudio = document.getElementById("bg");
        this.bgAudio.loop = true;
        this.bgAudio.play();
    }
    Background.inherit(Sprite);

    Background.prototype.controlUpdate = function () {
    }

    Background.prototype.renderUpdate = function () {
    }

    Background.prototype.changeVolume = function (volume) {
        var vol = this.bgAudio.volume + volume;
        if (vol > 0 && vol < 1.0) {
            this.bgAudio.volume += volume;
        }
    }

    Background.prototype.gameOver = function() {
        this.bgAudio.pause();
    }

    Background.prototype.draw = function () {
        this.context.drawImage(this.bgImage, 0, 0);
        this.context.drawImage(this.tree.image, this.tree.x, this.tree.y);
        this.context.drawImage(this.tree.image, this.tree.x + 750, this.tree.y);
    }

    return Background;
})