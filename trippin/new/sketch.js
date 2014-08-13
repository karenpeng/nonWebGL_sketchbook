paper.install(window);

//making a path
window.onload = function () {

  var path;
  var paths = [];

  paper.setup('myCanvas');
  var width = document.getElementById('myCanvas').width;

  var tool = new Tool();

  var segment;
  var hitOptions = {
    segments: true,
    stroke: true,
    fill: false,
    tolerance: 5
  };

  tool.onMouseDown = function (e) {
    if (isDrawingMode) {
      path = new Path();
      path.strokeColor = {
        gradient: {
          stops: ['blue', 'red', 'yellow']
        },
        origin: [0, 0],
        destination: [width, 0]
      };
      path.strokeWidth = 15;
    } else {
      segment = null;
      path = null;
      var hitResult = project.hitTest(e.point, hitOptions);
      if (!hitResult) {
        return;
      }
      if (e.modifiers.shift) {
        if (hitResult.type === 'segment') {
          hitResult.segment.remove();
        };
        return;
      }
      if (hitResult) {
        path = hitResult.item;
        if (hitResult.type === 'segment') {
          segment = hitResult.segment;
        } else if (hitResult.type === 'stroke') {
          var location = hitResult.location;
          segment = path.insert(location.index + 1, e.point);
          path.smooth();
        }
      }
    }
  };

  tool.onMouseDrag = function (e) {
    if (isDrawingMode) {
      path.add(e.point);
    } else if (segment) {
      //console.log(segment.point.x+ " with" + e.delta.x)
      segment.point.x += e.delta.x;
      segment.point.y += e.delta.y;
      path.smooth();
    } else if (path) {
      console.log(path)
      path.position += e.delta;
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
  };

  //gatting value
  function getValue(pathP) {
    for (var i = 0; i < pathP.curves.length; i++) {
      var curve = pathP.curves[i];
      var interval = 5;
      //console.log(curve.length)
      for (var j = 1; j <= curve.length; j += interval) {
        var curvePosition = curve.getLocationAt(j / curve.length);
        //console.log(curvePosition.point.x, curvePosition.point.y)
      }
    }
  }
  //TODO:
  //0.add begin and end point

  //1.hooking up for use, css3!!!!

  //2.browserify! T T  T T

  //3.i think it should involves live coding, the code control all the canvas

  //4.generative design? Or just a ball?

  tool.onKeyDown = function (e) {
    getValue(path)
  }
};
