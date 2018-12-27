define(["require", "inherit", "app/sprite"], function (require, inherit, Sprite) {
    'use strite';

    function Hero(game) {
        this.base.constructor.call(this, game);
        this.context = this.game.context;

        this.x = 400;
        this.y = 300;
        this.width = 148;
        this.height = 90;
        this.speed = 2;

        this.images = [];
        for (var i = 0; i < 28; i++) {
            var image = new Image(this.width, this.height);
            image.src = 'images/' + i + '.png';
            this.images[i] = image;
        }

        //index of body image when the bat is facing left side
        this.leftBody = 0;
        //four frame image coordinate, [x, y, w, h]
        //when the bat is flying, his body is moving as well
        this.leftBodyCoord = [
            [39, 27, 43, 39], [37, 21, 43, 39], [37, 19, 43, 39], [37, 17, 43, 39]
        ]
        this.rightBody = 1;
        this.rightBodyCoord = [
            [68, 27, 43, 39], [68, 21, 43, 39], [68, 19, 43, 39], [68, 17, 43, 39]
        ]

        //index of four left wings images when the bat is facing left side
        this.leftLeftWings = [2, 3, 4, 5];
        //four frame image coordinate, [x, y, w, h]
        this.leftLeftWingCoords = [
            [23, 0, 28, 53], [0, 20, 54, 32], [20, 32, 28, 30], [35, 36, 17, 54]
        ];
        this.leftRightWings = [6, 7, 8, 9];
        this.leftRigntWingCoords = [
            [74, 0, 38, 53], [69, 20, 79, 32], [70, 33, 50, 22], [71, 35, 26, 55]
        ];

        //index of four right wings images when the bat is facing right side
        this.rightLeftWings = [10, 11, 12, 13];
        this.rightLeftWingCoords = [
            [38, 0, 38, 53], [0, 20, 79, 32], [28, 33, 50, 22], [51, 35, 26, 55]
        ];
        this.rightRightWings = [14, 15, 16, 17];
        this.rightRightWingCoords = [
            [99, 0, 28, 53], [94, 20, 54, 32], [100, 32, 28, 30], [96, 36, 17, 54]
        ];

        //index of eating images when the bat is facing left side
        this.leftEatBody = [18, 19, 20, 21];
        //we got four possible status according to the state of flying, 
        //and got four possible status of the bat's mouth in each perious status
        this.leftEatBodyCoord = [
            [
                [32, 26, 48, 43], [30, 20, 57, 51], [31, 19, 55, 60], [31, 17, 45, 70]
            ],
            [
                [24, 23, 48, 43], [21, 19, 57, 51], [20, 13, 55, 60], [21, 13, 45, 70]
            ],
            [
                [28, 24, 48, 43], [24, 16, 57, 51], [25, 14, 55, 60], [24, 15, 45, 70]
            ],
            [
                [37, 20, 48, 43], [37, 20, 57, 51], [37, 13, 55, 60], [35, 15, 45, 70]
            ]
        ];

        this.rightEatBody = [22, 23, 24, 25];
        this.rightEatBodyCoord = [
            [
                [69, 27, 48, 43], [69, 20, 57, 51], [69, 19, 55, 60], [69, 17, 45, 70]
            ],
            [
                [70, 26, 48, 43], [70, 19, 57, 51], [70, 15, 55, 60], [70, 16, 45, 70]
            ],
            [
                [68, 25, 48, 43], [68, 20, 57, 51], [68, 15, 55, 60], [68, 17, 45, 70]
            ],
            [
                [69, 20, 48, 43], [66, 20, 57, 51], [67, 15, 55, 60], [66, 17, 45, 70]
            ]
        ];
        //animation loop, for iterational convenience
        this.eatLoop = [0, 1, 2, 3, 2, 1, 0];

        //index of image when the bat was hit by fruit
        this.leftHit = 26;
        this.rightHit = 27;

        //initial status
        this.index = 1;
        this.eatIndex = -1;
        this.step = 1;

        this.status = 'left';
        this.lastHitTime = performance.now();
        this.lastRenderTime = performance.now();

        this.hitAudio = document.getElementById("hit");
        this.eatAudio = document.getElementById("eat");
    }
    Hero.inherit(Sprite);

    Hero.prototype.changeVolume = function (volume) {
        var vol = this.hitAudio.volume + volume;
        if (vol > 0 && vol < 1.0) {
            this.hitAudio.volume += volume;
            this.eatAudio.volume += volume;
        }
    }

    Hero.prototype.controlUpdate = function () {
        //this.base.controlUpdate.call(this);
        //moving controls
        if (this.game.keycodes["ArrowLeft"] == true) {
            if (this.x > 0) {
                this.x -= this.speed;
                this.status = 'left';
            }
        }
        if (this.game.keycodes["ArrowRight"] == true) {
            if ((this.x + this.width) < this.game.width) {
                this.x += this.speed;
                this.status = 'right';
            }
        }
        if (this.game.keycodes["ArrowUp"] == true) {
            if (this.y > 0) {
                this.y -= this.speed;
            }
        }
        if (this.game.keycodes["ArrowDown"] == true) {
            if ((this.y + this.height) < this.game.height) {
                this.y += this.speed;
            }
        }
        //eating control
        if (this.game.keycodes[" "] == true) {
            if (this.status == 'left') {
                this.status = 'leftEat';
            } else if (this.status == 'right') {
                this.status = 'rightEat';
            }
        }
    }

    Hero.prototype.renderUpdate = function () {
        //this.base.renderUpdate.call(this);
        //flying loop
        if (this.index == 0 || this.index == 3) {
            this.step = -this.step;
        }
        this.index += this.step;

        //eating loop
        if (this.status == 'leftEat' || this.status == 'rightEat') {
            if (this.eatIndex < (this.eatLoop.length - 1)) {
                this.eatIndex++;
            } else {
                this.eatIndex = -1;
                if (this.status == 'leftEat') {
                    this.status = 'left';
                } else if (this.status == 'rightEat') {
                    this.status = 'right';
                }
            }
        }
    }

    //simple AABB collision detection algorithm
    Hero.prototype.intersects = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 + w1 > x2 &&
            y1 + h1 > y2 &&
            x1 < x2 + w2 &&
            y1 < y2 + h2) {
            return true;
        } else {
            return false;
        }
    }

    Hero.prototype.collisionCheckFlying = function (fruit, coord) {
        if (fruit.r == 7 && fruit.status != "dismiss") {
            if (this.intersects(this.x + coord[0], this.y + coord[1], coord[2], coord[3],
                fruit.x - fruit.r, fruit.y - fruit.r, fruit.r * 2, fruit.r * 2)) {
                if (fruit.status == "pause") {
                    var nowTime = performance.now();
                    //add 300ms delay after the bat was hit by fruit
                    if (nowTime - this.lastHitTime > 350) {
                        fruit.status = "dismiss";
                        if (this.status == "left") {
                            this.status = "leftHit";
                        } else {
                            this.status = "rightHit";
                        }
                        this.game.menu.changePoint(-1);
                        this.hitAudio.play();
                        this.lastRenderTime = performance.now();
                    }
                } else {
                    fruit.status = "pause";
                    this.lastHitTime = performance.now();
                }
            }
        }
    }

    Hero.prototype.collisionCheckEating = function(fruit, coord) {
        if (fruit.r == 7 && fruit.status != "dismiss") {
            if (this.intersects(this.x + coord[0], this.y + coord[1], coord[2], coord[3],
                fruit.x - fruit.r, fruit.y - fruit.r, fruit.r * 2, fruit.r * 2)) {
                if (fruit.status == "eatPause") {
                    var nowTime = performance.now();
                    //let the fruit fly 380ms, then dismiss
                    if (nowTime - this.lastHitTime > 380) {
                        fruit.status = "dismiss";
                        this.game.menu.changePoint(1);
                        this.eatAudio.play();
                        this.lastRenderTime = performance.now();
                    }
                } else {
                    fruit.status = "eatPause";
                    this.lastHitTime = performance.now();
                }
            }
        }
    }

    Hero.prototype.collisionCheck = function (fruits) {
        if (this.status == "left" || this.status == "right") {
            var coord;
            if (this.status == "left") {
                coord = this.leftBodyCoord[this.index];
            } else {
                coord = this.rightBodyCoord[this.index];
            }

            var iterate = fruits.leftFruits.iterate();
            while ((fruit = iterate.next()) != null) {
                this.collisionCheckFlying(fruit, coord);
            }

            iterate = fruits.rightFruits.iterate();
            while ((fruit = iterate.next()) != null) {
                this.collisionCheckFlying(fruit, coord);
            }
        } else if (this.status == "leftEat" || this.status == "rightEat") {
            if (this.eatIndex != -1) {
                var coord;
                if (this.status == "leftEat") {
                    coord = this.leftEatBodyCoord[this.eatLoop[this.eatIndex]][this.index];
                    var iterate = fruits.leftFruits.iterate();
                    while ((fruit = iterate.next()) != null) {
                        this.collisionCheckEating(fruit, coord);
                    }
                } else {
                    coord = this.rightEatBodyCoord[this.eatLoop[this.eatIndex]][this.index];
                    var iterate = fruits.rightFruits.iterate();
                    while ((fruit = iterate.next()) != null) {
                        this.collisionCheckEating(fruit, coord);
                    }
                }
            }
        }
    }

    Hero.prototype.draw = function () {
        var coord;
        if (this.status == 'left') {
            coord = this.leftLeftWingCoords[this.index];
            this.context.drawImage(this.images[this.leftLeftWings[this.index]], this.x + coord[0], this.y + coord[1])

            coord = this.leftBodyCoord[this.index];
            this.context.drawImage(this.images[this.leftBody], this.x + coord[0], this.y + coord[1]);

            coord = this.leftRigntWingCoords[this.index];
            this.context.drawImage(this.images[this.leftRightWings[this.index]], this.x + coord[0], this.y + coord[1]);
        } else if (this.status == 'right') {
            coord = this.rightRightWingCoords[this.index];
            this.context.drawImage(this.images[this.rightRightWings[this.index]], this.x + coord[0], this.y + coord[1])

            coord = this.rightBodyCoord[this.index];
            this.context.drawImage(this.images[this.rightBody], this.x + coord[0], this.y + coord[1]);

            coord = this.rightLeftWingCoords[this.index];
            this.context.drawImage(this.images[this.rightLeftWings[this.index]], this.x + coord[0], this.y + coord[1]);
        } else if (this.status == 'leftHit') {
            this.context.drawImage(this.images[this.leftHit], this.x, this.y);
            var nowTime = performance.now();
            if (nowTime - this.lastRenderTime > 300) {
                this.status = "left";
                this.lastRenderTime = nowTime;
            }
        } else if (this.status == 'rightHit') {
            this.context.drawImage(this.images[this.rightHit], this.x, this.y);
            var nowTime = performance.now();
            if (nowTime - this.lastRenderTime > 300) {
                this.status = "right";
                this.lastRenderTime = nowTime;
            }
        } else {
            if (this.eatIndex >= 0) {
                var coord;
                if (this.status == 'leftEat') {
                    coord = this.leftLeftWingCoords[this.index];
                    this.context.drawImage(this.images[this.leftLeftWings[this.index]], this.x + coord[0], this.y + coord[1]);

                    coord = this.leftEatBodyCoord[this.eatLoop[this.eatIndex]][this.index];
                    this.context.drawImage(this.images[this.leftEatBody[this.eatLoop[this.eatIndex]]], this.x + coord[0], this.y + coord[1]);

                    coord = this.leftRigntWingCoords[this.index];
                    this.context.drawImage(this.images[this.leftRightWings[this.index]], this.x + coord[0], this.y + coord[1]);
                } else if (this.status == 'rightEat') {
                    coord = this.rightRightWingCoords[this.index];
                    this.context.drawImage(this.images[this.rightRightWings[this.index]], this.x + coord[0], this.y + coord[1]);

                    coord = this.rightEatBodyCoord[this.eatLoop[this.eatIndex]][this.index];
                    this.context.drawImage(this.images[this.rightEatBody[this.eatLoop[this.eatIndex]]], this.x + coord[0], this.y + coord[1]);

                    coord = this.rightLeftWingCoords[this.index];
                    this.context.drawImage(this.images[this.rightLeftWings[this.index]], this.x + coord[0], this.y + coord[1]);
                }
            }
        }
    }

    return Hero;
})