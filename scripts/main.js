requirejs.config({
    baseUrl: "scripts/lib",
    paths: {
        app: "../app"
    }
});

requirejs(["app/game", "app/hero", "app/fruits", "app/menu", "app/background"],
    function (Game, Hero, Fruits, Menu, Background) {
        var mycanvas = document.getElementById("mycanvas");
        var game = new Game(mycanvas);

        var hero = new Hero(game);
        game.addHero(hero);

        var fruits = new Fruits(game);
        game.addFruits(fruits);

        var menu = new Menu(game);
        game.addMenu(menu);

        var background = new Background(game);
        game.addBackground(background);

        game.launch();
    }
);