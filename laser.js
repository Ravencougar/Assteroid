function Laser(spos, angle, strength) {
  this.pos = createVector(spos.x, spos.y); // Ship's initial position
  this.vel = p5.Vector.fromAngle(angle); // Velocity from ship's heading
  this.vel.mult(10); // Set laser speed
  this.strength = strength; // Laser strength (strokeWeight)

  // Update laser position
  this.update = function () {
    this.pos.add(this.vel);
  };
  this.r = random(2, this.strength);
  this.total = floor(random(10, 30)); // Number of vertices
  this.offset = [];
  for (let i = 0; i < this.total; i++) {
    this.offset[i] = random(-5,10); // Random offsets for irregular shape
  }

  // Render the laser
  this.render = function () {
    push();
    stroke(255);
    strokeWeight(2 * this.strength);
    noFill();
    // Triangle laser
    //push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount/20);
    //pop();
    strokeJoin(ROUND);
    beginShape();
    for (let i = 0; i < this.total; i++) {
      let angle = map(i, 0, this.total, 0, TWO_PI);
      let r = this.r + this.offset[i];
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
   
    pop();
  };

  // Check if the laser hits an asteroid
  this.hits = function (asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d - this.strength < asteroid.r; // Return true if the laser is within the asteroid's radius
  };

  // Check if the laser is offscreen
  this.offscreen = function () {
    return (
      this.pos.x > width ||
      this.pos.x < 0 ||
      this.pos.y > height ||
      this.pos.y < 0
    );
  };
}
