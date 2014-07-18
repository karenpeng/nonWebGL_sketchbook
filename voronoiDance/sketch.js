var resolution = 2;
var width = 640 / resolution;
var height = 480 / resolution;

function init() {

}

function draw() {
		if (WEBCAM.localMediaStream) {
				ctx.drawImage(WEBCAM.video, 0, 0, width, height);
		}

		requestAnimationFrame(draw);
}

draw();