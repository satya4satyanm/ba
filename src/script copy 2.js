var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 350,
  backgroundColor: '#666',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var bow, bag, arrow, angle, newArrow, apple, apple1, manFlex, manFixed;
var score = 0;
var g = 0.25;
var arrowCreated = false;
var shot = false;
var arrows = [];
var currentArrow;
var that;
var apples;

function preload() {
  this.load.image('bag', '../assets/bag_vgg6dd.png');
  this.load.image('bow', '../assets/b_ta0upq.png');
  this.load.image('arrow', '../assets/aa_sm8c8e.png');
  // this.load.image('appleStem', '../assets/appleStem.png');
  this.load.image('apple', '../assets/apple.png');
  this.load.image('d2', '../assets/d2.png');

  this.load.image('dark-smoke', '../assets/smoke-puff.png');
    this.load.image('white-smoke', '../assets/smoke0.png');
    this.load.image('fire', '../assets/muzzleflash3.png');

    this.load.atlas('atlas', '../assets/texture.png', '../assets/texture.json');

}

function create() {
  that = this;
  // var cam = this.cameras.add(0, 0, 800, 350);
  // cam.setBackgroundColor(0xbababa);
  bow = this.add.image(95, 220, 'atlas', 'Symbol10001').setScale(0.7).setOrigin(0.8,1);
  manFlex = this.add.image(95, 220, 'atlas', 'powerdragger').setScale(0.7).setOrigin(0.37,0.78);
  manFixed = this.add.image(100, 250, 'atlas', 'Symbol5').setScale(0.7);
  bag = this.add.image(650, 300, 'bag').setScale(0.3);
  apple = this.add.image(650, 100, 'apple').setScale(0.5);

  var customBounds = new Phaser.Geom.Rectangle(32, 20, 576, 240);

  this.input.on('pointerdown', function (pointer) {
    bow.destroy();
    bow=null;
    bow = this.add.image(95, 220, 'atlas', 'Symbol10004').setScale(0.7).setOrigin(0.8,1);

    var a = this.children.add(new Arrow(this, bow.x, bow.y));
    arrows.push(a);
    currentArrow = a;

   

  }, this);
  this.input.on('pointerup', function (p) {
    bow.destroy();
    bow=null;
    bow = this.add.image(95, 220, 'atlas', 'Symbol10001').setScale(0.7).setOrigin(0.8,1);
    currentArrow.shot = true;
    currentArrow.xVel = - (p.x - bow.x) / 6;
    currentArrow.yVel = - (p.y - bow.y) / 6;
    currentArrow.arrowAngle = bow.angle;
    currentArrow.dust.start();
  }, this);



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
    angle: { min: 180, max: 360},
    scale: { start: 1, end: 0},
    alpha: { start: 0, end: 0.2},
    lifespan: 2000,
            quantity: 20,
});
whiteSmoke.stop();

darkSmoke = this.add.particles('dark-smoke').createEmitter({
    x: 400,
    y: 300,
    speed: { min: 20, max: 100 },
    angle: { min: 180, max: 360},
    scale: { start: 1, end: 0},
    alpha: { start: 0, end: 0.1},
    blendMode: 'ADD',
    lifespan: 2000,
            quantity: 20,
});
darkSmoke.stop();



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
  //console.log(shot);
  angle = Math.atan2(game.input.mousePointer.x - bow.x, -(game.input.mousePointer.y - bow.y)) * (180 / Math.PI) - 180;
  bow.angle = angle;
  manFlex.angle = angle - 90;
  arrows.map(function (a, index) {
    if (!a.destroyed) {
      a.update();
    } else {
      arrows.splice(index, 1);
    }
  });

}

function hitTest(object1, object2) {
  var left1 = parseInt(object1.x);
  var left2 = parseInt(object2.x);
  var top1 = parseInt(object1.y);
  var top2 = parseInt(object2.y);
  var width1 = parseInt(object1.displayWidth);
  var width2 = parseInt(object2.displayWidth);
  var height1 = parseInt(object1.displayHeight);
  var height2 = parseInt(object2.displayHeight);
  var horTest = false;
  var verTest = false;
  if (((left1 >= left2) && (left1 <= left2 + width2)) || ((left2 >= left1) && (left2 <= left1 + width1))) { horTest = true; } if (((top1 >= top2) && (top1 <= top2 + height2)) || ((top2 >= top1) && (top2 <= top1 + height1))) {
    verTest = true;
  }
  if (horTest && verTest) {
    return true;
  }
  return false;
}



var Arrow = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize: function Arrow(scene, x, y) {
    Phaser.GameObjects.Image.call(this, scene);
    //this.add.image(100, 250, 'atlas', 'Symbol10001');
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

    this.on('pointerdown', function () {
      this.destroy();
      this.destroyed = true;
    });
    this.dust = that.add.particles('d2').createEmitter({
      x: bow.x-25,
      y: bow.y-30,
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

        var intersects = hitTest(this, bag);
        if (intersects) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
          this.dust.stop();
        }

        var hitApple = hitTest(this, apple);
        if (hitApple) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
          this.dust.stop();
          console.log("hit apple")
        }

      }
    } else {
      this.x = bow.x;
      this.y = bow.y;
      this.angle = bow.angle;
    }

    if (this.x > 700) {
      this.dust.stop();
      this.destroy();
      this.destroyed = true;
    } else if (this.y > 350) {
      blast({x:this.x,y:this.y});
      this.dust.stop();
      this.destroy();
      this.destroyed = true;
    }
  }
});