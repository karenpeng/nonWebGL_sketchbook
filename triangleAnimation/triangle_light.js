var canvas = document.getElementById("triangleTest"),
    context = canvas.getContext("2d"),
    verticesNumber = 64,
    vertices = new Array(verticesNumber),
    triangles,
    frame = 0;
var myTriangles = [];

      // for(i = vertices.length; i--; ) {
      //   do {
      //     x = Math.random() - 0.5;
      //     y = Math.random() - 0.5;
      //   } while(x * x + y * y > 0.25);

      //   x = (x * 0.96875 + 0.5) * canvas.width;
      //   y = (y * 0.96875 + 0.5) * canvas.height;

      //   vertices[i] = [x, y];
      // }

function dist(pointAX, pointAY, pointBX, pointBY){
  var dx = pointAX - pointBX;
  var dy = pointBY - pointBY;
  var dis = Math.sqrt( dx * dx + dy * dy );
  return dis;
}
function map(para, orMin, orMax, tarMin, tarMax){
  var ratio = (para - orMin)/(orMax - orMin);
  var tarValue = ratio * (tarMax - tarMin) + tarMin;
  return tarValue;
}

function init(){

  for(var j=0; j<vertices.length; j++){
    //vehicles.push( new Vehicle( new p5.Vector(random(width), random(height)), 8, 0.9, new p5.Vector(x, y) ) );
    var x = Math.floor(Math.random()*canvas.width);
    var y = Math.floor(Math.random()*canvas.height);
    vertices[j] = [x, y];
  }

  // for(var i = 0; i<16; i++){
  //    x = i*640/16;
  //   for(var j=0; j<16; j++){ 
  //     y = j*480/16;
  //     vertices[i+j*16] = [x, y];
  //   }
  // }

  console.time("triangulate");
  triangles = Delaunay.triangulate(vertices);
  console.timeEnd("triangulate");

  var k = 0;
  for(i = triangles.length; i>=3; i-=3 ) {
    //var color = 'rgb(0,' + Math.floor(255-k*10) + ',' + Math.floor(255-k*6) + ')';
    // context.strokeStyle = context.fillStyle;
    // context.beginPath();
    // context.moveTo(vertices[triangles[i-1]][0], vertices[triangles[i-1]][1]);
    // context.lineTo(vertices[triangles[i-2]][0], vertices[triangles[i-2]][1]);
    // context.lineTo(vertices[triangles[i-3]][0], vertices[triangles[i-3]][1]);
    // context.closePath();
    // context.stroke();
    // context.fill();
    myTriangles.push(new MyTriangle(vertices[triangles[i-1]],vertices[triangles[i-2]],vertices[triangles[i-3]],k));

    k+=0.6;

  }

}

canvas.onmousemove = function(e){
  console.log("ii");
   for(var l=0; l<myTriangles.length; l++){
    myTriangles[l].calDis(e.pageX, e.pageY);
  }

};
   
function draw(){

  requestAnimationFrame(draw);

  
  //context.fillStyle = "#ff00ff";
  //context.fillRect(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, 640, 480);
  
  frame ++;

  //console.log(frame);

   //if(frame % 30 === 0){

      // for(var j=0; j<vertices.length; j++){
      //   vertices[j][0] = vertices[j][0] += ( Math.random() - 0.5 );
      //   vertices[j][1] = vertices[j][1] += ( Math.random() - 0.5 );
      // }

   //}

  //triangles = Delaunay.triangulate(vertices);

  // var k = 0;
  // for(i = triangles.length; i>=3; i-=3 ) {
  //   var color = 'rgb(0,' + Math.floor(255-k*10) + ',' + Math.floor(255-k*6) + ')';
  //   context.strokeStyle = context.fillStyle;
  //   context.beginPath();
  //   context.moveTo(vertices[triangles[i-1]][0], vertices[triangles[i-1]][1]);
  //   context.lineTo(vertices[triangles[i-2]][0], vertices[triangles[i-2]][1]);
  //   context.lineTo(vertices[triangles[i-3]][0], vertices[triangles[i-3]][1]);
  //   context.closePath();
  //   context.stroke();
  //   context.fill();
    
  //   k+=0.6;

  // }

//context.clearRect(0, 0, canvas.width, canvas.height);

  for(var l=0; l<myTriangles.length; l++){
    myTriangles[l].render(myTriangles.length);
  }
  
}

function MyTriangle(a,b,c,sum){
  this.a = a;
  this.b = b;
  this.c = c;
  this.sum = sum;
  this.red = Math.floor(Math.random()*100);
}

MyTriangle.prototype.calDis = function(x, y){
  var dist1 = dist( this.a[0], this.a[1], x, y );
  var dist2 = dist( this.b[0], this.b[1], x, y );
  var dist3 = dist( this.c[0], this.c[1], x, y );
  this.sum = (dist1 + dist2 + dist3);
  console.log(this.sum);
};

MyTriangle.prototype.render = function(triNum){
  if(this.sum > triNum){
    this.sum = map(this.sum*this.sum, 1000, 16000000, 0, 120);
  }
  context.fillStyle = 'rgb('+ this.red.toString() + ',' + Math.floor(this.sum*2) + ',' + Math.floor(this.sum*2) + ')';
  context.strokeStyle = context.fillStyle;
  context.beginPath();
  context.moveTo(this.a[0], this.a[1]);
  context.lineTo(this.b[0], this.b[1]);
  context.lineTo(this.c[0], this.c[1]);
  context.closePath();
  context.stroke();
  context.fill();
};


init();
draw();
