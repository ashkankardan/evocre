const DEFAULT_RADIUS = 7;

class PoisonItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = DEFAULT_RADIUS;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default class PoisonManager {
  constructor(maxPoison) {
    this.items = [];
    this.maxPoison = maxPoison;
  }

  add(x, y) {
    if (this.items.length < this.maxPoison) {
      this.items.push(new PoisonItem(x, y));
      return true;
    }
    return false;
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

  count() {
    return this.items.length;
  }

  reset() {
    this.items = [];
  }
}
