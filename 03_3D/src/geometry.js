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
exports.create3DPosColorInterleavedVAO = exports.TABLE_INDICES = exports.TABLE_VERTICES = exports.CUBE_INDICES = exports.CUBE_VERTICES = void 0;
const Utils = __importStar(require("./utils.js"));
exports.CUBE_VERTICES = new Float32Array([
    // Front face
    -1.0, -1.0, 1.0, 1, 0, 0, // 0
    1.0, -1.0, 1.0, 1, 0, 0, // 1
    1.0, 1.0, 1.0, 1, 0, 0, // 2
    -1.0, 1.0, 1.0, 1, 0, 0, // 3
    // Back face
    -1.0, -1.0, -1.0, 1, 0, 0, // 4
    -1.0, 1.0, -1.0, 1, 0, 0, // 5
    1.0, 1.0, -1.0, 1, 0, 0, // ...
    1.0, -1.0, -1.0, 1, 0, 0,
    // Top face
    -1.0, 1.0, -1.0, 0, 1, 0,
    -1.0, 1.0, 1.0, 0, 1, 0,
    1.0, 1.0, 1.0, 0, 1, 0,
    1.0, 1.0, -1.0, 0, 1, 0,
    // Bottom face
    -1.0, -1.0, -1.0, 0, 1, 0,
    1.0, -1.0, -1.0, 0, 1, 0,
    1.0, -1.0, 1.0, 0, 1, 0,
    -1.0, -1.0, 1.0, 0, 1, 0,
    // Right face
    1.0, -1.0, -1.0, 0, 0, 1,
    1.0, 1.0, -1.0, 0, 0, 1,
    1.0, 1.0, 1.0, 0, 0, 1,
    1.0, -1.0, 1.0, 0, 0, 1,
    // Left face
    -1.0, -1.0, -1.0, 0, 0, 1,
    -1.0, -1.0, 1.0, 0, 0, 1,
    -1.0, 1.0, 1.0, 0, 0, 1,
    -1.0, 1.0, -1.0, 0, 0, 1,
]);
exports.CUBE_INDICES = new Uint16Array([
    0, 1, 2,
    0, 2, 3, // front
    4, 5, 6,
    4, 6, 7, // back
    8, 9, 10,
    8, 10, 11, // top
    12, 13, 14,
    12, 14, 15, // bottom
    16, 17, 18,
    16, 18, 19, // right
    20, 21, 22,
    20, 22, 23, // left
]);
exports.TABLE_VERTICES = new Float32Array([
    // Top face
    -10.0, 0.0, -10.0, 0.3, 0.3, 0.3,
    -10.0, 0.0, 10.0, 0.3, 0.3, 0.3,
    10.0, 0.0, 10.0, 0.3, 0.3, 0.3,
    10.0, 0.0, -10.0, 0.3, 0.3, 0.3,
]);
exports.TABLE_INDICES = new Uint16Array([
    0, 1, 2,
    0, 2, 3, // top
]);
function create3DPosColorInterleavedVAO(webGL2, vertexBuffer, indexBuffer, positionAttribute, colorAttribute) {
    const vao = webGL2.createVertexArray();
    if (!vao) {
        Utils.showError('Failed to create VAO');
        return null;
    }
    webGL2.bindVertexArray(vao);
    webGL2.enableVertexAttribArray(positionAttribute);
    webGL2.enableVertexAttribArray(colorAttribute);
    // Interleaved format: (x, y, z, r, g, b) (all f32)
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, vertexBuffer);
    webGL2.vertexAttribPointer(positionAttribute, 3, webGL2.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    webGL2.vertexAttribPointer(colorAttribute, 3, webGL2.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);
    webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, indexBuffer);
    webGL2.bindVertexArray(null);
    webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, null); // Not sure if necessary, but not a bad idea.
    return vao;
}
exports.create3DPosColorInterleavedVAO = create3DPosColorInterleavedVAO;
