//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
   const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
   const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

   // Create the shader program
   const shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   // If creating the shader program failed, alert
   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
   }

   return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
   const shader = gl.createShader(type);

   // Send the source to the shader object
   gl.shaderSource(shader, source);

   // Compile the shader program
   gl.compileShader(shader);

   // See if it compiled successfully
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
   }

   return shader;
}

class ShaderProgram {
   constructor(gl, vsSource, fsSource, attNames, ufmNames) {
      // Initialize a shader program; this is where all the lighting
      // for the vertices and so forth is established.
      const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

      var attLocs = {}, ufmLocs = {};
      for (var attName of attNames) {
         attLocs[attName] = gl.getAttribLocation(shaderProgram, attName);
      }

      for (var ufmName of ufmNames) {
         ufmLocs[ufmName] = gl.getUniformLocation(shaderProgram, ufmName);
      }

      this.program = shaderProgram;
      this.attribLocations = attLocs;
      this.uniformLocations = ufmLocs;
      this.gl = gl;
   }

   use() {
      this.gl.useProgram(this.program);
   }

   // Connect attribute |name| to VBO |buf|, which is already filled.
   // You may assume the program is currently selected, and that entries in |buf|
   // each have |dim| values of GL type |type| (e.g gl.FLOAT)
   setAtt(name, buf, dim, type, normalize) {
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
      this.gl.vertexAttribPointer(
         this.attribLocations[name],
         dim,
         type,
         normalize,
         stride,
         offset);
      this.gl.enableVertexAttribArray(
         this.attribLocations[name]);
   }

   // Connect the indices attribute to VBO |buf|, which is already filled.
   setIndices(buf) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buf);
   }

   // Put into uniform |name| the value |val|. Five different methods are provided
   // for various single, vector, or matrix types of |val|.
   uniform1f(name, val) {
      this.gl.uniform1f(this.uniformLocations[name], val);
   }

   uniform3fv(name, val) {
      this.gl.uniform3fv(this.uniformLocations[name], val);
   }

   uniform4fv(name, val) {
      this.gl.uniform4fv(this.uniformLocations[name], val);
   }

   uniformMatrix4fv(name, trans, val) {
      this.gl.uniformMatrix4fv(this.uniformLocations[name], trans, val);
   }

   uniform1i(name, val) {
      this.gl.uniform1i(this.uniformLocations[name], val);
   }
   
   static getSource(url) {
      var req = new XMLHttpRequest();

      req.open("GET", url, false);
      req.send(null);

      return (req.status == 200) ? req.responseText : null;
   };
   
}