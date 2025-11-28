import Creature from './creature.js';
import DNA from './dna.js';
import FoodItem from './food.js';
import PoisonItem from './poison.js';
import StatsPanel from './stats.js';
import History from './history.js';


// Initialize variables
const _POPULATION = 10;
const _FOOD = 20;
// Maximum poison allowed to be placed by user
const _MAX_POISON = _FOOD; 

let creatures = [];
let food = [];
let poison = [];
let frameCount = 0;
let generationCount = 0;
let currentSurvivalRate = 0;
let currentAccuracy = 0;

// Game State: 'SETUP', 'RUNNING', 'ENDED'
let gameState = 'SETUP';

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const poisonRemainingEl = document.getElementById('poisonRemaining');
const instructionsEl = document.getElementById('instructions');
const gameStatusEl = document.getElementById('gameStatus');

let statsPanel = new StatsPanel(document.getElementById('stats'), document.getElementById('gameStatus'));
let history = new History(document.getElementById('history-log-list'));

function initGame() {
  creatures = [];
  food = [];
  poison = [];
  frameCount = 0;
  generationCount = 0;
  gameState = 'SETUP';
  
  updateUI();

  for (let i = 0; i < _POPULATION; i++) {
    creatures.push(new Creature(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  // Setup food
  for (let i = 0; i < _FOOD; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    food.push(new FoodItem(x, y));
  }
  
  // Poison is now placed by user, so we start empty
}

// Initial setup
initGame();

// Event Listeners
canvas.addEventListener('mousedown', (e) => {
  if (gameState !== 'SETUP') return;
  
  if (poison.length < _MAX_POISON) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    poison.push(new PoisonItem(x, y));
    updateUI();
  }
});

startBtn.addEventListener('click', () => {
  if (gameState === 'SETUP') {
    gameState = 'RUNNING';
    updateUI();
  }
});

stopBtn.addEventListener('click', () => {
  if (gameState === 'RUNNING') {
    gameState = 'ENDED';
    gameStatusEl.innerText = "Game Status: Ended Manually (No Winner)";
    updateUI();
  }
});

resetBtn.addEventListener('click', () => {
    initGame();
    document.getElementById('history-log-list').innerHTML = '';
});

function updateUI() {
  poisonRemainingEl.innerText = _MAX_POISON - poison.length;

  if (gameState === 'SETUP' && poison.length < _MAX_POISON) {
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'not-allowed';
  }
  
  if (gameState === 'SETUP') {
    gameStatusEl.innerText = "Game Status: Setup";
    startBtn.disabled = false;
    startBtn.style.display = '';
    resetBtn.style.display = 'none';
    stopBtn.disabled = true;
    instructionsEl.style.display = 'block';
  } else if (gameState === 'RUNNING') {
    gameStatusEl.innerText = "Game Status: Simulation Running";
    startBtn.disabled = true;
    startBtn.style.display = '';
    resetBtn.style.display = 'none';
    stopBtn.disabled = false;
    instructionsEl.style.display = 'none'; 
  } else {
    // ENDED
    startBtn.style.display = 'none';
    resetBtn.style.display = '';
    stopBtn.disabled = true;
  }
}

statsPanel.setDataProvider(() => {
  const safeDiv = (num, den) => den > 0 ? num / den : 0;
  const population = creatures.length;
  
  if (frameCount % 100 === 0 || generationCount === 0) {
    currentSurvivalRate = safeDiv(creatures.reduce((sum, c) => sum + c.age, 0), population)
    currentAccuracy = safeDiv(creatures.reduce((sum, c) => sum + (c.age > 0 ? (c.foodEaten / c.age) * 1000 : 0), 0), population)
  }  

    return {
      generation: generationCount,
      population: population,
      food: food.length, // food items
      poison: poison.length, // poison items
      avgFitness: safeDiv(creatures.reduce((sum, creature) => sum + creature.health, 0), population).toFixed(2),
      bestFitness: (creatures.reduce((max, creature) => Math.max(max, creature.health), 0)).toFixed(2),
      // Calculate Efficiency (Food/Time) and Avg Age
      accuracy: currentAccuracy.toFixed(2),
      survival: currentSurvivalRate.toFixed(2)
    };
  
});
function animate() {
  // background(51) equivalent
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Always draw food and poison
  food.forEach(item => {
    ctx.fillStyle = 'rgb(0, 255, 98)';
    ctx.strokeStyle = 'rgb(200, 200, 200)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  poison.forEach(item => {
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  if (gameState === 'RUNNING') {
    frameCount++;

    // Update and draw creatures
    for (let i = creatures.length - 1; i >= 0; i--) {
      creatures[i].boundaries(canvas);
      creatures[i].behavior(food, poison);
      creatures[i].update();
      creatures[i].display(ctx);

      if (creatures[i].eliminate()) {
        creatures.splice(i, 1);
      }
    }

    // Check End Conditions
    if (creatures.length === 0) {
        gameState = 'ENDED';
        gameStatusEl.innerText = "Game Status: User Wins (All creatures died)";
        updateUI();
    } else if (poison.length === 0 && creatures.length > 0) {
        gameState = 'ENDED';
        gameStatusEl.innerText = "Game Status: Creatures Win (All poison eaten)";
        updateUI();
    }

    // Reproduction logic every 100 frames
    if (frameCount % 100 === 0 && creatures.length > 0) {
      const bestFitness = creatures.reduce((max, creature) => Math.max(max, creature.health), 0).toFixed(2);
      history.addLog({
        generation: generationCount,
        population: creatures.length,
        bestFitness: bestFitness,
        accuracy: currentAccuracy.toFixed(2),
        survival: currentSurvivalRate.toFixed(2)
      });

      // Filter and sort creatures by health (highest first)
      const sortedCreatures = [...creatures].sort((a, b) => b.health - a.health);
      
      // Get father (highest health) and mother (second highest, or father if only 1 exists)
      const father = sortedCreatures[0];
      const mother = sortedCreatures.length > 1 ? sortedCreatures[1] : sortedCreatures[0];
      
      // Create new DNA weights: [father[0], father[1], mother[2], mother[3]]
      const newDnaWeights = [
        father.dna.getWeight(0),
        father.dna.getWeight(1),
        mother.dna.getWeight(2),
        mother.dna.getWeight(3)
      ];

      const mutationRate = 0.2;
      for (let i = 0; i < newDnaWeights.length; i++) {
        if (Math.random() < mutationRate) {
          if (i < 2) {
             // Weights: adjust by +/- 0.2
             newDnaWeights[i] += (Math.random() * 0.4) - 0.2;
          } else {
             // Perception radii: adjust by +/- 10
             newDnaWeights[i] += (Math.random() * 20) - 10;
          }
        }
      }
      
      // Create new creature at father's position with mixed DNA
      creatures.push(new Creature(father.position.x, father.position.y, new DNA(newDnaWeights)));
      generationCount++;
    }

    if (Math.random() < 0.05) {
      food.push(new FoodItem(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  } else if (gameState === 'ENDED') {
       // Just draw creatures in their last state (optional, or just stop updating them)
      for (let i = creatures.length - 1; i >= 0; i--) {
          creatures[i].display(ctx);
      }
  }
  
  statsPanel.update();

  requestAnimationFrame(animate);
}

// Start the animation loop
animate();

