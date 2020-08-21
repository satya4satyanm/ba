var game;
var gameOptions = {
    colors: ["0xffffff", "0xff0000", "0x00ff00", "0x0000ff", "0xffff00"],
    columns: 3,
    rows: 4,
    thumbWidth: 60,
    thumbHeight: 60,
    spacing: 20,
    localStorageName: "levelselect"
}
window.onload = function () {
    var gameConfig = {
        width: 320,
        height: 480,
        backgroundColor: 0x222222,
        scene: [playGame, playLevel]
    }
    game = new Phaser.Game(gameConfig);
}
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.spritesheet("levelthumb", "levelthumb.png", {
            frameWidth: 60,
            frameHeight: 60
        });
        this.load.image("levelpages", "levelpages.png");
        this.load.image("transp", "transp.png");
    }
    create() {
        this.stars = [];
        this.stars[0] = 0;
        this.canMove = true;
        this.itemGroup = this.add.group();
        for (var l = 1; l < gameOptions.columns * gameOptions.rows * gameOptions.colors.length; l++) {
            this.stars[l] = -1;
        }
        this.savedData = localStorage.getItem(gameOptions.localStorageName) == null ? this.stars.toString() : localStorage.getItem(gameOptions.localStorageName);
        this.stars = this.savedData.split(",");
        this.pageText = this.add.text(game.config.width / 2, 16, "Swipe to select level page (1 / " + gameOptions.colors.length + ")", {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        this.pageText.setOrigin(0.5);
        this.scrollingMap = this.add.tileSprite(0, 0, gameOptions.colors.length * game.config.width, game.config.height, "transp");
        this.scrollingMap.setInteractive();
        this.input.setDraggable(this.scrollingMap);
        this.scrollingMap.setOrigin(0, 0);
        this.currentPage = 0;
        this.pageSelectors = [];
        var rowLength = gameOptions.thumbWidth * gameOptions.columns + gameOptions.spacing * (gameOptions.columns - 1);
        var leftMargin = (game.config.width - rowLength) / 2 + gameOptions.thumbWidth / 2;
        var colHeight = gameOptions.thumbHeight * gameOptions.rows + gameOptions.spacing * (gameOptions.rows - 1);
        var topMargin = (game.config.height - colHeight) / 2 + gameOptions.thumbHeight / 2;
        for (var k = 0; k < gameOptions.colors.length; k++) {
            for (var i = 0; i < gameOptions.columns; i++) {
                for (var j = 0; j < gameOptions.rows; j++) {
                    var thumb = this.add.image(k * game.config.width + leftMargin + i * (gameOptions.thumbWidth + gameOptions.spacing), topMargin + j * (gameOptions.thumbHeight + gameOptions.spacing), "levelthumb");
                    thumb.setTint(gameOptions.colors[k]);
                    thumb.levelNumber = k * (gameOptions.rows * gameOptions.columns) + j * gameOptions.columns + i;
                    thumb.setFrame(parseInt(this.stars[thumb.levelNumber]) + 1);
                    this.itemGroup.add(thumb);
                    var levelText = this.add.text(thumb.x, thumb.y - 12, thumb.levelNumber, {
                        font: "24px Arial",
                        fill: "#000000"
                    });
                    levelText.setOrigin(0.5);
                    this.itemGroup.add(levelText);
                }
            }
            this.pageSelectors[k] = this.add.sprite(game.config.width / 2 + (k - Math.floor(gameOptions.colors.length / 2) + 0.5 * (1 - gameOptions.colors.length % 2)) * 40, game.config.height - 40, "levelpages");
            this.pageSelectors[k].setInteractive();
            this.pageSelectors[k].on("pointerdown", function () {
                if (this.scene.canMove) {
                    var difference = this.pageIndex - this.scene.currentPage;
                    this.scene.changePage(difference);
                    this.scene.canMove = false;
                }
            });
            this.pageSelectors[k].pageIndex = k;
            this.pageSelectors[k].tint = gameOptions.colors[k];
            if (k == this.currentPage) {
                this.pageSelectors[k].scaleY = 1;
            }
            else {
                this.pageSelectors[k].scaleY = 0.5;
            }
        }
        this.input.on("dragstart", function (pointer, gameObject) {
            gameObject.startPosition = gameObject.x;
            gameObject.currentPosition = gameObject.x;
        });
        this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
            if (dragX <= 10 && dragX >= -gameObject.width + game.config.width - 10) {
                gameObject.x = dragX;
                var delta = gameObject.x - gameObject.currentPosition;
                gameObject.currentPosition = dragX;
                this.itemGroup.children.iterate(function (item) {
                    item.x += delta;
                });
            }
        }, this);
        this.input.on("dragend", function (pointer, gameObject) {
            this.canMove = false;
            var delta = gameObject.startPosition - gameObject.x;
            if (delta == 0) {
                this.canMove = true;
                this.itemGroup.children.iterate(function (item) {
                    if (item.texture.key == "levelthumb") {
                        var boundingBox = item.getBounds();
                        if (Phaser.Geom.Rectangle.Contains(boundingBox, pointer.x, pointer.y) && item.frame.name > 0) {
                            this.scene.start("PlayLevel", {
                                level: item.levelNumber,
                                stars: this.stars
                            });
                        }
                    }
                }, this);
            }
            if (delta > game.config.width / 8) {
                this.changePage(1);
            }
            else {
                if (delta < -game.config.width / 8) {
                    this.changePage(-1);
                }
                else {
                    this.changePage(0);
                }
            }
        }, this);
    }
    changePage(page) {
        this.currentPage += page;
        for (var k = 0; k < gameOptions.colors.length; k++) {
            if (k == this.currentPage) {
                this.pageSelectors[k].scaleY = 1;
            }
            else {
                this.pageSelectors[k].scaleY = 0.5;
            }
        }
        this.pageText.text = "Swipe to select level page (" + (this.currentPage + 1).toString() + " / " + gameOptions.colors.length + ")";
        var currentPosition = this.scrollingMap.x;
        this.tweens.add({
            targets: this.scrollingMap,
            x: this.currentPage * -game.config.width,
            duration: 300,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onUpdate: function (tween, target) {
                var delta = target.x - currentPosition;
                currentPosition = target.x;
                this.itemGroup.children.iterate(function (item) {
                    item.x += delta;
                });
            },
            onComplete: function () {
                this.canMove = true;
            }
        });
    }
}
class playLevel extends Phaser.Scene {
    constructor() {
        super("PlayLevel");
    }
    init(data) {
        this.level = data.level;
        this.stars = data.stars;
    }
    create() {
        this.add.text(game.config.width / 2, 20, "Play level " + this.level.toString(), {
            font: "32px Arial",
            color: "#ffffff"
        }).setOrigin(0.5);
        var failLevel = this.add.text(20, 60, "Fail level", {
            font: "48px Arial",
            color: "#ff0000"
        });
        failLevel.setInteractive();
        failLevel.on("pointerdown", function () {
            this.scene.start("PlayGame");
        }, this);
        var oneStarLevel = this.add.text(20, 160, "Get 1 star", {
            font: "48px Arial",
            color: "#ff8800"
        });
        oneStarLevel.setInteractive();
        oneStarLevel.on("pointerdown", function () {
            this.stars[this.level] = Math.max(this.stars[this.level], 1);
            if (this.stars[this.level + 1] != undefined && this.stars[this.level + 1] == -1) {
                this.stars[this.level + 1] = 0;
            }
            localStorage.setItem(gameOptions.localStorageName, this.stars.toString());
            this.scene.start("PlayGame");
        }, this);
        var twoStarsLevel = this.add.text(20, 260, "Get 2 stars", {
            font: "48px Arial",
            color: "#ffff00"
        });
        twoStarsLevel.setInteractive();
        twoStarsLevel.on("pointerdown", function () {
            this.stars[this.level] = Math.max(this.stars[this.level], 2);
            if (this.stars[this.level + 1] != undefined && this.stars[this.level + 1] == -1) {
                this.stars[this.level + 1] = 0;
            }
            localStorage.setItem(gameOptions.localStorageName, this.stars.toString());
            this.scene.start("PlayGame");
        }, this);
        var threeStarsLevel = this.add.text(20, 360, "Get 3 stars", {
            font: "48px Arial",
            color: "#00ff00"
        });
        threeStarsLevel.setInteractive();
        threeStarsLevel.on("pointerdown", function () {
            this.stars[this.level] = 3;
            if (this.stars[this.level + 1] != undefined && this.stars[this.level + 1] == -1) {
                this.stars[this.level + 1] = 0;
            }
            localStorage.setItem(gameOptions.localStorageName, this.stars.toString());
            this.scene.start("PlayGame");
        }, this);
    }
}
