"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateObjectExplorer = exports.generateNewShapeParameters = exports.createProgram = exports.stringfyGLSL = exports.createStaticIndexBuffer = exports.createStaticVertexBuffer = exports.getRandomIntegerInRange = exports.getRandomInRange = exports.showError = void 0;
// Utils
function showError(errorText) {
    console.log(errorText);
    // $("#error-box").empty();
    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null) {
        return;
    }
    const errorElement = document.getElementById('error-description');
    errorElement.innerHTML = errorText;
}
exports.showError = showError;
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomInRange = getRandomInRange;
function getRandomIntegerInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
exports.getRandomIntegerInRange = getRandomIntegerInRange;
function createStaticVertexBuffer(webGL2, data) {
    const buffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, buffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, data, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);
    return buffer;
}
exports.createStaticVertexBuffer = createStaticVertexBuffer;
function createStaticIndexBuffer(webGL2, data) {
    const buffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, buffer);
    webGL2.bufferData(webGL2.ELEMENT_ARRAY_BUFFER, data, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
}
exports.createStaticIndexBuffer = createStaticIndexBuffer;
function stringfyGLSL(filename) {
    var request = new XMLHttpRequest();
    request.open('GET', filename + '.glsl', false);
    request.send(null);
    return request.responseText;
}
exports.stringfyGLSL = stringfyGLSL;
function createProgram(webGL2, vertexShaderSourceCode, fragmentShaderSourceCode) {
    // Loading GLSL (OpenGL Shading Language) scripts
    const vertexShader = webGL2.createShader(webGL2.VERTEX_SHADER);
    webGL2.shaderSource(vertexShader, vertexShaderSourceCode);
    webGL2.compileShader(vertexShader);
    const fragmentShader = webGL2.createShader(webGL2.FRAGMENT_SHADER);
    webGL2.shaderSource(fragmentShader, fragmentShaderSourceCode);
    webGL2.compileShader(fragmentShader);
    let program = webGL2.createProgram();
    webGL2.attachShader(program, vertexShader);
    webGL2.attachShader(program, fragmentShader);
    webGL2.linkProgram(program);
    return program;
}
exports.createProgram = createProgram;
function generateNewShapeParameters() {
}
exports.generateNewShapeParameters = generateNewShapeParameters;
function updateObjectExplorer() {
}
exports.updateObjectExplorer = updateObjectExplorer;
