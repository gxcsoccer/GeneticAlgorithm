var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
	pop = [],
	offsetX = 0,
	offsetY = 0,
	width = 200,
	height = 200,
	hiddenCanvas = document.createElement('canvas'),
	hiddenContext = hiddenCanvas.getContext('2d'),
	img = new Image(),
	splice = Array.prototype.splice,
	canvas, context;

img.src = 'img/Firefox.png';

/**
 * 颜色
 */
var Color = function(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

Color.prototype.toString = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
}

/**
 * 三角形
 */
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


/**
 * 单体
 */
var GENE_SIZE = 50;

var Graph = function() {
		this.collection = [];

		for (var i = 0; i < GENE_SIZE; i++) {
			this.collection.push(Triangle.createTriangle());
		}

		this.calculateFitness();
	};

Graph.prototype = {
	mutation: function() {
		var pos = Math.round(Math.random() * (GENE_SIZE - 1));
		this.collection[pos] = Triangle.createTriangle();
	},
	draw: function(context) {
		context.clearRect(0, 0, width, height);
		this.collection.forEach(function(triangle) {
			triangle.draw(context);
		});
	},
	calculateFitness: function() {
		this.draw(hiddenContext);

		var that = this;
		resemble(img).compareTo(hiddenCanvas).onComplete(function(data) {
			that.fitness = (100 - data.misMatchPercentage) / 100;
		});
	},
	clone: function() {
		
	}
}

/**
 * 遗传算法
 */
var GeneticAlgorithm = function(popSize, Pc, Pm) {
		this.population = [];

		var idv;
		for (var i = 0; i < popSize; i++) {
			idv = new Graph();
			//console.log(idv.fitness)
			this.population.push(idv);
		}
		this.popSize = popSize;
		this.Pc = Pc || 1;
		this.Pm = Pm || 0.0001;
	}


GeneticAlgorithm.prototype = {
	go: function() {

		for (var i = 0; i < this.popSize; i++) {
			if (this.population[i].fitness >= 0.8) {
				console.log('bingo!' + this.population[i].toString());
				this.population[i].draw(context);
				return;
			}
		}

		this.N = 0;
		this.iteract();
	},
	iteract: function() {
		var newPop, i, r;

		this.population.sort(function(a, b) {
			return a.fitness === b.fitness ? 0 : a.fitness < b.fitness ? 1 : -1;
		});

		console.log(this.population[0].fitness);
		this.population[0].draw(context);
		newPop = [this.population[0], this.population[1]];
		for (i = 2; i < this.popSize; i++) {
			newPop.push(this.rouletteWheelSelect());
		}

		for (i = 2; i < this.popSize; i += 2) {
			r = Math.random();
			if (r <= this.Pc) {
				this.crossover(newPop[i], newPop[i + 1]);
			}
		}

		for (i = 2; i < this.popSize; i++) {
			r = Math.random();
			if (r <= this.Pm) {
				newPop[i].mutation();
			}
		}

		for (i = 0; i < this.popSize; i++) {
			newPop[i].calculateFitness();
			if (newPop[i].fitness >= 0.8) {
				console.log('bingo at ' + N);
				this.population[i].draw(context);
				return;
			}
		}

		this.population = newPop;

		if(this.N++ < 1000) {
			requestAnimationFrame(this.iteract.bind(this));
		}
	},
	rouletteWheelSelect: function() {
		var m = 0,
			r = Math.random();
		for (var i = 0; i < this.popSize; i++) {
			/* 产生的随机数在m~m+P[i]间则认为选中了i
			 *  因此i被选中的概率是P[i]
			 */
			m = m + this.population[i].fitness;
			if (r <= m) return this.population[i];
		}
	},
	crossover: function(i1, i2) {
		var pos = Math.round(Math.random() * (GENE_SIZE - 1)),
			diff = splice.apply(i1.collection, [pos, GENE_SIZE - pos].concat(i2.collection.slice(pos)));
		splice.apply(i2.collection, [pos, GENE_SIZE - pos].concat(diff));
	}
}

////////////////////////////////////////////////////////////////////
window.onload = function() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	var ga = new GeneticAlgorithm(10);
	ga.go();
};


// function draw() {
// 	pop.forEach(function(triangle) {
// 		triangle.draw(context);
// 	});
// 	requestAnimationFrame(draw);
// }