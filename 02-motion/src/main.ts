import {VAO, shapeParameters} from "./custom-types.js";
import * as utils from "./utils.js";
import {config} from "./config.js";
import * as Shapes from "./shapes.js";
import * as Colors from "./colors.js";
import * as Controls from "./controls.js";
import * as Objects from "./objects.js";

//---------------------------------------------------------------------------------
// Initializing variables and caches

Controls.initialize();
export let interval_ID_UpdateParametersDisplay_List : number[] = [];
export let interval_ID_UpdateBoundingBox_List : number[] = [];
export let animationID = NaN;
export let animationStatus = ['play'];

//---------------------------------------------------------------------------------

export function motionDemonstration(canvas : HTMLCanvasElement) {

    let webGL2 = canvas.getContext('webgl2');
    //---------------------------------------------------------------------------------
                                    
    // Loading GLSL source code and creating a webGL program

    const vertexShaderSourceCode = utils.stringfyGLSL('src/vertexShader');
    const fragmentShaderSourceCode = utils.stringfyGLSL('src/fragmentShader');
    const webGL2TriangleProgram = utils.createProgram(webGL2, vertexShaderSourceCode, fragmentShaderSourceCode);

    //---------------------------------------------------------------------------------

    // Getting references to program attributes/variables 

    const vertexPositionAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexPosition');
    const shapeSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeSize');
    const shapeLocationUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeLocation');
    const canvasSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'canvasSize');
    const vertexColorAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexColor');

    //---------------------------------------------------------------------------------
   
    // Creating buffers

    // Vertex/position buffers
    const triangleGeometryBuffer = utils.createStaticVertexBuffer(webGL2, Shapes.triangleVertices);
    const rgbColorBuffer = utils.createStaticVertexBuffer(webGL2, Colors.rgbTriangleColors);
    const fireyColorBuffer = utils.createStaticVertexBuffer(webGL2, Colors.fireyTriangleColors);
    // Color buffers
    const squareGeometryBuffer = utils.createStaticVertexBuffer(webGL2, Shapes.squareVertices);
    const indigoGradientSquareColorsBuffer = utils.createStaticVertexBuffer(webGL2, Colors.indigoGradientSquareColors);
    const graySquareColorsBuffer = utils.createStaticVertexBuffer(webGL2, Colors.graySquareColors);

    // Vertex/position-color interleaved buffer
    const circleInterleaveBuffer = utils.createStaticVertexBuffer(webGL2, Shapes.circleVertices);
    
    //---------------------------------------------------------------------------------

    // Creating VAOs (Vertex Attribute Objects)

    const fireyTriangleVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, triangleGeometryBuffer, fireyColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const rgbTriangleVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, triangleGeometryBuffer, rgbColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const indigoSquareVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, squareGeometryBuffer, indigoGradientSquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const graySquareVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, squareGeometryBuffer, graySquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const circleVertexAttributeObject = utils.createInterleaveBufferVertexAttributeObject(webGL2, circleInterleaveBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);

    const VAOList : VAO[] = [
        {vao: rgbTriangleVertexAttributeObject, numVertices: 3, type: 'RGB Triangle'},
        {vao: fireyTriangleVertexAttributeObject, numVertices: 3, type: 'Firey Triangle'},
        {vao: indigoSquareVertexAttributeObject, numVertices: 6, type: 'Indigo Square'},
        {vao: graySquareVertexAttributeObject, numVertices: 6, type: 'Gray Square'},
        {vao: circleVertexAttributeObject, numVertices: config.CIRCLE_SEGMENT_COUNT * 3, type: 'Spectral Circle'},
    ];

    let x = rgbTriangleVertexAttributeObject;

    //---------------------------------------------------------------------------------

    let shapes: Objects.MovingShape[] = []
    let timetoNextSpawn = config.SPAWN_TIME;
    let lastFrameTime = performance.now();
    
    let frame = function() {

        const thisFrameTime = performance.now();
        
        // Time interval in seconds
        let dt = (thisFrameTime - lastFrameTime) / 1000;

        if (animationStatus[0] === 'paused') {
            dt = 0;
        }

        timetoNextSpawn -= dt;

        // The loop makes the spawn time more independent from the browser's framerate. A feature to be further analyzed.
        while (timetoNextSpawn < 0) {

            timetoNextSpawn += config.SPAWN_TIME;

            let [position, velocity, size, timeRemaining, vao, numVertices, force, type] : shapeParameters = utils.generateNewShapeParameters(VAOList); 
    
            let new_id =  utils.getRandomIntegerInRange(1, 10000);
            if (shapes.length < config.MAX_SHAPE_COUNT) {
                
                shapes.push(
                    new Objects.MovingShape(position, velocity, size, timeRemaining, vao, numVertices, force, new_id, type)
                );    
           
            }
            
        }       
        // Imposing object count and lifespan limits

        utils.updateObjectExplorer(shapes);
        shapes = shapes.filter((shape) => shape.isAlive());

        
         
        lastFrameTime = thisFrameTime;

        shapes.forEach(shape => {
            shape.update(dt);            
        });

        canvas.style.width = `${config.CANVAS_WIDTH}px`; 
        canvas.style.height = `${config.CANVAS_HEIGHT}px`; 

        canvas.width = config.CANVAS_WIDTH * devicePixelRatio;
        canvas.height = config.CANVAS_HEIGHT * devicePixelRatio;

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

export const canvas= document.getElementById('demo-canvas') as HTMLCanvasElement;

try {
    motionDemonstration(canvas);
}
catch(e) {
    utils.showError(`Uncaught exception: ${e}`);
} 