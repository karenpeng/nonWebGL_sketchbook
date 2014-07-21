  var canvas = document.getElementById("triangleTest");
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

  //second attempt
  $("#animationType").change(function () {
    console.log("change")
    var value = $(this).val();
    if (value === "amb") {
      main = null;
      main = new Main(DelaunayAnimation);
    } else if (value === "lig") {
      main = null;
      main = new Main(DelaunayLight);
    } else if (value === "mou") {
      main = null;
      main = new Main(something);
    }
  });

  function Main(type) {
    this.animation = new type(canvas);
    console.log(this.main);
  }
  Main.prototype.init = function () {
    this.animation.init();
  };

  Main.prototype.update = function () {
    var that = this;
    requestAnimationFrame(function () {
      that.update();
    });
    this.animation.draw();
    //console.log(this);
  };

  main.init();
  main.update();

  canvas.onmousemove = function (e) {
    if (main.animation.mouseEvent !== undefined) {
      main.animation.mouseEvent(e.pageX, e.pageY);
    }
  };