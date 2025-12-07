export default class DNA {
  constructor(weights) {
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

  mutate(mutationRate) {
    for (let i = 0; i < this.weights.length; i++) {
      if (Math.random() < mutationRate) {
        if (i < 2) {
          this.weights[i] += (Math.random() * 0.4) - 0.2;
        } else {
          this.weights[i] += (Math.random() * 20) - 10;
        }
      }
    }
  }
}
