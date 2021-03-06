var GENE_SIZE = 50,
	splice = Array.prototype.splice;

/**
 * 个体
 */
var Individual = function(tpl) {
		// 染色体
		this.chromosome = [];
		for (var i = 0; i < GENE_SIZE; i++) {
			this.chromosome[i] = tpl ? tpl.chromosome[i] : Math.round(Math.random());
		}
		this.fitness = tpl ? tpl.fitness : 0;
		this.memo = {};
	}

Individual.prototype = {
	/**
	 * 变异
	 */
	mutation: function() {
		var pos = Math.round(Math.random() * (GENE_SIZE - 1));
		this.chromosome[pos] = (this.chromosome[pos] + 1) % 2;
	},
	compare: function(other) {
		var same = 0;
		for (var i = 0; i < GENE_SIZE; i++) {
			if (other.chromosome[i] === this.chromosome[i]) {
				same++;
			}
		}
		return same / (GENE_SIZE - 1);
	},
	toString: function() {
		return this.chromosome.join('');
	},
	valueOf: function() {
		return this.fitness;
	},
	clone: function() {
		return new Individual(this);
	}
}

var GeneticAlgorithm = function(popSize, elitist, Pc, Pm) {
		this.population = [];
		this.elitist = elitist || new Individual();

		var idv;
		for (var i = 0; i < popSize; i++) {
			idv = new Individual();
			idv.fitness = this.elitist.compare(idv);
			//console.log(idv.fitness)
			this.population.push(idv);
		}
		this.popSize = popSize;
		this.Pc = Pc || 1;
		this.Pm = Pm || 0.0001;
	}

GeneticAlgorithm.prototype = {
	go: function() {
		var N = 0,
			newPop, i, r;

		console.log("elitist: " + this.elitist.toString());
		for (i = 0; i < this.popSize; i++) {
			if (this.population[i].fitness >= 1) {
				console.log('bingo: ' + this.population[i].toString());
				return;
			}
		}

		do {
			this.population.sort(function(a, b) {
				return a.fitness === b.fitness ? 0 : a.fitness < b.fitness ? 1 : -1;
			});

			console.log(this.population[0].fitness);

			newPop = [this.population[0].clone(), this.population[1].clone()];
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
				newPop[i].fitness = this.elitist.compare(newPop[i]);
				if (newPop[i].fitness >= 1) {
					console.log('bingo at ' + N + ': ' + newPop[i].fitness + ' ' + newPop[i].toString());
					return;
				}
			}

			this.population = newPop;
			N++;
		} while (N < 100000);
		console.log('finish at ' + this.population[0].fitness + ': ' + this.population[0].toString());
	},
	rouletteWheelSelect: function() {
		var m = 0,
			r = Math.random();
		for (var i = 0; i < this.popSize; i++) {
			/* 产生的随机数在m~m+P[i]间则认为选中了i
			 *  因此i被选中的概率是P[i]
			 */
			m = m + this.population[i].fitness;
			if (r <= m) return this.population[i].clone();
		}
	},
	crossover: function(i1, i2) {
		var pos = Math.round(Math.random() * (GENE_SIZE - 1)),
			diff = splice.apply(i1.chromosome, [pos, GENE_SIZE - pos].concat(i2.chromosome.slice(pos)));
		splice.apply(i2.chromosome, [pos, GENE_SIZE - pos].concat(diff));
	}
}

var ga = new GeneticAlgorithm(50);
ga.go();