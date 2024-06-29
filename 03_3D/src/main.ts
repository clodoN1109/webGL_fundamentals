import * as Controls from './controls.js';
import * as Geometry from './geometry.js';
import * as Utils from './utils.js'
import * as Objects from './objects.js'; 
import { glMatrix, mat4, vec3 } from 'gl-matrix';
import { config } from './config.js';

Controls.initialize();

export let animationID;
export let animationStatus = ['play'];

export function introTo3D(canvas : HTMLCanvasElement) {

    //---------------------------------------------------------------------------------
    // Getting WebGL 2 context object

    let webGL2 = canvas.getContext('webgl2') as WebGL2RenderingContext;

    //---------------------------------------------------------------------------------
    // Creating buffers

    const cubeVertices = Utils.createStaticVertexBuffer(webGL2, Geometry.CUBE_VERTICES);
    const cubeIndices = Utils.createStaticIndexBuffer(webGL2, Geometry.CUBE_INDICES)
    const tableVertices = Utils.createStaticVertexBuffer(webGL2, Geometry.TABLE_VERTICES);
    const tableIndices = Utils.createStaticIndexBuffer(webGL2, Geometry.TABLE_INDICES);

    if (!cubeVertices || !cubeIndices || !tableVertices || !tableIndices) {
        Utils.showError(`Failed to create geometry: cube: vertex = ${!!cubeVertices} index = ${!!cubeIndices} table: vertex = ${!!tableVertices} index = ${!!tableIndices}`);
    }

    //---------------------------------------------------------------------------------
    // Loading GLSL source code and creating a webGL program

    const vertexShaderSourceCode = Utils.stringfyGLSL('src/vertexShader');
    const fragmentShaderSourceCode = Utils.stringfyGLSL('src/fragmentShader');

    // console.log(vertexShaderSourceCode);
    // console.log(fragmentShaderSourceCode);
 
    const demoProgram = Utils.createProgram(webGL2, vertexShaderSourceCode, fragmentShaderSourceCode);

    //---------------------------------------------------------------------------------
    // Getting program attributes references 

    const positionAttribute = webGL2.getAttribLocation(demoProgram, 'vertexPosition');
    const colorAttribute = webGL2.getAttribLocation(demoProgram, 'vertexColor');
    const matrixWorldUniform = webGL2.getUniformLocation(demoProgram, 'matWorld');
    const matrixViewProjUniform = webGL2.getUniformLocation(demoProgram, 'matViewProj');

    //---------------------------------------------------------------------------------
    // Creating VAOs (Vertex Attribute Objects)

    const cubeVAO = Geometry.create3DPosColorInterleavedVAO(
        webGL2, cubeVertices, cubeIndices, positionAttribute, colorAttribute
    );

    const tableVAO = Geometry.create3DPosColorInterleavedVAO(
        webGL2, tableVertices, tableIndices, positionAttribute, colorAttribute
    );

    //---------------------------------------------------------------------------------
    //

    const UP_VEC = vec3.fromValues(0, 1, 0);
    const shapes = [
        new Objects.Shape(vec3.fromValues(0, 0, 0), 1, UP_VEC, 0, tableVAO, Geometry.TABLE_INDICES.length),
        new Objects.Shape(vec3.fromValues(0, 0.4, 0), 0.4, UP_VEC, glMatrix.toRadian(30), cubeVAO, Geometry.CUBE_INDICES.length),
        new Objects.Shape(vec3.fromValues(1, 0.05, 1), 0.05, UP_VEC, glMatrix.toRadian(80), cubeVAO, Geometry.CUBE_INDICES.length),
        new Objects.Shape(vec3.fromValues(-1, 0.15, 1), 0.15, UP_VEC, 0, cubeVAO, Geometry.CUBE_INDICES.length),
        new Objects.Shape(vec3.fromValues(-1, 0.2, -1), 0.2, UP_VEC, glMatrix.toRadian(50), cubeVAO, Geometry.CUBE_INDICES.length)
    ]


    //---------------------------------------------------------------------------------
    //

    const matView = mat4.create();
    const matProj = mat4.create();

    let cameraAngle = 0;

    let lastFrameTime = performance.now();
    const frame = function() {

        const currentFrameTime = performance.now();
        let dt = (currentFrameTime - lastFrameTime) / 1000; 
        if (animationStatus[0] === 'paused') {
            dt = 0;
        }
        lastFrameTime = currentFrameTime;

        cameraAngle += dt * glMatrix.toRadian(10);
        

        const cameraX = 3 * Math.sin(cameraAngle);
        const cameraZ = 3 * Math.cos(cameraAngle);

        canvas.style.width = `${config.CANVAS_WIDTH}px`;
        canvas.style.height = `${config.CANVAS_HEIGHT}px`; 

        canvas.width = config.CANVAS_WIDTH * devicePixelRatio;
        canvas.height = config.CANVAS_HEIGHT * devicePixelRatio;
        
        webGL2.clearColor(0, 0, 0, 0);
        webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
        webGL2.enable(webGL2.DEPTH_TEST);
        webGL2.enable(webGL2.CULL_FACE);
        webGL2.cullFace(webGL2.BACK);
        webGL2.frontFace(webGL2.CCW);
        webGL2.viewport(0,0, canvas.width, canvas.height);

        webGL2.useProgram(demoProgram);
        
        //---------------------------------------------------------------------------------

        const matWorld = mat4.create();

        mat4.lookAt(
            matView,
            vec3.fromValues(cameraX, 1, cameraZ),
            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 1, 0),
            
        );


        mat4.perspective(
            matProj,
            glMatrix.toRadian(90),
            canvas.width/canvas.height,
            0.1,
            1000.0
        );

        const matViewProj = mat4.create();
        mat4.multiply(matViewProj, matProj, matView);

        webGL2.uniformMatrix4fv(matrixWorldUniform, false, matWorld);
        webGL2.uniformMatrix4fv(matrixViewProjUniform, false, matViewProj);

        shapes.forEach( shape => {
            shape.draw(webGL2, matrixWorldUniform);
        });

        animationID = requestAnimationFrame(frame);

    }

    animationID = requestAnimationFrame(frame);

}   

export const canvas= document.getElementById('demo-canvas') as HTMLCanvasElement;

try {
    introTo3D(canvas);
}
catch(e) {
    Utils.showError(`Uncaught exception: ${e}`);
} 
