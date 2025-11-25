const DEFAULT_RADIUS = 7;

export default class PoisonManager {
  constructor(bounds) {
    this.bounds = bounds;
    this.items = [];
  }

  addPoison(x, y) {
    this.items.push({ x, y, r: DEFAULT_RADIUS });
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    for (const item of this.items) {
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  checkCollision(creature) {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      if (Math.hypot(item.x - creature.position.x, item.y - creature.position.y) < item.r + creature.radius) {
        this.items.splice(i, 1);
        creature.touchPoison();
        return true;
      }
    }
    return false;
  }
}
