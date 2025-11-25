import Creature from './creature.js';
import Vector from './vector.js';

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

// Initialize variables
let creatures = [];
let food = [];
let poison = [];
let frameCount = 0;

for (let i = 0; i < 10; i++) {
  creatures.push(new Creature(Math.random() * canvas.width, Math.random() * canvas.height));
}

// Setup food
for (let i = 0; i < 20; i++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  food.push({ x, y });
}

for (let i = 0; i < 20; i++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  poison.push({ x, y });
}

function animate() {
  frameCount++;
  // background(51) equivalent
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Call the appropriate steering behaviors for our agents
  for (let i = creatures.length - 1; i >= 0; i--) {
    creatures[i].boundaries(canvas);
    creatures[i].behavior(food, poison);
    creatures[i].update();
    creatures[i].display(ctx);

    if (creatures[i].eliminate()) {
      creatures.splice(i, 1);
    }
    
  }

  // Reproduction logic every 100 frames
  if (frameCount % 100 === 0 && creatures.length > 0) {
    // Filter and sort creatures by health (highest first)
    const sortedCreatures = [...creatures].sort((a, b) => b.health - a.health);
    
    // Get father (highest health) and mother (second highest, or father if only 1 exists)
    const father = sortedCreatures[0];
    const mother = sortedCreatures.length > 1 ? sortedCreatures[1] : sortedCreatures[0];
    
    // Create new DNA: [father[0], father[1], mother[2], mother[3]]
    const newDna = [
      father.dna[0],
      father.dna[1],
      mother.dna[2],
      mother.dna[3]
    ];

    const mutationRate = 0.1;
    for (let i = 0; i < newDna.length; i++) {
      if (Math.random() < mutationRate) {
        newDna[i] += (Math.random() * 0.2) - 0.1;
      }
    }
    
    // Create new creature at father's position with mixed DNA
    creatures.push(new Creature(father.position.x, father.position.y, newDna));
  }

  food.forEach(item => {
    ctx.fillStyle = 'rgb(0, 255, 98)';
  // stroke(200)
  ctx.strokeStyle = 'rgb(200, 200, 200)';
  // strokeWeight(2)
  ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  poison.forEach(item => {
    ctx.fillStyle = 'rgb(255, 0, 0)';
  // stroke(200)
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    // strokeWeight(2)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  if (Math.random() < 0.05) {
    food.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
  }

  requestAnimationFrame(animate);
}

// Start the animation loop
animate();

