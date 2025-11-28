import Creature from './creature.js';
import DNA from './dna.js';

export default class GeneticAlgorithm {
  constructor(mutationRate = 0.2) {
    this.mutationRate = mutationRate;
  }

  // Evolve the population: Create a new child from the best parents
  evolve(creatures) {
    if (creatures.length === 0) return null;

    // Filter and sort creatures by health (highest first)
    const sortedCreatures = [...creatures].sort((a, b) => b.health - a.health);

    // Get father (highest health) and mother (second highest, or father if only 1 exists)
    const father = sortedCreatures[0];
    const mother = sortedCreatures.length > 1 ? sortedCreatures[1] : sortedCreatures[0];
    
    // Let's use the DNA.crossover method I implemented which is generic.
    const childDNA = father.dna.crossover(mother.dna);
    
    // Mutate
    childDNA.mutate(this.mutationRate);

    // Return new creature (at father's position as per original logic)
    return new Creature(father.position.x, father.position.y, childDNA);
  }
}

