export default class DNA {
  constructor(weights) {
    // DNA consists of genes:
    // 0: food weight
    // 1: poison weight
    // 2: food perception
    // 3: poison perception
    if (weights) {
      this.weights = weights;
    } else {
      this.weights = [
        Math.random() * 4 - 2,   // Food Weight
        Math.random() * 4 - 2,   // Poison Weight
        Math.random() * 90 + 10, // Food Perception
        Math.random() * 90 + 10  // Poison Perception
      ];
    }
  }

  getWeight(index) {
    return this.weights[index];
  }

  getPerceptionRadius(index) {
    return this.weights[index];
  }

  // Crossover with another DNA
  crossover(partner) {
    const newGenes = [];
    const mid = Math.floor(Math.random() * this.weights.length);
    
    for (let i = 0; i < this.weights.length; i++) {
      if (i > mid) {
        newGenes[i] = this.weights[i];
      } else {
        newGenes[i] = partner.weights[i];
      }
    }
    return new DNA(newGenes);
  }

  // Mutate the DNA
  mutate(mutationRate) {
    for (let i = 0; i < this.weights.length; i++) {
      if (Math.random() < mutationRate) {
        if (i < 2) {
          // Weights: adjust by +/- 0.2
          this.weights[i] += (Math.random() * 0.4) - 0.2;
        } else {
          // Perception radii: adjust by +/- 10
          this.weights[i] += (Math.random() * 20) - 10;
        }
      }
    }
  }
}
