class Octahedron extends LeafModel {
   constructor(gl, material) {
      super(material);
      this.makeModel();
      super.makeVBOs(gl);
   }

   makeModel() {
      var vertices = [], norms = [];
      var idxs = [];

      vertices.push(
         1, 0, 1,  // 0
         -1, 0, 1, // 1
         -1, 0, -1,// 2
         1, 0, -1, // 3 
         0, 1, 0,  // 4
         0, -1, 0  // 5
      );
      norms = vertices;

      idxs.push(
         0, 4, 1,
         1, 4, 2,
         2, 4, 3,
         3, 4, 0,
         0, 5, 1,
         1, 5, 2,
         2, 5, 3,
         3, 5, 0,
      );

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
      }
   }
}