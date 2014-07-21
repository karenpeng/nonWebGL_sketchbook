  var canvas = document.getElementById("triangleTest");
  var context = canvas.getContext("2d");
  var main = new Main(DelaunayAnimation);
  /*
  //first attempt
  var d = new DelaunayAnimation(canvas);

  function setup() {
    d.init();
  }

  function update(callback) {
    requestAnimationFrame(function () {
      update(callback);
    });
    console.log(this);
    callback();
  }

  setup();
  update(d.draw);
*/
function drawBackground(){
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function changeType(type){
  main.destory();
  main = new Main(type);
  main.init();
  main.update();
}
  //second attempt
  $("#animationType").change(function () {
    console.log("change")
    var value = $(this).val();
    if (value === "DelaunayAnimation") {
      drawBackground();
      changeType(DelaunayAnimation);
    } else if (value === "DelaunayLight") {
      drawBackground();
      changeType(DelaunayLight);
    } else if (value === "DelaunayAvoid") {
      drawBackground();
      changeType(DelaunayAvoid);
    }
  });

  function Main(type) {
    console.log(typeof type)
    this.animation = new type(canvas);
    console.log(this.animation);
    this.keepAnimating = true;
  }
  Main.prototype.init = function () {
    this.animation.init();
    this.keepAnimating = true;
  };

  Main.prototype.update = function () {
    var that = this;
    requestAnimationFrame(function () {
      if(that.keepAnimating){
        that.update();
      }
    });
    drawBackground();
    this.animation.draw();
    //console.log(this);
  };
  Main.prototype.destory = function(){
    this.animation = null;
    this.keepAnimating = false;
  };

  main.init();
  main.update();

  canvas.onmousemove = function (e) {
    if (main.animation.mouseMoveEvent !== undefined) {
      main.animation.mouseMoveEvent(e.pageX, e.pageY);
    }
  };

  canvas.onmousedown = function (e) {
    if (main.animation.mouseDownEvent !== undefined) {
      main.animation.mouseDownEvent(e.pageX, e.pageY);
    }
  };

  canvas.onmouseup = function (e) {
    if (main.animation.mouseUpEvent !== undefined) {
      main.animation.mouseUpEvent(e.pageX, e.pageY);
    }
  };