import Creature from './creature.js';
import DNA from './dna.js';

export default class GeneticAlgorithm {
  constructor(mutationRate = 0.2) {
    this.mutationRate = mutationRate;
  }

  evolve(creatures) {
    if (creatures.length === 0) return null;

    const sortedCreatures = [...creatures].sort((a, b) => b.health - a.health);

    const father = sortedCreatures[0];
    const mother = sortedCreatures.length > 1 ? sortedCreatures[1] : sortedCreatures[0];
    
    const childDNA = father.dna.crossover(mother.dna);
    
    childDNA.mutate(this.mutationRate);

    return new Creature(father.position.x, father.position.y, childDNA);
  }
}

