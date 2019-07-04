class Cylinder extends LeafModel {
   constructor(gl) {
      super();
      this.makeModel(gl);
      super.makeVBOs(gl);
   }

   makeModel(gl) {
      var vertices = [], norms = [], faceColors = [], consoleColors = [];
      /*** Vertices and Normals ****/
      // Top face
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), 1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(0, 1, 0);
      }

      // Middle Band
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), 1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(Math.cos(2 * Math.PI * (vdx / 60)), 0, Math.sin(2 * Math.PI * (vdx / 60)));
      }
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), -1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(Math.cos(2 * Math.PI * (vdx / 60)), 0, Math.sin(2 * Math.PI * (vdx / 60)));
      }

      // Bottom Face
      for (let vdx = 0; vdx < 60; vdx++) {
         vertices.push(Math.cos(2 * Math.PI * (vdx / 60)), -1, Math.sin(2 * Math.PI * (vdx / 60)));
         norms.push(0, -1, 0);
      }

      // Poles
      vertices.push(0, 1, 0,
                    0, -1, 0);
      norms.push(0, 1, 0,
                 0, -1, 0);

      /*** Indices and Colors ****/
      var idxs = [];
      // Top Face
      for (let i = 0; i < 60; i++) {
         idxs.push(
            i % 60, 240, (i + 1) % 60);
         for (let j = 0; j < 3; j++) {
            faceColors.push(1, 0, 0, 1);
         } 
         consoleColors.push([1, 0, 0, 1]);
         
      }

      // Middle Band (2 triangles for each face)
      for (let i = 0; i < 60; i++) {
         idxs.push(
            (i % 60) + 60, ((i + 1) % 60) + 60, (i % 60) + 120,
            ((i + 1) % 60) + 60, (i % 60) + 120, ((i + 1) % 60) + 120);
         for (let j = 0; j < 6; j++) {
            faceColors.push(1, 1, 1, 1);
         }
         consoleColors.push([1, 1, 1, 1], [1, 1, 1, 1]);
      }

      // Bottom Face
      for (let i = 0; i < 60; i++) {
         idxs.push(
            (i % 60) + 180, 241, ((i + 1) % 60) + 180);
         for (let j = 0; j < 3; j++) {
            faceColors.push(1, 0, 0, 1);
         }
         consoleColors.push([1, 0, 0, 1]);
      };
      
      console.log(vertices);
      console.log(idxs);
      console.log(consoleColors);
      console.log(faceColors);

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