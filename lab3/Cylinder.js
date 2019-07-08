class Cylinder extends LeafModel {
   constructor(gl, material) {
      super(material);
      this.makeModel(gl);
      super.makeVBOs(gl);
   }

   makeModel(gl) {
      var vertices = [], norms = [], faceColors = [];

      /*** Vertices, Normals, and Colors ****/
      // Top face
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), 1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(0, 1, 0);
         faceColors.push(1, 0, 0, 1);
      }
      // Middle Band
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), 1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(Math.cos(2 * Math.PI * (vdx / 60)), 0, Math.sin(2 * Math.PI * (vdx / 60)));
         faceColors.push(1, 1, 1, 1);
      }
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), -1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(Math.cos(2 * Math.PI * (vdx / 60)), 0, Math.sin(2 * Math.PI * (vdx / 60)));
         faceColors.push(1, 1, 1, 1);
      }
      // Bottom Face
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), -1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(0, -1, 0);
         faceColors.push(1, 0, 0, 1);
      }
      // Poles
      vertices.push(0, 1, 0,
         0, -1, 0);
      norms.push(0, 1, 0,
         0, -1, 0);
      faceColors.push(1, 0, 0, 1,
         1, 0, 0, 1);

      /*** Indices ****/
      var idxs = [];
      // Top Face
      for (let i = 0; i < 60; i++) {
         idxs.push(i, 240, (i + 1) % 60);
      }
      // Middle Band (2 triangles for each face)
      for (let i = 0; i < 60; i++) {
         idxs.push(
            i + 60, ((i + 1) % 60) + 60, i + 120,
            ((i + 1) % 60) + 60, i + 120, ((i + 1) % 60) + 120);
      }
      // Bottom Face
      for (let i = 0; i < 60; i++) {
         idxs.push(i + 180, 241, ((i + 1) % 60) + 180);
      };

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
         properties: {
            color: {
               vals: faceColors,
               type: gl.FLOAT,
               numComponents: 4,
            },
         },
      };
   }
}

function computeColor(x, y, z) {
   var r, g, b;

   r = (x + 1) / 2;
   g = (y + 1) / 2;
   b = (z + 1) / 2;

   return [r, g, b, 1.0];
}