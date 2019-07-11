class Octahedron extends LeafModel {
   constructor(gl, material, divN) {
      super(material);
      this.makeModel();
      super.subdivide(divN, function (v1, v2) {
         const midVec = vec3.create();
         vec3.add(midVec, v1, v2);
         vec3.scale(midVec, midVec, 0.5);
         return vec3.normalize(midVec, midVec);;
      });
      super.makeVBOs(gl);
   }

   makeModel() {
      var vertices = [], norms = [];
      var idxs = [];

      const rad = 1 / Math.sqrt(2);
      vertices.push(
         rad, 0, rad,  // 0
         -rad, 0, rad, // 1
         -rad, 0, -rad,// 2
         rad, 0, -rad, // 3 
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

class Icosahedron extends LeafModel {
   constructor(gl, material, divN) {
      super(material);
      this.makeModel();
      super.subdivide(divN, function (v1, v2) {
         const midVec = vec3.create();
         vec3.add(midVec, v1, v2);
         vec3.scale(midVec, midVec, 0.5);
         vec3.normalize(midVec, midVec);
         return midVec;
      });
      super.makeVBOs(gl);
   }

   makeModel() {
      const vertices = [];
      for (var k = 0; k < 10; k++) {
         vertices.push(
            Math.sin(Math.PI / 2 - Math.tan(1 / 2)) * Math.cos(k * 0.628318530717959),
            Math.pow(-1, k) * Math.cos(Math.PI / 2 - Math.tan(1 / 2)),
            Math.sin(Math.PI / 2 - Math.tan(1 / 2)) * Math.sin(k * 0.628318530717959),
         );
      }
      vertices.push(
         0, 1, 0,
         0, -1, 0);

      const idxs = [];
      for (var vdx = 0; vdx < 10; vdx++) {
         idxs.push(vdx % 10, (vdx + 1) % 10, (vdx + 2) % 10);
      }

      for (var vdx = 0; vdx < 5; vdx++) {
         idxs.push(10, (vdx * 2) % 10, ((vdx + 1) * 2) % 10);
         idxs.push(11, (1 + vdx * 2) % 10, (1 + (vdx + 1) * 2) % 10);
      }

      const norms = vertices;

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
      }
   }
}

class BandedSphere extends LeafModel {
   constructor(gl, material, latNum, longNum) {
      super(material);
      this.latNum = latNum;
      this.longNum = longNum;
      this.makeModel();
      super.makeVBOs(gl);
   }

   makeModel() {
      var vertices = [], norms = [];
      var idxs = [];

      const latN = this.latNum;
      const longN = this.longNum;
      for (let latK = 1; latK < latN; latK++) {
         for (let longK = 0; longK < longN; longK++) {

            const long = -Math.PI + longK * 2 * Math.PI / longN;
            const lat = -Math.PI / 2 + latK * Math.PI / latN;

            const phi = lat + Math.PI / 2
            const theta = long;

            vertices.push(
               Math.sin(phi) * Math.cos(theta),
               Math.cos(phi),
               Math.sin(phi) * Math.sin(theta),
            );
         }
      }

      vertices.push(
         0, 1, 0,
         0, -1, 0
      );

      // Non-polar sphere
      for (let latdx = 0; latdx < latN - 2; latdx++) {
         for (let longdx = 0; longdx < longN; longdx++) {
            idxs.push(
               latdx * longN + longdx, latdx * longN + ((longdx + 1) % longN), (latdx + 1) * longN + longdx,
               latdx * longN + ((longdx + 1) % longN), (latdx + 1) * longN + longdx, (latdx + 1) * longN + ((longdx + 1) % longN)
            );
         }
      }
      
      console.log(idxs.length / 3);

      // Poles
      for (let poldx = 0; poldx < longN; poldx++) {
      idxs.push(
         (latN - 1) * longN, poldx, (poldx + 1) % longN,
         (latN - 1) * longN + 1, (latN - 2) * longN + poldx, (latN - 2) * longN + (poldx + 1) % longN
         );
      }
         
      console.log(idxs.length / 3);
      console.log(2*longN*(latN -2) + 2*longN);
         
      norms = vertices;

      super.modelInfo = {
         positions: vertices,
         normals: norms,
         indices: idxs,
      }
   }
}