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
         const curIdxMax = Math.max(...this.modelInfo.indices);
         const curIdxLen = this.modelInfo.indices.length;
         var newIndices = [];

         // Copy of vertices in an array of arrays
         var vertArr = [];
         for (let vdx = 0; vdx < this.modelInfo.positions.length; vdx += 3) {
            vertArr.push([this.modelInfo.positions[vdx], this.modelInfo.positions[vdx + 1], this.modelInfo.positions[vdx + 2]]);
         }

         var newIdxIncr = 0;
         for (let idxIndex = 0; idxIndex < curIdxLen; idxIndex += 3) {
            // Start of new indices
            const newStartIndex = curIdxMax + 1 + newIdxIncr;
            console.log(newIdxIncr);
            
            // Function to check map containment
            var pairAvailable = function (i1, i2) {
               return !(idxMap.has([ i1, i2 ]) || idxMap.has([ i2, i1 ]));
            }
            // Original indices
            var a = this.modelInfo.indices[idxIndex];
            var b = this.modelInfo.indices[idxIndex + 1];
            var c = this.modelInfo.indices[idxIndex + 2];
            
            // Vertices of original vertices
            var v1 = vertArr[a];
            var v2 = vertArr[b];
            var v3 = vertArr[c];
            
            // Vertices of new indices
            if (pairAvailable(a, b)) {
               let m1 = ftn(v1, v2);
               this.modelInfo.positions.push(...m1);
               var d = newStartIndex;
               idxMap.set([a, b], d);
               newIdxIncr++;
            }
            else {
               var d = idxMap.get([a, b]);
               console.log(d);
            }
            if (pairAvailable(b, c)) {
               let m2 = ftn(v2, v3);
               this.modelInfo.positions.push(...m2);
               var e = newStartIndex + 1;
               idxMap.set([b, c], e);
               newIdxIncr++;
            }
            else {
               var e = idxMap.get([b, c]);
               console.log(e);
            }
            if (pairAvailable(c, a)) {
               let m3 = ftn(v3, v1);
               this.modelInfo.positions.push(...m3);
               var f = newStartIndex + 2;
               idxMap.set([c, a], f);
               newIdxIncr++;
            }
            else {
               var f = idxMap.get([c, a]);
               console.log(f);
            }
            
            // Set new indices
            newIndices.push(
               a, f, d,
               b, d, e,
               c, e, f,
               d, e, f, // Inverse filler triangle
            );
         }
         this.modelInfo.indices = newIndices;
         this.modelInfo.normals = this.modelInfo.positions;
         console.log(idxMap);
         console.log(this.modelInfo.positions);
         console.log(this.modelInfo.indices);
      }
   }
}