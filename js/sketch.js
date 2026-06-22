let layers = [];
let outline;

// Slider references and previous-frame cache for change detection
let sliders = {};
let prevValues = {};

function setup() {
  createCanvas(windowWidth, windowHeight);

  outline = new Outline();

  // --- Build slider panel ---
  let panel = select('#controls');

  sliders.amplitude   = _addSlider(panel, 'Amplitude',    10, 200, 60,  1);
  sliders.frequency   = _addSlider(panel, 'Frequency',   0.5,   8,  2, 0.1);
  sliders.noiseScale  = _addSlider(panel, 'Noise Scale',   0, 150, 50,  1);
  sliders.speed       = _addSlider(panel, 'Speed',     0.001, 0.02, 0.003, 0.001);
  sliders.gravity     = _addSlider(panel, 'Gravity',      0,   2, 0.3, 0.05);
  sliders.trackSpread = _addSlider(panel, 'Track Spread', 10, 200, 60,  1);

  // Create layers with default config
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

  // Force an initial sync so tracks pick up slider defaults
  prevValues = {};
}

/** Helper: append a labelled range slider to a parent element */
function _addSlider(parent, label, min, max, val, step) {
  let lbl = createElement('label', label);
  lbl.parent(parent);
  let valSpan = createSpan(val);
  valSpan.addClass('val');
  valSpan.parent(lbl);

  let slider = createSlider(min, max, val, step);
  slider.parent(parent);
  slider.style('width', '100%');
  // Update readout only when the slider moves
  slider.input(() => valSpan.html(slider.value()));
  slider._valSpan = valSpan;
  return slider;
}

function draw() {
  background(20, 20, 40);

  // Read current slider values
  let cur = {};
  for (let key in sliders) {
    cur[key] = sliders[key].value();
  }

  // Only push values into tracks/blobs when something changed
  let changed = false;
  for (let key in cur) {
    if (prevValues[key] !== cur[key]) { changed = true; break; }
  }

  if (changed) {
    let halfH = height / 2;
    for (let layer of layers) {
      let depth = layer.depth;
      let depthSpeedFactor = 1 - depth * 0.2;
      let halfTracks = layer.tracks.length / 2;
      for (let ti = 0; ti < layer.tracks.length; ti++) {
        let track = layer.tracks[ti];
        track.amplitude  = cur.amplitude;
        track.frequency  = cur.frequency;
        track.noiseScale = cur.noiseScale;
        track.speed      = cur.speed * depthSpeedFactor;
        track.centerY    = halfH + (ti - halfTracks) * cur.trackSpread + depth * 30;

        for (let blob of track.blobs) {
          blob.gravity = cur.gravity;
          // Preserve each blob's unique speed ratio (set once at construction)
          blob.speed   = track.speed * blob.speedRatio;
        }
      }
    }
    prevValues = cur;
  }

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
