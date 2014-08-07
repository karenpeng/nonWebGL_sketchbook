paper.install(window);

window.onload = function () {

  var path;
  var paths = [];

  paper.setup('myCanvas');
  var width = document.getElementById('myCanvas').width;

  var tool = new Tool();

  tool.onMouseDown = function (e) {
    if (isDrawingMode) {
      path = new Path();
      path.strokeColor = {
        gradient: {
          stops: ['blue', 'red', 'yellow']
        },
        //origin and destination defines the direction of your gradient. In this case its vertical i.e bottom(blue/cooler) to up(red/warmer) refering to link you sent.
        origin: [0, 0], //gradient will start applying from y=200 towards y=0. Adjust this value to get your desired result
        destination: [width / 2, 0]
      };
      path.strokeWidth = 15;
      //path.fullySelected = true;
    } else {

    }
    handle = null;
    // Do a hit test on path for handles:
    var hitResult = path.hitTest(event.point, {
      handles: true
    });
    if (hitResult) {
      if (hitResult.type == 'handle-in') {
        handle = hitResult.segment.handleIn;
      } else {
        handle = hitResult.segment.handleOut;
      }
    }
  };

  var handle;

  tool.onMouseDrag = function (e) {
    if (isDrawingMode) {
      path.add(e.point);
    } else {
      if (handle) {
        handle.x += event.delta.x;
        handle.y += event.delta.y;
      }
      // if (e.segment) {
      //   console.log(e.segment)
      //   e.segment.point += e.delta;
      //   e.path.smooth();
      // } else if (e.path) {
      //   console.log(e.path)
      //   e.path.position += e.delta;
      // }
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