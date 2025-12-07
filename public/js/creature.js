import Vector from './vector.js';
import DNA from './dna.js';

export default class Creature {
  constructor(x, y, dna) {
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, -2);
    this.position = new Vector(x, y);
    this.r = 4;
    this.maxspeed = 2;
    this.maxforce = 0.5;
    this.dna = dna || new DNA();
    this.health = 1;
    
    this.age = 0;
    this.foodEaten = 0;
  }

  behavior(food, poison) {
    let foodSteer = this.consume(food, true, this.dna.getPerceptionRadius(2));
    let poisonSteer = this.consume(poison, false, this.dna.getPerceptionRadius(3));

    foodSteer.mult(this.dna.getWeight(0));
    poisonSteer.mult(this.dna.getWeight(1));

    this.applyForce(foodSteer);
    this.applyForce(poisonSteer);
  }

  update() {
    this.health -= 0.005;
    this.age++;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  consume(list, reward, perception) {
    let closestDistance = Infinity;
    let closestIndex = -1;
    
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (!item) continue;
      
      const distance = Math.hypot(item.x - this.position.x, item.y - this.position.y);
      
      if (distance < closestDistance && distance < perception) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    const eatRadius = this.r * 2;

    if (closestDistance < eatRadius) {
      list.splice(closestIndex, 1);
      if (reward) {
        this.health += 1;
        this.foodEaten++;
      } else {
        this.health = 0.0;
      }
    } else if (closestIndex !== -1) {
      return this.seek(list[closestIndex]);
    }

    return new Vector(0, 0);
  }

  seek(target) {
    let desired = Vector.sub(target, this.position); 
    desired.setMag(this.maxspeed);
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); 
    return steer;
  }

  eliminate() {
    return this.health <= 0.0;
  }

  boundaries(canvasWidth, canvasHeight) {
    const d = 5;
    let desired = null;

    if (this.position.x < d) {
      desired = new Vector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > canvasWidth - d) {
      desired = new Vector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = new Vector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > canvasHeight - d) {
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

  display(ctx, debug = false) {
    let angle = this.velocity.heading() + Math.PI / 2;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);

    if (debug) {
      ctx.beginPath();
      ctx.arc(0, 0, this.dna.getPerceptionRadius(2), 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.dna.getWeight(0) * 20);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(0, 255, 0)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, this.dna.getPerceptionRadius(3), 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.dna.getWeight(1) * 20);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(255, 0, 0)';
      ctx.stroke();
    }

    const h = Math.max(0, Math.min(1, this.health));
    const r = Math.floor(255 * (1 - h));
    const g = Math.floor(255 * h);
    const currentHealthColor = `rgb(${r},${g},0)`;

    const bodyRadius = this.r * 2;
    const noseLength = this.r * 2.5;
    const noseBaseHalf = this.r * 0.9;

    ctx.beginPath();
    ctx.arc(0, 0, bodyRadius, 0, Math.PI * 2);
    ctx.fillStyle = currentHealthColor;
    ctx.strokeStyle = currentHealthColor;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-this.r * 0.5, -this.r * 0.2, this.r * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -(bodyRadius + noseLength));
    ctx.lineTo(-noseBaseHalf, -bodyRadius * 0.4);
    ctx.lineTo(noseBaseHalf, -bodyRadius * 0.4);
    ctx.closePath();
    ctx.fillStyle = currentHealthColor;
    ctx.strokeStyle = currentHealthColor;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
