//paper.install(window);
var width = 640;
var height = 480;
var radius = 10;
var beginX = radius;
var beginY = radius;
var endX = width - radius;
var endY = height - radius;
var interval = 6;
var isDrawingDone = false;
var time = 0;
var booPadding = 20;

function constrain(item, min, max) {
  if (item < min) return min;
  else if (item > max) return max;
  else return item;
}

function map(para, orMin, orMax, tarMin, tarMax) {
  var ratio = (para - orMin) / (orMax - orMin);
  var tarValue = ratio * (tarMax - tarMin) + tarMin;
  return tarValue;
}

function whatever() {
  var path;
  paper.setup('myCanvas');
  var tool = new paper.Tool();

  //making begin and end point
  var beginP = new paper.Path.Circle(new paper.Point(beginX, beginY), radius);
  var endP = new paper.Path.Circle(new paper.Point(endX, endY), radius);
  beginP.strokeColor = 'black';
  endP.strokeColor = 'black';

  //making draw area
  var drawArea = new paper.Path.Rectangle(0, 0, width, height);
  drawArea.strokeColor = 'black';

  //making interval x path
  var verticalPaths = [];
  for (var i = beginX; i <= endX; i += interval) {
    var verticalPath = new paper.Path.Line(new paper.Point(i, 0), new paper.Point(
      i, height));
    //verticalPath.strokeColor = 'black';
    verticalPaths.push(verticalPath);
  }

  //making moving ball
  var boo = new paper.Path.Circle(new paper.Point(width + booPadding, beginY),
    radius);
  boo.fillColor = 'blue';
  console.log(boo.fillColor.hue)

  function getValue() {
    var value = [];
    verticalPaths.forEach(function (pa) {
      var intersections = path.getIntersections(pa);
      intersections.forEach(function (intersection) {
        value.push([intersection.point.x, intersection.point.y]);
      });
    });
    return value;
  }

  var hitSegment;
  var hitOptions = {
    segments: true,
    stroke: true,
    fill: false,
    tolerance: 5
  };

  tool.onMouseDown = function (e) {
    if (isDrawingMode) {
      if (beginP.bounds.contains(e.point)) {
        beginP.fillColor = 'blue';
        path = new paper.Path();
        path.strokeColor = {
          gradient: {
            stops: ['blue', 'green', 'yellow']
          },
          origin: [0, 0],
          destination: [width, 0]
        };
        path.strokeWidth = 8;
        path.add(new paper.Point(beginX, beginY));
      }
    } else {
      hitSegment = null;
      var hitResult = paper.project.hitTest(e.point, hitOptions);
      if (!hitResult) {
        return;
      }
      if (e.modifiers.shift) {
        if (hitResult.type === 'segment') {
          hitResult.segment.remove();
        }
        return;
      }
      if (hitResult) {
        if (hitResult.type === 'segment') {
          hitSegment = hitResult.segment;
        } else if (hitResult.type === 'stroke') {
          var location = hitResult.location;
          hitSegment = path.insert(location.index + 1, e.point);
          path.smooth();
        }
      }
    }
  };

  tool.onMouseDrag = function (e) {
    if (isDrawingMode) {
      if (drawArea.bounds.contains(e.point)) {
        path.segments.forEach(function (s, index) {
          if (s.point.x >= e.point.x) {
            path.removeSegment(index);
          }
        });
        path.add(e.point);
        if (endP.bounds.contains(e.point)) {
          endP.fillColor = "yellow";
        }
      }
    } else if (hitSegment) {
      var index = hitSegment.index;
      hitSegment.point.x += e.delta.x;
      hitSegment.point.x = constrain(hitSegment.point.x, path.segments[
          index - 1].point.x + 0.0000001, path.segments[index + 1].point.x -
        0.0000001);
      hitSegment.point.y += e.delta.y;
      path.smooth();
    }
  };

  tool.onMouseUp = function (e) {
    if (isDrawingMode) {
      if (!endP.bounds.contains(e.point)) {
        path.add(new paper.Point(endX, endY));
      }
      endP.fillColor = 'yellow';
      path.smooth();
      path.simplify();
      path.firstSegment.point.x = beginX;
      path.firstSegment.point.y = beginY;
      path.lastSegment.point.x = endX;
      path.lastSegment.point.y = endY;
      isDrawingDone = true;
    }
  };

  tool.onMouseMove = function (e) {
    if (!isDrawingMode) {
      paper.project.activeLayer.selected = false;
      if (e.item) {
        e.item.selected = true;
      }
    }
  };

  //TODO:
  //0.add begin and end point

  //1.hooking up for use, css3!!!!

  //2.browserify! T T  T T

  //3.i think it should involves live coding, the code control all the canvas

  //4.generative design? Or just a ball?

  paper.view.onFrame = function (e) {
    if (isDrawingDone) {
      var value = getValue();
      boo.position.y = value[time][1];
      boo.fillColor.hue = map(boo.position.y, beginY, endY, 240, 60);
      time++;
      if (time >= value.length) time = 0;
    }
  };
}

window.onload = function () {
  whatever();
};