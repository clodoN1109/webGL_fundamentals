let triangleVertices = [-0.5, -0.5, 0.5, -0.5, 0, 0.5];
let scale : number = 100;
let offsetX : number = window.innerWidth/2;
let offsetY : number = window.innerHeight/2;
let width_in_pixels : number = window.innerWidth; 
let height_in_pixels : number = window.innerHeight; 

const myShape : WebGL2RenderingContext = shape(window.innerWidth, window.innerHeight, scale, offsetX, offsetY, triangleVertices) as WebGL2RenderingContext;

function updateTriangle(new_value, vertex_number, coordinate_number) {

    triangleVertices[vertex_number * 2 + coordinate_number] = new_value;

    shape(width_in_pixels, height_in_pixels, scale, offsetX, offsetY, triangleVertices);
}

function updateCanvasSize(width?:number, height?:number) {
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;

    if (width === undefined) {width = 100 * canvas.width/window.innerWidth;}
    if (height === undefined) {height = 100 * canvas.height/window.innerHeight;}

    width_in_pixels = window.innerWidth * width/100; 
    height_in_pixels = window.innerHeight * height/100; 

    shape(width_in_pixels, height_in_pixels, scale, offsetX, offsetY, triangleVertices);
}

function updateOffsetX(new_offsetX:number) {

    offsetX = new_offsetX/100 * window.innerWidth;

    shape(width_in_pixels, height_in_pixels, scale, offsetX, offsetY, triangleVertices);
}

function updateOffsetY(new_offsetY:number) {

    offsetY = new_offsetY/100 * window.innerHeight;

    shape(width_in_pixels, height_in_pixels, scale, offsetX, offsetY, triangleVertices);
}

function updateScale(new_scale:number) {

    scale = new_scale;

    shape(width_in_pixels, height_in_pixels, scale, offsetX, offsetY, triangleVertices);
}

function showError(errorText: string) {
    console.log(errorText);
    // $("#error-box").empty();

    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null){
        return;
    }

    const errorElement = document.createElement('p');
    errorElement.innerText = errorText;
    errorBoxDiv.appendChild(errorElement);
}



showError("");

function shape(width, height, scale, offsetX, offsetY, triangleVertices) {
    
    const canvas = document.getElementById('demo-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
        showError("You've just made a terrible mistake!");
        return;
    }
            
    //console.log(canvas);

    const webGL2 = canvas.getContext('webgl2');

    // console.log(webGL2);

    //---------------------------------------------------------------------------------

    const triangleGeoCPUBuffer = new Float32Array(triangleVertices);

    //console.log(triangleGeoCPUBuffer);

    const triangleGeoGPUBuffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, triangleGeoGPUBuffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, triangleGeoCPUBuffer, webGL2.STATIC_DRAW)
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

    //---------------------------------------------------------------------------------

    const vertexShaderSourceCode = 
        `#version 300 es
        precision mediump float;

        in vec2 vertexPosition;

        uniform vec2 canvasSize;
        uniform vec2 shapeLocation;
        uniform float shapeSize;

        void main() {
            vec2 finalVertexPosition = vertexPosition * shapeSize + shapeLocation;
            vec2 clipPosition = (finalVertexPosition / canvasSize) * 2.0 - 1.0;

            gl_Position = vec4(clipPosition, 0.0, 1.0);
        }`;
                                    
    // console.log(vertexShaderSourceCode);

    const vertexShader = webGL2.createShader(webGL2.VERTEX_SHADER);
    webGL2.shaderSource(vertexShader, vertexShaderSourceCode);
    webGL2.compileShader(vertexShader);

    //---------------------------------------------------------------------------------

    const fragmentShaderSourceCode = 
        `#version 300 es
        precision mediump float;

        out vec4 outputColor;
        float r;
        float g;
        float b;
        float a;
        uniform float u_time;

        vec2 generateSeed(float time) {
            return vec2(time, time);
        }

        float rand(vec2 seed) {
            return cos(dot(seed.xy, vec2(0.9898, 8.233)));
        }

        vec4 randomColor(float color) {
            r = color + 0.3;
            g = color + 0.1;
            b = color + 0.6;
            a = color;
            return vec4(r, g, b, a);
        }   

        void main() {        

            outputColor = randomColor(rand( generateSeed(u_time) ));
        
        }`;

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

    //---------------------------------------------------------------------------------

    canvas.width = width;
    canvas.height = height;

    webGL2.clearColor(0.2, 0.2, 0.1, 0);
    webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
    webGL2.viewport(0,0, canvas.width, canvas.height);

    //---------------------------------------------------------------------------------

    webGL2.useProgram(webGL2TriangleProgram);

    webGL2.enableVertexAttribArray(vertexPositionAttributeLocation);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, triangleGeoGPUBuffer);
    webGL2.vertexAttribPointer(vertexPositionAttributeLocation, 2, webGL2.FLOAT, false, 8, 0);
   
    //---------------------------------------------------------------------------------

    webGL2.uniform2f(canvasSizeUniform, canvas.width, canvas.height);
    webGL2.uniform1f(shapeSizeUniform, scale);
    webGL2.uniform2f(shapeLocationUniform, offsetX, offsetY);
    webGL2.drawArrays(webGL2.TRIANGLES, 0, 3);

    return webGL2;

}