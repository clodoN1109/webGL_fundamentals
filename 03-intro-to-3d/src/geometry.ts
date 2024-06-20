import * as Utils from './utils.js'

export const CUBE_VERTICES = new Float32Array([
    // Front face
    -1.0, -1.0, 1.0, 1, 0, 0,  // 0
    1.0, -1.0, 1.0, 1, 0, 0,   // 1
    1.0, 1.0, 1.0, 1, 0, 0,    // 2
    -1.0, 1.0, 1.0, 1, 0, 0,   // 3
  
    // Back face
    -1.0, -1.0, -1.0, 1, 0, 0, // 4
    -1.0, 1.0, -1.0, 1, 0, 0,  // 5
    1.0, 1.0, -1.0, 1, 0, 0,   // ...
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

export const CUBE_INDICES = new Uint16Array([
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

  export const TABLE_VERTICES = new Float32Array([
    // Top face
    -10.0, 0.0, -10.0, 0.3, 0.3, 0.3,
    -10.0, 0.0, 10.0, 0.3, 0.3, 0.3,
    10.0, 0.0, 10.0, 0.3, 0.3, 0.3,
    10.0, 0.0, -10.0, 0.3, 0.3, 0.3,
  ]);
  export const TABLE_INDICES = new Uint16Array([
    0, 1, 2,
    0, 2, 3, // top
  ]);

export function create3DPosColorInterleavedVAO(
    webGL2: WebGL2RenderingContext,
    vertexBuffer: WebGLBuffer,
    indexBuffer: WebGLBuffer,
    positionAttribute: number,
    colorAttribute: number
) {
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
  webGL2.vertexAttribPointer(
    positionAttribute, 3, webGL2.FLOAT, false,
    6 * Float32Array.BYTES_PER_ELEMENT, 0);
  webGL2.vertexAttribPointer(
    colorAttribute, 3, webGL2.FLOAT, false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT);
  webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);

  webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, indexBuffer);
  webGL2.bindVertexArray(null);

  webGL2.bindBuffer(webGL2.ELEMENT_ARRAY_BUFFER, null);  // Not sure if necessary, but not a bad idea.

  return vao;
}