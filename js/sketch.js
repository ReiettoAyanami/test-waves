let layers = [];
let outline;

function setup() {
  createCanvas(windowWidth, windowHeight);

  outline = new Outline();

  // Create layers with different depths
  let config = {
    amplitude: 60,
    frequency: 2,
    noiseScale: 50,
    numBlobs: 8,
    speed: 0.003
  };

  // 3 layers, each with 2 tracks
  for (let i = 0; i < 3; i++) {
    layers.push(new Layer(i, 2, config));
  }
}

function draw() {
  background(20, 20, 40);

  // Update all layers
  for (let layer of layers) {
    layer.update();
  }

  // Draw layers back to front
  for (let i = layers.length - 1; i >= 0; i--) {
    layers[i].draw();
  }

  // Draw outline around all blobs
  let allBlobs = [];
  for (let layer of layers) {
    allBlobs = allBlobs.concat(layer.getAllBlobs());
  }
  outline.draw(allBlobs);

  // Debug info
  fill(255);
  noStroke();
  textSize(12);
  text(`FPS: ${floor(frameRate())}`, 10, 20);
  text(`Blobs: ${allBlobs.length}`, 10, 35);
  text(`Layers: ${layers.length}`, 10, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
