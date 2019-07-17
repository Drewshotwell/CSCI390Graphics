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
   const attNames = ['vertPos', 'vertNormal', 'texCoord'];
   
   // Uniform names
   const ufmNames = ['mvMatrix', 'prjMatrix', 'nrmMatrix', 'glbAmbient', 'texSampler',
      // Struct Names
      'light.diffuse', 'light.specular', 'light.position',
      'tex.diffuse', 'tex.shininess'
   ];

   // Initialize program from class
   const texShaderProgram = new ShaderProgram(gl, getSource('texVrtShader.glsl'), getSource('texFrgShader.glsl'), attNames, ufmNames);

   // Textures
   const firefoxTex = new Texture(gl, 'cubetexture.png', 5, false, 'LINEAR');
   const woodTex = new Texture(gl, 'wood.jpg', 0.5, true, 'LINEAR');
   const earthTex = new Texture(gl, 'earth_day.jpg', 0.7, false, 'LINEAR');
   const rockTex = new Texture(gl, 'rock.png', 1, true, 'LINEAR');
   const terrainTex = new Texture(gl, 'terrainAtlas.jpg', 1, false, 'LINEAR');

   // Model creation
   //const model = new CompoundModel();
   //model.addChild(new Cylinder(gl, rockTex, 2, 10), mat4.scale(mat4.create(), mat4.create(), [1, 10, 1]));

   // Landscape
   /*const model = new Landscape(gl, terrainTex, 10, [
      { farLeft: { x: 0, z: 0 }, nearRight: { x: 5, z: 5 }, tile: { row: 0, col: 6 } },
      { farLeft: { x: 4, z: 4 }, nearRight: { x: 7, z: 7 }, tile: { row: 3, col: 4 } },
   ]);*/
   const model = new Cube(gl, woodTex);

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

   drawScene(gl, texShaderProgram, model, objTransforms);

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
      }
      drawScene(gl, texShaderProgram, model, objTransforms);
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
   Light.stdLight.setUniform(program, 'light');
      
   model.render(gl, program, viewTransform);
}