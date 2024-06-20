"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
const gl_matrix_1 = require("gl-matrix");
class Shape {
    constructor(position, scale, rotationAxis, rotationAngle, vao, numIndices) {
        this.position = position;
        this.scale = scale;
        this.rotationAxis = rotationAxis;
        this.rotationAngle = rotationAngle;
        this.vao = vao;
        this.numIndices = numIndices;
        this.matWorld = gl_matrix_1.mat4.create();
        this.scaleVec = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.quat.create();
    }
    draw(webGL2, matWorldUniform) {
        gl_matrix_1.quat.setAxisAngle(this.rotation, this.rotationAxis, this.rotationAngle);
        gl_matrix_1.vec3.set(this.scaleVec, this.scale, this.scale, this.scale);
        gl_matrix_1.mat4.fromRotationTranslationScale(this.matWorld, 
        /* rotation */ this.rotation, 
        /* position */ this.position, 
        /* scale */ this.scaleVec);
        webGL2.uniformMatrix4fv(matWorldUniform, false, this.matWorld);
        webGL2.bindVertexArray(this.vao);
        webGL2.drawElements(webGL2.TRIANGLES, this.numIndices, webGL2.UNSIGNED_SHORT, 0);
        webGL2.bindVertexArray(null);
    }
}
exports.Shape = Shape;
