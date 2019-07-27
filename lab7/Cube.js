class Cube extends LeafModel {
   constructor(gl, texture) {
      super(texture);
      
      var vertices = [], norms = [], idxs = [], txtCrds = [], tangs = [];

      let F1 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), 0));
      let F2 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), Math.PI / 2));
      let F3 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), Math.PI))
      let F4 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), 3 * Math.PI / 2));
      let F5 = makeFace(mat4.rotateX(mat4.create(), mat4.create(), - Math.PI / 2));
      let F6 = makeFace(mat4.rotateX(mat4.create(), mat4.create(), Math.PI / 2));
      console.log(F1);
      console.log(F2);
      console.log(F3);
      console.log(F4);
      console.log(F5);
      console.log(F6);
      
      vertices.push(...F1.verts, ...F2.verts, ...F3.verts, ...F4.verts, ...F5.verts, ...F6.verts);
      norms.push(...F1.normals, ...F2.normals, ...F3.normals, ...F4.normals, ...F5.normals, ...F6.normals);

      for (let i = 0; i < 6; i++){
         txtCrds.push(0, 0, 1, 0, 0, 1, 1, 1);
      }

      for (let i = 0; i < vertices.length / 3; i += 4) {
         idxs.push(
            i, i + 1, i + 2,
            i + 1, i + 2, i + 3,
         );
      }

      function makeFace(trans) {
         let baseFace = [
            [-1, 1, 1],
            [1, 1, 1],
            [-1, -1, 1],
            [1, -1, 1],
         ];
         let face = [];
         for (let f of baseFace) {
            vec3.transformMat4(f, f, trans);
            face.push(...f);
         }
         let norms = [];
         let n = vec3.create();
         vec3.transformMat4(n, [1, 0, 0], trans);
         for (let i = 0; i < 4; i++) {
            norms.push(...n);
         }
         return { verts: face, normals: norms };
      }
      
      this.positions = vertices;
      this.indices = idxs;
      this.properties['texCoord'] = super.setProperty(txtCrds, gl.FLOAT, 2);
      
      if (!(this instanceof SkyBox)) {         
         this.properties['vertNormal'] = super.setProperty(norms, gl.FLOAT, 3);
         this.properties['vertTangent'] = super.setProperty(tangs, gl.FLOAT, 3);
         super.makeVBOs(gl);
      }
   }
}

class SkyBox extends Cube {
   constructor(gl, texture) {
      super(gl, texture);

      // Attribute names
      const attNames = ['vertPos', 'texCoord'];

      // Uniform names
      const ufmNames = ['mvMatrix', 'prjMatrix', 'tex'];

      this.program = new ShaderProgram(gl, ShaderProgram.getSource('SkyBoxVrtShader.glsl'), ShaderProgram.getSource('SkyBoxFrgShader.glsl'), attNames, ufmNames);

      var txtCrds = [];

      txtCrds.push(
         // F1
         0, 0.34,
         0.25, 0.34,
         0, 0.66,
         0.25, 0.66,

         // F2
         0.25, 0.34,
         0.5, 0.34,
         0.25, 0.66,
         0.5, 0.66,

         // F3
         0.5,0.34,
         0.75,0.34,
         0.5, 0.66,
         0.75, 0.66,

         // F4
         0.75, 0.34,
         1, 0.34,
         0.75, 0.66,
         1, 0.66,

         // F5
         0.5, 0,
         0.5, 0.34,
         0.25, 0,
         0.25, 0.34,

         // F6
         0.25, 1,
         0.25, 0.66,
         0.5, 1,
         0.5, 0.66,
      );

      this.properties['texCoord'].vals = txtCrds;

      super.makeVBOs(gl);
   }
   
   render(time, gl, program, transform) {
      gl.disable(gl.DEPTH_TEST);
      super.render(time, gl, this.program, transform);
      gl.enable(gl.DEPTH_TEST);
   }
}