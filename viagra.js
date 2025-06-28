function Viagra() {
  this.x = random(width);
  this.y = random(height);
  this.pos = createVector(this.x, this.y);

  this.r = 15; // Define a radius for collision detection!
  this.isViagra = true; // Essential for ship.hits to identify it

  // Initialize velocity
  this.vel = p5.Vector.random2D();
  this.vel.mult(random(1, 2));

  // Update viagra position
  this.update = function() {
    this.pos.add(this.vel);
  };

  // Render viagra
  this.render = function() {
    push(); 
    fill(130, 200, 200);
    stroke(130, 200, 100);
    strokeWeight(30);
    strokeJoin(ROUND);
    translate(this.pos.x, this.pos.y); // Use this.pos.x, this.pos.y
    quad(50, 73, 86, 50, 50, 28, 14, 50);
    stroke(255);
    strokeWeight(5);
    line(50, 65, 35, 40);
    line(50, 65, 65, 40);
    pop();
  };

  // Wrap viagra around the screen edges
  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  };
}
