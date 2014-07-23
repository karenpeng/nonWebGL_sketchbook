(function (exports) {

		var pp = document.getElementById("pp");
		var debugPp = document.getElementById("reducePp");

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

		DetectPoints.prototype.reducePoints = function(points){
			// var minY = this.canvasHeight;
			// var maxY = 0;
			// this.points.forEach(function(p){
			// 		if(p.y < minY){
			// 			minY = p.y;
			// 		}
			// 		if(p.y > maxY){
			// 			maxY = p.y;
			// 		}
			// });
			// for(var h = minY; h < maxY; h+=this.sampleRate){

			// }
			//if(points.length !== 0){
				var middlePointIndexes = [];
				for(var i = 1; i< points.length-1; i++){				
					if(points[i-1].x === points[i].x - this.sampleRate /*&& points[i+1].x === points[i].x + this.sampleRate*/ ){
						middlePointIndexes.push(i);
					}
				}

				//console.log(middlePointIndexes);
				if(middlePointIndexes.length !== 0){
					var newPoints = [];				
					// 	for(var k = 0; k < middlePointIndexes.length; k++){
					// 		for(var j = 1; j < middlePointIndexes[k]; j++){	
					// 		// if (middlePointIndexes[k] > j) {
					// 		// 	break;
					// 		// }
					// 		//else 
					// 		if (j!== middlePointIndexes[k]){
					// 			newPoints.push(points[j]);
					// 		}
					// 	}
					// }
					var checkIndex = 0;
					for(var j = 1; j < points.length-1; j++){
						if(j< middlePointIndexes[checkIndex]){
							newPoints.push(points[j]);
						}else{
							checkIndex ++;
						}
					}
					//this.points = newPoints;
					//console.log(points.length, newPoints.length)
					return newPoints;
				}else return points;
			//}
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

				var rawPoints = [];
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
												//this.points.push(new Point(i, j));
												rawPoints.push([i, j]);
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

				var getIndexes = [];
				for(var it = 1; it< rawPoints.length - 1 ; it++){
						if(rawPoints[it][0] + this.sampleRate === rawPoints[it+1][0] && 
							rawPoints[it][0] - this.sampleRate === rawPoints[it-1][0]){

						}else{
							getIndexes.push(it);
						}
				}
				console.log(getIndexes.length, rawPoints.length)
				for(var itt = 0; itt<getIndexes.length; itt++){
					this.points.push(new Point(rawPoints[itt][0], rawPoints[itt][1]));
				}
				// ctx.save();
				// ctx.translate(can.width, 0);
				// ctx.scale(-1, 1);
				// if (WEBCAM.localMediaStream) {
				// 		ctx.drawImage(WEBCAM.video, 0, 0, can.width, can.height);
				// }
				// ctx.restore();

				


				if (this.points != []) {
						for (var k = 0; k < this.points.length-1; k++) {
								if (this.points[k].update()) {
										this.points.splice(k, 1);
										//vertices.splice(k, 1);
								} else if(this.points[k].x + this.sampleRate === this.points[k+1].x){
									//console.log(k)
									//this.points.splice(k,1);
								}else{
									this.points[k].render(pp,2,"#ff00ff")
								}
					}	


				//var newPoints = this.reducePoints(this.points); 
				//console.log(this.points.length, newPoints.length)
				//if(this.points.length > newPoints.length){
					//this.points = newPoints;
					// this.points = [];
					// for(var l=0;l<newPoints.length;l++){
					// 	this.points.push(new Point(newPoints[l].x, newPoints[l].y));
					// }
					//console.log(this.points.length, newPoints.length)




					// var self = this;
					// this.points.forEach(function(p){
					// 	p.render(pp, 2, "#ff00ff");
					// });
					// newPoints.forEach(function(p){
					// 	p.render(debugPp, 2, "#0000ff");
					// });
				//}

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
		Point.prototype.render = function (can, sampleRate, fillStyle) {
				ctx = can.getContext("2d");
				ctx.fillStyle = fillStyle;
				ctx.fillRect(this.x, this.y, sampleRate, sampleRate);
		};

		exports.DetectPoints = DetectPoints;

})(this);