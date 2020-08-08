var gameConfig = {
  "gameName": "Rescue The Zombies",
  "author": "Satyanarayan Mishra",
  "email": "satya4satyanm@gmail.com",
  "levels": [
    {
      "name": "Level One",
      "stars": 3,
      "completeMsg": "",
      "completeRewards": {
        "gameCoins": 50
      },
      "enimies": [
        {
          "sprite": "",
          "position": { x: 200, y: 400 },
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

window.onload = function () {
  window.addEventListener("resize", resizeGame, false);
}
function resizeGame() {
  window.location.reload();
}

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000',
  fps: {
    target: 90,
    forceSetTimeOut: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var bow, bag, plant, stone, grass, arrow, angle, newArrow, apple, apple1, manFlex, manFixed, cloud;
var score = 0;
var g = 0.25;
var arrowCreated = false;
var shot = false;
var arrows = [];
var currentArrow;
var that;
var apples;
var waterContainer;

function preload() {

  this.load.image('spark', '../assets/b1.png');


  this.load.image('bg', '../assets/background1.png');
  this.load.image('cloud', '../assets/cloud.png');
  this.load.image('bag', '../assets/bag_vgg6dd.png');
  this.load.image('bow', '../assets/b_ta0upq.png');
  this.load.image('arrow', '../assets/aa_sm8c8e.png');
  // this.load.image('appleStem', '../assets/appleStem.png');
  this.load.image('apple', '../assets/apple.png');
  this.load.image('d2', '../assets/d2.png');
  this.load.image('dark-smoke', '../assets/smoke-puff.png');
  this.load.image('white-smoke', '../assets/smoke0.png');
  this.load.image('fire', '../assets/muzzleflash3.png');
  this.load.image('plant', '../assets/plant.png');
  this.load.image('stone', '../assets/stones.png');
  this.load.image('grass', '../assets/grass.png');
  this.load.atlas('atlas', '../assets/texture.png', '../assets/texture.json');
}

function create() {




  that = this;
  // var cam = this.cameras.add(0, 0, 800, 350);
  // cam.setBackgroundColor(0xbababa);
  bg = this.add.image(0, -100, 'bg').setScale(1).setOrigin(0, 0);
  cloud = this.add.image(900, 100, 'cloud');
  bow = this.add.image(130, 280, 'atlas', 'Symbol10001').setScale(0.7);
  //manFlex = this.add.image(95, 220, 'atlas', 'powerdragger').setScale(0.7).setOrigin(0.37,0.78);
  //manFixed = this.add.image(100, 250, 'atlas', 'Symbol5').setScale(0.7);
  bag = this.add.image(650, 300, 'bag').setScale(1).setOrigin(0, 0);
  plant = this.add.image(150, 360, 'plant').setScale(1).setOrigin(0, 0);
  apple = this.add.image(650, 100, 'apple').setScale(1).setOrigin(0, 0);
  stone = this.add.image(300, 300, 'stone').setScale(1).setOrigin(0, 0);

  waterContainer = this.add.container(0,0);



  this.tweens.add({
    targets: cloud,
    x: -100,
    duration: 12000,
    ease: 'Linear',
    easeParams: [1],
    repeat: -1,
    onComplete: function() {
      cloud.y = Math.random() * 150;
    }
  });

  grass = this.add.image(0, 396, 'grass').setScale(1).setOrigin(0, 0);

  var customBounds = new Phaser.Geom.Rectangle(32, 20, 576, 240);

  this.input.on('pointerdown', function (pointer) {
    bow.destroy();
    bow = null;
    bow = this.add.image(130, 280, 'atlas', 'Symbol10004').setScale(0.7);
    var a = this.children.add(new Arrow(this, bow.x, bow.y));
    arrows.push(a);
    currentArrow = a;
    // console.log(pointer.x, pointer.y);
  }, this);
  this.input.on('pointerup', function (p) {
    bow.destroy();
    bow = null;
    bow = this.add.image(130, 280, 'atlas', 'Symbol10001').setScale(0.7);
    currentArrow.shot = true;
    currentArrow.xVel = (p.x - bow.x) / 25;
    currentArrow.yVel = (p.y - bow.y) / 25;
    currentArrow.arrowAngle = bow.angle;
    currentArrow.dust.start();
  }, this);

  var graphics1 = this.add.graphics();
  fire = this.add.particles('fire').createEmitter({
    x: 400,
    y: 300,
    speed: { min: 100, max: 200 },
    angle: { min: 180, max: 360 },
    scale: { start: 0, end: 1, ease: 'Back.easeOut' },
    alpha: { start: 1, end: 0, ease: 'Quart.easeOut' },
    blendMode: 'SCREEN',
    lifespan: 500,
    quantity: 20,

  });
  fire.stop();

  whiteSmoke = this.add.particles('white-smoke').createEmitter({
    x: 400,
    y: 300,
    speed: { min: 20, max: 100 },
    angle: { min: 180, max: 360 },
    scale: { start: 1, end: 0 },
    alpha: { start: 0, end: 0.2 },
    lifespan: 2000,
    quantity: 20,
  });
  whiteSmoke.stop();

  darkSmoke = this.add.particles('dark-smoke').createEmitter({
    x: 400,
    y: 300,
    speed: { min: 20, max: 100 },
    angle: { min: 180, max: 360 },
    scale: { start: 1, end: 0 },
    alpha: { start: 0, end: 0.1 },
    blendMode: 'ADD',
    lifespan: 2000,
    quantity: 20,
  });
  darkSmoke.stop();





 

  sprite1 = this.physics.add.sprite(-50, 480, 'spark');
  sprite1.setScale(120, 5).setAlpha(0.01);
  rect = new Phaser.Geom.Rectangle(-50, 450, 800, 50);
  graphics = this.add.graphics();
  graphics.lineStyle(1, 0x00ff00, 0.01);
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
      var hit = sprite1.body.hitTest(x, y);

      if (hit) {
        if (count <= 500) count++;
        if (!started && count > 500) {
          //that.cameras.main.shake(300);
          var particles = that.add.particles('spark');
          var emitter = particles.createEmitter({
            x: 0,
            y: 450,
            blendMode: 'SCREEN',
            scale: { start: 0.4, end: 0.1 },
            speed: { min: -200, max: 0 },
            quantity: 60,
            gravityY: 500,
            deathZone: { type: 'onEnter', source: rect }
          });
          emitter.setEmitZone(emitZone);
          waterContainer.add(particles);
          started = true
        }
      };

      return hit;
    }
  };




  var particles = this.add.particles('spark');

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
  waterContainer.add(particles);



}

function blast(pointer) {
  darkSmoke.setPosition(pointer.x, pointer.y);
  whiteSmoke.setPosition(pointer.x, pointer.y);
  fire.setPosition(pointer.x, pointer.y);
  darkSmoke.explode();
  whiteSmoke.explode();
  fire.explode();
}

function update() {
  angle = Math.atan2(game.input.mousePointer.x - bow.x, -(game.input.mousePointer.y - bow.y)) * (180 / Math.PI);
  bow.angle = angle;
  arrows.map(function (a, index) {
    if (!a.destroyed) {
      a.update();
    } else {
      arrows.splice(index, 1);
    }
  });
}
var graphics;
var thickness = 3;
var color = 0x00ff00;
var colorRed = 0xff0000;
var alpha = 1;

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
    var alpha = m.getPixelAlpha(p.x - image.x, p.y - image.y, image.texture.key, 1);
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

var Arrow = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function Arrow(scene, x, y) {
    Phaser.GameObjects.Image.call(this, scene);
    this.setTexture('atlas', 'a1');
    this.setPosition(x, y);
    this.setScale(0.7);
    this.setInteractive();
    this.xp = bow.x;
    this.yp = bow.y;
    this.oldx = bow.x;
    this.oldy = bow.y;
    this.xVel = 0;
    this.yVel = 0;
    this.hit = false;
    this.arrowAngle = bow.angle;
    this.shot = false;

    // this.on('pointerdown', function () {
    //   this.destroy();
    //   this.destroyed = true;
    // });
    this.dust = that.add.particles('d2').createEmitter({
      x: bow.x - 25,
      y: bow.y - 30,
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
        var intersects = pixelPerfectHitTest(this, bag);
        if (intersects) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
          this.dust.stop();
        }

        var hitApple = pixelPerfectHitTest(this, apple);
        if (hitApple) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
          this.dust.stop();
          console.log("hit apple")
        }

        var hitPlant = pixelPerfectHitTest(this, plant);

        if (hitPlant) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
          this.dust.stop();
          console.log("hit plant")
        }

        var hitStone = pixelPerfectHitTest(this, stone);

        if (hitStone) {
          this.hit = true;
          console.log("hit stone");
          blast({ x: this.tip.x, y: this.tip.y });
          this.dust.stop();
          this.destroy();
          this.destroyed = true;
        }

      }
    } else {
      this.x = bow.x;
      this.y = bow.y;
      this.angle = bow.angle;
    }

    if (this.x > 850) {
      this.dust.stop();
      this.destroy();
      this.destroyed = true;
    } else
      if (this.y > 450) {
        blast({ x: this.x, y: this.y });
        this.dust.stop();
        this.destroy();
        this.destroyed = true;
      }
  }
});