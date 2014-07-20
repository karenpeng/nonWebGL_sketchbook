  var canvas = document.getElementById("triangleTest");

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

  /*
  //second attempt

  function Main(type) {
    this.main = new type(canvas);
    console.log(this.main);
  }
  Main.prototype.init = function () {
    this.main.init();
  }

  Main.prototype.update = function () {
    requestAnimationFrame(function () {
      this.update();
    });
    this.main.draw();
    console.log(this);
  }

  var main = new Main(DelaunayAnimation);
  main.init();
  main.update();
  */