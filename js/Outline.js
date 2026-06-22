class Outline {
  constructor() {
    this.smoothing = 0.3;
  }

  draw(blobs) {
    if (blobs.length < 3) return;

    // Sort blobs by x position to create a coherent outline
    let sorted = blobs.slice().sort((a, b) => a.x - b.x);

    // Separate into top and bottom hulls for a closed shape
    let hull = this._convexHull(sorted);

    if (hull.length < 3) return;

    // Draw the outline using curveVertex for smooth interpolation
    stroke(255, 200, 100, 200);
    strokeWeight(2);
    noFill();

    beginShape();
    // Use curveVertex for smooth curves - need to repeat first and last
    curveVertex(hull[hull.length - 1].x, hull[hull.length - 1].y);
    for (let point of hull) {
      curveVertex(point.x, point.y);
    }
    curveVertex(hull[0].x, hull[0].y);
    curveVertex(hull[1].x, hull[1].y);
    endShape(CLOSE);

    strokeWeight(1);
  }

  // Convex hull using gift wrapping (Jarvis march) algorithm
  _convexHull(points) {
    if (points.length < 3) return points;

    // Find leftmost point
    let start = points[0];
    for (let p of points) {
      if (p.x < start.x || (p.x === start.x && p.y < start.y)) {
        start = p;
      }
    }

    let hull = [];
    let current = start;
    let visited = new Set();

    do {
      hull.push({ x: current.x, y: current.y });
      visited.add(current);

      let next = points[0];
      for (let p of points) {
        if (p === current) continue;
        let cross = this._cross(current, next, p);
        if (next === current || cross > 0 || (cross === 0 && this._dist(current, p) > this._dist(current, next))) {
          next = p;
        }
      }
      current = next;
    } while (current !== start && hull.length < points.length);

    return hull;
  }

  _cross(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }

  _dist(a, b) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  }
}
