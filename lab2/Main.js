var model;
var cameraTransform;

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

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 color;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = color;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize programInfo without outside module
  const attNames = ['aVertexPosition','color'], ufmNames = ['uModelViewMatrix','uProjectionMatrix'];
  const programInfo = makeShaderProgram(gl, vsSource, fsSource, attNames, ufmNames);

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  model = new JackStackAttack(gl);

  cameraTransform = drawScene(gl, programInfo, model);

  document.addEventListener('keydown', (event) => {
    // Left 
    if(event.keyCode == 37) {
      console.log(mat4.str(cameraTransform));
      mat4.translate(cameraTransform, mat4.create(), [1, 0, 0]);
      cameraTransform = drawScene(gl, programInfo, model);
      console.log(mat4.str(cameraTransform));
    }
    // Right
    else if(event.keyCode == 39) {

    }
    // Up
    else if(event.keyCode == 38) {

    }
    // Down
    else if(event.keyCode == 40) {

    }
    // F -- Rotate C-Clockwise
    else if(event.keyCode == 70) {

    }
    // G -- Rotate Clockwise
    else if(event.keyCode == 71) {

    }
    //console.log(cameraTransform);
  });
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, model) {
  console.log("Hello");
  console.log(gl);
  console.log(programInfo);
  console.log(model);

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
  
  if (!cameraTransform){
    cameraTransform = mat4.create();
  }
  mat4.translate(cameraTransform, cameraTransform, [0, 0, -10.0]);
  model.render(gl, programInfo, cameraTransform);

  return cameraTransform;
}