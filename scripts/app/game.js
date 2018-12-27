define(["require"], function (require) {
    'use strict';

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function Game(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = canvas.getContext('2d');

        this.status = "";

        this.keycodes = {};
        document.addEventListener('keydown', this.keyPress.bind(this));
        document.addEventListener('keyup', this.keyPress.bind(this));

        this.mousePoints = {
            click: false,
            x: 0,
            y: 0
        };
        this.canvas.addEventListener("mousedown", this.mouseEvent.bind(this));

        this.config = {
            volume: 25,
            time: 5,
            //control speed of control and render
            renderTickLength: 120,
            controlTickLength: 20,
        }
    }

    Game.prototype = {
        constructor: Game,

        keyPress: function (e) {
            if (e.type == "keydown") {
                this.keycodes[e.key] = true;
            }
            if (e.type == "keyup") {
                this.keycodes[e.key] = false;
            }
        },

        mouseEvent: function (e) {
            if (e.type == "mousedown") {
                this.mousePoints.click = true;
                this.mousePoints.x = e.offsetX;
                this.mousePoints.y = e.offsetY;
            }
        },

        addFruits: function (fruits) {
            this.fruits = fruits;
        },

        addHero: function (hero) {
            this.hero = hero;
        },

        addMenu: function (menu) {
            this.menu = menu;
        },

        addBackground: function(background) {
            this.background = background;
        },

        changeVolume: function(volume) {
            this.menu.changeVolume(volume);
            this.background.changeVolume(volume);
            this.hero.changeVolume(volume);
        },

        loop: function (tFrame) {
            if (this.status == "stop") {
                this.background.gameOver();
                this.menu.gameOver();
                return;
            } else {
                window.requestAnimationFrame(this.loop.bind(this));
                var nextRenderTick = this.lastRenderTick + this.renderTickLength;
                var nextControlTick = this.lastControlTick + this.controlTickLength;
                var numRenderTicks = 0;
                var numControlTicks = 0;

                if (tFrame > nextRenderTick) {
                    var timeSinceTick = tFrame - this.lastRenderTick;
                    numRenderTicks = Math.floor(timeSinceTick / this.renderTickLength);
                }
                if (tFrame > nextControlTick) {
                    var timeSinceTick = tFrame - this.lastControlTick;
                    numControlTicks = Math.floor(timeSinceTick / this.controlTickLength);
                }

                if (this.status == "start") {
                    for (var i = 0; i < numControlTicks; i++) {
                        this.lastControlTick += this.controlTickLength;

                        this.hero.controlUpdate();
                        this.fruits.controlUpdate();
                    }
                }
                //In order to respond in time, menu get control every frame
                this.menu.controlUpdate();

                if (this.status == "start") {
                    for (var i = 0; i < numRenderTicks; i++) {
                        this.lastRenderTick += this.renderTickLength;

                        this.hero.renderUpdate();
                        this.fruits.renderUpdate();
                    }
                }
                //In order to respond in time, menu get update every frame
                this.menu.renderUpdate();

                this.hero.collisionCheck(this.fruits);

                this.context.clearRect(0, 0, this.width, this.height);

                this.background.draw();
                if (this.status == "start") {
                    this.hero.draw();
                    this.fruits.draw();
                }
                this.menu.draw();
            }
        },

        start: function () {
            setTimeout(this.stop.bind(this), this.config.time * 1000 * 60);
            this.status = "start";
        },

        stop: function () {
            this.status = "stop";
        },

        launch: function () {
            this.lastRenderTick = this.lastControlTick = performance.now();
            this.renderTickLength = this.config.renderTickLength;
            this.controlTickLength = this.config.controlTickLength;
            this.loop(performance.now());
        }
    }

    return Game;
})