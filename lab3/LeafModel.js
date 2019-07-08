class LeafModel {
   constructor(material) {
      this.material = material;
   }

   makeVBOs(gl) {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelInfo.positions), gl.STATIC_DRAW);

      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelInfo.normals), gl.STATIC_DRAW);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.modelInfo.indices), gl.STATIC_DRAW);

      this.modelInfo['posBuf'] = positionBuffer;
      this.modelInfo['indexBuf'] = indexBuffer;
      this.modelInfo['normBuf'] = normalBuffer;
   }

   render(gl, program, modelViewMatrix) {
      if (this.material != null) {
         this.material.setUniform(gl, program, this.material);
      } else {
         console.log("Leaf Model's material is null");
      }
      
      // Set attributes for vertices and normals
      program.setAtt(program.attribLocations.vertPos, this.modelInfo.posBuf, 3, gl.FLOAT);
      program.setAtt(program.attribLocations.vertNormal, this.modelInfo.normBuf, 3, gl.FLOAT);

      // Tell WebGL which indices to use to index the vertices
      program.setIndices(this.modelInfo.indexBuf);

      // Tell WebGL to use our program when drawing
      program.use();

      // Set the shader uniforms
      program.uniformMatrix4fv(
         program.uniformLocations.mvMatrix,
         false,
         modelViewMatrix);
   
      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);
   
      program.uniformMatrix4fv(
         program.uniformLocations.nrmMatrix,
         false,
         normalMatrix);

      {
         const vertexCount = this.modelInfo.indices.length;
         const type = gl.UNSIGNED_SHORT;
         const offset = 0;
         gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
   }
}