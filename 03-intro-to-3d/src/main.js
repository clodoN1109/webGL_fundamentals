"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvas = exports.introTo3D = exports.animationStatus = exports.animationID = void 0;
const Controls = __importStar(require("./controls.js"));
const Geometry = __importStar(require("./geometry.js"));
const Utils = __importStar(require("./utils.js"));
const Objects = __importStar(require("./objects.js"));
const gl_matrix_1 = require("gl-matrix");
const config_js_1 = require("./config.js");
Controls.initialize();
exports.animationStatus = ['play'];
function introTo3D(canvas) {
    //---------------------------------------------------------------------------------
    // Getting WebGL 2 context object
    let webGL2 = canvas.getContext('webgl2');
    //---------------------------------------------------------------------------------
    // Creating buffers
    const cubeVertices = Utils.createStaticVertexBuffer(webGL2, Geometry.CUBE_VERTICES);
    const cubeIndices = Utils.createStaticIndexBuffer(webGL2, Geometry.CUBE_INDICES);
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
    const cubeVAO = Geometry.create3DPosColorInterleavedVAO(webGL2, cubeVertices, cubeIndices, positionAttribute, colorAttribute);
    const tableVAO = Geometry.create3DPosColorInterleavedVAO(webGL2, tableVertices, tableIndices, positionAttribute, colorAttribute);
    //---------------------------------------------------------------------------------
    //
    const UP_VEC = gl_matrix_1.vec3.fromValues(0, 1, 0);
    const shapes = [
        new Objects.Shape(gl_matrix_1.vec3.fromValues(0, 0, 0), 1, UP_VEC, 0, tableVAO, Geometry.TABLE_INDICES.length),
        new Objects.Shape(gl_matrix_1.vec3.fromValues(0, 0.4, 0), 0.4, UP_VEC, gl_matrix_1.glMatrix.toRadian(30), cubeVAO, Geometry.CUBE_INDICES.length),
        new Objects.Shape(gl_matrix_1.vec3.fromValues(1, 0.05, 1), 0.05, UP_VEC, gl_matrix_1.glMatrix.toRadian(80), cubeVAO, Geometry.CUBE_INDICES.length),
        new Objects.Shape(gl_matrix_1.vec3.fromValues(-1, 0.15, 1), 0.15, UP_VEC, 0, cubeVAO, Geometry.CUBE_INDICES.length),
        new Objects.Shape(gl_matrix_1.vec3.fromValues(-1, 0.2, -1), 0.2, UP_VEC, gl_matrix_1.glMatrix.toRadian(50), cubeVAO, Geometry.CUBE_INDICES.length)
    ];
    //---------------------------------------------------------------------------------
    //
    const matView = gl_matrix_1.mat4.create();
    const matProj = gl_matrix_1.mat4.create();
    let cameraAngle = 0;
    let lastFrameTime = performance.now();
    const frame = function () {
        const currentFrameTime = performance.now();
        let dt = (currentFrameTime - lastFrameTime) / 1000;
        if (exports.animationStatus[0] === 'paused') {
            dt = 0;
        }
        lastFrameTime = currentFrameTime;
        cameraAngle += dt * gl_matrix_1.glMatrix.toRadian(10);
        const cameraX = 3 * Math.sin(cameraAngle);
        const cameraZ = 3 * Math.cos(cameraAngle);
        canvas.style.width = `${config_js_1.config.CANVAS_WIDTH}px`;
        canvas.style.height = `${config_js_1.config.CANVAS_HEIGHT}px`;
        canvas.width = config_js_1.config.CANVAS_WIDTH * devicePixelRatio;
        canvas.height = config_js_1.config.CANVAS_HEIGHT * devicePixelRatio;
        webGL2.clearColor(0, 0, 0, 0);
        webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
        webGL2.enable(webGL2.DEPTH_TEST);
        webGL2.enable(webGL2.CULL_FACE);
        webGL2.cullFace(webGL2.BACK);
        webGL2.frontFace(webGL2.CCW);
        webGL2.viewport(0, 0, canvas.width, canvas.height);
        webGL2.useProgram(demoProgram);
        //---------------------------------------------------------------------------------
        const matWorld = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.lookAt(matView, gl_matrix_1.vec3.fromValues(cameraX, 1, cameraZ), gl_matrix_1.vec3.fromValues(0, 0, 0), gl_matrix_1.vec3.fromValues(0, 1, 0));
        gl_matrix_1.mat4.perspective(matProj, gl_matrix_1.glMatrix.toRadian(90), canvas.width / canvas.height, 0.1, 1000.0);
        const matViewProj = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.multiply(matViewProj, matProj, matView);
        webGL2.uniformMatrix4fv(matrixWorldUniform, false, matWorld);
        webGL2.uniformMatrix4fv(matrixViewProjUniform, false, matViewProj);
        shapes.forEach(shape => {
            shape.draw(webGL2, matrixWorldUniform);
        });
        exports.animationID = requestAnimationFrame(frame);
    };
    exports.animationID = requestAnimationFrame(frame);
}
exports.introTo3D = introTo3D;
exports.canvas = document.getElementById('demo-canvas');
try {
    introTo3D(exports.canvas);
}
catch (e) {
    Utils.showError(`Uncaught exception: ${e}`);
}
