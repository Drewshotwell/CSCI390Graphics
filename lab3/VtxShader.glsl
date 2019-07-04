attribute vec4 aVertexPosition;
attribute vec4 color;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying lowp vec4 vColor;
void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = color;
}