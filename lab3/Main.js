/* Global Variables*/
var worldTheta = 0, worldPhi = 0;
var lightTheta = 0, lightPhi = 0;
var distToModel = [0, 0, -10];
var distToLight = [0, 0, 10];

main();

//
// Start here
//
function main() {
   const canvas = document.querySelector('#glcanvas');
   const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

   // If we don't have a GL context, give up now

   if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
   }

   function getSource(url) {
      var req = new XMLHttpRequest();

      req.open('GET', url, false);
      req.send(null);

      return (req.status == 200) ? req.responseText : null;
   };

   // Attribute names
   const attNames = ['vertPos', 'notAnAtt', 'vertNormal', 'color']

   // Uniform names
   const ufmNames = ['mvMatrix', 'prjMatrix', 'nrmMatrix', 'glbAmbient',
      // Struct Names
      'light.ambient', 'light.diffuse', 'light.specular', 'light.position',
      'material.ambient', 'material.diffuse', 'material.specular', 'material.shininess'
   ];

   // Initialize program from class
   const gouraudShaderProgram = new ShaderProgram(gl, getSource('GouraudVrtShader.glsl'), getSource('GouraudFrgShader.glsl'), attNames, ufmNames);
   const phongShaderProgram = new ShaderProgram(gl, getSource('PhongVrtShader.glsl'), getSource('PhongFrgShader.glsl'), attNames, ufmNames);

   // Here's where we call the routine that builds all the
   // objects we'll be drawing.
   //const model = new Jack(gl, Material.pearl);
   const model = new JackStackAttack(gl);
   var effectiveShaderProgram = gouraudShaderProgram;
   //const model = new JackStack(gl, 0, Material.gold);
   //const model = new Cylinder(gl, Material.pearl);

   drawScene(gl, effectiveShaderProgram, model);

   document.addEventListener('keydown', (event) => {
      switch (event.code) {
         case 'ArrowLeft':
            if (event.shiftKey) {
               lightTheta -= Math.PI / 10;
            }
            else {
               worldTheta -= Math.PI / 10;
            }
            break;
         case 'ArrowRight':
            if (event.shiftKey) {
               lightTheta += Math.PI / 10;
            }
            else {
               worldTheta += Math.PI / 10;
            }
            break;
         case 'ArrowUp':
            if (event.shiftKey) {
               lightPhi = lightPhi < Math.PI / 2 ? lightPhi + Math.PI / 10 : Math.PI / 2;
            }
            else {
               worldPhi = worldPhi < Math.PI / 2 ? worldPhi + Math.PI / 10 : Math.PI / 2;
            }
            break;
         case 'ArrowDown':
            if (event.shiftKey) {
               lightPhi = lightPhi > -Math.PI / 2 ? lightPhi - Math.PI / 10 : -Math.PI / 2;
            }
            else {
               worldPhi = worldPhi > -Math.PI / 2 ? worldPhi - Math.PI / 10 : -Math.PI / 2;
            }
            break;
         case 'KeyA':
            vec3.add(distToModel, distToModel, [0, 0, 1]);
            break;
         case 'KeyS':
            vec3.add(distToModel, distToModel, [0, 0, -1]);
            break;
         case 'KeyG':
            effectiveShaderProgram = gouraudShaderProgram;
            break;
         case 'KeyP':
            effectiveShaderProgram = phongShaderProgram;
            break;
      }
      drawScene(gl, effectiveShaderProgram, model);
   });
}

//
// Draw the scene.
//
function drawScene(gl, program, model) {
   gl.clearColor(0.6, 0.8, 1.0, 1.0);  // Clear to black, fully opaque
   gl.clearDepth(1.0);                 // Clear everything
   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

   // Clear the canvas before we start drawing on it.
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   // Create a perspective matrix, a special matrix that is
   // used to simulate the distortion of perspective in a camera.
   // Our field of view is 45 degrees, with a width/height
   // ratio that matches the display size of the canvas
   // and we only want to see objects between 0.1 units
   // and 100 units away from the camera.
   const fieldOfView = 45 * Math.PI / 180;   // in radians
   const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
   const zNear = 0.1;
   const zFar = 100.0;
   const projectionMatrix = mat4.create();

   // note: glmatrix.js always has the first argument
   // as the destination to receive the result.
   mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar);
   
   const globalAmbient = [0.2, 0.2, 0.2, 1.0];
   
   // Tell WebGL to use our program when drawing
   program.use();

   // Projection Matrix
   program.uniformMatrix4fv(
      program.uniformLocations.prjMatrix,
      false,
      projectionMatrix);
   
   // Global ambient light
   program.uniform4fv(
      program.uniformLocations.glbAmbient,
      globalAmbient);
   
      
   // Camera Transforms (last transforms in code sequence made first)
   var cameraTransform = mat4.create();
   mat4.translate(cameraTransform, cameraTransform, distToModel);
   mat4.rotateX(cameraTransform, cameraTransform, worldPhi);
   mat4.rotateY(cameraTransform, cameraTransform, -worldTheta);
   
   // vec3 * mat4 -> vec3
   vec3.transformMat4(Light.stdLight.position, vec3.subtract(vec3.create(), distToLight, distToModel), cameraTransform);
   console.log(-lightPhi, ' ', lightTheta);
   console.log("Subtracted: ", vec3.str(vec3.subtract(vec3.create(), distToLight, distToModel)));
   console.log("Untransformed", distToLight);
   
   const radius = vec3.length(vec3.subtract(vec3.create(), distToLight, distToModel));
   distToLight = [
      radius*Math.sin(-lightPhi + Math.PI / 2)*Math.sin(lightTheta),
      radius*Math.cos(-lightPhi + Math.PI / 2),
      radius*Math.sin(-lightPhi + Math.PI / 2)*Math.cos(lightTheta),
   ];
   
   // Standard light
   Light.stdLight.setUniform(gl, program, Light.stdLight);
      
   model.render(gl, program, cameraTransform);
}