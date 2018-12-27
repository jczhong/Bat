define(["require", "inherit", "app/list", "app/sprite"], function (require, inherit, List, Sprite) {
    'use strite';

    function Fruits(game) {
        this.base.constructor.call(this, game);
        this.context = this.game.context;

        this.x = 0;
        this.y = Math.floor((Math.random() * 600) + 1);;
        this.leftFruits = new List();
        this.rightFruits = new List();

        this.speed = 4;
        this.status = "display";

        this.leftTree = {
            x0: 120,
            y0: 200,
            x1: 20,
            y1: 470,
            x2: 230,
            y2: 470
        }
        this.rightTree = {
            x0: 870,
            y0: 200,
            x1: 780,
            y1: 470,
            x2: 980,
            y2: 470
        }

        this.lastControlTime = performance.now();
        this.lastRenderTime = performance.now();
    }
    Fruits.inherit(Sprite);

    Fruits.prototype.controlUpdate = function () {
        var nowTime = performance.now();
        //product one fruit every 3000 ms
        if (nowTime - this.lastControlTime > 3000) {
            var coord = this.getRandomCoord(this.leftTree);
            this.leftFruits.add({
                x: coord.x,
                y: coord.y,
                r: 1,
                status: "display"
            });

            coord = this.getRandomCoord(this.rightTree);
            this.rightFruits.add({
                x: coord.x,
                y: coord.y,
                r: 1,
                status: "display"
            })
            this.lastControlTime = nowTime;
        }
    }

    //get a random point on a triangle
    Fruits.prototype.getRandomCoord = function (tree) {
        var a = Math.random() * 10;
        var b = Math.random() * (10 - a);
        a /= 10;
        b /= 10;
        var coord = {};
        coord.x = tree.x0 * a + tree.x2 * b + (1 - a - b) * tree.x1;
        coord.y = tree.y0 * a + tree.y2 * b + (1 - a - b) * tree.y1;
        return coord;
    }

    Fruits.prototype.renderUpdate = function () {
        var nowTime = performance.now();
        var fruit;
        var iterate = this.leftFruits.iterate();
        while ((fruit = iterate.next()) != null) {
            //delete the fruit if is has exceeded boundary
            if (fruit.x > this.game.width || fruit.x < 0 || fruit.status == "dismiss") {
                this.leftFruits.delete(fruit);
                continue;
            }
            if (fruit.r < 7) {
                //grow up 1 every 800 ms
                if (nowTime - this.lastRenderTime > 800) {
                    fruit.r += 1;
                }
                continue;
            } else {
                //moving one step in 1000 ms
                fruit.x += this.speed;
            }
        }

        var iterate = this.rightFruits.iterate();
        while ((fruit = iterate.next()) != null) {
            if (fruit.x > this.game.width || fruit.x < 0 || fruit.status == "dismiss") {
                this.rightFruits.delete(fruit);
                continue;
            }
            if (fruit.r < 7) {
                if (nowTime - this.lastRenderTime > 800) {
                    fruit.r += 1;
                }
                continue;
            } else {
                fruit.x -= this.speed;
            }
        }
        if (nowTime - this.lastRenderTime > 1000) {
            this.lastRenderTime = nowTime;
        }
    }

    Fruits.prototype.drawFruit = function (fruit) {
        if (fruit.status != "dismiss") {
            this.context.beginPath();
            this.context.arc(fruit.x, fruit.y, fruit.r, 0, Math.PI * 2, true);
            this.context.fillStyle = `rgb(255,
                    ${Math.floor(255 - 42.5 * fruit.r)},
                    0)`;
            this.context.fill();
        }
    }

    Fruits.prototype.draw = function () {
        var fruit;
        var iterate = this.leftFruits.iterate();
        while ((fruit = iterate.next()) != null) {
            this.drawFruit(fruit);
        }

        var iterate = this.rightFruits.iterate();
        while ((fruit = iterate.next()) != null) {
            this.drawFruit(fruit);
        }
    }

    return Fruits;
})