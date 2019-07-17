class Cube extends LeafModel {
   constructor(gl, texture) {
      super(texture);
      
      var vertices = [], norms = [], idxs = [], txtCrds = [];

      let F1 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), 0));
      let F2 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), Math.PI / 2));
      let F3 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), Math.PI))
      let F4 = makeFace(mat4.rotateY(mat4.create(), mat4.create(), 3 * Math.PI / 2));
      let F5 = makeFace(mat4.rotateZ(mat4.create(), mat4.create(), Math.PI / 2));
      let F6 = makeFace(mat4.rotateZ(mat4.create(), mat4.create(), - Math.PI / 2));
      vertices.push(...F1.verts, ...F2.verts, ...F3.verts, ...F4.verts, ...F5.verts, ...F6.verts);
      norms.push(...F1.normals, ...F2.normals, ...F3.normals, ...F4.normals, ...F5.normals, ...F6.normals);

      for (let i = 0; i < 6; i ++){
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
            [1, 1, 1],
            [1, 1, -1],
            [1, -1, 1],
            [1, -1, -1]
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

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         texCoords: txtCrds,
         indices: idxs,
      };

      super.makeVBOs(gl);
   }
}