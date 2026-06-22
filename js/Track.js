class Track {
  constructor(centerY, amplitude, frequency, noiseScale, numBlobs, speed) {
    this.centerY = centerY;       // vertical center of the sinusoidal path
    this.amplitude = amplitude;   // wave amplitude
    this.frequency = frequency;   // wave frequency
    this.noiseScale = noiseScale; // perlin noise displacement scale
    this.numBlobs = numBlobs;     // number of blobs on this track
    this.speed = speed;           // base speed for blobs
    this.noiseOffset = random(1000); // unique noise seed per track
    this.blobs = [];

    this._createBlobs();
  }

  _createBlobs() {
    for (let i = 0; i < this.numBlobs; i++) {
      let offset = i / this.numBlobs; // evenly spaced along track
      let blobSpeed = this.speed * random(0.8, 1.2); // slight variation
      this.blobs.push(new Blob(this, offset, blobSpeed));
    }
  }

  getPosition(t) {
    // t is 0..1 along the track
    let x = t * width;

    // Sinusoidal base path
    let sinY = sin(t * TWO_PI * this.frequency) * this.amplitude;

    // Perlin noise displacement
    let noiseVal = noise(t * 3 + this.noiseOffset, frameCount * 0.005) * 2 - 1;
    let perlinY = noiseVal * this.noiseScale;

    let y = this.centerY + sinY + perlinY;

    return createVector(x, y);
  }

  update() {
    // Slowly evolve noise offset for organic movement
    this.noiseOffset += 0.001;

    for (let blob of this.blobs) {
      blob.update();
    }
  }

  draw(alpha) {
    // Draw the track path for debugging
    stroke(255, 255, 255, 40);
    noFill();
    beginShape();
    for (let t = 0; t <= 1; t += 0.01) {
      let pos = this.getPosition(t);
      vertex(pos.x, pos.y);
    }
    endShape();

    // Draw blobs
    for (let blob of this.blobs) {
      blob.draw(alpha);
    }
  }

  getBlobs() {
    return this.blobs;
  }
}
