class LeafModel {
   constructor(material) {
      this.material = material;
      super.modelInfo = {
         positions: [],
         normals: [],
         indices: [],
      }
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
      }
      else {
         alert("Leaf Model's material is null");
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

   subdivide(reps, ftn) {
      for (let i = 0; i < reps; i++) {

         // New index objects
         var idxMap = new Map();
         const curIdxLen = this.modelInfo.indices.length;
         var newIndices = [];

         // Copy of vertices in an array of arrays
         var vertArr = [];
         for (let vdx = 0; vdx <= this.modelInfo.positions.length - 3; vdx += 3) {
            vertArr.push([this.modelInfo.positions[vdx], this.modelInfo.positions[vdx + 1], this.modelInfo.positions[vdx + 2]]);
         }

         for (let idxIndex = 0; idxIndex <= curIdxLen - 3; idxIndex += 3) {
            const newStartIndex = curIdxLen / 3 + idxIndex;
            let v1 = vertArr[this.modelInfo.indices[idxIndex]];
            let v2 = vertArr[this.modelInfo.indices[idxIndex + 1]];
            let v3 = vertArr[this.modelInfo.indices[idxIndex + 2]];
            let m1 = ftn(v1, v2);
            let m2 = ftn(v2, v3);
            let m3 = ftn(v3, v1);
            this.modelInfo.positions.push(...m1, ...m2, ...m3);

            // Original indices
            var a = this.modelInfo.indices[idxIndex];
            var b = this.modelInfo.indices[idxIndex + 1];
            var c = this.modelInfo.indices[idxIndex + 2];

            // New indices
            var d = newStartIndex;
            var e = newStartIndex + 1;
            var f = newStartIndex + 2;

            // Set new indices
            newIndices.push(a, f, d);
            newIndices.push(b, d, e);
            newIndices.push(c, e, f);
            newIndices.push(d, e, f); // Inverse filler triangle

            var pairAvailable = function (i1, i2) {
               if (!(idxMap.has({ i1, i2 }) || idxMap.has({ i2, i1 }))) {
                  return true;
               }
               else return false;
            }

            if (pairAvailable(a, b)) idxMap.set({ a, b }, d);
            if (pairAvailable(b, c)) idxMap.set({ b, c }, e);
            if (pairAvailable(c, a)) idxMap.set({ c, a }, f);
         }
         this.modelInfo.indices = newIndices;
         console.log(idxMap);
         console.log(this.modelInfo.positions);
         console.log(this.modelInfo.indices);
      }
   }
}