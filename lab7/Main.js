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
      'tex.diffuse', 'tex.shininess',
      //'material.ambient', 'material.diffuse', 'material.specular', 'material.shininess'
   ];

   // Initialize program from class
   //const texShaderProgram = new ShaderProgram(gl, getSource('texVrtShader.glsl'), getSource('texFrgShader.glsl'), attNames, ufmNames);
   const shaderProg = new ShaderProgram(gl, getSource('TexVrtShader.glsl'), getSource('TexFrgShader.glsl'), attNames, ufmNames);

   // Textures
   const firefoxTex = new Texture(gl, 'cubetexture.png', 5, false, 'LINEAR');
   const woodTex = new Texture(gl, 'wood.jpg', 0.5, true, 'LINEAR');
   const earthTex = new Texture(gl, 'earth_day.jpg', 0.7, false, 'LINEAR');
   const rockTex = new Texture(gl, 'rock.png', 1, true, 'LINEAR');
   const terrainTex = new Texture(gl, 'terrainAtlas.jpg', 1, false, 'LINEAR');


   // Model creation
   //const model = new Cube(gl, woodTex);
   //const model = new JackStack(gl, [Math.PI / 3, -Math.PI / 3, Math.PI / 4], woodTex);
   //const model = new JackStackAttack(gl, woodTex);
   const model = new TestAnimation(gl, woodTex);

   var cameraTransforms = {
      theta: 0,
      phi: 0,
      distance: 0
   };

   var camTrans = mat4.create();
   var lightTrans = {
      theta: 0,
      phi: 0,
      distance: 20
   }

   drawScene(gl, shaderProg, model, lightTrans, 0);

   const fps = 24;
   var pause = false, reverse = false, time = 0;
   document.addEventListener('keydown', (event) => {
      switch (event.code) {
         case 'ArrowLeft':
            if (event.shiftKey) {
               lightTrans.theta -= Math.PI / 10;
            }
            else if (event.altKey) {
               reverse = true;
            }
            else {
               cameraTransforms.theta -= Math.PI / 10;
            }
            break;
         case 'ArrowRight':
            if (event.shiftKey) {
               lightTrans.theta += Math.PI / 10;
            }
            else if (event.altKey) {
               reverse = false;
            }
            else {
               cameraTransforms.theta += Math.PI / 10;
            }
            break;
         case 'ArrowUp':
            if (event.shiftKey) {
               lightTrans.phi = lightTrans.phi < Math.PI / 2 ? lightTrans.phi + Math.PI / 10 : Math.PI / 2;
            }
            else if (event.altKey && pause) {
               time += 1.0 / fps;
            }
            else {
               cameraTransforms.phi = cameraTransforms.phi < Math.PI / 2 ? cameraTransforms.phi + Math.PI / 10 : Math.PI / 2;
            }
            break;
         case 'ArrowDown':
            if (event.shiftKey) {
               lightTrans.phi = lightTrans.phi > -Math.PI / 2 ? lightTrans.phi - Math.PI / 10 : -Math.PI / 2;
            }
            else if (event.altKey && pause) {
               time -= 1.0 / fps;
            }
            else {
               cameraTransforms.phi = cameraTransforms.phi > -Math.PI / 2 ? cameraTransforms.phi - Math.PI / 10 : -Math.PI / 2;
            }
            break;
         case 'KeyA':
            if (event.shiftKey) {
               lightTrans.distance--;
            }
            else {
               cameraTransforms.distance--;
            }
            break;
         case 'KeyS':
            if (event.shiftKey) {
               lightTrans.distance++;
            }
            else {
               cameraTransforms.distance++;
            }
            break;
         case 'Space':
            pause = !pause;
            if (!pause) {
               requestAnimationFrame(doFrame);
            }
            break;
      }
      
      camTrans = mat4.create();
      mat4.translate(camTrans, camTrans, [0, 0, cameraTransforms.distance]);
      mat4.rotateX(camTrans, camTrans, cameraTransforms.phi);
      mat4.rotateY(camTrans, camTrans, -cameraTransforms.theta);
      
      model.camera.model.transform(camTrans);
      drawScene(gl, shaderProg, model, lightTrans, time);
   });

   
   // Draw the scene repeatedly at 24fps
   function doFrame(timeStamp) {
      //time += timeStamp * 0.001;  // convert to seconds;
      time = !reverse ? time + 1 / fps : time - 1 / fps;  // convert to seconds;
                
      setTimeout(function () {
         drawScene(gl, shaderProg, model, lightTrans, time);
         if (time < 30 && !pause) {
            requestAnimationFrame(doFrame);
         }
      }, 1000 / fps);
   }
   requestAnimationFrame(doFrame);
}

//
// Draw the scene.
//
function drawScene(gl, program, model, lightTrans, time) {
   gl.clearColor(0.6, 0.8, 1.0, 1.0);  // Clear to sky
   gl.clearDepth(1.0);                 // Clear everything
   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

   // Clear the canvas before we start drawing on it.
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   // Create a perspective matrix
   const fieldOfView = 45 * Math.PI / 180;   // in radians
   const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
   const zNear = 0.1;
   const zFar = 100.0;
   const projectionMatrix = mat4.create();
   mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar);

   // Global ambient to be bound in the shader program
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
   const lightRadius = lightTrans.distance;
   const lightPos = [
      lightRadius * Math.sin(-lightTrans.phi + Math.PI / 2) * Math.sin(lightTrans.theta),
      lightRadius * Math.cos(-lightTrans.phi + Math.PI / 2),
      lightRadius * Math.sin(-lightTrans.phi + Math.PI / 2) * Math.cos(lightTrans.theta),
   ];

   // Camera Transforms (last transforms in code sequence made first)
   const cameraXfm = model.getCameraXfm(time);
   const mvTransform = mat4.create();
   mat4.invert(mvTransform, cameraXfm);

   // Standard light
   // vec3 * mat4 -> vec3
   vec3.transformMat4(Light.stdLight.position, lightPos, mvTransform);
   Light.stdLight.setUniform(program, 'light');

   model.render(time, gl, program, mvTransform);
}