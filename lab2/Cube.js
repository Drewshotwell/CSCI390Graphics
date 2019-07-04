class CubeModel extends LeafModel {
   constructor(gl) {
      super();
      this.makeModel(gl);
      super.makeVBOs(gl);
   }

   makeModel(gl) {
      var vertices = [], vertexColors = [];
      for (var z = 1; z >= -1; z -= 2) {
         for (var y = 1; y >= -1; y -= 2) {
            for (var x = 1; x >= -1; x -= 2) {
               vertices.push(x, y, z);
               vertexColors.push(...computeColor(x, y, z));
            }
         }
      }

      const idxs = [
         0, 1, 3, 0, 3, 2,
         0, 2, 6, 0, 6, 4,
         6, 4, 5, 6, 5, 7,
         7, 3, 1, 7, 1, 5,
         1, 0, 4, 1, 4, 5,
         3, 2, 6, 3, 6, 7,
      ];

      super.modelInfo = {
         positions: vertices,
         //posBuf: positionBuffer,
         indices: idxs,
         //indexBuf: indexBuffer,
         properties: {
            color: {
               vals: vertexColors,
               //buf: colorBuffer,
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