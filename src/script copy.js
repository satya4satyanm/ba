var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 350,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  backgroundColor: 'white',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var bow, bag, arrow, angle, newArrow, apple, apple1;
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
}

function create() {
  that = this;
  var cam = this.cameras.add(0, 0, 800, 600);
  cam.setBackgroundColor(0xbababa);
  bow = this.add.image(100, 250, 'bow').setScale(0.1);
  bag = this.add.image(650, 300, 'bag').setScale(0.5);
  apple = this.add.image(650, 100, 'apple').setScale(0.5);

  var customBounds = new Phaser.Geom.Rectangle(32, 20, 576, 240);
  apples = this.physics.add.group({
    key: 'apple',
    quantity: 0,
    bounceX: 1,
    bounceY: 0,
    customBoundsRectangle: customBounds,
    collideWorldBounds: true,
    velocityX: 0,
    velocityY: 150
  });
  Phaser.Actions.RandomRectangle(apples.getChildren(), this.physics.world.bounds);
  this.physics.add.collider(apples);


  this.input.on('pointerdown', function (p) {
    var a = this.children.add(new Arrow(this, bow.x, bow.y));
    arrows.push(a);
    currentArrow = a;
  }, this);
  this.input.on('pointerup', function (p) {
    currentArrow.shot = true;
    currentArrow.xVel = - (p.x - bow.x) / 6;
    currentArrow.yVel = - (p.y - bow.y) / 6;
    currentArrow.arrowAngle = bow.angle;
  }, this);
}

function update() {
  //console.log(shot);
  angle = Math.atan2(game.input.mousePointer.x - bow.x, -(game.input.mousePointer.y - bow.y)) * (180 / Math.PI) - 180;
  bow.angle = angle;
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

    this.setTexture('arrow');
    this.setPosition(x, y);
    this.setScale(0.2);
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

        var intersects = hitTest(this, bag);
        if (intersects) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
        }

        var hitApple = hitTest(this, apple);
        if (hitApple) {
          this.hit = true;
          this.xVel = 0;
          this.yVel = 0;
          apple1 = that.physics.add.image(apple.x, apple.y, 'apple').setScale(0.5);
          //apple1.body.setVelocity(0, 150).setBounce(1, 0.2).setCollideWorldBounds(true);
          apples.add(apple1);
        }

      }
    } else {
      this.x = bow.x;
      this.y = bow.y;
      this.angle = bow.angle;
    }

    if (this.x > 700 || this.y > 400) {
      this.destroy();
      this.destroyed = true;
    }
  }
});