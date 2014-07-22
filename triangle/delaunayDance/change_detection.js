(function (exports) {

		function colorDiff(colorA, colorB) {
			var rDiff = Math.abs(colorA[0] - colorB[0]);
			var	gDiff = Math.abs(colorA[1] - colorB[1]);
			var	bDiff = Math.abs(colorA[2] - colorB[2]);
			var	aveDiff = (rDiff + gDiff + bDiff) / 3;
			return aveDiff;
		}

		function DetectPoints(can){
			this.can = can;
			this.ctx = this.can.getContext('2d');
			this.sampleRate = 4;
			this.width = this.can.width;
		 	this.height = this.can.height;
			this.currentColor = [];
			this.previousColor = [];
			this.colorDiffShrehold = 80;
			this.points = [];
			this.vertices = [];
		  //this.triangles;
		}

		DetectPoints.prototype.init = function() {
			for (var i = 0; i < this.width; i += this.sampleRate) {
				for (var j = 0; j < this.height; j += this.sampleRate) {
					this.previousColor.push([0, 0, 0, 255]);
				}
			}
		}


		DetectPoints.prototype.draw = function() {

				this.ctx.save();
				this.ctx.translate(this.width, 0);
				this.ctx.scale(-1, 1);
				if (WEBCAM.localMediaStream) {
						this.ctx.drawImage(WEBCAM.video, 0, 0, this.width, this.height);
				}
				this.ctx.restore();

				var index = 0;

				if (WEBCAM.localMediaStream) {
						for (var i = 0; i < this.width; i += this.sampleRate) {
								for (var j = 0; j < this.height; j += this.sampleRate) {
										var data = this.ctx.getImageData(i, j, 1, 1).data;
										//console.log(data);
										this.currentColor[index] = data;
										//console.log(currentColor[i * width + j]);
										var colorDifference = colorDiff(this.previousColor[index], this.currentColor[
												index]);
										//console.log(previousColor[index], currentColor[index]);
										//console.log(colorDifference)
										if (colorDifference > this.colorDiffShrehold) {
												this.points.push(new Point(i, j));
												// vertices.push([
												// 		// i * condenseRate + Math.random() * 12 - 6, j * condenseRate +
												// 		// Math.random() * 12 - 6
												// 		i * condenseRate , j * condenseRate 
												// ]);
										}
										this.previousColor[index] = this.currentColor[index];
										index++;

								}
						}
				}

				// ctx.save();
				// ctx.translate(can.width, 0);
				// ctx.scale(-1, 1);
				// if (WEBCAM.localMediaStream) {
				// 		ctx.drawImage(WEBCAM.video, 0, 0, can.width, can.height);
				// }
				// ctx.restore();

				if (this.points != []) {
						for (var k = 0; k < this.points.length; k++) {
								if (this.points[k].update()) {
										this.points.splice(k, 1);
										//vertices.splice(k, 1);
								} else {
										//points[k].render();
								}
						}
						// triangles = Delaunay.triangulate(vertices);

						// //ctx.globalCompositeOperation = 'lighten';
						// for (var l = triangles.length; l >= 3; l -= 3) {
						// 		var hue = Math.floor(Math.random() * 360);
						// 		var saturation = '100%';
						// 		var lightness = Math.floor(Math.random() * 50 + 50);
						// 		var al = Math.random();
						// 		ctx.fillStyle = "hsla(" + hue.toString() + "," + saturation + "," +
						// 				lightness.toString() + "%" + "," + al.toString() + ")";
						// 		ctx.strokeStyle = ctx.fillStyle;
						// 		ctx.beginPath();
						// 		ctx.moveTo(vertices[triangles[l - 1]][0], vertices[triangles[l - 1]][
						// 				1
						// 		]);
						// 		ctx.lineTo(vertices[triangles[l - 2]][0], vertices[triangles[l - 2]][
						// 				1
						// 		]);
						// 		ctx.lineTo(vertices[triangles[l - 3]][0], vertices[triangles[l - 3]][
						// 				1
						// 		]);
						// 		ctx.closePath();
						// 		ctx.stroke();
						// 		ctx.fill();
						// }
				}
		}

		function Point(x, y) {
				this.x = x;
				this.y = y;
				this.life = 10;
		}
		Point.prototype.update = function () {
				this.life--;
				return this.life < 0;
		};
		// Point.prototype.render = function (ctx, sampleRate) {
		// 		//ctx.fillStyle = "#ff00ff";
		// 		ctx.fillRect(this.x, this.y, sampleRate, sampleRate);
		// };

		exports.DetectPoints = DetectPoints;

})(this);