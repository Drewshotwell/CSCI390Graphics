precision mediump float;
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
   // normalize the light, normal, and view vectors:
	vec3 L = normalize(varyingLightDir);
	vec3 N = normalize(varyingNormal);
	vec3 V = normalize(-varyingVertPos);
	
	// compute light reflection vector, with respect N:
	vec3 R = normalize(reflect(-L, N));
	
	// get the angle between the light and surface normal:
	float cosTheta = dot(L,N);
	
	// angle between the view vector and reflected light:
	float cosPhi = dot(V,R);

	// compute ADS contributions (per pixel):
	vec3 ambient = glbAmbient.xyz;
   vec3 diffuse = light.diffuse.xyz * max(cosTheta,0.0);
	vec3 specular = light.specular.xyz * pow(max(cosPhi,0.0), tex.shininess);

	gl_FragColor = texture2D(tex.diffuse, varyingTexCoord) * vec4((ambient + diffuse + specular), 1.0);
}
