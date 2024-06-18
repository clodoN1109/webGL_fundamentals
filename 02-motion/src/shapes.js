"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.circleVertices = exports.squareVertices = exports.triangleVertices = void 0;
const config_js_1 = require("./config.js");
// Defining shapes
exports.triangleVertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, 0, 1.0]);
exports.squareVertices = new Float32Array([-1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1]);
exports.circleVertices = function buildCircleVertexBuffer() {
    const vertexData = [];
    const angle_increment = (Math.PI * 2 / config_js_1.config.CIRCLE_SEGMENT_COUNT);
    for (let i = 0; i < config_js_1.config.CIRCLE_SEGMENT_COUNT; i++) {
        const vertex1Angle = i * angle_increment;
        const vertex2Angle = (i + 1) * angle_increment;
        const x1 = Math.cos(vertex1Angle);
        const y1 = Math.sin(vertex1Angle);
        const x2 = Math.cos(vertex2Angle);
        const y2 = Math.sin(vertex2Angle);
        vertexData.push(0, 0, 0.70, 0.70, 0.70);
        vertexData.push(x1, y1, 0.95, 0.95, 0.95);
        vertexData.push(x2, y2, 0.95, 0.95, 0.95);
    }
    return new Float32Array(vertexData);
}();
