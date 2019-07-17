precision mediump float;
attribute vec3 vertPos;
attribute vec3 vertNormal;
attribute vec2 texCoord;
varying vec3 varyingNormal;
varying vec3 varyingLightDir;
varying vec3 varyingVertPos;
varying vec2 varyingTexCoord;

struct PositionalLight {
	vec4 diffuse;
	vec4 specular;
	vec3 position;
};

struct Texture {
   sampler2D diffuse;
	float shininess;
};

uniform PositionalLight light;
uniform Texture tex;
uniform vec4 glbAmbient;
uniform mat4 mvMatrix;
uniform mat4 prjMatrix;
uniform mat4 nrmMatrix;

void main(void) {	
   varyingVertPos = (mvMatrix * vec4(vertPos,1.0)).xyz;
	varyingLightDir = light.position - varyingVertPos;
	varyingNormal = (nrmMatrix * vec4(vertNormal,1.0)).xyz;

	gl_Position = prjMatrix * mvMatrix * vec4(vertPos,1.0);

   varyingTexCoord = texCoord;
}