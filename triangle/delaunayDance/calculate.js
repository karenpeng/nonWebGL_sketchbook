(function (exports) {

  function Data() {
    this.points = [];
    this.avgX;
    this.avgY;
    this.totalSize;
  }

  Data.prototype.getPoints = function (points) {
    this.points = [];
    for (var i = 0; i < points.length; i++) {
      this.points[i] = [points[i].x, points[i].y];
    }
  }

  Data.prototype.getAvg = function () {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < this.points.length; i++) {
      var sumX += this.points[i].x;
      var sumY += this.points[i].y;
    }
    this.avgX = sumX / this.points.length;
    this.avgY = sumY / this.points.length;
  }

  Data.prototype.getSize = function () {
    // for (var j = 0; j<  ){

    // }
  }

  exports.Data = Data;

})(this);