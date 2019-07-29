class LeafModel {
   constructor(texture) {
      this.positions = [];
      this.indices = [];
      this.properties = {};
      this.texture = texture;
   }

   makeVBOs(gl) {
      this.posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

      this.indexBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

      for (let p in this.properties) {
         //console.log(p);
         this.properties[p]['buf'] = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, this.properties[p].buf);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.properties[p].vals), gl.STATIC_DRAW);
      }
   }

   setProperty(vals, type, numComponents) {
      return { vals, type, numComponents }
   }

   render(time, gl, program, transform) {
      
      if (this.texture != null) {
         this.texture.setUniform(gl, program, 'tex');
      }
      else {
         //alert("Leaf Model's has no texture");
      }
      
      // Set attributes for vertices and normals
      // Tell WebGL which indices to use to index the vertices
      program.setAtt('vertPos', this.posBuf, 3, gl.FLOAT, false);
      program.setIndices(this.indexBuf);

      for (let p in this.properties) {
         if (this.properties[p])
            program.setAtt(
               p,
               this.properties[p].buf,
               this.properties[p].numComponents,
               this.properties[p].type,
               false,
            );
      }
      
      
      // Tell WebGL to use our program when drawing
      program.use();

      // Set the shader uniforms
      program.uniformMatrix4fv(
         'mvMatrix',
         false,
         transform);

      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, transform);
      mat4.transpose(normalMatrix, normalMatrix);

      program.uniformMatrix4fv(
         'nrmMatrix',
         false,
         normalMatrix);

      {
         const vertexCount = this.indices.length;
         const type = gl.UNSIGNED_SHORT;
         const offset = 0;
         gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
   }

   getCameraXfm() {
      return null;
   }

   subdivide(reps, ftn) {
      for (let i = 0; i < reps; i++) {
         // New index objects
         var idxMap = {};
         var newIndices = [];

         // Stamp current index length as not to cause an infinte loop
         const curIdxLen = this.indices.length;

         // Copy of vertices in an array of arrays
         var vertArr = [];
         for (let vdx = 0; vdx < this.positions.length; vdx += 3) {
            vertArr.push([this.positions[vdx], this.positions[vdx + 1], this.positions[vdx + 2]]);
         }

         // Construction per-triangle of new indices
         for (let idxIndex = 0; idxIndex < curIdxLen; idxIndex += 3) {
            // Function to check map containment
            var pairAvailable = function (i1, i2) {
               return !(idxMap.hasOwnProperty([i1, i2]) || idxMap.hasOwnProperty([i2, i1]));
            }

            var getObjectByKey = function (k1, k2) {
               return idxMap[[k1, k2]] ? idxMap[[k1, k2]] : idxMap[[k2, k1]];
            }

            // Original indices
            var a = this.indices[idxIndex];
            var b = this.indices[idxIndex + 1];
            var c = this.indices[idxIndex + 2];

            // New indices
            var d, e, f;
            
            // Vertices of original vertices
            var v1 = vertArr[a];
            var v2 = vertArr[b];
            var v3 = vertArr[c];

            // If available, then set a new index and compute midpoint,
            // Otherwise, simply retrieve the midpoint-index already there.
            if (pairAvailable(a, b)) {
               d = this.positions.length / 3;
               idxMap[[a, b]] = d;
               let m1 = ftn(v1, v2);
               this.positions.push(...m1);
            }
            else d = getObjectByKey(a, b);

            if (pairAvailable(b, c)) {
               e = this.positions.length / 3;
               idxMap[[b, c]] = e;
               let m2 = ftn(v2, v3);
               this.positions.push(...m2);
            }
            else e = getObjectByKey(b, c);

            if (pairAvailable(c, a)) {
               f = this.positions.length / 3;
               idxMap[[c, a]] = f;
               let m3 = ftn(v3, v1);
               this.positions.push(...m3);
            }
            else f = getObjectByKey(c, a);
            
            // Set new indices
            newIndices.push(
               a, f, d,
               b, d, e,
               c, e, f,
               d, e, f,
            );
         }
         this.indices = newIndices;
         this.normals = this.positions;
      }
   }
}