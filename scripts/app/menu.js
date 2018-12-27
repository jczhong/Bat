define(["require", "inherit", "app/list", "app/sprite"], function (require, inherit, List, Sprite) {
    'use strite';

    function Menu(game) {
        this.base.constructor.call(this, game);
        this.context = this.game.context;

        this.buttons = new List();

        this.btnVolumeDown = {
            x: 880,
            y: 15,
            w: 30,
            h: 30,
            status: "display",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function (menu) {
                menu.game.changeVolume(-0.1);
            }
        };
        this.btnVolumeDown.image = new Image();
        this.btnVolumeDown.image.src = "images/vd.png";
        this.buttons.add(this.btnVolumeDown);

        this.btnVolumeUp = {
            x: 950,
            y: 15,
            w: 30,
            h: 30,
            status: "display",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function (menu) {
                menu.game.changeVolume(0.1);
            }
        };
        this.btnVolumeUp.image = new Image();
        this.btnVolumeUp.image.src = "images/vu.png";
        this.buttons.add(this.btnVolumeUp);

        this.btnStart = {
            x: 400,
            y: 100,
            w: 200,
            h: 60,
            status: "display",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function(menu) {
                menu.btnStart.status = "dismiss";
                menu.btnTime.status = "dismiss";
                menu.game.start();
            }
        };
        this.btnStart.image = new Image();
        this.btnStart.image.src = "images/start.png";
        this.buttons.add(this.btnStart);

        this.btnTime = {
            x: 400,
            y: 200,
            w: 200,
            h: 60,
            status: "display",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function(menu) {
                menu.btnStart.status = "dismiss";
                menu.btnTime.status = "dismiss";
                menu.btnTime1.status = "display";
                menu.btnTime3.status = "display";
                menu.btnTime5.status = "display";
                menu.btnTime7.status = "display";
            }
        };
        this.btnTime.image = new Image();
        this.btnTime.image.src = "images/time.png";
        this.buttons.add(this.btnTime);

        this.btnTime1 = {
            x: 400,
            y: 50,
            w: 200,
            h: 60,
            status: "dismiss",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function(menu) {
                menu.game.config.time = 1;
                menu.btnStart.status = "display";
                menu.btnTime.status = "display";
                menu.btnTime1.status = "dismiss";
                menu.btnTime3.status = "dismiss";
                menu.btnTime5.status = "dismiss";
                menu.btnTime7.status = "dismiss";
            }
        };
        this.btnTime1.image = new Image();
        this.btnTime1.image.src = "images/1m.png";
        this.buttons.add(this.btnTime1);

        this.btnTime3 = {
            x: 400,
            y: 160,
            w: 200,
            h: 60,
            status: "dismiss",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function(menu) {
                menu.game.config.time = 3;
                menu.btnStart.status = "display";
                menu.btnTime.status = "display";
                menu.btnTime1.status = "dismiss";
                menu.btnTime3.status = "dismiss";
                menu.btnTime5.status = "dismiss";
                menu.btnTime7.status = "dismiss";
            }
        };
        this.btnTime3.image = new Image();
        this.btnTime3.image.src = "images/3m.png";
        this.buttons.add(this.btnTime3);

        this.btnTime5 = {
            x: 400,
            y: 270,
            w: 200,
            h: 60,
            status: "dismiss",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function(menu) {
                menu.game.config.time = 5;
                menu.btnStart.status = "display";
                menu.btnTime.status = "display";
                menu.btnTime1.status = "dismiss";
                menu.btnTime3.status = "dismiss";
                menu.btnTime5.status = "dismiss";
                menu.btnTime7.status = "dismiss";
            }
        };
        this.btnTime5.image = new Image();
        this.btnTime5.image.src = "images/5m.png";
        this.buttons.add(this.btnTime5);

        this.btnTime7 = {
            x: 400,
            y: 380,
            w: 200,
            h: 60,
            status: "dismiss",
            draw: function (context) {
                context.drawImage(this.image, this.x, this.y);
            },
            eventHandler: function(menu) {
                menu.game.config.time = 7;
                menu.btnStart.status = "display";
                menu.btnTime.status = "display";
                menu.btnTime1.status = "dismiss";
                menu.btnTime3.status = "dismiss";
                menu.btnTime5.status = "dismiss";
                menu.btnTime7.status = "dismiss";
            }
        };
        this.btnTime7.image = new Image();
        this.btnTime7.image.src = "images/7m.png";
        this.buttons.add(this.btnTime7);

        this.pnlGameOver = {
            x: 350,
            y: 150,
            w: 300,
            h: 250,
            eventHandler: function (menu) {
                menu.context.drawImage(this.image, this.x, this.y);
                menu.context.font = "40px Arial"
                menu.context.fillStyle = "red";
                menu.context.fillText("Points: " + menu.points.count, this.x + 55, this.y + 180);
                menu.overAudio.play();
            }
        };
        this.pnlGameOver.image = new Image();
        this.pnlGameOver.image.src = "images/over.png";

        this.points = {
            x: 20,
            y: 30,
            count: 0,
            draw: function (context) {
                context.font = "20px Arial";
                context.fillStyle = "black";
                context.fillText(this.count, this.x, this.y, 20);
            }
        };

        this.overAudio = document.getElementById("over");
        this.overAudio.loop = true;
    }
    Menu.inherit(Sprite);

    Menu.prototype.gameOver = function() {
        this.pnlGameOver.eventHandler(this);
    }

    Menu.prototype.changeVolume = function(volume) {
        var vol = this.overAudio.volume + volume;
        if (vol > 0 && vol < 1.0) {
            this.overAudio.volume += volume;
        }
    }

    Menu.prototype.changePoint = function(point) {
        this.points.count += point;
    }

    Menu.prototype.controlUpdate = function () {
        if (this.game.mousePoints.click) {
            var button;
            var iterate = this.buttons.iterate();
            while ((button = iterate.next()) != null) {
                if (button.status == 'display') {
                    if (this.game.mousePoints.x >= button.x && 
                        this.game.mousePoints.x <= (button.x + button.w) &&
                        this.game.mousePoints.y >= button.y &&
                        this.game.mousePoints.y <= (button.y + button.h)) {
                            button.eventHandler(this);
                        }
                }
            }
            this.game.mousePoints.click = false;
            this.game.mousePoints.x = 0;
            this.game.mousePoints.y = 0;
        }
    }

    Menu.prototype.renderUpdate = function () {
    }

    Menu.prototype.draw = function () {
        var button;
        var iterate = this.buttons.iterate();
        while ((button = iterate.next()) != null) {
            if (button.status == 'display') {
                this.context.drawImage(button.image, button.x, button.y);
            }
        }
        this.points.draw(this.context);
    }

    return Menu;
})