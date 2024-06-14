import {VAO, shapeParameters} from "./custom-types.js";
import * as utils from "./utils.js";
import * as Config from "./config.js";
import * as Controls from "./controls.js";

//---------------------------------------------------------------------------------

Controls.createEventListeners();

// Defining shapes

export let triangleVertices = new Float32Array( [-0.5, -0.5, 0.5, -0.5, 0, 0.5] );
export let squareVertices = new Float32Array([-1/3, 1/3, -1/3, -1/3, 1/3, -1/3, -1/3, 1/3, 1/3, -1/3, 1/3, 1/3])
export let circleVertices = function buildCircleVertexBuffer() {

    const vertexData = [];

    const angle_increment = (Math.PI * 2 / Config.config.CIRCLE_SEGMENT_COUNT);

    for (let i = 0; i < Config.config.CIRCLE_SEGMENT_COUNT; i++) {
        
        const vertex1Angle = i * angle_increment;
        const vertex2Angle = (i + 1) * angle_increment;
        
        const x1 = Math.cos(vertex1Angle)/3;
        const y1 = Math.sin(vertex1Angle)/3;

        const x2 = Math.cos(vertex2Angle)/3;
        const y2 = Math.sin(vertex2Angle)/3;

        vertexData.push(
            0, 0, 
            0.70, 0.70, 0.70
        );

        vertexData.push(
            x1, y1, 
            0.95, 0.95, 0.95
        );

        vertexData.push(
            x2, y2, 
            0.95, 0.95, 0.95
        );
    }
    return new Float32Array(vertexData);

}()

//---------------------------------------------------------------------------------

// Defining Colors

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


export let animationID = NaN;
export let animationStatus = ['play'];

export function motionAndColor(width, height, scale, offsetX, offsetY) {
    
    const canvas = document.getElementById('demo-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        utils.showError("Sorry! This was just a terrible mistake!");
        return;
    }

    let webGL2 = canvas.getContext('webgl2');

    //---------------------------------------------------------------------------------

    // Defining a Moving Object

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
                                    
    // Creating a program

    const vertexShaderSourceCode = utils.stringfyGLSL('vertexShader');
    const fragmentShaderSourceCode = utils.stringfyGLSL('fragmentShader');
    const webGL2TriangleProgram = utils.createProgram(webGL2, vertexShaderSourceCode, fragmentShaderSourceCode);

    //---------------------------------------------------------------------------------

    // Getting references/links to program attributes 

    const vertexPositionAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexPosition');
    const shapeSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeSize');
    const shapeLocationUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeLocation');
    const canvasSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'canvasSize');
    const vertexColorAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexColor');

    //---------------------------------------------------------------------------------
   
    // Creating buffers

    // Vertex/position buffers
    const triangleGeometryBuffer = utils.createStaticVertexBuffer(webGL2, triangleVertices);
    const rgbColorBuffer = utils.createStaticVertexBuffer(webGL2, rgbTriangleColors);
    const fireyColorBuffer = utils.createStaticVertexBuffer(webGL2, fireyTriangleColors);
    // Color buffers
    const squareGeometryBuffer = utils.createStaticVertexBuffer(webGL2, squareVertices);
    const indigoGradientSquareColorsBuffer = utils.createStaticVertexBuffer(webGL2, indigoGradientSquareColors);
    const graySquareColorsBuffer = utils.createStaticVertexBuffer(webGL2, graySquareColors);

    // Vertex/position-color interleaved buffer
    const circleInterleaveBuffer = utils.createStaticVertexBuffer(webGL2, circleVertices);
    
    //---------------------------------------------------------------------------------

    // Creating VAOs (Vertex Attribute Objects)

    const fireyTriangleVertexAttributeObject = utils.createTwoBufferVertexAttribureObject(webGL2, triangleGeometryBuffer, fireyColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const rgbTriangleVertexAttributeObject = utils.createTwoBufferVertexAttribureObject(webGL2, triangleGeometryBuffer, rgbColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const indigoSquareVertexAttributeObject = utils.createTwoBufferVertexAttribureObject(webGL2, squareGeometryBuffer, indigoGradientSquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const graySquareVertexAttributeObject = utils.createTwoBufferVertexAttribureObject(webGL2, squareGeometryBuffer, graySquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const circleVertexAttributeObject = utils.createInterleaveBufferVertexAttribureObject(webGL2, circleInterleaveBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);

    const VAOList : VAO[] = [
        {vao: rgbTriangleVertexAttributeObject, numVertices: 3},
        {vao: fireyTriangleVertexAttributeObject, numVertices: 3},
        {vao: indigoSquareVertexAttributeObject, numVertices: 6},
        {vao: graySquareVertexAttributeObject, numVertices: 6},
        {vao: circleVertexAttributeObject, numVertices: Config.config.CIRCLE_SEGMENT_COUNT * 3},
    ];

    //---------------------------------------------------------------------------------

    let shapes: MovingShape[] = []
    let timetoNextSpawn = Config.config.SPAWN_TIME;
    let lastFrameTime = performance.now();
    
    let frame = function() {

        const thisFrameTime = performance.now();
        
        let dt = (thisFrameTime - lastFrameTime) / 1000;

        if (animationStatus[0] === 'paused') {
            dt = 0;
        }

        timetoNextSpawn -= dt;

        // The loop makes the spawn time more independent from the browser's framerate. A feature to be further analyzed.
        while (timetoNextSpawn < 0) {

            timetoNextSpawn += Config.config.SPAWN_TIME;

            let [position, velocity, size, timeRemaining, vao, numVertices, force] : shapeParameters = utils.generateNewShapeParameters(VAOList); 
            
            shapes.push(
                new MovingShape(position, velocity, size, timeRemaining, vao, numVertices, force)
            );

        }       
        // Imposing object count and lifespan limits
        shapes = shapes.filter((shape) => shape.isAlive()).slice(0, Config.config.MAX_SHAPE_COUNT);
         
        lastFrameTime = thisFrameTime;

        shapes.forEach(shape => {
            shape.update(dt);            
        });

        canvas.width = width;
        canvas.height = height;

        webGL2.clearColor(0.2, 0.2, 0.1, 0);
        webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
        webGL2.viewport(0,0, canvas.width, canvas.height);
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
    motionAndColor(window.innerWidth, window.innerHeight, Config.config.SCALE, Config.config.OFFSET_X, Config.config.OFFSET_Y);
}
catch(e) {
    utils.showError(`Uncaught exception: ${e}`);
} 