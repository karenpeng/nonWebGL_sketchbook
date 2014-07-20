(function (exports) {

  function DelaunayAnimation(can) {
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.verticesNumber = 64;
    this.vertices = new Array(this.verticesNumber);
    this.triangles;
    this.r;
    this.g;
    this.b;
    this.frame = 0;
    this.vertexes = [];

    // for(i = vertices.length; i--; ) {
    //   do {
    //     x = Math.random() - 0.5;
    //     y = Math.random() - 0.5;
    //   } while(x * x + y * y > 0.25);

    //   x = (x * 0.96875 + 0.5) * canvas.width;
    //   y = (y * 0.96875 + 0.5) * canvas.height;

    //   vertices[i] = [x, y];
    // }

  }

  DelaunayAnimation.prototype.init = function () {

    for (var j = 0; j < this.vertices.length; j++) {
      //vehicles.push( new Vehicle( new p5.Vector(random(width), random(height)), 8, 0.9, new p5.Vector(x, y) ) );
      var x = Math.floor(Math.random() * this.canvas.width);
      var y = Math.floor(Math.random() * this.canvas.height);
      this.vertices[j] = [x, y];
      this.vertexes.push(new Vertex(x, y, this.canvas));
    }

    // for(var i = 0; i<16; i++){
    //    x = i*640/16;
    //   for(var j=0; j<16; j++){
    //     y = j*480/16;
    //     vertices[i+j*16] = [x, y];
    //   }
    // }

    console.time("triangulate");
    this.triangles = Delaunay.triangulate(this.vertices);
    console.timeEnd("triangulate");

  };

  DelaunayAnimation.prototype.update = function () {};

  DelaunayAnimation.prototype.draw = function () {

    this.frame++;
    if (this.frame < 3) {
      //console.log(this);
    }

    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //if (this.frame % 60 === 0) {

    // for (var j = 0; j < this.vertices.length; j++) {
    //   // vertices[j][0] = vertices[j][0] += Math.cos(theta);
    //   // vertices[j][1] = vertices[j][1] += Math.sin(theta);
    //   this.vertices[j][0] = this.vertices[j][0] += (Math.random() * 4 - 2);
    //   this.vertices[j][1] = this.vertices[j][1] += (Math.random() * 4 - 2);
    // }

    //}

    // for(var i = 0; i<16; i++){
    //    x = i*640/16;
    //   for(var j=0; j<16; j++){
    //     y = j*480/16;
    //     vertices[i+j*16] = [x, y];
    //   }
    // }
    for (var j = 0; j < this.vertexes.length; j++) {
      this.vertexes[j].update();
      this.vertices[j] = [this.vertexes[j].x, this.vertexes[j].y];
    }

    //console.time("triangulate");
    this.triangles = Delaunay.triangulate(this.vertices);
    //console.timeEnd("triangulate");

    var k = 0;
    for (var i = this.triangles.length; i >= 3; i -= 3) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      //context.fillStyle = "rgb(" + r.toString() + ","+ g.toString() + "," + b.toString() +")";
      this.context.fillStyle = 'rgb(0,' + Math.floor(255 - k * 4) + ',' +
        Math.floor(255 - k * 2) + ')';
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

    // for(i = triangles.length; i>3; i-- ) {
    //   context.moveTo(vertices[triangles[i-1]][0], vertices[triangles[i-1]][1]);
    //   context.lineTo(vertices[triangles[i-2]][0], vertices[triangles[i-2]][1]);
    //   context.lineTo(vertices[triangles[i-3]][0], vertices[triangles[i-3]][1]);
    // }
    // var count = 0;
    //       for(i = triangles.length; i; ) {
    //         ctx.beginPath();
    //         --i; ctx.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
    //         --i; ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
    //         --i; ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
    //         ctx.closePath();
    //         ctx.stroke();
    //         count ++;
    //       }
    //       console.log(count, triangles.length)

    //requestAnimationFrame(DelaunayAnimation.prototype.draw);

  };
  //}

  function Vertex(x, y, can) {
    this.x = x;
    this.y = y;
    this.vX = Math.random() * 0.2 - 0.1;
    this.vY = Math.random() * 0.2 - 0.1;
    this.can = can;
  }

  Vertex.prototype.update = function () {
    this.x += this.vX;
    this.y += this.vY;
    if (this.x < 0 || this.x > this.can.width) this.vX *= -1;
    if (this.y < 0 || this.y > this.can.height) this.vY *= -1;
  }

  exports.DelaunayAnimation = DelaunayAnimation;

})(this);