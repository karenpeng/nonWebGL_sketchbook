function dist(pointAX, pointAY, pointBX, pointBY) {
  var dx = pointAX - pointBX;
  var dy = pointBY - pointBY;
  var dis = Math.sqrt(dx * dx + dy * dy);
  return dis;
}

function map(para, orMin, orMax, tarMin, tarMax) {
  var ratio = (para - orMin) / (orMax - orMin);
  var tarValue = ratio * (tarMax - tarMin) + tarMin;
  return tarValue;
}

(function (exports) {

  function DelaunayLight(can) {
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.verticesNumber = 64;
    this.vertices = new Array(this.verticesNumber);
    this.triangles;
    this.frame = 0;
    this.myTriangles = [];
  }

  DelaunayLight.prototype.init = function () {

    for (var j = 0; j < this.vertices.length; j++) {
      //vehicles.push( new Vehicle( new p5.Vector(random(width), random(height)), 8, 0.9, new p5.Vector(x, y) ) );
      var x = Math.floor(Math.random() * this.canvas.width);
      var y = Math.floor(Math.random() * this.canvas.height);
      this.vertices[j] = [x, y];
    }

    console.time("triangulate");
    this.triangles = Delaunay.triangulate(this.vertices);
    console.timeEnd("triangulate");

    var k = 0;
    for (var i = this.triangles.length; i >= 3; i -= 3) {
      this.myTriangles.push(new MyTriangle(
        this.vertices[this.triangles[i - 1]],
        this.vertices[this.triangles[i - 2]],
        this.vertices[this.triangles[i - 3]],
        k,
        this.canvas
      ));

      k += 0.6;

    }

  };

  DelaunayLight.prototype.draw = function () {
    for (var l = 0; l < this.myTriangles.length; l++) {
      this.myTriangles[l].render(this.myTriangles.length);
    }
  };

  DelaunayLight.prototype.mouseEvent = function (x, y) {
    for (var l = 0; l < this.myTriangles.length; l++) {
      this.myTriangles[l].calDis(x, y);
    }
  };

  function MyTriangle(a, b, c, sum, can) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.sum = sum;
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.red = Math.floor(Math.random() * 100);
  }

  MyTriangle.prototype.calDis = function (x, y) {
    var dist1 = dist(this.a[0], this.a[1], x, y);
    var dist2 = dist(this.b[0], this.b[1], x, y);
    var dist3 = dist(this.c[0], this.c[1], x, y);
    this.sum = (dist1 + dist2 + dist3);
    //console.log(this.sum);
  };

  MyTriangle.prototype.render = function (triNum) {
    if (this.sum > triNum) {
      this.sum = map(this.sum * this.sum, 1000, 16000000, 0, 120);
    }
    this.context.fillStyle = 'rgb(' + this.red.toString() + ',' + Math.floor(
      this.sum * 2) + ',' + Math.floor(this.sum * 2) + ')';
    this.context.strokeStyle = this.context.fillStyle;
    this.context.beginPath();
    this.context.moveTo(this.a[0], this.a[1]);
    this.context.lineTo(this.b[0], this.b[1]);
    this.context.lineTo(this.c[0], this.c[1]);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();
  };

  exports.DelaunayLight = DelaunayLight;
  //console.log(exports.DelaunayLight);

})(this);