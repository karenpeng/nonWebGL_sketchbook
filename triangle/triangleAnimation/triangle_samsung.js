(function(exports){
	var colors = [
		"#1428a0",
		"#0057b8",
		"#00a9e0",
		"#008ca6",
		"#56b1aa"
	]

	var isMouseMove = false;

	function SAnimation(can){
		this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.vehicles1 = [];
    this.vehicles2 = [];
    this.triangles1;
    this.triangles2;
    this.vertices1 = [];
    this.vertices2 = [];

	}


	SAnimation.prototype.init = function(){

		//initiate two groupps
		//group1
		for(var i = 0; i< 16; i ++){
			var x = Math.floor(Math.random()*this.width*2/3+this.width/3+30);
			var y = Math.floor(Math.random()*this.height-20);
			this.vehicles1.push(new Vehicle(new PVector(x,y), 8, 0.8, this.canvas));
			this.vertices1.push([x,y]);
		}
		//the static points
		for(var it=this.width/3+600; it<this.width+100; it+= 200){
			this.vertices1.push([it, -300]);
			//this.vertices1.push([it, this.height +300]);
		}
		for(it = -100; it<this.height+100; it+=200){
			this.vertices1.push([this.width+100, it]);
		}
		for(it = 0; it< this.height; it+=60){
			var interfere = Math.random()* 60 + 30;
			//this.vertices1.push([this.width/3+interfere , it]);
		}

		//group2
		for(i = 0; i< 10; i ++){
			var x = Math.floor(Math.random()*this.width/3);
			var y = Math.floor(Math.random()*this.height*2/3 + this.height/3);
			this.vehicles2.push(new Vehicle(new PVector(x,y), 8, 0.8, this.canvas));
			this.vertices2.push([x,y]);
		}
		//the static points
		for(it=-100; it<this.width/3-100; it+= 100){
			this.vertices2.push([it, this.height +100]);
		}
		for(it = this.height*2/3+30; it<this.height+100; it+=200){
			this.vertices2.push([-100, it]);
		}


    this.triangles1 = Delaunay.triangulate(this.vertices1);
    this.triangles2 = Delaunay.triangulate(this.vertices2);
	}

	SAnimation.prototype.draw = function(){

		 for (var j = 0; j < this.vehicles1.length; j++) {
		 	//if(this.vertices1[j].status === "dynamic"){
			 	if(isMouseMove){
	      	this.vehicles1[j].sepDist = constrain(this.vehicles1[j].sepDist, 25, 200);
	        var seekForce = this.vehicles1[j].seek();
	        seekForce.mult(0.5);
	        this.vehicles1[j].applyForce(seekForce);
	      }
	        this.vehicles1[j].update();
	        this.vehicles1[j].borders(this.width/3+30, this.width+100, 0, this.height);
      //}

      this.vertices1[j] = [this.vehicles1[j].loc.x, this.vehicles1[j].loc.y];
    }

    this.triangles1 = Delaunay.triangulate(this.vertices1);

    for (j = 0; j < this.vehicles2.length; j++) {
    	//if(this.vertices1[j].status === "dynamic"){
	    	if(isMouseMove){
	      	this.vehicles2[j].sepDist = constrain(this.vehicles2[j].sepDist, 25, 100);
	        //this.vehicles[j].applyBehaviors();
	        var seekForce = this.vehicles2[j].seek();
	        seekForce.mult(0.5);
	        this.vehicles2[j].applyForce(seekForce);
	      }
	        this.vehicles2[j].update();
	        this.vehicles2[j].borders(-100, this.width/3-30, this.height/3, this.height+100);
    	//}

      this.vertices2[j] = [this.vehicles2[j].loc.x, this.vehicles2[j].loc.y];
    }

    this.triangles2 = Delaunay.triangulate(this.vertices2);

		var k = 0;
    for (var i = this.triangles1.length; i >= 3; i -= 3) {
      // if(k % 2 === 0){
      // this.context.fillStyle = 'rgb(250,'+ Math.floor(250 - k * 4) + ',' +
      // Math.floor(250 - k * 2)+ ')';
      // }else{
      this.context.fillStyle = 'rgb(0,' + Math.floor(
        200 - k * 6) + ',' +
        Math.floor(250 - k * 3) + ')';
      //}
      //console.log(this.context.fillStyle);
      this.context.strokeStyle = this.context.fillStyle;
      this.context.beginPath();
      this.context.moveTo(this.vertices1[this.triangles1[i - 1]][0], this.vertices1[
        this.triangles1[i - 1]][1]);
      this.context.lineTo(this.vertices1[this.triangles1[i - 2]][0], this.vertices1[
        this.triangles1[i - 2]][1]);
      this.context.lineTo(this.vertices1[this.triangles1[i - 3]][0], this.vertices1[
        this.triangles1[i - 3]][1]);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
      k += 0.6;

    }

    k = 0;
    for (i = this.triangles2.length; i >= 3; i -= 3) {
      // if(k % 2 === 0){
      // this.context.fillStyle = 'rgb(250,'+ Math.floor(250 - k * 4) + ',' +
      // Math.floor(250 - k * 2)+ ')';
      // }else{
      this.context.fillStyle = 'rgb(0,' + Math.floor(
        k * 16 +16) + ',' +
        Math.floor(k * 30 +30) + ')';
      //}
      //console.log(this.context.fillStyle);
      this.context.strokeStyle = this.context.fillStyle;
      this.context.beginPath();
      this.context.moveTo(this.vertices2[this.triangles2[i - 1]][0], this.vertices2[
        this.triangles2[i - 1]][1]);
      this.context.lineTo(this.vertices2[this.triangles2[i - 2]][0], this.vertices2[
        this.triangles2[i - 2]][1]);
      this.context.lineTo(this.vertices2[this.triangles2[i - 3]][0], this.vertices2[
        this.triangles2[i - 3]][1]);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
      k += 0.6;

    }

    //console.log(this.vehicles1[1].target.x-this.vehicles1[1].loc.x);
    //console.log(this.vehicles1[2].vel.x, this.vehicles1[2].vel.y)

	};

	SAnimation.prototype.mouseEnterEvent = function(x, y){
		isMouseMove = true;
		console.log(isMouseMove);
		this.vehicles1.forEach(function (v) {
      v.recordLocation();
    })

    this.vehicles2.forEach(function (vv) {
     vv.recordLocation();
    })
	};

	SAnimation.prototype.mouseLeaveEvent = function(x, y){
		isMouseMove = false;
		//console.log(isMouseMove);
	};

	SAnimation.prototype.mouseMoveEvent = function (x, y) {
    this.vehicles1.forEach(function (v) {
      var sepForce = v.separate(x, y);
      sepForce.mult(2);
      v.applyForce(sepForce);
      //v.target = new PVector(x, y);
    })

    this.vehicles2.forEach(function (vv) {
      var sepForce = vv.separate(x, y);
      sepForce.mult(2);
      vv.applyForce(sepForce);
      //vv.target = new PVector(x, y);
    })
  };


	function Vehicle(l, ms, mf, can, status){
		this.loc = new PVector(l.x, l.y);
    this.vel = new PVector(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1);
    this.acc = new PVector(0, 0);
    this.maxSpeed = ms;
    this.maxForce = mf;
    this.r = 5;
    this.sepDist = 100;
    this.can = can;
    this.status = status;
    this.target = this.loc;
	}

	Vehicle.prototype.update = function(){
		if(isMouseMove){
			this.vel.mult(0);
		}
		else{
			this.target = new PVector(this.loc.x, this.loc.y)
			this.vel = this.preVel !== undefined ? this.preVel : this.vel;
			//if(this.preVel !== undefined) console.log(this.preVel)
		}
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.loc.add(this.vel);
		this.acc.mult(0);
		//this.borders();
	};

	Vehicle.prototype.applyForce = function(f){
		this.acc.add(f);
	};

	Vehicle.prototype.recordLocation = function(){
		this.target = this.loc;
		this.preVel = new PVector(this.vel.x, this.vel.y);
	};

	Vehicle.prototype.borders = function(xMin, xMax, yMin, yMax){
		if(this.loc.x < xMin || this.loc.x > xMax) this.vel.x *= -1;
		if(this.loc.y < yMin || this.loc.y > yMax) this.vel.y *= -1;
	};

	Vehicle.prototype.applyBehaviors = function(){
		var sepForce = this.separate();
		var seekForce = this.seek();
		sepForce.mult(2);
		seekForce.mult(1);
		this.applyForce(sepForce);
		this.applyForce(seekForce);
	};

	Vehicle.prototype.seek = function(){
		var desire = PVector.sub(this.target, this.loc);
		var d = desire.mag();

		if(d<100){
			var m = map(d, 0, 100, 0, this.maxSpeed);
			desire.normalize();
			desire.mult(m);
		}else{
			desire.normalize();
			desire.mult(this.maxSpeed);
		}
		var steer = PVector.sub(desire, this.vel);
		steer.limit(this.maxForce);
		return steer;
	};

	Vehicle.prototype.separate = function(x,y){
		var dd = PVector.sub(this.loc, new PVector(x,y));
		var d = dd.mag();
		//console.log(d);
		if(d < this.sepDist){
			var diff = PVector.sub(this.loc, new PVector(x,y));
			diff.normalize();
			diff.mult(this.maxSpeed);
			diff.mult(this.sepDist / d);

			var steer = PVector.sub(diff, this.vel);
			steer.limit(this.maxForce);
			return steer;
		}else{
			return new PVector(0,0);
		}
	}
	
	Vehicle.prototype.getDis = function(){
		var dis = dist(this.loc.x, this.loc.y, this.target.x, this.target.y);
		return dis;
	}

	Vehicle.prototype.render = function(){
		var ctx = this.can.getContext("2d");
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(this.loc.x, this.loc.y, 2, 2);
	}


	exports.SAnimation = SAnimation;

})(this);