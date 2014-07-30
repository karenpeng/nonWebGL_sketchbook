(function (exports) {

  function SAnimation(can) {
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.vertexes1 = [];
    this.vertexes2 = [];
    this.triangles1;
    this.triangles2;
  }

  SAnimation.prototype.init = function () {

    //initiate two groupps
    //group1
    /*
      
          .
    */
    this.vertexes1.push(new Vertex(this.width / 3, this.height + 40, false));
    /*
        .
      .
    */
    this.vertexes1.push(new Vertex(this.width / 3 + 20, this.height /2, false));
    this.vertexes1.push(new Vertex(this.width / 3 + 100, this.height / 3, false));

    /*
                 ========

                 ========
    */
    for (var it = this.width / 3 + 200; it < this.width + 10; it += 200) {
      this.vertexes1.push(new Vertex(it, 0, false));
      this.vertexes1.push(new Vertex(it, this.height, false));
    }
    this.vertexes1.push(new Vertex(this.width + 40, this.height + 10, false));

    /*
                          |
                          |
                          |
    */

    for (it = -10; it < this.height + 10; it += 200) {
      this.vertexes1.push(new Vertex(this.width, it, false));
    }

    //moving points
    for (var i = 0; i < 10; i++) {
      var x = Math.floor(Math.random() * this.width * 2 / 3 + this.width / 3 + 30);
      var y = Math.floor(Math.random() * this.height - 10);
      this.vertexes1.push(new Vertex(x, y, true));
    }


    //group2
    //the static points
    /*

    =     =
    */
    this.vertexes2.push(new Vertex(0, this.height, false));
    this.vertexes2.push(new Vertex(this.width / 6, this.height, false));

    /*

    .
 
    */
    this.vertexes2.push(new Vertex(0, this.height * 5 / 8, false));
    this.vertexes2.push(new Vertex(this.width / 8, this.height *2/ 3, false));


    //moving points
    for (i = 0; i < 5; i++) {
      var x = Math.floor(Math.random() * this.width / 6);
      var y = Math.floor(Math.random() * this.height / 2 + this.height / 2);
      this.vertexes2.push(new Vertex(x, y, true));
    }

  }


  SAnimation.prototype.draw = function () {

    for (var j = 0; j < this.vertexes1.length; j++) {    
      this.vertexes1[j].update(this.width / 3 + 10, this.width, 10, this.height - 20);
    }
 

    for (j = 0; j < this.vertexes2.length; j++) {
      this.vertexes2[j].update(10, this.width / 6, this.height / 2 + 10, this.height - 10);
    }


    var vertices1 = [];
    var vertices2 = [];
    for(var it = 0; it< this.vertexes1.length; it++ ){
      vertices1.push([this.vertexes1[it].x, this.vertexes1[it].y]);

    }
    for(it = 0; it< this.vertexes2.length; it++ ){
      vertices2.push([this.vertexes2[it].x, this.vertexes2[it].y]);
    }

    this.triangles1 = Delaunay.triangulate(vertices1);
    this.triangles2 = Delaunay.triangulate(vertices2);

    var k = 0;
    for (var i = this.triangles1.length; i >= 3; i -= 3) {

      this.context.fillStyle = 'rgb(0,' + Math.floor(
        130 - k * 6) + ',' +
        Math.floor(230 - k * 3) + ')';

      this.context.strokeStyle = this.context.fillStyle;
      this.context.beginPath();
      this.context.moveTo(vertices1[this.triangles1[i - 1]][0], vertices1[
        this.triangles1[i - 1]][1]);
      this.context.lineTo(vertices1[this.triangles1[i - 2]][0], vertices1[
        this.triangles1[i - 2]][1]);
      this.context.lineTo(vertices1[this.triangles1[i - 3]][0], vertices1[
        this.triangles1[i - 3]][1]);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
      k += 0.6;

    }

    k = 0;
    for (i = this.triangles2.length; i >= 3; i -= 3) {

      this.context.fillStyle = 'rgb(0,' + Math.floor(
        k * 4 + 140) + ',' +
        Math.floor(k * 8 + 220) + ')';

      this.context.strokeStyle = this.context.fillStyle;
      this.context.beginPath();
      this.context.moveTo(vertices2[this.triangles2[i - 1]][0], vertices2[
        this.triangles2[i - 1]][1]);
      this.context.lineTo(vertices2[this.triangles2[i - 2]][0], vertices2[
        this.triangles2[i - 2]][1]);
      this.context.lineTo(vertices2[this.triangles2[i - 3]][0], vertices2[
        this.triangles2[i - 3]][1]);
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
      k += 0.6;

    }
    
  };

  var preMouse = [0,0];

  SAnimation.prototype.mouseEnterEvent = function(x, y){
    preMouse = [0,0];
  }

  SAnimation.prototype.mouseMoveEvent = function (x, y) {

    if(Math.abs(x - preMouse[0]) > 30 || Math.abs(y - preMouse[1]) > 30){
      if(x > this.width / 3 + 20 && this.vertexes1.length < 48){
        this.vertexes1.push(new Vertex(x + Math.random()*4 -2, y+ Math.random()*4 -2, true));
      }else if(x < this.width / 6 && y > this.height / 2 && this.vertexes2.length < 18){
        this.vertexes2.push(new Vertex(x+ Math.random()*4 -2, y+ Math.random()*4 -2, true));
      }        
    preMouse = [x ,y];   
    }
  };

  
  function Vertex(x, y, status) {
    this.x = x;
    this.y = y;
    this.vX = Math.random() * 0.2 - 0.1;
    this.vY = Math.random() * 0.2 - 0.1;
    this.status = status;
  }

  Vertex.prototype.update = function (minX, maxX, minY, maxY) {
    if(this.status){
      this.x += this.vX;
      this.y += this.vY;
      if (this.x < minX || this.x > maxX) this.vX *= -1;
      if (this.y < minY || this.y > maxY) this.vY *= -1;
    }
  };
 

  exports.SAnimation = SAnimation;

})(this);