var gameConfig = {
    "gameName": "Rescue The Zombies",
    "author": "Satyanarayan Mishra",
    "email": "satya4satyanm@gmail.com",
    "music": "on",
    "levels": [
        {
            "name": "Level One",
            "stars": 3,
            "speedMultiplier": 1,
            "completeMsg": "",
            "completeRewards": {
                "gameCoins": 50
            },
            "graphics": {
                "background": "bg1",
                "others": [
                    "waterFall", "cloud"
                ]
            },
            "enimies": [
                {
                    "sprite": "ghost1",
                    "position": { x: 600, y: 300 },
                    "strength": 100,
                    "reward": {
                        "coins": 30
                    }
                },
                {
                    "sprite": "apple",
                    "position": { x: 450, y: 420 },
                    "strength": 100,
                    "reward": {
                        "coins": 30
                    }
                }
            ],
            "obstacles": [
                {
                    "sprite": "stone",
                    x: 350,
                    y: 370
                }
            ]
        },
        {
            "name": "Level One",
            "stars": 3,
            "speedMultiplier": 1,
            "completeMsg": "",
            "completeRewards": {
                "gameCoins": 50
            },
            "graphics": {
                "background": "bg1",
                "others": [
                    "waterFall", "cloud"
                ]
            },
            "enimies": [
                {
                    "sprite": "ghost1",
                    "position": { x: 600, y: 300 },
                    "strength": 100,
                    "reward": {
                        "coins": 30
                    }
                }
            ],
            "obstacles": [
                {
                    "sprite": ""
                }
            ]
        }
    ]
};


var game;
var g = 0.25;


function getTipPoint(o) {
    var d = 25;
    var x = o.x;
    var y = o.y;
    var alpha = (o.angle - 90) * Math.PI / 180;
    o.tip = { x: x + (d * Math.cos(alpha)), y: y + (d * Math.sin(alpha)) };
    return o.tip;
}


function pixelPerfectHitTest(object1, image) {
    var p = getTipPoint(object1);
    if (p.x > image.x && p.y > image.y && p.x < image.x + image.width && p.y < image.y + image.height) {
        var m = image.texture.manager;
        var alpha = m.getPixelAlpha(p.x - image.x, p.y - image.y, image.texture.key); // , 1 removed
        if (alpha > 200) {
            // graphics = that.add.graphics();
            // graphics.lineStyle(thickness, colorRed, 1);
            // graphics.strokeRect(p.x, p.y, 1, 1);
            return true;
        } else {
            return false;
        }
    }
}


var gameOptions = {
    colors: ["0xffffff", "0xff0000", "0x00ff00", "0x0000ff", "0xffff00"],
    columns: 6,
    rows: 4,
    thumbWidth: 60,
    thumbHeight: 45,
    spacing: 50,
    localStorageName: "levelselect",
    worlds: ["Easter Island", "Tiki Island", "Amazon Jungles", "Ice Land", "Halloween Island"],
    initialTime: 60
}


window.onload = function () {
    var gameConfig = {
        backgroundColor: 0x222222,
        scene: [BootScene, PreloadScene, Intro, LevelSelect, PlayLevel, Paused],
        fps: {
            target: 60,
            // forceSetTimeOut: true
        },
        scale: {
            width: 800,
            height: 496
        }
    }
    game = new Phaser.Game(gameConfig);
}

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('background', './assets/background.png');
    }

    create() {
        this.scene.start("PreloadScene");
    }
}

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    preload() {
        this.add.image(0, -100, 'background').setOrigin(0, 0);

        this.graphics = this.add.graphics();
        this.newGraphics = this.add.graphics();
        var progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 5);
        var progressBarFill = new Phaser.Geom.Rectangle(201, 201, 290, 3);
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRectShape(progressBar);
        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(progressBarFill);
        var loadingText = this.add.text(250, 260, "Loading: ", { fontSize: '32px', fill: '#FFF' });



        // this.load.image('background', './assets/background.png');


        for (var i = 0; i < 3; i++) {
            this.load.image('background_' + i, './assets/background.png');
        }
        this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics, loadingText: loadingText });
        this.load.on('complete', this.complete, { scene: this.scene });
    }
    create() {

    }
    updateBar(percentage) {
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(201, 201, percentage * 390, 3));
        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
    }
    complete() {
        this.scene.start("Intro");
    }

}


class Intro extends Phaser.Scene {
    constructor() {
        super("Intro");
    }
    preload() {
        this.load.image("transp", "./assets/background.png");
        this.load.atlas('atlas', './assets/texture.png', './assets/texture.json');
    }
    create() {
        this.add.image(0, -100, "transp").setOrigin(0, 0);
        this.add.image(game.config.width / 2 + 20, 160, 'atlas', 'Symbol10005').setRotation(45);

        var txt = this.add.text(400, 300, "You are the saviour.\nSave the Islands..!", {
            fontFamily: "Arial", fontSize: 20,
            color: "#ffffff",
            lineSpacing: 20,
            align: "center"
        }).setOrigin(0.5, 0.5);
        txt.setStroke('rgba(f,f,f,0.5)', 8);
        txt.setShadow(0, 0, "#7b3f00", 4, true, true);

        var skip = this.add.text(400, 400, "CONTINUE", {
            fontFamily: "Arial", fontSize: 24,
            color: "#ffffff"
        }).setOrigin(0.5, 0.5).setInteractive();
        skip.setStroke('rgba(f,f,f,0.5)', 8);
        skip.setShadow(2, 2, "#7b3f00", 4, true, true);
        skip.setTint(0x33FFFF, 0x33FFFF, 0xFF00FF, 0xFF00FF);

        skip.on("pointerup", function () {
            this.scene.start("LevelSelect");
        }, this);
    }
}


class Paused extends Phaser.Scene {
    constructor() {
        super("Paused");
    }
    preload() {
        this.load.image("notpause", "./assets/notpause.png");
    }
    create() {
        var pause = this.add.image(760, 30, 'notpause').setScale(0.8).setInteractive();

        pause.on("pointerdown", function () {
            this.scene.resume("PlayLevel");
            this.scene.sendToBack();
        }, this);
    }
}

class LevelSelect extends Phaser.Scene {
    constructor() {
        super("LevelSelect");
    }
    preload() {
        this.load.spritesheet("levelthumb", "levelthumb.png", {
            frameWidth: 60,
            frameHeight: 78
        });
        this.load.image("levelpages", "levelpages.png");
        this.load.image("longbg", "./assets/long-bg.png");
        this.load.image("nextBtn", "./assets/rightArrow.png");
        this.load.image("icons", "./assets/icons.png");
    }
    create() {
        this.stars = [];
        this.stars[0] = 0;
        this.canMove = true;
        this.container = this.add.container(0,0);
        this.itemGroup = this.add.group();

        this.input.on('pointerdown', function (p) {
            console.log(p.x, p.y)
        })

        for (var l = 1; l < gameOptions.columns * gameOptions.rows * gameOptions.colors.length; l++) {
            this.stars[l] = -1;
        }
        this.savedData = localStorage.getItem(gameOptions.localStorageName) == null ? this.stars.toString() : localStorage.getItem(gameOptions.localStorageName);
        this.stars = this.savedData.split(",");

        this.scrollingMap = this.add.image(0, -100, "longbg");
        this.scrollingMap.setInteractive();
        this.input.setDraggable(this.scrollingMap);
        this.scrollingMap.setOrigin(0, 0);
        // this.scrollingMap.setTint(0x000000, 0x000000);

        this.pageText = this.add.text(20, 15, gameOptions.worlds[0] + " (1 / " + gameOptions.colors.length + ")", {
            fontFamily: "Arial", fontSize: 20,
            fill: "#ffffff",
            align: "center"
        });
        this.pageText.setOrigin(0, 0);
        this.pageText.setStroke('rgba(f,f,f,0.5)', 8);
        this.pageText.setShadow(2, 2, "#7b3f00", 4, true, true);
        this.pageText.setTint(0xFFFFFF, 0xFFFFFF, 0x33FFFF, 0x33FFFF);

        this.currentPage = 0;
        var rowLength = gameOptions.thumbWidth * gameOptions.columns + gameOptions.spacing * (gameOptions.columns - 1);
        var leftMargin = (game.config.width - rowLength) / 2 + gameOptions.thumbWidth / 2;
        var colHeight = gameOptions.thumbHeight * gameOptions.rows + gameOptions.spacing * (gameOptions.rows - 1);
        var topMargin = (game.config.height - colHeight) / 2 + gameOptions.thumbHeight / 2;
        for (var k = 0; k < gameOptions.colors.length; k++) {
            for (var i = 0; i < gameOptions.columns; i++) {
                for (var j = 0; j < gameOptions.rows; j++) {
                    var thumb = this.add.image(k * game.config.width + leftMargin + i * (gameOptions.thumbWidth + gameOptions.spacing), topMargin + j * (gameOptions.thumbHeight + gameOptions.spacing) + 20, "levelthumb");
                    // thumb.setTint(gameOptions.colors[k]);
                    thumb.levelNumber = k * (gameOptions.rows * gameOptions.columns) + j * gameOptions.columns + i;
                    thumb.setFrame(parseInt(this.stars[thumb.levelNumber]) + 1);
                    this.itemGroup.add(thumb);
                    var levelText = this.add.text(thumb.x, thumb.y - 12, thumb.levelNumber + 1, {
                        font: "24px Arial",
                        fill: "#ffffff"
                    });
                    levelText.setOrigin(0.5);
                    this.itemGroup.add(levelText);
                }
            }
        }
        this.input.on("dragstart", function (pointer, gameObject) {
            gameObject.startPosition = gameObject.x;
            gameObject.currentPosition = gameObject.x;
        });
        this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
            if (dragX <= 0 && dragX >= -gameObject.width + game.config.width - 0) {
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

        var prevBtn = this.add.image(40, 270, "nextBtn").setInteractive().setScale(-1, 1);
        var nextBtn = this.add.image(760, 270, "nextBtn").setInteractive();
        prevBtn.on('pointerdown', function () {
            if (this.scene.currentPage > 0) {
                this.scene.changePage(-1);
                this.scene.canMove = false;
            }
        })
        nextBtn.on('pointerdown', function () {
            if (this.scene.currentPage < gameOptions.colors.length - 1) {
                this.scene.changePage(1);
                this.scene.canMove = false;
            }
        });

        var controls = this.add.image(780, 15, "icons").setInteractive().setOrigin(1, 0).setScale(0.8);
        var lifes = this.add.text(546, 44, "12", {
            fontFamily: "Arial", fontSize: 16,
            fill: "#ffffff"
        }).setOrigin(0.5, 0).setStroke('rgba(f,f,f,0.5)', 5);
        var coins = this.add.text(600, 44, "245", {
            fontFamily: "Arial", fontSize: 16,
            fill: "#ffffff"
        }).setOrigin(0.5, 0).setStroke('rgba(f,f,f,0.5)', 5);
        var bombs = this.add.text(655, 44, "300", {
            fontFamily: "Arial", fontSize: 16,
            fill: "#ffffff"
        }).setOrigin(0.5, 0).setStroke('rgba(f,f,f,0.5)', 5);
        var settings = this.add.text(710, 44, "657", {
            fontFamily: "Arial", fontSize: 16,
            fill: "#ffffff"
        }).setOrigin(0.5, 0).setStroke('rgba(f,f,f,0.5)', 5);
        var bags = this.add.text(763, 44, "4567", {
            fontFamily: "Arial", fontSize: 16,
            fill: "#ffffff"
        }).setOrigin(0.5, 0).setStroke('rgba(f,f,f,0.5)', 5);
    }
    changePage(page) {
        this.currentPage += page;
        this.pageText.text = gameOptions.worlds[this.currentPage] + " (" + (this.currentPage + 1).toString() + " / " + gameOptions.colors.length + ")";
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


class PlayLevel extends Phaser.Scene {
    constructor() {
        super("PlayLevel");
    }
    init(data) {
        this.level = data.level;
        this.stars = data.stars;
    }
    preload() {
        var config = gameConfig;
        var levelObj = config.levels[this.level];

        this.load.image("energycontainer", "./assets/energycontainer.png");
        this.load.image("energybar", "./assets/energybar.png");

        // for (var i in levelObj.graphics.sprites) {

        // }
        this.load.image('cloud', './assets/cloud.png');
        this.load.image('ghost1', './assets/ghost1.png');
        this.load.image('spark', './assets/b1.png');
        this.load.image('plant', './assets/plant.png');
        this.load.image('stone', './assets/stone.png');
        this.load.image('apple', './assets/apple.png');

        // defaults
        this.load.image('bg1', './assets/background.png');
        this.load.image('bow', './assets/b_ta0upq.png');
        this.load.image('arrow', './assets/aa_sm8c8e.png');
        this.load.atlas('atlas', './assets/texture.png', './assets/texture.json');
        this.load.image('d2', './assets/d2.png');
        this.load.image('grass', './assets/grass.png');
        this.load.image('gear', './assets/gear.png');
        this.load.image('pause', './assets/pause.png');
        this.load.image('refresh', './assets/refresh.png');

        this.load.image('dark-smoke', './assets/smoke-puff.png');
        this.load.image('white-smoke', './assets/smoke0.png');
        this.load.image('fire', './assets/muzzleflash3.png');


        this.load.image('stones', './assets/stones.png');
    }
    update() {
        this.cloud.update();
        var that = this;
        this.arrows.map(function (a, index) {
            if (!a.destroyed) {
                a.update();
                that.enimies.map(function (e, index) {
                    var hitTest = pixelPerfectHitTest(a, e);
                    if (hitTest) {

                        that.children.add(new Blast(that, e.x + e.width / 2, e.y + e.height / 2));
                        e.destroy();
                        that.enimies.splice(index, 1);
                        e = null;

                        // a.dust.stop();
                        a.destroy();
                        a.destroyed = true;

                        a.dust.stop();
                        setTimeout(function () {
                            a.dustParticles.destroy();
                            a.dust = null;
                        }, 300);



                        that.cameras.main.shake(50);
                        that.stars[that.level] = 3; // write stars logic
                        if (that.stars[that.level + 1] != undefined && that.stars[that.level + 1] == -1) {
                            that.stars[that.level + 1] = 0;
                        }
                        localStorage.setItem(gameOptions.localStorageName, that.stars.toString());
                        // setTimeout(function () {
                        //     that.scene.start("LevelSelect");
                        // }, 400);
                    }
                })

                that.obstacles.map(function (e, index) {
                    var hitTest1 = pixelPerfectHitTest(a, e);
                    if (hitTest1) {

                        that.children.add(new Blast(that, a.tip.x, a.tip.y));

                        a.destroy();
                        a.destroyed = true;

                        a.dust.stop();
                        setTimeout(function () {
                            a.dustParticles.destroy();
                            a.dust = null;
                        }, 300);
                    }
                });
            } else {
                that.arrows.splice(index, 1);
            }
        });
        this.bow.angle = this.dragObj.angle ? this.dragObj.angle - 90 : 90;
    }
    create() {
        var displayElements = gameConfig.levels[this.level].graphics;
        var bg = this.add.image(0, -100, displayElements.background).setOrigin(0, 0).setInteractive();

        for (var i = 0; i < displayElements.others.length; i++) {
            if (displayElements.others[i] === "waterFall")
                this.children.add(new WaterFall(this, 0, 0));
            if (displayElements.others[i] === "cloud") {
                this.cloud = new Cloud(this, 5);
                this.children.add(this.cloud);
            }
        }

        this.dragObj = {};
        this.arrows = [];
        this.dragInitiated;
        this.currentArrow;
        this.upEmitted = false;
        var gameScene = this;
        this.distanceText = this.add.text(0, 0, '', { color: '#ffffff', align: 'left' });
        this.bow = this.add.image(130, 280, 'atlas', 'Symbol10001').setScale(0.7);
        this.graphics2 = this.add.graphics({ lineStyle: { width: 1, color: 0xffffff } });

        this.input.on('pointerdown', function (p) {
            // if(this.currentArrow) {
            //   this.currentArrow.dust.stop();
            //   this.currentArrow.destroy();
            //   this.currentArrow = null;
            // }
            if (p.y > 60 || p.x < 630) {
                this.bow.destroy();
                this.bow = null;
                this.bow = this.add.image(130, 280, 'atlas', 'Symbol10005').setScale(0.7);

                this.dragObj.startP = new Phaser.Geom.Point(p.x, p.y);
                this.dragObj.endP = new Phaser.Geom.Point(p.x, p.y);
                this.dragObj.pointerDown = true;
                this.upEmitted = false;
                this.distanceText.x = p.x;
                this.distanceText.y = p.y;
                this.dragInitiated = true;
                // console.log(p.x, p.y);
            }
        }, this);
        this.input.on('pointerup', function (p) {
            if (!this.upEmitted && this.dragInitiated) {
                this.bow.destroy();
                this.bow = null;
                this.bow = this.add.image(130, 280, 'atlas', 'Symbol10001').setScale(0.7);
                var a = this.children.add(new Arrow(this, this.bow, this.bow.x, this.bow.y));
                this.arrows.push(a);
                this.currentArrow = a;
                this.currentArrow.shot = true;
                this.currentArrow.xVel = (this.dragObj.startP.x - this.dragObj.endP.x) / 12; //(p.x - this.bow.x) / 25;
                this.currentArrow.yVel = (this.dragObj.startP.y - this.dragObj.endP.y) / 12; //(p.y - this.bow.y) / 25;
                this.currentArrow.arrowAngle = this.dragObj.angle;//this.bow.angle;
                this.currentArrow.dust.start();
                this.dragObj.pointerDown = false;

                this.dragObj.startP.x = 0;
                this.dragObj.startP.y = 0;
                this.dragObj.endP.x = 0;
                this.dragObj.endP.y = 0;
                this.dragObj.distance = 0;
                this.graphics2.clear();

                this.distanceText.setText("");
                this.dragInitiated = false;
            }
        }, this);
        this.input.on('pointermove', function (p) {
            if (this.dragObj.pointerDown) {
                this.dragObj.endP = new Phaser.Geom.Point(p.x, p.y);
                this.dragObj.distance = Math.ceil(Math.sqrt(Math.pow((this.dragObj.endP.x - this.dragObj.startP.x), 2) + Math.pow((this.dragObj.endP.y - this.dragObj.startP.y), 2)));
                //console.log("this.dragObj.distance" + this.dragObj.distance);
                this.dragObj.angle = Math.atan2(this.dragObj.endP.y - this.dragObj.startP.y, this.dragObj.endP.x - this.dragObj.startP.x) * 180 / Math.PI;
                //console.log("this.dragObj.angle" + this.dragObj.angle);

                this.distanceText.setText(Math.ceil(this.dragObj.distance / 15) + " " + Math.round(90 - this.dragObj.angle + 90) + "\u{00B0}");

                var line = new Phaser.Geom.Line(this.dragObj.startP.x, this.dragObj.startP.y, this.dragObj.endP.x, this.dragObj.endP.y);
                this.graphics2.clear();

                this.graphics2.strokeLineShape(line);

                if (p.x < 20 || p.y > 480) {
                    this.input.emit('pointerup', p);
                    this.upEmitted = true;
                }

            }
        }, this);

        this.enimies = [];
        for (var i = 0; i < gameConfig.levels[this.level].enimies.length; i++) {
            var enimy = gameConfig.levels[this.level].enimies[i];
            var e1 = this.add.image(enimy.position.x, enimy.position.y, enimy.sprite).setOrigin(0, 0);
            this.enimies.push(e1);
        }
        this.add.image(0, 388, 'grass').setScale(1).setOrigin(0, 0);
        this.add.image(640, 30, 'gear').setScale(0.8).setInteractive();

        var pause = this.add.image(760, 30, 'pause').setScale(0.8).setInteractive();
        pause.on('pointerdown', function () {
            gameScene.scene.pause();
            gameScene.scene.launch('Paused');
            gameScene.scene.sendToBack();
        })

        var reload = this.add.image(700, 30, 'refresh').setScale(0.7).setInteractive();

        reload.on('pointerdown', function () {
            // this.registry.destroy(); // destroy registry
            // this.events.off(); // disable all active events
            this.scene.scene.restart(); // restart current scene
        })

        this.obstacles = [];
        for (var i = 0; i < gameConfig.levels[this.level].obstacles.length; i++) {
            var obstacle = gameConfig.levels[this.level].obstacles[i];
            var o1 = this.add.image(obstacle.x, obstacle.y, obstacle.sprite).setOrigin(0, 0);
            this.obstacles.push(o1);
        }

        // this.enimies.push(this.add.image(600, 250, 'plant').setScale(1).setOrigin(0, 0));

        // this.add.text(game.config.width / 2, 20, "Play level " + this.level.toString(), {
        //     font: "32px Arial",
        //     color: "#ffffff"
        // }).setOrigin(0.5);
        // var failLevel = this.add.text(20, 60, "Fail level", {
        //     font: "48px Arial",
        //     color: "#ff0000"
        // });
        // failLevel.setInteractive();
        // failLevel.on("pointerdown", function () {
        //     this.scene.start("LevelSelect");
        // }, this);
        // var oneStarLevel = this.add.text(20, 160, "Get 1 star", {
        //     font: "48px Arial",
        //     color: "#ff8800"
        // });
        // oneStarLevel.setInteractive();
        // oneStarLevel.on("pointerdown", function () {
        //     this.stars[this.level] = Math.max(this.stars[this.level], 1);
        //     if (this.stars[this.level + 1] != undefined && this.stars[this.level + 1] == -1) {
        //         this.stars[this.level + 1] = 0;
        //     }
        //     localStorage.setItem(gameOptions.localStorageName, this.stars.toString());
        //     this.scene.start("LevelSelect");
        // }, this);
        // var twoStarsLevel = this.add.text(20, 260, "Get 2 stars", {
        //     font: "48px Arial",
        //     color: "#ffff00"
        // });
        // twoStarsLevel.setInteractive();
        // twoStarsLevel.on("pointerdown", function () {
        //     this.stars[this.level] = Math.max(this.stars[this.level], 2);
        //     if (this.stars[this.level + 1] != undefined && this.stars[this.level + 1] == -1) {
        //         this.stars[this.level + 1] = 0;
        //     }
        //     localStorage.setItem(gameOptions.localStorageName, this.stars.toString());
        //     this.scene.start("LevelSelect");
        // }, this);
        // var threeStarsLevel = this.add.text(20, 360, "Get 3 stars", {
        //     font: "48px Arial",
        //     color: "#00ff00"
        // });
        // threeStarsLevel.setInteractive();
        // threeStarsLevel.on("pointerdown", function () {
        //     this.stars[this.level] = 3;
        //     if (this.stars[this.level + 1] != undefined && this.stars[this.level + 1] == -1) {
        //         this.stars[this.level + 1] = 0;
        //     }
        //     localStorage.setItem(gameOptions.localStorageName, this.stars.toString());
        //     this.scene.start("LevelSelect");
        // }, this);

        var healthbar = this.children.add(new HealthBar(this, this.bow, 0, 70));
    }
}


var WaterFall = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize: function WaterFall(scene, x, y) {
        Phaser.GameObjects.Container.call(this, scene);
        this.x = x;
        this.y = y;
        that = this;
        sprite1 = scene.add.sprite(-50, 480, 'spark');
        sprite1.setScale(120, 5).setAlpha(0.01);
        rect = new Phaser.Geom.Rectangle(-50, 450, 800, 50);
        graphics = scene.add.graphics();
        graphics.lineStyle(1, 0x00ff00, 0);
        graphics.strokeRectShape(rect);

        var emitZone = { // make it ellipse
            source: new Phaser.Geom.Line(30, 0, 120, 0),
            type: 'edge',
            quantity: 50
        };

        var started = false;
        var count = 0;
        var coll = {
            contains: function (x, y) {
                var r = sprite1.getBounds();
                var hit = r.contains(x, y)
                if (hit) {
                    if (count <= 500) count++;
                    if (!started && count > 500) {
                        var particles = scene.add.particles('spark');
                        var emitter = particles.createEmitter({
                            x: 0,
                            y: 450,
                            blendMode: 'SCREEN',
                            scale: { start: 0.6, end: 0.3 },
                            speed: { min: -200, max: 0 },
                            quantity: 60,
                            gravityY: 500,
                            deathZone: { type: 'onEnter', source: rect }
                        });
                        emitter.setEmitZone(emitZone);
                        that.add(particles);
                        started = true
                    }
                };

                return hit;
            }
        };

        var particles = scene.add.particles('spark');
        var emitterblur = particles.createEmitter({
            x: -20,
            y: 220,
            speed: 60,
            tint: [0x1E90FF],
            alpha: { start: 0.5, end: 0.3 },
            scale: { start: 0.5, end: 0.2 },
            angle: { min: 290, max: 320 },
            lifespan: 3000,
            frequency: 50,
            blendMode: 'ADD',
            gravityY: 90,
            quantity: 2,
            deathZone: { type: 'onEnter', source: coll }
        });

        var emitter1 = particles.createEmitter({
            x: -20,
            y: 220,
            angle: { min: 290, max: 320 },
            speed: { min: 75, max: 125 },
            alpha: { start: 0.2, end: 0.8 },
            gravityY: 300,
            lifespan: { min: 1500, max: 3000 },
            scale: { start: 1, end: 0.5 },
            blendMode: 'ADD',
            quantity: 20,
            deathZone: { type: 'onEnter', source: coll }
        });
        this.add(particles);
    },
    update: function () {

    }
});


var Cloud = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize: function Cloud(scene, count) {
        Phaser.GameObjects.Container.call(this, scene);
        for (var i = 0; i < count; i++) {
            var img = scene.add.image(-400, Math.random * 120, "cloud").setScale(Math.random() * 0.5 + 0.3);
            this.add(img);
        }
    },
    update: function () {
        this.list.map(function (cloud) {
            cloud.x -= 0.5;
            if (cloud.x < -100) {
                cloud.x = Math.random() * 800 + 450;
                cloud.y = Math.random() * 120;
            }
        });
    }
});


var Arrow = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Arrow(scene, bow, x, y) {
        Phaser.GameObjects.Image.call(this, scene);
        this.setTexture('atlas', 'a1');
        this.setPosition(x, y);
        this.setScale(0.7);
        this.setInteractive();
        this.bow = bow;
        this.xp = this.bow.x;
        this.yp = this.bow.y;
        this.oldx = this.bow.x;
        this.oldy = this.bow.y;
        this.xVel = 0;
        this.yVel = 0;
        this.hit = false;
        this.arrowAngle = this.bow.angle;
        this.shot = false;
        this.dustParticles = scene.add.particles('d2');
        this.dust = this.dustParticles.createEmitter({
            x: this.bow.x,
            y: this.bow.y,
            speed: { min: -40, max: 40 },
            angle: { min: 0, max: 360 },
            rotate: { start: 0, end: 360 },
            scale: { start: 0.1, end: 0.3 },
            alpha: { start: 0.6, end: 1 },
            lifespan: 800,
            gravityY: 0
        });

    },
    update: function () {
        if (this.shot) {
            if (!this.hit) {
                this.xp += this.xVel;
                this.yp += this.yVel;
                this.yVel += g;
                this.x = this.xp;
                this.y = this.yp;
                this.arrowAngle = Math.atan2(this.xp - this.oldx, -(this.yp - this.oldy)) * (180 / Math.PI);
                this.angle = this.arrowAngle;
                this.oldx = this.xp;
                this.oldy = this.yp;
                this.dust.setPosition(this.x, this.y);
            }
        } else {
            this.x = this.bow.x;
            this.y = this.bow.y;
            this.angle = this.bow.angle;
        }

        if (this.x > 850) {
            this.dust.stop();
            this.destroy();
            this.destroyed = true;
        } else
            if (this.y > 450) {
                this.dust.stop();
                this.destroy();
                this.destroyed = true;
            }
    }
});

var Blast = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize: function Blast(scene, x, y) {
        var fire = scene.add.particles('fire').createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 180, max: 360 },
            scale: { start: 0, end: 1, ease: 'Back.easeOut' },
            alpha: { start: 1, end: 0, ease: 'Quart.easeOut' },
            blendMode: 'SCREEN',
            lifespan: 500,
            quantity: 20,

        });
        fire.stop();

        var whiteSmoke = scene.add.particles('white-smoke').createEmitter({
            x: x,
            y: y,
            speed: { min: 20, max: 100 },
            angle: { min: 180, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 0, end: 0.2 },
            lifespan: 2000,
            quantity: 20,
        });
        whiteSmoke.stop();

        var darkSmoke = scene.add.particles('dark-smoke').createEmitter({
            x: x,
            y: y,
            speed: { min: 20, max: 100 },
            angle: { min: 180, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 0, end: 0.1 },
            blendMode: 'ADD',
            lifespan: 2000,
            quantity: 20,
        });
        darkSmoke.stop();

        darkSmoke.setPosition(x, y);
        whiteSmoke.setPosition(x, y);
        fire.setPosition(x, y);
        darkSmoke.explode();
        whiteSmoke.explode();
        fire.explode();
    }
})


var HealthBar = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize: function HealthBar(scene, gameObj, deltax, deltay) {
        this.timeLeft = gameOptions.initialTime;
        let energyContainer = scene.add.sprite(gameObj.x + deltax, gameObj.y + deltay, "energycontainer");
        let energyBar = scene.add.sprite(energyContainer.x, energyContainer.y, "energybar");
        this.energyMask = scene.add.sprite(energyBar.x, energyBar.y, "energybar");
        this.energyMask.visible = false;
        energyBar.mask = new Phaser.Display.Masks.BitmapMask(scene, this.energyMask);
        var p = this;
        this.gameTimer = scene.time.addEvent({
            delay: 1000,
            callback: function () {
                if (p.timeLeft >= 0) {
                    p.timeLeft--;
                    let stepWidth = p.energyMask.displayWidth / gameOptions.initialTime;
                    p.energyMask.x -= stepWidth;
                    if (p.timeLeft == 0) {
                        console.log("destroyed")
                    }
                }
            },
            callbackScope: scene,
            loop: true
        });
    }
})