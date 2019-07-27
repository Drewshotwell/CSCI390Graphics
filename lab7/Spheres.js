class BandedSphere extends LeafModel {
   constructor(gl, texture, latN, longN) {
      super(texture);
      
      var vertices = [], norms = [], tangs = [];
      var idxs = [];
      var txtCrds = [];

      /*for (let longK = 0; longK <= longN; longK++) {
         for (let latK = 0; latK <= latN; latK++) {

            const long = -Math.PI + 2 * Math.PI * longK / longN;
            const lat = -Math.PI / 2 + Math.PI * latK / latN;

            const theta = long;
            const phi = lat + Math.PI / 2;

            vertices.push(
               Math.sin(phi) * Math.cos(theta),
               Math.cos(phi),
               Math.sin(phi) * Math.sin(theta),
            );

            //console.log(phi, theta,
               Math.sin(phi) * Math.cos(theta),
               Math.cos(phi),
               Math.sin(phi) * Math.sin(theta),
            //);
            txtCrds.push(
               1 - longK / longN,
               1 - 0.5 * (Math.cos(phi) + 1),
            );
         }
      }*/

      // Non-polar sphere
      /*for (let longdx = 0; longdx <= longN; longdx++) {
         for (let latdx = 0; latdx <= latN; latdx++) {
            idxs.push(
               longdx * (latN + 1) + latdx, longdx * (latN + 1) + (latdx + 1), (longdx + 1) * (latN + 1) + latdx,
               longdx * (latN + 1) + (latdx + 1), (longdx + 1) * (latN + 1) + latdx, (longdx + 1) * (latN + 1) + (latdx + 1),
            );
         }
      }*/

      // Poles
      /*for (let longdx = 0; longdx <= longN; longdx++) {
         idxs.push(
            longdx * latN, longdx * latN + 1, (longdx + 1) * latN + 1,
         );
      }*/

      //console.log(vertices);

      for (let latK = 1; latK < latN; latK++) {
         for (let longK = 0; longK <= longN; longK++) {

            const long = -Math.PI + 2 * Math.PI * longK / longN;
            const lat = -Math.PI / 2 + Math.PI * latK / latN;

            const theta = long;
            const phi = lat + Math.PI / 2;

            vertices.push(
               Math.sin(phi) * Math.cos(theta),
               Math.cos(phi),
               Math.sin(phi) * Math.sin(theta),
            );
            txtCrds.push(
               1 - longK / longN,
               1 - 0.5 * (Math.cos(phi) + 1),
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

      for (let i = 0; i < norms.length; i += 3) {
         const n = [norms[i], norms[i + 1], norms[i + 2]];
         if (n[0] == 0 && n[1] == 1 && n[2] == 0 || n[0] == 0 && n[1] == -1 && n[2] == 0) {
            tangs.push(0, 0, -1);
         }
         else {
            tangs.push(...vec3.cross(vec3.create(), [0, 1, 0], n));
         }
      }

      this.positions = vertices;
      this.indices = idxs;
      this.properties['vertNormal'] = super.setProperty(norms, gl.FLOAT, 3);
      this.properties['texCoord'] = super.setProperty(txtCrds, gl.FLOAT, 2);
      this.properties['vertTangent'] = super.setProperty(tangs, gl.FLOAT, 3);

      super.makeVBOs(gl);
   }
}