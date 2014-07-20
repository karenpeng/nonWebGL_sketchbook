(function () {
		var can = document.getElementById('myCanvas');
		var ctx = can.getContext('2d');

		var sampleRate = 4;
		var condenseRate = 10;
		var width = Math.floor(can.width / condenseRate);
		var height = Math.floor(can.height / condenseRate);
		var currentColor = [];
		var previousColor = [];
		var colorDiffShrehold = 100;
		var points = [];
		var vertices = [];
		var triangles;

		function init() {

				for (var i = 0; i < width; i += sampleRate) {
						for (var j = 0; j < height; j += sampleRate) {
								previousColor.push([0, 0, 0, 255]);
						}
				}

		}

		function colorDiff(colorA, colorB) {
				rDiff = Math.abs(colorA[0] - colorB[0]);
				gDiff = Math.abs(colorA[1] - colorB[1]);
				bDiff = Math.abs(colorA[2] - colorB[2]);
				aveDiff = (rDiff + gDiff + bDiff) / 3;
				return aveDiff;
		}

		function update() {

				ctx.save();
				ctx.translate(width, 0);
				ctx.scale(-1, 1);
				if (WEBCAM.localMediaStream) {
						ctx.drawImage(WEBCAM.video, 0, 0, width, height);
				}
				ctx.restore();

				var index = 0;

				if (WEBCAM.localMediaStream) {
						for (var i = 0; i < width; i += sampleRate) {
								for (var j = 0; j < height; j += sampleRate) {
										var data = ctx.getImageData(i, j, 1, 1).data;
										//console.log(data);
										currentColor[index] = data;
										//console.log(currentColor[i * width + j]);
										var colorDifference = colorDiff(previousColor[index], currentColor[
												index]);
										//console.log(previousColor[index], currentColor[index]);
										//console.log(colorDifference)
										if (colorDifference > colorDiffShrehold) {
												points.push(new Point(i, j));
												vertices.push([
														i * condenseRate + Math.random() * 12 - 6, j * condenseRate +
														Math.random() * 12 - 6
												]);
										}
										previousColor[index] = currentColor[index];
										index++;

								}
						}
				}

				ctx.save();
				ctx.translate(can.width, 0);
				ctx.scale(-1, 1);
				if (WEBCAM.localMediaStream) {
						ctx.drawImage(WEBCAM.video, 0, 0, can.width, can.height);
				}
				ctx.restore();

				if (points != []) {
						for (var k = 0; k < points.length; k++) {
								if (points[k].update()) {
										points.splice(k, 1);
										vertices.splice(k, 1);
								} else {
										//points[k].render();
								}
						}
						triangles = Delaunay.triangulate(vertices);

						//ctx.globalCompositeOperation = 'lighten';
						for (var l = triangles.length; l >= 3; l -= 3) {
								var hue = Math.floor(Math.random() * 360);
								var saturation = '100%';
								var lightness = Math.floor(Math.random() * 50 + 50);
								var al = Math.random();
								ctx.fillStyle = "hsla(" + hue.toString() + "," + saturation + "," +
										lightness.toString() + "%" + "," + al.toString() + ")";
								ctx.strokeStyle = ctx.fillStyle;
								ctx.beginPath();
								ctx.moveTo(vertices[triangles[l - 1]][0], vertices[triangles[l - 1]][
										1
								]);
								ctx.lineTo(vertices[triangles[l - 2]][0], vertices[triangles[l - 2]][
										1
								]);
								ctx.lineTo(vertices[triangles[l - 3]][0], vertices[triangles[l - 3]][
										1
								]);
								ctx.closePath();
								ctx.stroke();
								ctx.fill();
						}
				}
		}

		function createAnimation(callback) {
				requestAnimationFrame(function () {
						createAnimation(callback);
				});
				callback();
		}

		function Point(x, y) {
				this.x = x * condenseRate;
				this.y = y * condenseRate;
				this.life = 10;
		}
		Point.prototype.update = function () {
				this.life--;
				return this.life < 0;
		};
		Point.prototype.render = function () {
				//ctx.fillStyle = "#ff00ff";
				ctx.fillRect(this.x, this.y, sampleRate, sampleRate);
		};

		init();
		createAnimation(update);

})(this);