function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.currentScale = 1.0;
  this.r = 20 * this.currentScale;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.fireRate = 8;
  this.laserStrength = 2;
  this.speedMultiplier = 1;
  this.shield = 0;
  this.multiShot = 1;

  // Set the rotation speed
  this.setRotation = function(a) {
    this.rotation = a;
  };

  // Update the ship's heading based on rotation
  this.turn = function() {
    this.heading += this.rotation;
  };

  // Enable or disable boosting
  this.boosting = function(b) {
    this.isBoosting = b;
  };

  // Update the ship's position and velocity
  this.update = function() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.97); // Apply friction to slow down the ship
  };

  // Apply a force in the direction of the ship's heading
  this.boost = function() {
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1 * this.speedMultiplier); // Apply speedMultiplier here
    this.vel.add(force);
  };

  // Combined hits function for both asteroids and Viagra
  this.hits = function(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      if (this.shield > 0) {
        this.shield--;
        Shld.html("Shield: " + this.shield);
        return 'shielded'; // Indicate a hit that was absorbed by the shield
      } else {
        return 'asteroid'; // Indicate a damaging hit from an asteroid
      }
    }
  }
  this.eats = function(viagra) {
    if (viagras.length > 1) {
      let v = dist(this.pos.x, this.pos.y, viagra.pos.x, viagra.pos.y);
      if (v < this.r + viagra.r) {
        this.currentScale ++;
        return 'viagra';
      }
    }
    return false; // No collision 
  }

      // Check if the other object is a Viagra (e.g., by checking for a unique property or type)
      // Since Viagra doesn't have 'H', we can assume it's Viagra here, or add a 'type' property
      // else if (other.hasOwnProperty('isViagra')) { // Add a property to Viagra to identify it
      //   SIZE += 20; // Apply the Viagra effect
      //   return 'viagra'; // Indicate Viagra was picked up
      // }
  

  // Render the ship
  this.render = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);

    fill(shipColor.value(), 200, 200);
    stroke(shipColor.value()-20, 200, 200); // Add stroke for outline
    strokeWeight(1); // Set a base stroke weight

    scale(this.currentScale); // Apply the overall scaling

    // Define base dimensions relative to the unscaled canvas
    let bodyWidth = 20;
    let bodyHeight = 60;
    let headDiameter = 20; // Assuming this was the original 'this.r' value for the head's size
    let testicleDiameter = 20; // Assuming this was the original 'this.r' value for testicle size
    let testicleXOffset = 10;
    let testicleYOffset = 40; // The original 'this.r*2' (20*2=40)

    // Body (rectangle centered at 0,0, but vertically offset to align with penis shape)
    rectMode(CENTER); // Use CENTER mode for easier positioning
    ellipse(0, -headDiameter / 2, headDiameter, headDiameter); // Centered on x, at the top
    rect(0, bodyHeight / 2 - headDiameter / 2, bodyWidth, bodyHeight); // Center body, adjust y

    // Head (ellipse at the top)
    
    // Testicles (ellipses at the bottom)
    ellipse(-testicleXOffset, bodyHeight + testicleDiameter / 2, testicleDiameter, testicleDiameter);
    ellipse(testicleXOffset, bodyHeight + testicleDiameter / 2, testicleDiameter, testicleDiameter);

    rectMode(CORNER); // Reset rectMode if needed elsewhere

    pop();
  };

  // Wrap the ship around the screen edges
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
