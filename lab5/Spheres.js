class BandedSphere extends LeafModel {
   constructor(gl, texture, latNum, longNum) {
      super(texture);
      this.latNum = latNum;
      this.longNum = longNum;
      this.makeModel();
      super.makeVBOs(gl);
   }

   makeModel() {
      var vertices = [], norms = [];
      var idxs = [];
      var txtCrds = [];

      const latN = this.latNum;
      const longN = this.longNum;
      for (let latK = 1; latK < latN; latK++) {
         for (let longK = 0; longK <= longN; longK++) {

            const long = -Math.PI + 2 * Math.PI * longK / longN;
            const lat = -Math.PI / 2 + Math.PI * latK / latN;

            const theta = long;
            const phi = lat + Math.PI / 2

            vertices.push(
               Math.sin(phi) * Math.cos(theta),
               Math.cos(phi),
               Math.sin(phi) * Math.sin(theta),
            );
            txtCrds.push(
               1 - longK / longN,
               1 - 0.5*(Math.cos(phi) + 1),
            );
         }
      }

      vertices.push(
         0, 1, 0,
         0, -1, 0
      );
      txtCrds.push(
         0.5, 0,
         0.5, 1,
      );

      // Non-polar sphere
      for (let latdx = 0; latdx < latN - 2; latdx++) {
         for (let longdx = 0; longdx < longN; longdx++) {
            idxs.push(
               latdx * (longN + 1) + longdx, latdx * (longN + 1) + (longdx + 1), (latdx + 1) * (longN + 1) + longdx,
               latdx * (longN + 1) + (longdx + 1), (latdx + 1) * (longN + 1) + longdx, (latdx + 1) * (longN + 1) + (longdx + 1)
            );
         }
      }

      // Poles
      for (let poldx = 0; poldx < longN; poldx++) {
         idxs.push(
            vertices.length / 3 - 2, poldx, (poldx + 1) % longN,
            vertices.length / 3 - 1, (latN - 2) * (longN + 1) + poldx, (latN - 2) * (longN + 1) + ((poldx + 1) % longN)
         );
      }
      
      norms = vertices;

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
         texCoords: txtCrds,
      }
   }
}