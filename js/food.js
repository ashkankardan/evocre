const DEFAULT_RADIUS = 6;

class FoodItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = DEFAULT_RADIUS;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default class FoodManager {
  constructor(count, canvasWidth, canvasHeight) {
    this.items = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Initial spawn
    for (let i = 0; i < count; i++) {
      this.addRandom();
    }
  }

  addRandom() {
    const x = Math.random() * this.canvasWidth;
    const y = Math.random() * this.canvasHeight;
    this.items.push(new FoodItem(x, y));
  }

  update(chanceToSpawn = 0.05) {
    if (Math.random() < chanceToSpawn) {
      this.addRandom();
    }
  }

  draw(ctx) {
    this.items.forEach(item => item.draw(ctx));
  }

  getAll() {
    return this.items;
  }

  remove(index) {
    this.items.splice(index, 1);
  }
}
