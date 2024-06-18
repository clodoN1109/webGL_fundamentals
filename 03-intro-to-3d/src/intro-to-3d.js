"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geometry_1 = require("./geometry");
const gl_utils_1 = require("./gl-utils");
const gl_matrix_1 = require("gl-matrix");
const vertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;

out vec3 fragmentColor;

uniform mat4 matWorld;
uniform mat4 matViewProj;

void main() {
  fragmentColor = vertexColor;

  gl_Position = matViewProj * matWorld * vec4(vertexPosition, 1.0);
}`;
const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentColor;
out vec4 outputColor;

void main() {
  outputColor = vec4(fragmentColor, 1.0);
}`;
class Shape {
    constructor(pos, scale, rotationAxis, rotationAngle, vao, numIndices) {
        this.pos = pos;
        this.scale = scale;
        this.rotationAxis = rotationAxis;
        this.rotationAngle = rotationAngle;
        this.vao = vao;
        this.numIndices = numIndices;
        this.matWorld = gl_matrix_1.mat4.create();
        this.scaleVec = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.quat.create();
    }
    draw(gl, matWorldUniform) {
        gl_matrix_1.quat.setAxisAngle(this.rotation, this.rotationAxis, this.rotationAngle);
        gl_matrix_1.vec3.set(this.scaleVec, this.scale, this.scale, this.scale);
        gl_matrix_1.mat4.fromRotationTranslationScale(this.matWorld, 
        /* rotation= */ this.rotation, 
        /* position= */ this.pos, 
        /* scale= */ this.scaleVec);
        gl.uniformMatrix4fv(matWorldUniform, false, this.matWorld);
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}
function introTo3DDemo() {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        (0, gl_utils_1.showError)('Could not get Canvas reference');
        return;
    }
    const gl = (0, gl_utils_1.getContext)(canvas);
    const cubeVertices = (0, gl_utils_1.createStaticVertexBuffer)(gl, geometry_1.CUBE_VERTICES);
    const cubeIndices = (0, gl_utils_1.createStaticIndexBuffer)(gl, geometry_1.CUBE_INDICES);
    const tableVertices = (0, gl_utils_1.createStaticVertexBuffer)(gl, geometry_1.TABLE_VERTICES);
    const tableIndices = (0, gl_utils_1.createStaticIndexBuffer)(gl, geometry_1.TABLE_INDICES);
    if (!cubeVertices || !cubeIndices || !tableVertices || !tableIndices) {
        (0, gl_utils_1.showError)(`Failed to create geo: cube: (v=${!!cubeVertices} i=${cubeIndices}), table=(v=${!!tableVertices} i=${!!tableIndices})`);
        return;
    }
    const demoProgram = (0, gl_utils_1.createProgram)(gl, vertexShaderSourceCode, fragmentShaderSourceCode);
    if (!demoProgram) {
        (0, gl_utils_1.showError)('Failed to compile WebGL program');
        return;
    }
    const posAttrib = gl.getAttribLocation(demoProgram, 'vertexPosition');
    const colorAttrib = gl.getAttribLocation(demoProgram, 'vertexColor');
    const matWorldUniform = gl.getUniformLocation(demoProgram, 'matWorld');
    const matViewProjUniform = gl.getUniformLocation(demoProgram, 'matViewProj');
    if (posAttrib < 0 || colorAttrib < 0 || !matWorldUniform || !matViewProjUniform) {
        (0, gl_utils_1.showError)(`Failed to get attribs/uniforms: ` +
            `pos=${posAttrib}, color=${colorAttrib} ` +
            `matWorld=${!!matWorldUniform} matViewProj=${!!matViewProjUniform}`);
        return;
    }
    const cubeVao = (0, geometry_1.create3dPosColorInterleavedVao)(gl, cubeVertices, cubeIndices, posAttrib, colorAttrib);
    const tableVao = (0, geometry_1.create3dPosColorInterleavedVao)(gl, tableVertices, tableIndices, posAttrib, colorAttrib);
    if (!cubeVao || !tableVao) {
        (0, gl_utils_1.showError)(`Failed to create VAOs: cube=${!!cubeVao} table=${!!tableVao}`);
        return;
    }
    const UP_VEC = gl_matrix_1.vec3.fromValues(0, 1, 0);
    const shapes = [
        new Shape(gl_matrix_1.vec3.fromValues(0, 0, 0), 1, UP_VEC, 0, tableVao, geometry_1.TABLE_INDICES.length), // Ground
        new Shape(gl_matrix_1.vec3.fromValues(0, 0.4, 0), 0.4, UP_VEC, 0, cubeVao, geometry_1.CUBE_INDICES.length), // Center
        new Shape(gl_matrix_1.vec3.fromValues(1, 0.05, 1), 0.05, UP_VEC, gl_matrix_1.glMatrix.toRadian(20), cubeVao, geometry_1.CUBE_INDICES.length),
        new Shape(gl_matrix_1.vec3.fromValues(1, 0.1, -1), 0.1, UP_VEC, gl_matrix_1.glMatrix.toRadian(40), cubeVao, geometry_1.CUBE_INDICES.length),
        new Shape(gl_matrix_1.vec3.fromValues(-1, 0.15, 1), 0.15, UP_VEC, gl_matrix_1.glMatrix.toRadian(60), cubeVao, geometry_1.CUBE_INDICES.length),
        new Shape(gl_matrix_1.vec3.fromValues(-1, 0.2, -1), 0.2, UP_VEC, gl_matrix_1.glMatrix.toRadian(80), cubeVao, geometry_1.CUBE_INDICES.length),
    ];
    const matView = gl_matrix_1.mat4.create();
    const matProj = gl_matrix_1.mat4.create();
    const matViewProj = gl_matrix_1.mat4.create();
    let cameraAngle = 0;
    //
    // Render!
    let lastFrameTime = performance.now();
    const frame = function () {
        const thisFrameTime = performance.now();
        const dt = (thisFrameTime - lastFrameTime) / 1000;
        lastFrameTime = thisFrameTime;
        //
        // Update
        cameraAngle += dt * gl_matrix_1.glMatrix.toRadian(10);
        const cameraX = 3 * Math.sin(cameraAngle);
        const cameraZ = 3 * Math.cos(cameraAngle);
        gl_matrix_1.mat4.lookAt(matView, 
        /* pos= */ gl_matrix_1.vec3.fromValues(cameraX, 1, cameraZ), 
        /* lookAt= */ gl_matrix_1.vec3.fromValues(0, 0, 0), 
        /* up= */ gl_matrix_1.vec3.fromValues(0, 1, 0));
        gl_matrix_1.mat4.perspective(matProj, 
        /* fovy= */ gl_matrix_1.glMatrix.toRadian(80), 
        /* aspectRatio= */ canvas.width / canvas.height, 
        /* near, far= */ 0.1, 100.0);
        // in GLM:    matViewProj = matProj * matView
        gl_matrix_1.mat4.multiply(matViewProj, matProj, matView);
        //
        // Render
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        gl.clearColor(0.02, 0.02, 0.02, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(demoProgram);
        gl.uniformMatrix4fv(matViewProjUniform, false, matViewProj);
        shapes.forEach((shape) => shape.draw(gl, matWorldUniform));
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}
try {
    introTo3DDemo();
}
catch (e) {
    (0, gl_utils_1.showError)(`Unhandled JavaScript exception: ${e}`);
}
