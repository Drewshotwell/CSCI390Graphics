var arr = [];
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
   var effectiveShaderProgram = gouraudShaderProgram;

   // Here's where we call the routine that builds all the
   // objects we'll be drawing.
   const model = new Octahedron(gl, Material.pearl);

   var objTransforms = {
      cameraTransforms: {
         theta: 0,
         phi: 0,
         distance: 10
      },
      lightTransforms: {
         theta: 0,
         phi: 0,
         distance: 20
      }
   }

   drawScene(gl, effectiveShaderProgram, model, objTransforms);

   document.addEventListener('keydown', (event) => {
      switch (event.code) {
      case 'ArrowLeft':
         if (event.shiftKey) {
            objTransforms.lightTransforms.theta -= Math.PI / 10;
         }
         else {
            objTransforms.cameraTransforms.theta -= Math.PI / 10;
         }
         break;
      case 'ArrowRight':
         if (event.shiftKey) {
            objTransforms.lightTransforms.theta += Math.PI / 10;
         }
         else {
            objTransforms.cameraTransforms.theta += Math.PI / 10;
         }
         break;
      case 'ArrowUp':
         if (event.shiftKey) {
            objTransforms.lightTransforms.phi = objTransforms.lightTransforms.phi < Math.PI / 2 ? objTransforms.lightTransforms.phi + Math.PI / 10 : Math.PI / 2;
         }
         else {
            objTransforms.cameraTransforms.phi = objTransforms.cameraTransforms.phi < Math.PI / 2 ? objTransforms.cameraTransforms.phi + Math.PI / 10 : Math.PI / 2;
         }
         break;
      case 'ArrowDown':
         if (event.shiftKey) {
            objTransforms.lightTransforms.phi = objTransforms.lightTransforms.phi > -Math.PI / 2 ? objTransforms.lightTransforms.phi - Math.PI / 10 : -Math.PI / 2;
         }
         else {
            objTransforms.cameraTransforms.phi = objTransforms.cameraTransforms.phi > -Math.PI / 2 ? objTransforms.cameraTransforms.phi - Math.PI / 10 : -Math.PI / 2;
         }
         break;
      case 'KeyA':
         if (event.shiftKey) {
            objTransforms.lightTransforms.distance--;
         }
         else {
            objTransforms.cameraTransforms.distance--;
         }
         break;
      case 'KeyS':
         if (event.shiftKey) {
            objTransforms.lightTransforms.distance++;
         }
         else {
            objTransforms.cameraTransforms.distance++;
         }
         break;
      case 'KeyG':
         effectiveShaderProgram = gouraudShaderProgram;
         break;
      case 'KeyP':
         effectiveShaderProgram = phongShaderProgram;
         break;
      }
      drawScene(gl, effectiveShaderProgram, model, objTransforms);
   });
}

//
// Draw the scene.
//
function drawScene(gl, program, model, objTransforms) {
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
   
   const globalAmbient = [0.5, 0.5, 0.5, 1.0];
   
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
   
   // Declared light position using light rotations
   const lightRadius = objTransforms.lightTransforms.distance;
   const lightPos = [
      lightRadius * Math.sin(-objTransforms.lightTransforms.phi + Math.PI / 2) * Math.sin(objTransforms.lightTransforms.theta),
      lightRadius * Math.cos(-objTransforms.lightTransforms.phi + Math.PI / 2),
      lightRadius * Math.sin(-objTransforms.lightTransforms.phi + Math.PI / 2) * Math.cos(objTransforms.lightTransforms.theta),
   ];

   // Establish camera direction
   const cameraDir = [0, 0, -1];

   // Camera Transforms (last transforms in code sequence made first)
   var viewTransform = mat4.create();
   mat4.translate(viewTransform, viewTransform, vec3.scale(vec3.create(), cameraDir, objTransforms.cameraTransforms.distance));
   mat4.rotateX(viewTransform, viewTransform, objTransforms.cameraTransforms.phi);
   mat4.rotateY(viewTransform, viewTransform, -objTransforms.cameraTransforms.theta);

   // vec3 * mat4 -> vec3
   vec3.transformMat4(Light.stdLight.position, lightPos, viewTransform);
   
   // Standard light
   Light.stdLight.setUniform(gl, program, Light.stdLight);
      
   model.render(gl, program, viewTransform);
}