class Blob {
  constructor(track, offset, speed) {
    this.track = track;
    this.offset = offset; // position along the track (0-1)
    this.speed = speed;   // how fast it moves along the track
    this.radius = 30;
    this.x = 0;
    this.y = 0;
    this.gravity = 0.3;   // drag to the bottom
    this.yOffset = 0;     // accumulated gravity offset
    this.maxYOffset = 15; // never falls too far
  }

  update() {
    // Move along track
    this.offset += this.speed;
    if (this.offset > 1) this.offset -= 1;
    if (this.offset < 0) this.offset += 1;

    // Get position from track
    let pos = this.track.getPosition(this.offset);
    this.x = pos.x;

    // Apply gravity drag (pulls down but never falls)
    this.yOffset += this.gravity;
    this.yOffset = constrain(this.yOffset, -this.maxYOffset, this.maxYOffset);

    // Spring back toward track position
    this.yOffset *= 0.95;

    this.y = pos.y + this.yOffset;
  }

  draw() {
    noStroke();
    fill(255, 100, 50, 150);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}
