(function (exports) {

		function colorDiff(colorA, colorB) {
				var rDiff = Math.abs(colorA[0] - colorB[0]);
				var gDiff = Math.abs(colorA[1] - colorB[1]);
				var bDiff = Math.abs(colorA[2] - colorB[2]);
				var aveDiff = (rDiff + gDiff + bDiff) / 3;
				return aveDiff;
		}

		function DetectPoints(can) {
				this.can = can;
				this.ctx = this.can.getContext('2d');
				this.sampleRate = 4;
				this.width = this.can.width;
				this.height = this.can.height;
				this.currentColor = [];
				this.previousColor = [];
				this.colorDiffShrehold = 40;
				this.points = [];
		}

		DetectPoints.prototype.init = function () {
				for (var j = 0; j < this.height; j += this.sampleRate) {
						for (var i = 0; i < this.width; i += this.sampleRate) {
								this.previousColor.push([0, 0, 0, 255]);
						}
				}
		};

		DetectPoints.prototype.draw = function () {

				this.ctx.save();
				this.ctx.translate(this.width, 0);
				this.ctx.scale(-1, 1);
				if (WEBCAM.localMediaStream) {
						this.ctx.drawImage(WEBCAM.video, 0, 0, this.width, this.height);
				}
				this.ctx.restore();

				var index = 0;

				var rawPoints = [];

				if (WEBCAM.localMediaStream) {
	
						for (var j = 0; j < this.height; j += this.sampleRate) {
								for (var i = 0; i < this.width; i += this.sampleRate) {
										var data = this.ctx.getImageData(i, j, 1, 1).data;

										this.currentColor[index] = data;
										var colorDifference = colorDiff(this.previousColor[index], this.currentColor[
												index]);
										if (colorDifference > this.colorDiffShrehold) {

												rawPoints.push([true, i, j]);

										}else{
											rawPoints.push([false]);
										}
										this.previousColor[index] = this.currentColor[index];
										index++;

								}
						}


						this.points = [];
						var widthAmount = this.width/this.sampleRate;

							for(k=widthAmount; k<rawPoints.length- widthAmount-1; k++){
								if(rawPoints[k][0]){							
									if(!rawPoints[k-1][0] || !rawPoints[k-1][0] || !rawPoints[k-widthAmount][0] || !rawPoints[k+widthAmount][0]){
										this.points.push(new Point(rawPoints[k][1], rawPoints[k][2], "#ff00ff"));
									}
								}
							}


						}


				if (this.points !== []) {
						for (var k = 0; k < this.points.length - 1; k++) {
								if (this.points[k].update()) {
										this.points.splice(k, 1);
								} else {
										this.points[k].render(this.can, 2);
								}
						}

				}
		};

		function Point(x, y, fillStyle) {
				this.x = x;
				this.y = y;
				this.life = 240;
				this.fillStyle = fillStyle;
		}
		Point.prototype.update = function () {
				this.life--;
				return this.life < 0;
		};
		Point.prototype.render = function (can, radius) {
				ctx = can.getContext("2d");
				ctx.fillStyle = this.fillStyle;
				ctx.fillRect(this.x, this.y, radius, radius);
		};

		exports.DetectPoints = DetectPoints;

})(this);