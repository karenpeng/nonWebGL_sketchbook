paper.install(window);

window.onload = function () {

  var path;
  var paths = [];

  paper.setup('myCanvas');
  var width = document.getElementById('myCanvas').width;

  var tool = new Tool();

  var segment;
  var movePath = false;
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
        //origin and destination defines the direction of your gradient. In this case its vertical i.e bottom(blue/cooler) to up(red/warmer) refering to link you sent.
        origin: [0, 0], //gradient will start applying from y=200 towards y=0. Adjust this value to get your desired result
        destination: [width, 0]
      };
      path.strokeWidth = 15;
      //path.fullySelected = true;
    } else {
      segment = null;
      path = null;
      var hitResult = project.hitTest(e.point, hitOptions);
      if(!hitResult) {
        return;
      }
      if(e.modifiers.shift){
        if(hitResult.type === 'segment'){
          hitResult.segment.remove();
        };
        return;
      }
      if(hitResult){
        path = hitResult.item;
        if(hitResult.type === 'segment'){
          segment = hitResult.segment;
        }else if(hitResult.type === 'stroke'){
          var location = hitResult.location;
          segment = path.insert(location.index + 1, e.point);
          path.smooth();
        }
      }
      movePath = hiteResult.type = 'fill';
      if(movePath){
        //project.activeLayer.addChild(hitResult.item);
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
  }
}