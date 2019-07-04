var cameraTransform;
var theta = 0, phi = 0;
var distToCamera = [0, 0, -10];

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

    req.open("GET", url, false);
    req.send(null);
    
    return (req.status == 200) ? req.responseText : null;
  };

  const vsSource = getSource('VtxShader.glsl');
  const fsSource = getSource('FrgShader.glsl');

  // Initialize programInfo without outside module
  const attNames = ['aVertexPosition','color'], ufmNames = ['uModelViewMatrix','uProjectionMatrix'];
  const programInfo = makeShaderProgram(gl, vsSource, fsSource, attNames, ufmNames);

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const model = new Cylinder(gl);

  drawScene(gl, programInfo, model);

  document.addEventListener('keydown', (event) => {
    // Left
    if(event.keyCode == 37) {
      theta -= Math.PI / 10;
    }
    // Right
    else if(event.keyCode == 39) {
      theta += Math.PI / 10;
    }
    // Up
    else if(event.keyCode == 38) {
      phi = phi < Math.PI / 2 ? phi + Math.PI / 10 : Math.PI / 2;
    }
    // Down
    else if(event.keyCode == 40) {
      phi = phi > -Math.PI / 2 ? phi - Math.PI / 10 : -Math.PI / 2;
    }
    // F -- Zoom forward
    else if(event.keyCode == 70) {
      vec3.add(distToCamera, distToCamera, [0, 0, 1]);
    }
    // G -- Zoom backward
    else if(event.keyCode == 71) {
      vec3.add(distToCamera, distToCamera, [0, 0, -1]);
    }
    drawScene(gl, programInfo, model);
  });
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, model) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
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

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.uProjectionMatrix,
    false,
    projectionMatrix);
    
  cameraTransform = mat4.create();
  
  mat4.translate(cameraTransform, cameraTransform, distToCamera);
  mat4.rotateX(cameraTransform, cameraTransform, phi);
  mat4.rotateY(cameraTransform, cameraTransform, theta);

  model.render(gl, programInfo, cameraTransform);

  return cameraTransform;
}