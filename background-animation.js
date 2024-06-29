function drawrandomParticles(canvas, hexColor, maxRadius, numberOfParticles) {
    
  context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  
  const proton = new Proton();
  
  const emitter = new Proton.Emitter();
  emitter.rate = new Proton.Rate(
    new Proton.Span(numberOfParticles),
    new Proton.Span(0.05, 0.2)
  );
  emitter.addInitialize(new Proton.Mass(1));
  emitter.addInitialize(new Proton.Radius(1, maxRadius));
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
  
  emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.05, 0.7)));
  emitter.addBehaviour(new Proton.Color(hexColor));
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

}

let canvas_01 = document.getElementById('canvas_01');
let canvas_02 = document.getElementById('canvas_02');

let numberOfParticles = Math.min(parseInt(window.innerWidth / (1000 / 145)), 400);
drawrandomParticles(canvas_01, "#ffffff", 2, numberOfParticles);

numberOfParticles = 50;
drawrandomParticles(canvas_02, "#603311", 120, numberOfParticles);
