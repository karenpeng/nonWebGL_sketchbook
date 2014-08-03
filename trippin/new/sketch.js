//paper.install(window);

var canvas, path, tool;
// tool;

function init() {
  // Get a reference to the canvas object
  canvas = document.getElementById('myCanvas');
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);
  // Create a Paper.js Path to draw a line into it:
  path = new paper.Path();
  // Give the stroke a color

  tool = new paper.Tool();

  path.strokeColor = 'black';

}

tool.onMouseDown = function (e) {
  path.add(e.point);
}

function update() {
  if (path.segments.length > 0) {
    path.forEach(function (s) {
      console.log(s)
    })
    // var start = new paper.Point(100, 100);
    // path.moveTo(start);
    // // Note that the plus operator on Point objects does not work
    // // in JavaScript. Instead, we need to call the add() function:
    // path.lineTo(start.add([200, -50]));
    // // Draw the view now:
    // paper.view.draw();
  }
}

function createAnimation(callback) {
  requestAnimationFrame(update);
  callback();
}
window.onload = function () {
  init();
  createAnimation(update);
}