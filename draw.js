function scale(num, in_min, in_max, out_min, out_max) {
  var v = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	return v > out_max ? out_max : v < out_min ? out_min : v;

}

function clearCanvas(canvas) {
	var context= canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);  
}


function myNoise3d(x,y,z,l) {
	var v = noise.simplex3(x/l, y/l, z/l);
	return 0.5*(v+1);
}

function myNoise3dx(x,y,z,l) {
	var il = l;
	var pe = 0.5;			
	var re = 0;
	for(var i=0 ; i < 7; ++i) {
		re += pe*myNoise3d(x,y,z,il);
		il*= 0.5;
		pe*= 0.5;
	}
	return re;
}

function clamp(val, min, max) {
	return val < min ? min : val > max ? max : val;
}

noise.seed(Math.random());

var imageData= null;
function drawPerlinToCanvas(canvas, imageCanvas, time) {
	var context= canvas.getContext("2d");
	var imageContext= imageCanvas.getContext("2d");

	var imageData = imageContext.getImageData(0,0,imageCanvas.width, imageCanvas.height);
	var canvasData = context.createImageData(canvas.width, canvas.height);

	var cp = Math.min(canvas.width, canvas.height)/8;
	var waveLength = 20;

	for (var x = 0; x < canvas.width; x++) {
	  	for (var y = 0; y < canvas.height; y++) {
	  		var sx = x + waveLength*myNoise3dx(x, y, time/128, cp);
	  		var sy = y + waveLength*myNoise3dx(x+128, y, time/128, cp);

	  		sx = parseInt(clamp(sx, 0, imageCanvas.width - 1)+'');
	  		sy = parseInt(clamp(sy, 0, imageCanvas.height - 1)+'');
	  		sp = (sx*imageCanvas.width + sy)*4;

	    	var value = myNoise3dx(x, y, time/128, cp);
			var index = (x*canvas.width+y)*4;
			for(var i=0 ; i < 3; ++i) {
				canvasData.data[index+i] = imageData.data[sp + i]; // put sp here
			}
			canvasData.data[index+3] = 255;
		}
	}
	context.putImageData( canvasData, 0, 0 );     
}
