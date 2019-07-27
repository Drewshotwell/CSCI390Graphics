precision mediump float;

varying vec2 varyingTexCoord;

uniform sampler2D tex;
uniform mat4 mvMatrix;
uniform mat4 prjMatrix;

void main(void) {
   gl_FragColor = texture2D(tex, varyingTexCoord);
}