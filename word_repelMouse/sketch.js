//----------------------------------------- main ---------------------------------------
var resolution, cols, rows, img;
var vehicles = [];

function setup() {
  createCanvas(720, 720);
  colorMode(HSB);

  resolution = 8;
  cols = (width/resolution);
  rows = (height/resolution);

  img = loadImage("oN5ra04N.png", function(){
	  img.loadPixels();
	  //console.log(pixels)
	  for(var x=0; x<img.width; x+=resolution){
	    for(var y=0; y<img.height; y+=resolution){
	      var loc = x+y*width;
	      var b = blue(img.pixels[loc]);
	      if(b > 200){
	        vehicles.push( new Vehicle( new p5.Vector(random(width), random(height)), 8, 0.9, new p5.Vector(x, y) ) );
	      }
	    }
	  }
  });
  
}

function draw() {
  background(200*360/250, 150*360/250, 150*360/250);

  vehicles.forEach(function(v){
	if(isMousePressed){
		//console.log("s");
		v.sepDist += 5;
	}else{
		v.sepDist -= 5;
	}
	v.sepDist = constrain(v.sepDist, 25, 100);
	v.applyBehaviors();
	v.run();
  });

var count = 0;
  for(var i = 0; i< vehicles.length; i++){
  	for(var j = i+1; j< vehicles.length; j++){
  		// count ++
  		// console.log(count)
  		if(vehicles[i].loc === vehicles[j].loc){
  			console.log("coincidence")
  		}
  	}
  }
}

//-----------------------------------------------------------------------------------------
var Vehicle = function(l, ms, mf, t){
	this.loc = l.get();
	this.vel = new p5.Vector(0,0);
	this.acc = new p5.Vector(0,0);
	this.maxSpeed = ms;
	this.maxForce = mf;
	this.r = 5;
	this.target = t;
	this.sepDist = 100; 
};

Vehicle.prototype = {
	update: function(){
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.loc.add(this.vel);
		this.acc.mult(0);
	},
	applyForce: function(f){
		this.acc.add(f);
	},
	run:function(){
		this.update();
		this.display();
	},
	display:function(){
		noStroke();
		//pushSytle();
		var dis = dist(this.loc.x, this.loc.y, this.target.x, this.target.y);
		fill(Math.floor((dis*20+50)*360/250), Math.floor((dis*4)*360/250), Math.floor((360-dis)*360/250));
		rect(this.loc.x, this.loc.y, this.r, this.r);
		//popStyle();
	},
	borders:function(){
		if(this.loc.x < -this.r) this.loc.x = width + this.r;
		if(this.loc.y < -this.r) this.loc.y = height + this.r;
		if(this.loc.x > width + this.r) this.loc.x = -this.r;
		if(this.loc.y > height + this.r) this.loc.y = -this.r;
	},
	applyBehaviors: function(){
		var sepForce = this.separate();
		var seekForce = this.seek();
		sepForce.mult(2);
		seekForce.mult(1);
		this.applyForce(sepForce);
		this.applyForce(seekForce);
	},
	seek: function(){
		var desire = p5.Vector.sub(this.target, this.loc);
		var d = desire.mag();

		if(d<100){
			var m = map(d, 0, 100, 0, this.maxSpeed);
			desire.normalize();
			desire.mult(m);
		}else{
			desire.normalize();
			desire.mult(this.maxSpeed);
		}
		var steer = p5.Vector.sub(desire, this.vel);
		steer.limit(this.maxForce);
		return steer;
	},
	separate: function(){
		var dd = p5.Vector.sub(this.loc, new p5.Vector(mouseX, mouseY));
		var d = dd.mag();
		//console.log(d);
		if(d < this.sepDist){
			var diff = p5.Vector.sub(this.loc, new p5.Vector(mouseX, mouseY));
			diff.normalize();
			diff.mult(this.maxSpeed);
			diff.mult(this.sepDist / d);

			var steer = p5.Vector.sub(diff, this.vel);
			steer.limit(this.maxForce);
			return steer;
		}else{
			return new p5.Vector(0,0);
		}
	},
	getDist:function(){
		var dis = dist(this.loc.x, this.loc.y, this.target.x, this.target.y);
		return dis;
	}
};