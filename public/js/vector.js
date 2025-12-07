export default class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
  
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
  
    mult(n) {
      this.x *= n;
      this.y *= n;
      return this;
    }
  
    div(n) {
      this.x /= n;
      this.y /= n;
      return this;
    }
  
    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    setMag(n) {
      return this.normalize().mult(n);
    }
  
    normalize() {
      const m = this.mag();
      if (m !== 0) {
        this.div(m);
      }
      return this;
    }
  
    limit(max) {
      if (this.mag() > max) {
        this.normalize().mult(max);
      }
      return this;
    }
  
    heading() {
      return Math.atan2(this.y, this.x);
    }
  
    static sub(v1, v2) {
      return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
  }