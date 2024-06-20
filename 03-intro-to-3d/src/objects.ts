import {mat4, vec3, quat} from 'gl-matrix';

export class Shape {

    private matWorld = mat4.create();
    private scaleVec = vec3.create();
    private rotation = quat.create();

    constructor(
        private position: vec3,
        private scale: number,
        private rotationAxis: vec3,
        private rotationAngle: number,
        public readonly vao: WebGLVertexArrayObject,
        public readonly numIndices: number
    ) { }

    draw(webGL2: WebGL2RenderingContext, matWorldUniform: WebGLUniformLocation) {
        
        quat.setAxisAngle(this.rotation, this.rotationAxis, this.rotationAngle);
        vec3.set(this.scaleVec, this.scale, this.scale, this.scale);

        mat4.fromRotationTranslationScale(
            this.matWorld,
            /* rotation */   this.rotation,
            /* position */ this.position,
            /* scale */ this.scaleVec
        );
        
        webGL2.uniformMatrix4fv(matWorldUniform, false, this.matWorld);
        webGL2.bindVertexArray(this.vao);
        webGL2.drawElements(webGL2.TRIANGLES, this.numIndices, webGL2.UNSIGNED_SHORT, 0);
        webGL2.bindVertexArray(null);
        
    }   

}