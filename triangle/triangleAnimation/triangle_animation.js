(function (exports) {

  var colors = [

    ["#FF4E50", "#FC913A", "#F9D423", "#E1F5C4"], //http://www.colourlovers.com/palette/937624/Dance_To_Forget
    ["#029DAF", "#E5D599", "#FFC219", "#E32551"], //http://www.colourlovers.com/palette/985632/Invisible_Look!
    ["#551BB3", "#268FBE", "#3DDB8F", "#A9F04D"], //http://www.colourlovers.com/palette/784112/Spring_Cleaning
    ["#A7CD2C", "#CEE891", "#E1F5C4", "#50C8C6"], //http://www.colourlovers.com/palette/1008442/Ambiental_Spray

  ];


  function DelaunayAnimation(can) {
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.verticesNumber = 64;
    this.vertices = new Array(this.verticesNumber);
    this.triangles;
    this.frame = 0;
    this.vertexes = [];
  }

  DelaunayAnimation.prototype.init = function () {
    var index = 0;
    for(var i = -100; i < 1400; i += 200){
      for( var k = -100; k < 400; k += 200){
        this.vertices[index] = [ i, k ];
        this.vertexes.push(new Vertex(i, k , this.canvas));
        index++;
      }
    }


    for (var j = 22; j < this.vertices.length; j++) {
      //vehicles.push( new Vehicle( new p5.Vector(random(width), random(height)), 8, 0.9, new p5.Vector(x, y) ) );
      var x = Math.floor(Math.random() * this.canvas.width );
      var y = Math.floor(Math.random() * this.canvas.height );
      this.vertices[j] = [x, y];
      this.vertexes.push(new Vertex(x, y, this.canvas));
    }

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

    for (var j = 0; j < this.vertexes.length; j++) {
      this.vertexes[j].update();
      this.vertices[j] = [this.vertexes[j].x, this.vertexes[j].y];
    }

    //console.time("triangulate");
    this.triangles = Delaunay.triangulate(this.vertices);
    //console.timeEnd("triangulate");

    var k = 0;
    for (var i = this.triangles.length; i >= 3; i -= 3) {
      // if(k % 2 === 0){
      // this.context.fillStyle = 'rgb(250,'+ Math.floor(250 - k * 4) + ',' +
      // Math.floor(250 - k * 2)+ ')';
      // }else{
      this.context.fillStyle = 'rgb('+ Math.floor(k*1.4)+ ','+ Math.floor(250 - k * 6) + ',' +
      Math.floor(250 - k * 3)+ ')';
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
      k +=0.6;

    }

  };


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
  };

  exports.DelaunayAnimation = DelaunayAnimation;

})(this);