#version 300 es
precision mediump float;

in vec2 vertexPosition;
in vec3 vertexColor;

out vec3 fragmentColor;

uniform vec2 canvasSize;
uniform vec2 shapeLocation;
uniform float shapeSize;

void main() {

    fragmentColor = vertexColor;
    
    // Internaly, webGL API multiplies each vertex coordinate for the corresponding screen 
    // dimension value, what would stretch the clip's figure. By diving the vertex position
    // by the canvas size, that effect is avoided and the figure is symmetrically rendered.
    // Also, this defines the appropriate pixel unit within clip space, WebGL considers each 
    // clip space unit as one canvas pixel.
    vec2 clipUnit = (1.0 / canvasSize);

    vec2 clipPosition = (clipUnit * vertexPosition * shapeSize) + shapeLocation; 

    gl_Position = vec4(clipPosition, 0.0, 1.0);

}