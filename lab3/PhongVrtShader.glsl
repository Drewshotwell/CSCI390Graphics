attribute vec3 vertPos;
attribute vec3 vertNormal;
varying vec3 varyingNormal;
varying vec3 varyingLightDir;
varying vec3 varyingVertPos;

struct PositionalLight {
   vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec3 position;
};

struct Material {	
   vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	float shininess;
};

uniform vec4 globalAmbient;
uniform PositionalLight light;
uniform Material material;
uniform mat4 mvMatrix;
uniform mat4 prjMatrix;
uniform mat4 nrmMatrix;

void main(void) {	
   varyingVertPos = (mvMatrix * vec4(vertPos,1.0)).xyz;
	varyingLightDir = light.position - varyingVertPos;
	varyingNormal = (nrmMatrix * vec4(vertNormal,1.0)).xyz;

	gl_Position = prjMatrix * mvMatrix * vec4(vertPos,1.0);
}
