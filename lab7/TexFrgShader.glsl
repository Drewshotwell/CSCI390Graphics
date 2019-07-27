precision mediump float;
varying vec3 varyingNormal;
varying vec3 varyingLightDir;
varying vec3 varyingVertPos;
varying vec2 varyingTexCoord;

varying vec3 varyingTangent;

struct PositionalLight {
	vec4 diffuse;
	vec4 specular;
	vec3 position;
};

struct Texture {
   sampler2D diffuse;
   sampler2D normMap;
   sampler2D heightMap;
   sampler2D roughMap;
   sampler2D occMap;
   float maxHeight;
};

uniform PositionalLight light;
uniform Texture tex;
uniform vec4 glbAmbient;
uniform mat4 mvMatrix;
uniform mat4 prjMatrix;
uniform mat4 nrmMatrix;

vec3 calcNewNormal() {
   vec3 normal = normalize(varyingNormal);
   vec3 tangent = normalize(varyingTangent);
   tangent = normalize(tangent - dot(tangent, normal) * normal);
   vec3 bitangent = cross(tangent, normal);
   mat3 tbn = mat3(tangent, bitangent, normal);
   vec3 retrievedNormal = texture2D(tex.normMap, varyingTexCoord).xyz;
   retrievedNormal = retrievedNormal * 2.0 - 1.0;
   vec3 newNormal = tbn * retrievedNormal;
   newNormal = normalize(newNormal);
   return newNormal;
}

void main(void) {	
   // normalize the light, normal, and view vectors:
	vec3 L = normalize(varyingLightDir);
	vec3 V = normalize(-varyingVertPos);
   //vec3 N = normalize(varyingNormal);
   vec3 N = calcNewNormal();
   /*float a = 0.25;
   float b = 100.0;
   float x = varyingVertPos.x;
   float y = varyingVertPos.y;
   float z = varyingVertPos.z;
   N.x = varyingNormal.x + a*sin(b*x);
   N.y = varyingNormal.y + a*sin(b*y);
   N.z = varyingNormal.z + a*sin(b*z);
   N = normalize(N);*/
   
	// compute light reflection vector, with respect N:
	vec3 R = normalize(reflect(-L, N));
	
	// get the angle between the light and surface normal:
	float cosTheta = dot(L,N);
	
	// angle between the view vector and reflected light:
	float cosPhi = dot(V,R);

	// compute ADS contributions (per pixel):
	vec3 ambient = glbAmbient.xyz * texture2D(tex.occMap, varyingTexCoord).xyz;
   vec3 diffuse = light.diffuse.xyz * max(cosTheta,0.0);
	//vec3 specular = light.specular.xyz * pow(max(cosPhi,0.0), tex.shininess);
   vec3 specular = light.specular.xyz * pow(max(cosPhi,0.0), 2.0*(length(texture2D(tex.roughMap, varyingTexCoord))) + 1.0);

	gl_FragColor = texture2D(tex.diffuse, varyingTexCoord) * vec4((ambient + diffuse + specular), 1.0);
}
