import * as Main from "./main.js";
import {config} from "./config.js";

// Utils
 
export function showError(errorText: string) {
    console.log(errorText);
    // $("#error-box").empty();

    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null){
        return;
    }
 
    const errorElement = document.getElementById('error-description');
    errorElement.innerHTML = errorText;
}

export function getRandomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function getRandomIntegerInRange(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

export function createStaticVertexBuffer(webGL2: WebGL2RenderingContext, data: ArrayBuffer) {

    const buffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, buffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, data, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    return buffer;
}

export function createStaticIndexBuffer(webGL2: WebGL2RenderingContext, data: ArrayBuffer) {

    const buffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, buffer);
    webGL2.bufferData(webGL2.ELEMENT_ARRAY_BUFFER, data, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, null);

    return buffer;
}

export function stringfyGLSL(filename: string) {
    
    var request = new XMLHttpRequest();
    
    request.open('GET', filename + '.glsl', false);

    request.send(null);
    
    return request.responseText;    
}


export function createProgram(webGL2 : WebGL2RenderingContext, vertexShaderSourceCode : string, fragmentShaderSourceCode : string) {
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

export function generateNewShapeParameters() {

   
}

export function updateObjectExplorer(){

    
}
