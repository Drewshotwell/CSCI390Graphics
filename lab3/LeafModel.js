class LeafModel {
   modelInfo;
   makeVBOs(gl) {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelInfo.positions), gl.STATIC_DRAW);

      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelInfo.normals), gl.STATIC_DRAW); 

      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelInfo.properties.color.vals), gl.STATIC_DRAW);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.modelInfo.indices), gl.STATIC_DRAW);


      this.modelInfo['posBuf'] = positionBuffer;
      this.modelInfo['indexBuf'] = indexBuffer;
      this.modelInfo['normBuf'] = normalBuffer;
      this.modelInfo.properties.color['buf'] = colorBuffer;
   }

   render(gl, programInfo, modelViewMatrix) {
      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute
      {
         const numComponents = 3;
         const type = gl.FLOAT;
         const normalize = false;
         const stride = 0;
         const offset = 0;
         gl.bindBuffer(gl.ARRAY_BUFFER, this.modelInfo.posBuf);
         gl.vertexAttribPointer(
            programInfo.attribLocations.vertPos,
            numComponents,
            type,
            normalize,
            stride,
            offset);
         gl.enableVertexAttribArray(
            programInfo.attribLocations.vertPos);
      }

      {
         const numComponents = 3;
         const type = gl.FLOAT;
         const normalize = false;
         const stride = 0;
         const offset = 0;
         gl.bindBuffer(gl.ARRAY_BUFFER, this.modelInfo.normBuf);
         gl.vertexAttribPointer(
            programInfo.attribLocations.vertNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
         gl.enableVertexAttribArray(
            programInfo.attribLocations.vertNormal);
      }

      // Tell WebGL how to pull out the colors from the color buffer
      // into the vertexColor attribute.
      for (let p in this.modelInfo.properties) {
         const numComponents = this.modelInfo.properties[p].numComponents;
         const type = this.modelInfo.properties[p].type;
         const normalize = false;
         const stride = 0;
         const offset = 0;
         gl.bindBuffer(gl.ARRAY_BUFFER, this.modelInfo.properties[p].buf);
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

      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.modelInfo.indexBuf);

      // Tell WebGL to use our program when drawing
      gl.useProgram(programInfo.program);

      // Set the shader uniforms
      gl.uniformMatrix4fv(
         programInfo.uniformLocations.mvMatrix,
         false,
         modelViewMatrix);

      {
         const vertexCount = this.modelInfo.indices.length;
         const type = gl.UNSIGNED_SHORT;
         const offset = 0;
         gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
   }
}