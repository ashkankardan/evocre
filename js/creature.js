import Vector from './vector.js';

export default class Creature {
  constructor(x, y, dna) {
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, -2);
    this.position = new Vector(x, y);
    this.r = 4;
    this.maxspeed = 2;
    this.maxforce = 0.5;

    this.health = 1;

    this.dna = dna || [];
    if (this.dna.length === 0) {
      this.dna[0] = Math.random() * 4 - 2;
      this.dna[1] = Math.random() * 4 - 2;
      this.dna[2] = Math.random() * 90 + 10;
      this.dna[3] = Math.random() * 90 + 10;
    }
  }

  behavior(food, poison) {
    let foodSteer = this.consume(food, true, this.dna[2]);
    let poisonSteer = this.consume(poison, false, this.dna[3]);

    foodSteer.mult(this.dna[0]);
    poisonSteer.mult(this.dna[1]);

    this.applyForce(foodSteer);
    this.applyForce(poisonSteer);
  }

  // Method to update location
  update() {

    this.health -= 0.01;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  consume(list, reward, perception) {
    let closestDistance = Infinity;
    let closestIndex = -1;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      const distance = Math.hypot(item.x - this.position.x, item.y - this.position.y);
      if (distance < closestDistance && distance < perception) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    if (closestDistance < 5) {
      list.splice(closestIndex, 1);
      if (reward) {
        this.health += 1;
      } else {
        this.health = 0.0;
      }
    } else if (closestIndex !== -1) {
      return this.seek(list[closestIndex]);
    }

    return new Vector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  eliminate() {
    return this.health <= 0.0;
  }

  boundaries(canvas) {

    const d = 5;

    let desired = null;

    if (this.position.x < d) {
      desired = new Vector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > canvas.width - d) {
      desired = new Vector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = new Vector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > canvas.height - d) {
      desired = new Vector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  display(ctx) {
    // Draw a triangle rotated in the direction of velocity
    let angle = this.velocity.heading() + Math.PI / 2;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);

    // Debug lines for DNA weights
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.dna[0] * 20);
    ctx.moveTo(this.dna[2], 0);
    ctx.arc(0, 0, this.dna[2], 0, Math.PI * 2);
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.dna[1] * 20);
    ctx.moveTo(this.dna[3], 0);
    ctx.arc(0, 0, this.dna[3], 0, Math.PI * 2);
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.stroke();

    // Health color interpolation (Green at 1.0, Red at 0.0)
    const h = Math.max(0, Math.min(1, this.health));
    const r = Math.floor(255 * (1 - h));
    const g = Math.floor(255 * h);
    const currentHealthColor = `rgb(${r},${g},0)`;

    ctx.beginPath();
    ctx.moveTo(0, -this.r * 2);
    ctx.lineTo(-this.r, this.r * 2);
    ctx.lineTo(this.r, this.r * 2);
    ctx.closePath();

    ctx.fillStyle = currentHealthColor;
    ctx.strokeStyle = currentHealthColor;
    ctx.lineWidth = 1;

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}