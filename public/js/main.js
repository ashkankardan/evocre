import Creature from './creature.js';
import FoodManager from './food.js';
import PoisonManager from './poison.js';
import GeneticAlgorithm from './ga.js';
import StatsPanel from './stats.js';
import History from './history.js';

// Configuration
const POPULATION_SIZE = 10;
const INITIAL_FOOD = 20;
const MAX_POISON = 20;

// State
let creatures = [];
let foodManager;
let poisonManager;
let ga;
let frameCount = 0;
let generationCount = 0;
let gameState = 'SETUP'; 
let visualDebug = false;

// UI Elements
const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const poisonRemainingEl = document.getElementById('poisonRemaining');
const instructionsEl = document.getElementById('instructions');
const gameStatusEl = document.getElementById('gameStatus');
const visualDebugCheckbox = document.getElementById('visual-debug-checkbox');

// Components
let statsPanel = new StatsPanel(document.getElementById('stats'), gameStatusEl);
let history = new History(document.getElementById('history-log-list'));

// Initialization
function initGame() {
  creatures = [];
  frameCount = 0;
  generationCount = 0;
  gameState = 'SETUP';

  // Managers
  foodManager = new FoodManager(INITIAL_FOOD, canvas.width, canvas.height);
  poisonManager = new PoisonManager(MAX_POISON);
  ga = new GeneticAlgorithm(0.2); // 0.2 mutation rate

  // Initialize population
  for (let i = 0; i < POPULATION_SIZE; i++) {
    creatures.push(new Creature(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  updateUI();
}

// Input Handlers
canvas.addEventListener('mousedown', (e) => {
  if (gameState !== 'SETUP') return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (poisonManager.add(x, y)) {
    updateUI();
  }
});

visualDebugCheckbox.addEventListener('change', () => {
  visualDebug = visualDebugCheckbox.checked;
});

startBtn.addEventListener('click', () => {
  if (gameState === 'SETUP' && poisonManager.count() >= 1) {
    gameState = 'RUNNING';
    updateUI();
  }
});

stopBtn.addEventListener('click', () => {
  if (gameState === 'RUNNING') {
    gameState = 'ENDED';
    gameStatusEl.innerText = "Game Status: Ended Manually";
    updateUI();
  }
});

resetBtn.addEventListener('click', () => {
  initGame();
  document.getElementById('history-log-list').innerHTML = '';
});

function updateUI() {
  poisonRemainingEl.innerText = MAX_POISON - poisonManager.count();

  if (gameState === 'SETUP' && poisonManager.count() < MAX_POISON) {
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'not-allowed';
  }

  if (gameState === 'SETUP') {
    const hasMinimumPoison = poisonManager.count() >= 1;
    gameStatusEl.innerText = hasMinimumPoison ? "Game Status: Setup" : "Game Status: Add at least 1 poison to start";
    startBtn.disabled = !hasMinimumPoison;
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
    startBtn.style.display = 'none';
    resetBtn.style.display = '';
    stopBtn.disabled = true;
  }
}

statsPanel.setDataProvider(() => {
  const safeDiv = (num, den) => den > 0 ? num / den : 0;
  const population = creatures.length;

  const survivalRate = safeDiv(creatures.reduce((sum, c) => sum + c.age, 0), population);
  const accuracy = safeDiv(creatures.reduce((sum, c) => sum + (c.age > 0 ? (c.foodEaten / c.age) * 1000 : 0), 0), population);

  return {
    generation: generationCount,
    population: population,
    food: foodManager.getAll().length,
    poison: poisonManager.getAll().length,
    avgFitness: safeDiv(creatures.reduce((sum, creature) => sum + creature.health, 0), population).toFixed(2),
    bestFitness: (creatures.reduce((max, creature) => Math.max(max, creature.health), 0)).toFixed(2),
    accuracy: accuracy.toFixed(2),
    survival: survivalRate.toFixed(2)
  };
});

function animate() {
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  foodManager.draw(ctx);
  poisonManager.draw(ctx);

  if (gameState === 'RUNNING') {
    frameCount++;

    for (let i = creatures.length - 1; i >= 0; i--) {
      const c = creatures[i];
      c.boundaries(canvas.width, canvas.height);
      c.behavior(foodManager.getAll(), poisonManager.getAll());
      c.update();
      c.display(ctx, visualDebug);

      if (c.eliminate()) {
        creatures.splice(i, 1);
      }
    }

    if (creatures.length === 0) {
      gameState = 'ENDED';
      gameStatusEl.innerText = "Game Status: User Wins (All creatures died)";
      updateUI();
    } else if (poisonManager.count() === 0 && creatures.length > 0) {
      gameState = 'ENDED';
      gameStatusEl.innerText = "Game Status: Creatures Win (All poison eaten)";
      updateUI();
    }

    if (frameCount % 100 === 0 && creatures.length > 0) {
      const data = statsPanel.dataProvider();
      history.addLog(data);

      const newCreature = ga.evolve(creatures);
      if (newCreature) {
        creatures.push(newCreature);
        generationCount++;
      }
    }

    foodManager.update(0.05);
  } else if (gameState === 'ENDED') {
    creatures.forEach(c => c.display(ctx, visualDebug));
  }

  statsPanel.update();
  requestAnimationFrame(animate);
}

initGame();
animate();
