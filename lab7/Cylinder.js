class Cylinder extends LeafModel {
   constructor(gl, texture, sMult, tMult) {
      super(texture);

      var vertices = [], norms = [], txtCrds = [];

      /*** Vertices, Texture Coordinates, and Normals ****/
      // Top face
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), 1, Math.sin(2 * Math.PI * (vdx / 60)));
         txtCrds.push(0.5*(Math.cos(2 * Math.PI * (vdx / 60)) + 1)* sMult, 0.5*(Math.sin(2 * Math.PI * (vdx / 60)) + 1)* tMult);
         norms.push(0, 1, 0);
      }
      // Top Band
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), 1, Math.sin(2 * Math.PI * (vdx / 60)));
         txtCrds.push((vdx / 60)* sMult, 0* tMult);
         norms.push(Math.cos(2 * Math.PI * (vdx / 60)), 0, Math.sin(2 * Math.PI * (vdx / 60)));
      }
      vertices.push(1, 1, 0);
      txtCrds.push(1* sMult, 0* tMult);
      norms.push(1, 0, 0);
      // Lower band
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), -1, Math.sin(2 * Math.PI * (vdx / 60)));
         txtCrds.push((vdx / 60)* sMult, 1* tMult);
         norms.push(Math.cos(2 * Math.PI * (vdx / 60)), 0, Math.sin(2 * Math.PI * (vdx / 60)));
      }
      vertices.push(1, -1, 0);
      txtCrds.push(1* sMult, 1* tMult);
      norms.push(1, 0, 0);
      // Bottom Face
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), -1, Math.sin(2 * Math.PI * (vdx / 60)));
         txtCrds.push(0.5*(Math.cos(2 * Math.PI * (vdx / 60)) + 1)* sMult, 0.5*(Math.sin(2 * Math.PI * (vdx / 60)) + 1)* tMult);
         norms.push(0, -1, 0);
      }
      // Poles
      vertices.push(
         0, 1, 0,
         0, -1, 0);
      norms.push(
         0, 1, 0,
         0, -1, 0);
      txtCrds.push(
         0.5* sMult, 0.5* tMult,
         0.5* sMult, 0.5* tMult);      

      /*** Indices ****/
      var idxs = [];
      // Top Face
      for (let i = 0; i < 60; i++) {
         idxs.push(i, vertices.length / 3 - 2, (i + 1) % 60);
      }
      // Middle Band (2 triangles for each face)
      for (let i = 0; i < 60; i++) {
         idxs.push(
            i + 60, (i + 1) + 60, i + 121,
            (i + 1) + 60, i + 121, (i + 1) + 121);
      }
      // Bottom Face
      for (let i = 0; i < 60; i++) {
         idxs.push(i + 182, vertices.length / 3 - 1, ((i + 1) % 60) + 182);
      }

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
         texCoords: txtCrds,
      };

      super.makeVBOs(gl);
   }
}