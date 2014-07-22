//mouse

//vechicle
//seek
//separate

(function (exports) {

  function DelaunayAvoid(can) {
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.verticesNumber = 64;
    this.vertices = new Array(this.verticesNumber);
    this.triangles;
    this.vehicles = [];
  }

  DelaunayAvoid.prototype.init = function () {
    var index = 0;
    for (var i = 0; i < 1400; i += 200) {

      this.vertices[index] = [i, -100];
      this.vehicles.push(new Vehicle(new PVector(i, -100), 8, 0.9, new PVector(
        i, -100), this.canvas, "static"));
      index++;
      this.vertices[index] = [i, 400];
      this.vehicles.push(new Vehicle(new PVector(i, 400), 8, 0.9, new PVector(
        i, 400), this.canvas, "static"));
      index++;
    }

    for (var k = 0; k < 400; k += 200) {
      this.vertices[index] = [-100, k];
      this.vehicles.push(new Vehicle(new PVector(-100, k), 8, 0.9, new PVector(-
        100, k), this.canvas, "static"));
      index++;
      this.vertices[index] = [1400, k];
      this.vehicles.push(new Vehicle(new PVector(1400, k), 8, 0.9, new PVector(
        1400, k), this.canvas, "static"));
      index++;
    }

    for (var j = 17; j < this.vertices.length; j++) {
      var x = Math.floor(Math.random() * this.canvas.width);
      var y = Math.floor(Math.random() * this.canvas.height);
      this.vertices[j] = [x, y];
      this.vehicles.push(new Vehicle(new PVector(x, y), 8, 0.9, new PVector(x,
        y), this.canvas, "dynamic"));
    }

    console.time("triangulate");
    this.triangles = Delaunay.triangulate(this.vertices);
    console.timeEnd("triangulate");

  }

  DelaunayAvoid.prototype.draw = function () {
    for (var j = 0; j < this.vehicles.length; j++) {
      this.vehicles[j].sepDist = constrain(this.vehicles[j].sepDist, 25, 100);
      if (this.vehicles[j].status === "dynamic") {
        //this.vehicles[j].applyBehaviors();
        var seekForce = this.vehicles[j].seek();
        seekForce.mult(1);
        this.vehicles[j].applyForce(seekForce);
        this.vehicles[j].update();
      }
      //for debug
      //this.vehicles[j].render();

      this.vertices[j] = [this.vehicles[j].loc.x, this.vehicles[j].loc.y];
    }

    this.triangles = Delaunay.triangulate(this.vertices);

    var k = 0;
    for (var i = this.triangles.length; i >= 3; i -= 3) {
      // if(k % 2 === 0){
      // this.context.fillStyle = 'rgb(250,'+ Math.floor(250 - k * 4) + ',' +
      // Math.floor(250 - k * 2)+ ')';
      // }else{
      this.context.fillStyle = 'rgb(' + Math.floor(k) + ',' + Math.floor(
        250 - k * 5) + ',' +
        Math.floor(250 - k * 3) + ')';
      //}
      //console.log(this.context.fillStyle);
      this.context.strokeStyle = this.context.fillStyle;
      this.context.beginPath();
      this.context.moveTo(this.vertices[this.triangles[i - 1]][0], this.vertices[
        this.triangles[i - 1]][1]);
      this.context.lineTo(this.vertices[this.triangles[i - 2]][0], this.vertices[
        this.triangles[i - 2]][1]);
      this.context.lineTo(this.vertices[this.triangles[i - 3]][0], this.vertices[
        this.triangles[i - 3]][1]);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
      k += 0.6;

    }
  }

  DelaunayAvoid.prototype.mouseMoveEvent = function (x, y) {
    this.vehicles.forEach(function (v) {
      var sepForce = v.separate(x, y);
      sepForce.mult(2);
      v.applyForce(sepForce);
    })
  };

  DelaunayAvoid.prototype.mouseDownEvent = function (x, y) {
    this.vehicles.forEach(function (v) {
      v.sepDist += 5;
    })
  };

  DelaunayAvoid.prototype.mouseUpEvent = function (x, y) {
    this.vehicles.forEach(function (v) {
      v.sepDist -= 5;
    })
  };

  //---------------------------------------------

  function Vehicle(l, ms, mf, t, can, status) {
    this.loc = new PVector(l.x, l.y);
    this.vel = new PVector(0, 0);
    this.acc = new PVector(0, 0);
    this.maxSpeed = ms;
    this.maxForce = mf;
    this.r = 5;
    this.target = t;
    this.sepDist = 100;
    this.can = can;
    this.status = status;
  }

  Vehicle.prototype.update = function () {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.loc.add(this.vel);
    this.acc.mult(0);
    //this.borders();
  };

  Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
  };

  Vehicle.prototype.borders = function () {
    if (this.loc.x < -this.r) this.loc.x = this.can.width + this.r;
    if (this.loc.y < -this.r) this.loc.y = this.can.height + this.r;
    if (this.loc.x > this.can.width + this.r) this.loc.x = -this.r;
    if (this.loc.y > this.can.height + this.r) this.loc.y = -this.r;
  };

  Vehicle.prototype.applyBehaviors = function () {
    var sepForce = this.separate();
    var seekForce = this.seek();
    sepForce.mult(2);
    seekForce.mult(1);
    this.applyForce(sepForce);
    this.applyForce(seekForce);
  };

  Vehicle.prototype.seek = function () {
    var desire = PVector.sub(this.target, this.loc);
    var d = desire.mag();

    if (d < 100) {
      var m = map(d, 0, 100, 0, this.maxSpeed);
      desire.normalize();
      desire.mult(m);
    } else {
      desire.normalize();
      desire.mult(this.maxSpeed);
    }
    var steer = PVector.sub(desire, this.vel);
    steer.limit(this.maxForce);
    return steer;
  };

  Vehicle.prototype.separate = function (x, y) {
    var dd = PVector.sub(this.loc, new PVector(x, y));
    var d = dd.mag();
    //console.log(d);
    if (d < this.sepDist) {
      var diff = PVector.sub(this.loc, new PVector(x, y));
      diff.normalize();
      diff.mult(this.maxSpeed);
      diff.mult(this.sepDist / d);

      var steer = PVector.sub(diff, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return new PVector(0, 0);
    }
  }

  Vehicle.prototype.getDis = function () {
    var dis = dist(this.loc.x, this.loc.y, this.target.x, this.target.y);
    return dis;
  }

  Vehicle.prototype.render = function () {
    var ctx = this.can.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.loc.x, this.loc.y, 2, 2);
  }

//---------------------------------------------

	function Vehicle(l, ms, mf, t, can, status){
		this.loc = new PVector(l.x, l.y);
		this.vel = new PVector(0,0);
		this.acc = new PVector(0,0);
		this.maxSpeed = ms;
		this.maxForce = mf;
		this.r = 5;
		this.target = t;
		this.sepDist = 100; 
		this.can = can;
		this.status = status;
	}

	Vehicle.prototype.update = function(){
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.loc.add(this.vel);
		this.acc.mult(0);
		//this.borders();
	};

	Vehicle.prototype.applyForce = function(f){
		this.acc.add(f);
	};

	Vehicle.prototype.borders = function(){
		if(this.loc.x < -this.r) this.loc.x = this.can.width + this.r;
		if(this.loc.y < -this.r) this.loc.y = this.can.height + this.r;
		if(this.loc.x > this.can.width + this.r) this.loc.x = -this.r;
		if(this.loc.y > this.can.height + this.r) this.loc.y = -this.r;
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
	
	//--------------------------------------------

	exports.DelaunayAvoid = DelaunayAvoid;

})(this);