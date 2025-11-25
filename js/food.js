const DEFAULT_RADIUS = 6;

export default class FoodManager {
  constructor(count, bounds) {
    this.bounds = bounds;
    this.items = [];
    this.generate(count);
  }

  generate(count) {
    this.items = Array.from({ length: count }, () => this.randomItem());
  }

  randomItem() {
    return {
      x: Math.random() * this.bounds.width,
      y: Math.random() * this.bounds.height,
      r: DEFAULT_RADIUS,
    };
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
    for (const item of this.items) {
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  tryConsume(creature) {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      if (Math.hypot(item.x - creature.position.x, item.y - creature.position.y) < item.r + creature.radius) {
        creature.eatFood(10);
        this.items.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}
