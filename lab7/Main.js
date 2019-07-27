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

   // Attribute names
   const attNames = ['vertPos', 'vertNormal', 'texCoord', 'vertTangent'];

   // Uniform names
   const ufmNames = ['mvMatrix', 'prjMatrix', 'nrmMatrix', 'glbAmbient',
      // Struct Names
      'light.diffuse', 'light.specular', 'light.position',
      'tex.diffuse', 'tex.normMap', 'tex.heightMap', 'tex.roughMap', 'tex.occMap','tex.maxHeight',
      //'material.ambient', 'material.diffuse', 'material.specular', 'material.shininess'
   ];

   // Initialize program from class
   //const texShaderProgram = new ShaderProgram(gl, getSource('texVrtShader.glsl'), getSource('texFrgShader.glsl'), attNames, ufmNames);
   const shaderProg = new ShaderProgram(gl, ShaderProgram.getSource('TexVrtShader.glsl'), ShaderProgram.getSource('TexFrgShader.glsl'), attNames, ufmNames);

   // Model creation
   const model = new TestAnimation(gl);

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
            break;
         case 'ArrowRight':
            if (event.shiftKey) {
               lightTrans.theta += Math.PI / 10;
            }
            else if (event.altKey) {
               reverse = false;
            }
            break;
         case 'ArrowUp':
            if (event.shiftKey) {
               lightTrans.phi = lightTrans.phi < Math.PI / 2 ?
                  lightTrans.phi + Math.PI / 10 : Math.PI / 2;
            }
            else if (event.altKey && pause) {
               time += 1.0 / fps;
            }
            break;
         case 'ArrowDown':
            if (event.shiftKey) {
               lightTrans.phi = lightTrans.phi > -Math.PI / 2 ?
                  lightTrans.phi - Math.PI / 10 : -Math.PI / 2;
            }
            else if (event.altKey && pause) {
               time -= 1.0 / fps;
            }
            break;
         case 'KeyA':
            if (event.shiftKey) {
               lightTrans.distance--;
            }
            break;
         case 'KeyS':
            if (event.shiftKey) {
               lightTrans.distance++;
            }
            break;
         case 'Space':
            pause = !pause;
            if (!pause) {
               requestAnimationFrame(doFrame);
            }
            break;
      }

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

   // Sky box projection matrix uniform with its respective shader program
   if (model.skyBox) {
      model.skyBox.program.use();
      model.skyBox.program.uniformMatrix4fv(
         'prjMatrix',
         false,
         projectionMatrix);
   }
      
   // Tell WebGL to use our program when drawing
   program.use();
   
   // Projection Matrix
   program.uniformMatrix4fv(
      'prjMatrix',
      false,
      projectionMatrix);
      
   // Global ambient light
   program.uniform4fv(
      'glbAmbient',
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