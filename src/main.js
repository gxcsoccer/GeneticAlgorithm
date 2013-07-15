var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
	pop = [],
	offsetX = 100,
	offsetY = 100,
	width = 200,
	height = 200,
	canvas, context;


window.onload = function() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	for (var i = 0; i < 50; i++) {
		pop.push(Triangle.createTriangle());
	}

	draw();
};


function draw() {
	

	
	pop.forEach(function(triangle) {
		triangle.draw(context);
	});

	requestAnimationFrame(draw);
}