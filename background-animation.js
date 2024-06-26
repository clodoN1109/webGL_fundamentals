canvas = document.getElementById('canvas');
context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const num = Math.min(parseInt(window.innerWidth / (1000 / 145)), 400);
const proton = new Proton();

const emitter = new Proton.Emitter();
emitter.rate = new Proton.Rate(
  new Proton.Span(num),
  new Proton.Span(0.05, 0.2)
);
emitter.addInitialize(new Proton.Mass(1));
emitter.addInitialize(new Proton.Radius(1, 4));
emitter.addInitialize(new Proton.Life(Infinity));

const pointZone = new Proton.Position(
  new Proton.RectZone(0, 0, canvas.width, canvas.height)
);
emitter.addInitialize(pointZone);
emitter.addInitialize(
  new Proton.Velocity(
    new Proton.Span(0.05, 0.1),
    new Proton.Span(0, 360),
    "polar"
  )
);

emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.2, 0.9)));
emitter.addBehaviour(new Proton.Color("#ff0000"));
emitter.addBehaviour(
  new Proton.CrossZone(
    new Proton.RectZone(0, 0, canvas.width, canvas.height),
    "cross"
  )
);

emitter.emit("once");
emitter.damping = 0;
proton.addEmitter(emitter);

const renderer = new Proton.CanvasRenderer(canvas);
proton.addRenderer(renderer);

setTimeout(() => {
  emitter.rate = new Proton.Rate(new Proton.Span(3), 0.5);
  emitter.removeInitialize(pointZone);
}, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    proton.update();
}

// Start the animation
animate();