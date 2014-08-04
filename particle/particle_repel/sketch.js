var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
//context.globalCompositeOperation  = 'lighter';
var width = canvas.width;
var height = canvas.height;
var maxSpeed = Math.random()*3;
var maxForce = Math.random()*0.5 + 0.1;

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
};

function Particle(x, y, radius, color){
	this.init(x, y, radius, color)
}

Particle.prototype = {
	init: function(x, y, radius, color){
    this.loc = new PVector(x, y);
    this.color = color;
    this.radius = radius;
    this.vel = new PVector(-10,0);
    this.acc = new PVector(0,0);
	},
  applyForce: function(f){
    var force = f.clone()
    this.acc.add(force);  
  },
  update: function(){
    this.radius = map(Math.abs(width/2 -this.loc.x), 0, width/2, 60, 0.1);
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.loc.add(this.vel);
    this.acc.mult(0);
  },
  run: function(ctx){
    this.update();
    this.borders();
    this.render(ctx);
  },
  follow: function(flow){
    var desire = flow.lookup(this.loc);
    desire.mult(maxSpeed);
    var steer = PVector.sub(desire, this.vel);
    steer.limit(maxForce);
    this.applyForce(steer);
  },
  borders:function(){
    if (this.loc.x < 0) this.loc.x = width;
    if (this.loc.y < -this.radius) this.loc.y = height+this.radius;
    if (this.loc.x > width) this.loc.x = 0;
    if (this.loc.y > height+this.radius) this.loc.y = -this.radius;
  },
  render: function(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc( this.loc.x, this.loc.y, this.radius, 0, Math.PI*2 );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function FlowField(r){
  this.resolution = r;
  this.cols = Math.floor(width/this.resolution);
  this.rows = Math.floor(height/this.resolution);
  this.grid = [];
  this.time = 0;
  this.init();
}

FlowField.prototype = {
  init: function(){ 
    this.time += 0.002;
    var perlinNoise = new Perlin();
    var xoff = this.time;
    for (var i=0; i<this.cols; i++) {
      var yoff = this.time;
      for (var j=0; j < this.rows; j++) {
        var theta = map( perlinNoise.noise(xoff, yoff), 0, 1, 0, Math.PI * 2);
        this.grid[i * this.cols + j] = new PVector( Math.cos(theta), Math.sin(theta) );
        //console.log(this.grid[i * this.cols + j] )
        yoff+= 0.006;
      }
      xoff += 0.006;
    }
    //return this;
  },
  lookup: function(lookUp){
    var column = Math.floor(constrain(lookUp.x / this.resolution, 0, this.cols -1));
    var row = Math.floor(constrain(lookUp.y / this.resolution, 0, this.rows -1 ));
    
    return this.grid[column*this.cols+row].clone();
  },
  drawVector: function(v, x, y, ctx){
    ctx.save();
    ctx.translate(x, y);
    //console.log(v)
    ctx.rotate(v.heading())
    var len = v.mag()*8;
    //console.log(len);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(len, 0);
    ctx.stroke();
    ctx.restore();
  },
  render: function(ctx){
     for (var i=0; i<this.cols; i++) {
      for (var j=0; j<this.rows; j++) {
        this.drawVector(this.grid[i*this.cols+j], i* this.resolution, j*this.resolution, ctx);
      }
    }
  }
}



var debug = false;
var flowField;
var particles = [];
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];


function drawBackground() {
  context.fillStyle = "#2b2b2b";
  context.fillRect(0, 0, width, height);
}

function init(){
  flowField = new FlowField(20);
  var j = 0;
  for(var i= 0; i<100; i++){
    particles.push(new Particle(Math.random()*width, Math.random()*height, 10, COLOURS[j]));
    j++;
    if(j>=COLOURS.length) j = 0;
  }
}



function update(){
  context.globalCompositeOperation  = 'source-over';
  drawBackground();
  context.globalCompositeOperation  = 'lighter';
  flowField.init();
    if(debug){
    flowField.render(context);
  }
  particles.forEach(function(p){
    p.follow(flowField);
    p.run(context);
  })

}

function createAnimation(callback){
  requestAnimationFrame(function(){
    createAnimation(callback);
  });
  callback();
}

init();
createAnimation(update);


// window.onkeydown(function(e){
//   e.preventDefault();
//   if(e.which === 32){
//     debug = !debug;
//   }
// })