const DEFAULT_RADIUS = 7;

export default class PoisonItem {
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
