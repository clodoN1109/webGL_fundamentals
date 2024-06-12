// Configurations
let SPAWN_RATE = 1;
let MIN_SHAPE_TIME = 2;
let MAX_SHAPE_TIME = 6;
let MIN_SHAPE_SIZE = 0.1;
let MAX_SHAPE_SIZE = 2;
let MIN_SHAPE_FORCE = 150;
let MAX_SHAPE_FORCE = 750;
let MIN_SHAPE_SPEED = 125;
let MAX_SHAPE_SPEED = 350;
let MAX_SHAPE_COUNT = 250;
let CIRCLE_SEGMENT_COUNT = 100;

//---------------------------------------------------------------------------------
// Control Box Variables
let scale : number = 500;
let offsetX : number = window.innerWidth/2;
let offsetY : number = window.innerHeight/2;
let width_in_pixels : number = window.innerWidth; 
let height_in_pixels : number = window.innerHeight; 

//---------------------------------------------------------------------------------

let animationID = NaN;
let triangleVertices = new Float32Array( [-0.5, -0.5, 0.5, -0.5, 0, 0.5] );
let squareVertices = new Float32Array([-1/3, 1/3, -1/3, -1/3, 1/3, -1/3, -1/3, 1/3, 1/3, -1/3, 1/3, 1/3])
let circleVertices = function buildCircleVertexBuffer() {

    const vertexData = [];

    const angle_increment = (Math.PI * 2 / CIRCLE_SEGMENT_COUNT);

    for (let i = 0; i < CIRCLE_SEGMENT_COUNT; i++) {
        
        const vertex1Angle = i * angle_increment;
        const vertex2Angle = (i + 1) * angle_increment;
        
        const x1 = Math.cos(vertex1Angle)/3;
        const y1 = Math.sin(vertex1Angle)/3;

        const x2 = Math.cos(vertex2Angle)/3;
        const y2 = Math.sin(vertex2Angle)/3;

        vertexData.push(
            0, 0, 
            0.200, 0.200, 0.957
        );

        vertexData.push(
            x1, y1, 
            0.200, 0.200, 0.957
        );

        vertexData.push(
            x2, y2, 
            0.200, 0.200, 0.957
        );
    }
    return new Float32Array(vertexData);

}()

let rgbTriangleColors = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
]);

let fireyTriangleColors = new Uint8Array([
    229, 47, 15,
    246, 206, 29,
    233, 154, 26
]);

const indigoGradientSquareColors = new Uint8Array([
    // Top: "Tropical Indigo" - A799FF
    167, 153, 255,
    // Bottom: "Eminence" - 583E7A
    88, 62, 122,
    88, 62, 122,
    167, 153, 255,
    88, 62, 122,
    167, 153, 255
]);

const graySquareColors = new Uint8Array([
    80, 80, 80,
    120, 120, 120,
    120, 120, 120,
    80, 80, 80,
    120, 120, 120,
    80, 80, 80,
]);

//---------------------------------------------------------------------------------

class MovingShape {
    constructor (
        public position: [number, number],
        public velocity: [number,number],
        public size: number,
        public timeRemaining: number,
        public vao: WebGLVertexArrayObject,
        public numVertices: number,
        public force: [number, number],
        
    ) {}

    isAlive() {
        return this.timeRemaining > 0;
    }

    update(dt: number) {

        this.velocity[0] += this.force[0] * dt;
        this.velocity[1] += this.force[1] * dt;

        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;

        this.timeRemaining -= dt;

    }

    reset() {
        this.position[0] = offsetX;
        this.position[1] = offsetY;
    }

    
}

//---------------------------------------------------------------------------------

const vertexShaderSourceCode = 
`#version 300 es
precision mediump float;

in vec2 vertexPosition;
in vec3 vertexColor;

out vec3 fragmentColor;

uniform vec2 canvasSize;
uniform vec2 shapeLocation;
uniform float shapeSize;

void main() {

    fragmentColor = vertexColor;
    vec2 finalVertexPosition = vertexPosition * shapeSize + shapeLocation;
    vec2 clipPosition = (finalVertexPosition / canvasSize) * 2.0 - 1.0;
    gl_Position = vec4(clipPosition, 0.0, 1.0);

}`;

const fragmentShaderSourceCode = 
`#version 300 es
precision mediump float;

in vec3 fragmentColor;
out vec4 outputColor;

void main() {        

    outputColor = vec4(fragmentColor, 1.0);

}`;

//---------------------------------------------------------------------------------

function updateTriangle(new_value, vertex_number, coordinate_number) {

    triangleVertices[vertex_number * 2 + coordinate_number] = new_value;

    try {
        cancelAnimationFrame(animationID);
        motionAndColor(width_in_pixels, height_in_pixels, scale, offsetX, offsetY);
    }
    catch(e) {
        showError(`Uncaught exception: ${e}`);
    }
}

function updateCanvasSize(width?:number, height?:number) {
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;

    if (width === undefined) {width = 100 * canvas.width/window.innerWidth;}
    if (height === undefined) {height = 100 * canvas.height/window.innerHeight;}

    width_in_pixels = window.innerWidth * width/100; 
    height_in_pixels = window.innerHeight * height/100; 

    try {
        cancelAnimationFrame(animationID);
        motionAndColor(width_in_pixels, height_in_pixels, scale, offsetX, offsetY);
    }
    catch(e) {
        showError(`Uncaught exception: ${e}`);
    }
}

function updateOffsetX(new_offsetX:number) {

    offsetX = new_offsetX/100 * window.innerWidth;

    try {
        cancelAnimationFrame(animationID);
        motionAndColor(width_in_pixels, height_in_pixels, scale, offsetX, offsetY);
    }
    catch(e) {
        showError(`Uncaught exception: ${e}`);
    }
}

function updateOffsetY(new_offsetY:number) {

    offsetY = new_offsetY/100 * window.innerHeight;

    try {
        cancelAnimationFrame(animationID);
        motionAndColor(width_in_pixels, height_in_pixels, scale, offsetX, offsetY);
    }
    catch(e) {
        showError(`Uncaught exception: ${e}`);
    }
}

function updateScale(new_scale:number) {

    scale = new_scale;

    try {
        cancelAnimationFrame(animationID);
        motionAndColor(width_in_pixels, height_in_pixels, scale, offsetX, offsetY);
    }
    catch(e) {
        showError(`Uncaught exception: ${e}`);
    }
}

//---------------------------------------------------------------------------------

function showError(errorText: string) {
    console.log(errorText);
    // $("#error-box").empty();

    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null){
        return;
    }

    const errorElement = document.getElementById('error-description');
    errorElement.innerHTML = errorText;
}


function getRandomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}


function motionAndColor(width, height, scale, offsetX, offsetY) {
    
    const canvas = document.getElementById('demo-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        showError("You've just made a terrible mistake!");
        return;
    }
            
    //console.log(canvas);

    let webGL2 = canvas.getContext('webgl2');

    // console.log(webGL2);
 
    //---------------------------------------------------------------------------------

    function createStaticVertexBuffer(webGL2: WebGL2RenderingContext, data: ArrayBuffer) {
        const buffer = webGL2.createBuffer();
        webGL2.bindBuffer(webGL2.ARRAY_BUFFER, buffer);
        webGL2.bufferData(webGL2.ARRAY_BUFFER, data, webGL2.STATIC_DRAW);
        webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

        return buffer;
    }

    const triangleGeometryBuffer = createStaticVertexBuffer(webGL2, triangleVertices);
    const rgbColorBuffer = createStaticVertexBuffer(webGL2, rgbTriangleColors);
    const fireyColorBuffer = createStaticVertexBuffer(webGL2, fireyTriangleColors);

    const squareGeometryBuffer = createStaticVertexBuffer(webGL2, squareVertices);
    const indigoGradientSquareColorsBuffer = createStaticVertexBuffer(webGL2, indigoGradientSquareColors);
    const graySquareColorsBuffer = createStaticVertexBuffer(webGL2, graySquareColors);

    const circleInterleaveBuffer = createStaticVertexBuffer(webGL2, circleVertices);

    //---------------------------------------------------------------------------------
                                    
    // console.log(vertexShaderSourceCode);

    const vertexShader = webGL2.createShader(webGL2.VERTEX_SHADER);
    webGL2.shaderSource(vertexShader, vertexShaderSourceCode);
    webGL2.compileShader(vertexShader);

    //---------------------------------------------------------------------------------

  

    const fragmentShader = webGL2.createShader(webGL2.FRAGMENT_SHADER);
    webGL2.shaderSource(fragmentShader, fragmentShaderSourceCode);
    webGL2.compileShader(fragmentShader);

    //---------------------------------------------------------------------------------

    const webGL2TriangleProgram = webGL2.createProgram();
    webGL2.attachShader(webGL2TriangleProgram, vertexShader);
    webGL2.attachShader(webGL2TriangleProgram, fragmentShader);
    webGL2.linkProgram(webGL2TriangleProgram);

    //---------------------------------------------------------------------------------

    const vertexPositionAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexPosition');
    const shapeSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeSize');
    const shapeLocationUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeLocation');
    const canvasSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'canvasSize');
    const vertexColorAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexColor');

    //---------------------------------------------------------------------------------


    function createTwoBufferVertexAttribureObject(webGL2: WebGL2RenderingContext, positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, positionAttributeLocation: number, colorAttributeLocation: number) {
            
        const vertexAttributeObject = webGL2.createVertexArray();

        webGL2.bindVertexArray(vertexAttributeObject);

        webGL2.enableVertexAttribArray(positionAttributeLocation);
        webGL2.enableVertexAttribArray(colorAttributeLocation);
        
        webGL2.bindBuffer(webGL2.ARRAY_BUFFER, positionBuffer);
        webGL2.vertexAttribPointer(positionAttributeLocation, 2, webGL2.FLOAT, false, 0, 0);

        webGL2.bindBuffer(webGL2.ARRAY_BUFFER, colorBuffer);
        webGL2.vertexAttribPointer(colorAttributeLocation, 3, webGL2.UNSIGNED_BYTE, true, 0, 0);

        webGL2.bindVertexArray(null);

        return vertexAttributeObject;
    
    }

    function createInterleaveBufferVertexAttribureObject(webGL2: WebGL2RenderingContext, interleaveBuffer : WebGLBuffer, positionAttributeLocation: number, colorAttributeLocation: number) {
            
        const vertexAttributeObject = webGL2.createVertexArray();

        webGL2.bindVertexArray(vertexAttributeObject);

        webGL2.enableVertexAttribArray(positionAttributeLocation);
        webGL2.enableVertexAttribArray(colorAttributeLocation);
        
        webGL2.bindBuffer(webGL2.ARRAY_BUFFER, interleaveBuffer);

        webGL2.vertexAttribPointer(positionAttributeLocation, 2, webGL2.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        webGL2.vertexAttribPointer(colorAttributeLocation, 3, webGL2.UNSIGNED_BYTE, true, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);


        webGL2.bindVertexArray(null);

        return vertexAttributeObject;
    
    }

    
    //---------------------------------------------------------------------------------
   
    const fireyTriangleVertexAttributeObject = createTwoBufferVertexAttribureObject(webGL2, triangleGeometryBuffer, fireyColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const rgbTriangleVertexAttributeObject = createTwoBufferVertexAttribureObject(webGL2, triangleGeometryBuffer, rgbColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const indigoSquareVertexAttributeObject = createTwoBufferVertexAttribureObject(webGL2, squareGeometryBuffer, indigoGradientSquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const graySquareVertexAttributeObject = createTwoBufferVertexAttribureObject(webGL2, squareGeometryBuffer, graySquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);

    const circleVertexAttributeObject = createInterleaveBufferVertexAttribureObject(webGL2, circleInterleaveBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation)

    let shapes: MovingShape[] = []
    let timetoNextSpawn = SPAWN_RATE;

    //---------------------------------------------------------------------------------

    const geometryList = [
        {vao: rgbTriangleVertexAttributeObject, numVertices: 3},
        {vao: fireyTriangleVertexAttributeObject, numVertices: 3},
        {vao: indigoSquareVertexAttributeObject, numVertices: 6},
        {vao: graySquareVertexAttributeObject, numVertices: 6},
        {vao: circleVertexAttributeObject, numVertices: CIRCLE_SEGMENT_COUNT * 3},
    ];

    //---------------------------------------------------------------------------------

    let initialFrame = performance.now();
    let lastFrameTime = initialFrame;
    let frame = function() {
        const thisFrameTime = performance.now();
        const dt = (thisFrameTime - lastFrameTime) / 1000;

        // if (lastFrameTime - initialFrame > 8*1000) {
        //     shapes.forEach(shape => {
        //         shape.reset();
        //     });

        //     initialFrame = lastFrameTime;

        // }

        timetoNextSpawn -= dt;


        while (timetoNextSpawn < 0) {

            timetoNextSpawn += SPAWN_RATE;

            const movementAngle = getRandomInRange(0, 2 * Math.PI);
            const movementSpeed = getRandomInRange(MIN_SHAPE_SPEED, MAX_SHAPE_SPEED);

            const forceAngle = getRandomInRange(0, 2 * Math.PI);
            const forceSpeed = getRandomInRange(MIN_SHAPE_FORCE, MAX_SHAPE_FORCE);
            
            const position: [number, number] = [offsetX, offsetY];
            const velocity: [number, number] = [
                Math.sin(movementAngle) * movementSpeed,
                Math.cos(movementAngle) * movementSpeed
            ];
            const force: [number, number] = [
                Math.sin(forceAngle) * forceSpeed,
                Math.cos(forceAngle) * forceSpeed
            ];
            const size = scale * getRandomInRange(MIN_SHAPE_SIZE, MAX_SHAPE_SIZE);
            const timeRemaining = getRandomInRange(MIN_SHAPE_TIME, MAX_SHAPE_TIME);
            const attributeObjectIndex = Math.floor(getRandomInRange(0, geometryList.length));
            const geometry = geometryList[attributeObjectIndex];

            shapes.push(
                new MovingShape(position, velocity, size, timeRemaining, geometry.vao, geometry.numVertices, force)
            );

        }       

        shapes = shapes.filter((shape) => shape.isAlive()).slice(0, MAX_SHAPE_COUNT);
         
        lastFrameTime = thisFrameTime;

        shapes.forEach(shape => {
            shape.update(dt);            
        });

        canvas.width = width;
        canvas.height = height;

        webGL2.clearColor(0.2, 0.2, 0.1, 1);
        webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
        webGL2.viewport(0,0, canvas.width, canvas.height);

        //---------------------------------------------------------------------------------

        webGL2.useProgram(webGL2TriangleProgram);

        //---------------------------------------------------------------------------------
        
        shapes.forEach(shape => {
            webGL2.bindVertexArray(shape.vao);
            webGL2.uniform2f(canvasSizeUniform, canvas.width, canvas.height);
            webGL2.uniform1f(shapeSizeUniform, shape.size);
            webGL2.uniform2f(shapeLocationUniform, shape.position[0], shape.position[1]);
            webGL2.drawArrays(webGL2.TRIANGLES, 0, shape.numVertices);
                
        });

        //---------------------------------------------------------------------------------
        
     
        animationID = requestAnimationFrame(frame);

    }

    requestAnimationFrame(frame);
    
}

try {
    motionAndColor(window.innerWidth, window.innerHeight, scale, offsetX, offsetY);
}
catch(e) {
    showError(`Uncaught exception: ${e}`);
}