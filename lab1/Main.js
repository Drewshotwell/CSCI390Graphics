var cubeRotation = 0.0;
var cubeTranslate = [0, 0, -6.0];
var trAcc = 0;

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
  const modelInfo = makeCubeModel(gl);

  //var result = "";
  for (var p in modelInfo.properties) {
    //if (modelInfo.properties.hasOwnProperty(p)) {
      console.log(modelInfo.properties[p].vals);
    //} 
  }

  var then = 0;

  // Draw the scene repeatedly
  function doFrame(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, modelInfo, deltaTime);

    requestAnimationFrame(doFrame);
  }
  requestAnimationFrame(doFrame);
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, modelInfo, deltaTime) {
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

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 //[-0.0, 0.0, -6.0]);  // amount to translate
                 cubeTranslate);
  /*mat4.rotate(modelViewMatrix,
              modelViewMatrix,
              1,
              [0, 1, 0]);
  mat4.scale(modelViewMatrix,
             modelViewMatrix,
             [1, 0.5, 1]);*/
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation * .7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, modelInfo.posBuf);
    gl.vertexAttribPointer(
        programInfo.attribLocations.aVertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.aVertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.

  for (var p in modelInfo.properties){
    const numComponents = modelInfo.properties[p].numComponents;
    const type = modelInfo.properties[p].type;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, modelInfo.properties[p].buf);
    gl.vertexAttribPointer(
        programInfo.attribLocations[p],
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations[p]);
  }

  /*{
    const numComponents = modelInfo.properties.color.numComponents;
    const type = modelInfo.properties.color.type;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, modelInfo.properties.color.buf);
    gl.vertexAttribPointer(
        programInfo.attribLocations.aVertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.aVertexColor);
  }*/

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelInfo.indexBuf);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.uModelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = modelInfo.indices.length;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
  trAcc += deltaTime;
  cubeTranslate[0] = Math.sin(deltaTime);
}
