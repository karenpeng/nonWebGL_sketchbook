var debugCanvas = document.getElementById("debugCanvas");
var detectPoints = new DetectPoints(debugCanvas);
var myCanvas = document.getElementById("myCanvas");
var drawPoints = new DrawPoints(myCanvas);
var cornerDetect = new CornerDetect(debugCanvas);
		var pp = document.getElementById("pp");
		var debugPp = document.getElementById("reducePp");

function setup(){
	detectPoints.init();
	cornerDetect.init();
}

function update(){
	pp.getContext("2d").fillStyle="white";
	pp.getContext("2d").fillRect(0,0,160,120);
	reducePp.getContext("2d").fillStyle="white";
	reducePp.getContext("2d").fillRect(0,0,160,120);
	
	detectPoints.draw();
	drawPoints.getPoints(detectPoints.points, detectPoints.width, detectPoints.height);
	drawPoints.draw();
	cornerDetect.tick();


}

function loop(callback) {
	requestAnimationFrame(function () {
		loop(callback);
	});
	callback();
}

setup();
loop(update);

// window.onload = function(){
	
// };

//dat.gui
// var fizzyText = function(){
// 	detectPoints.threshold = 80;
// 	this.changes_sensitivity = 80;
// 	cornerDetect.threshold = 40;
// 	this.corner_sensitivity = 40;
// 	this.debug = true;
// }

// var text = new FizzyText();
// var gui = new dat.GUI();
// gui.add(text, 'changes_sensitivity', 60, 100).step(1);
// gui.add(text, 'corner_sensitivity', 20, 60).step(1);
// gui.add(text, 'changes_sensitivity', 60, 100).step(1);
// gui.add(text, 'corner_sensitivity', 20, 60).step(1);
// gui.add(text, 'debug');
