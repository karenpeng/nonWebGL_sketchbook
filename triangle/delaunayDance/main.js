var debugCanvas = document.getElementById("debugCanvas");
var detectPoints = new DetectPoints(debugCanvas);
var myCanvas = document.getElementById("myCanvas");
var drawPoints = new DrawPoints(myCanvas);

function setup(){
	detectPoints.init();
	cornerDetect(myCanvas);
}

function update(){
	detectPoints.draw();
	drawPoints.getPoints(detectPoints.points, detectPoints.width, detectPoints.height);
	drawPoints.draw();
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