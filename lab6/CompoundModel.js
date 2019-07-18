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

   getCameraXfm() {
      for (let leaf of this.collection) {
         const camXfm = leaf.model.getCameraXfm();
         if (camXfm) { // Found a camera, begin multiplication string
            const coll = this.collection;
            return function (time) {
               let trans = camXfm(time);
               console.log(coll);
               for (let subLeaf of coll) {
                  console.log(mat4.str(subLeaf.transform(time)));
                  mat4.multiply(trans, camXfm(time), subLeaf.transform(time));
               }
               return trans;
            }
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