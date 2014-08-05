var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
//context.globalCompositeOperation  = 'lighter';
var width = canvas.width;
var height = canvas.height;
var maxSpeed = 0.3;
var maxForce = 0.3;

function map(para, orMin, orMax, tarMin, tarMax) {
  var ratio = (para - orMin) / (orMax - orMin);
  var tarValue = ratio * (tarMax - tarMin) + tarMin;
  return tarValue;
}

function constrain(val, start, end) {
  if (val < start) {
    return start;
  }
  if (val > end) {
    return end;
  }
  return val;
}

function Particle(x, y, color) {
  this.init(x, y, color);
}

Particle.prototype = {
  init: function (x, y, color) {
    this.loc = new PVector(x, y);
    this.color = color;
    this.radius = Math.random() * 3;
    this.oldRadius = this.radius;
    this.vel = new PVector(0, 0);
    this.acc = new PVector(0, 0);
  },
  applyForce: function (f) {
    var force = f.clone();
    this.acc.add(force);
  },
  update: function () {
    // this.radius = this.oldRadius + map(Math.abs(height / 2 - this.loc.y), 0,
    //   height / 2, 50, 0.1);
    this.radius = this.oldRadius + map(Math.abs(width / 2 - this.loc.x), 0,
      width / 2, 70, 0.001);
    // this.radius = this.oldRadius + map(Math.abs(width / 2 - this.loc.x), 0,
    //   width / 2, 0.1, 50);
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.loc.add(this.vel);
    this.acc.mult(0);
  },
  run: function (ctx) {
    this.update();
    this.borders();
    this.render(ctx);
  },
  separate: function (x, y) {
    var mouse = new PVector(x, y);
    var d = PVector.dist(this.loc, mouse);
    var maxDis = 100;
    if ((d > 0) && (d < maxDis)) {
      var diff = PVector.sub(this.loc, mouse);
      diff.normalize();
      diff.mult(maxDis / d);
      var steer = PVector.sub(diff, this.vel);
      //steer.limit(maxForce);
      this.applyForce(steer);
    }
  },
  follow: function (flow) {
    var desire = flow.lookup(this.loc);
    desire.mult(maxSpeed);
    var steer = PVector.sub(desire, this.vel);
    steer.limit(maxForce);
    this.applyForce(steer);
  },
  borders: function () {
    if (this.loc.x >= 0 && this.loc.x <= width) {
      if (this.loc.y < -this.radius) this.loc.y = height + this.radius;
      if (this.loc.y > height + this.radius) this.loc.y = -this.radius;
    } else if (this.loc.x < 0) {
      this.loc.x = width;
      if (this.loc.y < 0) this.loc.y = height;
      if (this.loc.y > height) this.loc.y = 0;
    } else if (this.loc.x > width) {
      this.loc.x = 0;
      if (this.loc.y < 0) this.loc.y = height;
      if (this.loc.y > height) this.loc.y = 0;
    }

    // if (this.loc.y >= 0 && this.loc.y <= height) {
    //   if (this.loc.x < -this.radius) this.loc.x = width + this.radius;
    //   if (this.loc.x > width + this.radius) this.loc.x = -this.radius;
    // } else if (this.loc.y < 0) {
    //   this.loc.y = height;
    //   if (this.loc.x < 0) this.loc.x = width;
    //   if (this.loc.x > width) this.loc.x = 0;
    // } else if (this.loc.y > height) {
    //   this.loc.y = 0;
    //   if (this.loc.x < 0) this.loc.x = width;
    //   if (this.loc.x > width) this.loc.x = 0;
    // }
  },
  render: function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function FlowField(r) {
  this.resolution = r;
  this.cols = Math.floor(width / this.resolution);
  this.rows = Math.floor(height / this.resolution);
  this.grid = [];
  this.time = 0;
  this.init();
}

FlowField.prototype = {
  init: function () {
    this.time += 0.002;
    var perlinNoise = new Perlin();
    var xoff = this.time;
    for (var i = 0; i < this.cols; i++) {
      var yoff = this.time;
      for (var j = 0; j < this.rows; j++) {
        var theta = map(perlinNoise.noise(xoff, yoff), 0, 1, 0, Math.PI * 2);
        this.grid[i * this.cols + j] = new PVector(Math.cos(theta), Math.sin(
          theta));
        //console.log(this.grid[i * this.cols + j] )
        yoff += 0.06;
      }
      xoff += 0.06;
    }
    //return this;
  },
  lookup: function (lookUp) {
    var column = Math.floor(constrain(lookUp.x / this.resolution, 0, this.cols -
      1));
    var row = Math.floor(constrain(lookUp.y / this.resolution, 0, this.rows - 1));

    return this.grid[column * this.cols + row].clone();
  },
  drawVector: function (v, x, y, ctx) {
    ctx.strokeStyle = "white";
    ctx.save();
    ctx.translate(x, y);
    //console.log(v)
    ctx.rotate(v.heading());
    var len = v.mag() * 8;
    //console.log(len);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();
    ctx.restore();
  },
  render: function (ctx) {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.drawVector(this.grid[i * this.cols + j], i * this.resolution, j *
          this.resolution, ctx);
      }
    }
  }
};

var debug = true;
var flowField;
var particles = [];
var COLOURS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50',
  '#F9D423'
];

function drawBackground() {
  context.fillStyle = "#2b2b2b";
  context.fillRect(0, 0, width, height);
}

function init() {
  flowField = new FlowField(30);
  var j = 0;
  for (var i = 0; i < 120; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height,
      COLOURS[j]));
    j++;
    if (j >= COLOURS.length) j = 0;
  }
}

function update() {
  context.globalCompositeOperation = 'source-over';
  drawBackground();
  context.globalCompositeOperation = 'lighter';
  //context.globalCompositeOperation = 'xor';
  flowField.init();
  if (debug) {
    flowField.render(context);
  }
  particles.forEach(function (p) {
    p.follow(flowField);
    p.run(context);
  });
}

function createAnimation(callback) {
  requestAnimationFrame(function () {
    createAnimation(callback);
  });
  callback();
}

init();
createAnimation(update);

window.onkeydown = function (e) {
  e.preventDefault();
  if (e.which === 32) {
    debug = !debug;
  }
};

canvas.onmousemove = function (e) {
  particles.forEach(function (p) {
    p.separate(e.pageX, e.pageY);
  });
};