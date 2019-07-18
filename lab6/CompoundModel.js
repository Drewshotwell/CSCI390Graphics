class CompoundModel {
   constructor() {
      this.collection = [];
   }

   addChild(child, makeTransform) {
      this.collection.push({model: child, transform: makeTransform});
   }

   render(time, gl, prgInfo, transform) {
      for (let leaf of this.collection) {
         leaf.model.render(time, gl, prgInfo,
            function (time) {
               return mat4.multiply(mat4.create(), transform(time), leaf.transform(time));
            }
         );
      }
   }

   getCameraXfm(time) {
      for (let leaf of this.collection) {
         const camXfm = leaf.model.getCameraXfm();
         if (camXfm) { // Found a camera, begin multiplication string
            for (let subLeaf of this.collection) {
               mat4.multiply(camXfm, camXfm, subLeaf.transform(time));
            }
            return camXfm;
         }
      }
      return null;
   }
}

class TestAnimation extends CompoundModel {
   constructor(gl, texture) {
      super();
      
      super.addChild(new Camera(), function (time) {
         const trans = mat4.create();
         mat4.translate(trans, trans, [0, 0, 10]);
         return trans;
      });
      
      super.addChild(new Jack(gl, texture), function (time) {
         const trans = mat4.create();
         //mat4.rotateY(trans, trans, (Math.PI / 4) * time);
         return trans;
      });
   }
}