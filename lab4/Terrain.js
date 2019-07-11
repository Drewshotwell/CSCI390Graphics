class Terrain extends LeafModel {
   constructor(gl, material, divN) {
      super(material);
      this.makeModel();
      super.subdivide(divN, function (v1, v2) {
         const midVec = vec3.create();
         vec3.add(midVec, v1, v2);
         vec3.scale(midVec, midVec, 0.5);
         const scaleFactor = 0.25*vec3.distance(v1, v2);
         vec3.add(midVec, midVec, [0, 2*scaleFactor*(Math.random() - 0.5), 0]);
         return midVec;
      });
      super.makeVBOs(gl);
   }

   makeModel() {
      var vertices = [], norms = [];
      var idxs = [];

      vertices.push(
         5, 0, 0, // 0
         0, 0, 5, // 1
         -5, 0, 0,// 2
         0, 0, -5,// 3
         0, 1, 0  // 4
      );
      norms = vertices;

      idxs.push(
         0, 4, 1,
         1, 4, 2,
         2, 4, 3,
         3, 4, 0,
      );

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
      }
   }
}