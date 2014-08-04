paper.install(window);

window.onload = function () {
  var path;
  var paths = [];

  paper.setup('myCanvas');

  var tool = new Tool();

  tool.onMouseDown = function (e) {
    if (isDrawingMode) {
      path = new Path();
      path.strokeColor = 'black';
      path.strokeWidth = 15;
      //path.fullySelected = true;
    } else {

    }
  };

  tool.onMouseDrag = function (e) {
    if (isDrawingMode) {
      path.add(e.point);
    } else {
      if (segment) {
        e.segment.point += e.delta;
        e.path.smooth();
      } else if (e.path) {
        e.path.position += e.delta;
      }
    }
  };

  tool.onMouseUp = function (e) {
    if (isDrawingMode) {
      path.smooth();
      path.simplify();
      paths.push(path);
    }
  };

  tool.onMouseMove = function (e) {
    if (isDrawingMode) {

    } else {
      project.activeLayer.selected = false;
      if (e.item) {
        e.item.selected = true;
      }
    }
  }
}