class Layer {
  constructor(depth, numTracks, config) {
    this.depth = depth;       // 0 = front, higher = back
    this.tracks = [];
    this.alpha = map(depth, 0, 3, 255, 80);

    for (let i = 0; i < numTracks; i++) {
      let centerY = height / 2 + (i - numTracks / 2) * 60 + depth * 30;
      let amplitude = config.amplitude || 50;
      let frequency = config.frequency || 2;
      let noiseScale = config.noiseScale || 40;
      let numBlobs = config.numBlobs || 6;
      let speed = (config.speed || 0.003) * (1 - depth * 0.2);

      this.tracks.push(new Track(centerY, amplitude, frequency, noiseScale, numBlobs, speed));
    }
  }

  update() {
    for (let track of this.tracks) {
      track.update();
    }
  }

  draw() {
    for (let track of this.tracks) {
      track.draw(this.alpha);
    }
  }

  getAllBlobs() {
    let allBlobs = [];
    for (let track of this.tracks) {
      allBlobs = allBlobs.concat(track.getBlobs());
    }
    return allBlobs;
  }
}
