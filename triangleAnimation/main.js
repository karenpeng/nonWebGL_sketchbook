  var canvas = document.getElementById("triangleTest");
  var d = new DelaunayAnimation(canvas);

  function setup() {
    d.init();
  }

  function update(callback) {
    requestAnimationFrame(function () {
      update(callback);
    });
    callback();
  }

  setup();
  update(d.draw);