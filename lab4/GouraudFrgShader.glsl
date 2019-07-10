precision mediump float;
varying vec3 varyingColor;

//  uniforms match those in the vertex shader,
//  but aren't used directly in this fragment shader
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

uniform PositionalLight light;
uniform Material material;
uniform vec4 globalAmbient;
uniform mat4 mvMatrix;
uniform mat4 prjMatrix;
uniform mat4 nrmMatrix;

//  interpolate lighted color
// (interpolation of gl_Position is automatic)
void main(void) {	
   gl_FragColor = vec4(varyingColor, 1.0);
}
