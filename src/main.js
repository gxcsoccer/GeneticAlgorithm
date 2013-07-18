var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
	pop = [],
	offsetX = 100,
	offsetY = 100,
	width = 200,
	height = 200,
	hiddenCanvas = document.createElement('canvas'),
	hiddenContext = hiddenCanvas.getContext('2d'),
	canvas, context;


var Triangle = function(p1, p2, p3, color) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.color = color;
	};

function randomPosition() {
	var x = (Math.random() * width) + offsetX,
		y = (Math.random() * height) + offsetY;

	return {
		x: x,
		y: y
	}
}

function randomColor() {
	return new Color(~~ (Math.random() * 255), ~~ (Math.random() * 255), ~~ (Math.random() * 255), Math.random());
}

Triangle.prototype = {
	draw: function(context) {
		context.beginPath();
		context.moveTo(this.p1.x, this.p1.y);
		context.lineTo(this.p2.x, this.p2.y);
		context.lineTo(this.p3.x, this.p3.y);
		context.lineTo(this.p1.x, this.p1.y);
		context.fillStyle = this.color.toString();
		context.fill();
		context.closePath();
	},
	mutation: function() {
		var index = ~~ (Math.randon() * 3);
		switch (index) {
		case 0:
			this.p1 = randomPosition();
			break;
		case 1:
			this.p2 = randomPosition();
			break;
		case 2:
			this.p3 = randomPosition();
			break;
		case 3:
			this.color = randomColor();
			break;
		default:
			return;
		}
	},

};

Triangle.createTriangle = function() {
	return new Triangle(randomPosition(), randomPosition(), randomPosition(), randomColor());
};


var GENE_SIZE = 50;

var Graph = function() {
		this.collection = [];

		for (var i = 0; i < GENE_SIZE; i++) {
			this.collection.push(Triangle.createTriangle());
		}

		hiddenContext.clearRect(0, 0, width, height);
		this.collection.forEach(function(triangle) {
			triangle.draw(hiddenContext);
		});

		this.fitness = 0;
	};

Graph.prototype = {
	mutation: function() {
		var pos = Math.round(Math.random() * (GENE_SIZE - 1));
		this.collection[pos] = Triangle.createTriangle();
	}
}


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