const DEFAULT_RADIUS = 6;

export default class FoodItem {
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
