precision mediump float;

attribute vec3 vertPos;
attribute vec2 texCoord;

varying vec2 varyingTexCoord;

uniform sampler2D tex;
uniform mat4 mvMatrix;
uniform mat4 prjMatrix;

void main(void) {
   gl_Position = prjMatrix * mvMatrix * vec4(vertPos,1.0);
   varyingTexCoord = texCoord;
}