class Landscape extends LeafModel {
   constructor(gl, textureAtlas, dim, regions) {
      super(textureAtlas);

      var vertices = [], idxs = [], txtCrds = [], norms = [];

      var anchorTex = [];
      for (let deltaZ = 0; deltaZ < 2; deltaZ++) {
         for (let deltaX = 0; deltaX < 2; deltaX++) {
            anchorTex.push(
               (0 + deltaX) / 8,
               (0 + deltaZ) / 4,
            );
         }
      }

      for (let zCoord = -2, modZ = 0; Math.abs(2 - zCoord) > 0.001; zCoord += 4 / dim, modZ = (modZ + 1) % 2) {
         for (let xCoord = -2, modX = 0; Math.abs(2 - xCoord) > 0.001; xCoord += 4 / dim, modX = (modX + 1) % 2) {
            vertices.push(
               xCoord, 0, zCoord,
               xCoord + 4 / dim, 0, zCoord,
               xCoord, 0, zCoord + 4 / dim,
               xCoord + 4 / dim, 0, zCoord + 4 / dim,
            );
            norms.push(
               0, 1, 0,
               0, 1, 0,
               0, 1, 0,
               0, 1, 0,
            );
            let newTxtCrd;
            for (let reg of regions) {
               // If in region, add texture
               if ((xCoord + 2) / 4 * dim >= reg.farLeft.x && (xCoord + 2) / 4 * dim <= reg.nearRight.x
                  && (zCoord + 2) / 4 * dim >= reg.farLeft.z && (zCoord + 2) / 4 * dim <= reg.nearRight.z) {
                  
                  // Initialize list
                  if (!newTxtCrd) newTxtCrd = [];

                  // Add texture coord per-vertex
                  for (let deltaZ = 0; deltaZ < 2; deltaZ++) {
                     for (let deltaX = 0; deltaX < 2; deltaX++) {
                        newTxtCrd.push(
                           (reg.tile.col + deltaX) / 8,
                           (reg.tile.row + deltaZ) / 4,
                        );
                     }
                  }
                  break;
               }
               // End texture-if
            }
            // Adding new texture coordinate
            let addCrd = newTxtCrd ? newTxtCrd : anchorTex;
            if (modZ == 0) {
               if (modX == 0) {
                  // no transform
                  txtCrds.push(...addCrd);
               }
               else {
                  // flipH
                  txtCrds.push(...flipH(addCrd));
               }
            }
            else {
               if (modX == 0) {
                  // flipV
                  txtCrds.push(...flipV(addCrd));
               }
               else {
                  // flipH & V
                  txtCrds.push(...flipH(flipV(addCrd)));
               }
            }
         }
      }

      function flipH(coords) {
         let newCoords = [];
         newCoords.push(
            coords[4], coords[5],
            coords[6], coords[7],
            coords[0], coords[1],
            coords[2], coords[3],
         );
         return newCoords;
      }

      function flipV(coords) {
         let newCoords = [];
         newCoords.push(
            coords[2], coords[3],
            coords[0], coords[1],
            coords[6], coords[7],
            coords[4], coords[5],
         );
         return newCoords;
      }

      for (let i = 0; i <= 4 * (dim*dim - 1); i += 4) {
         idxs.push(
            i, i + 1, i + 2,
            i + 1, i + 2, i + 3,
         );
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