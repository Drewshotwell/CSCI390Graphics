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
            mat4.multiply(mat4.create(), transform, leaf.transform(time)));
      }
   }

   getCameraXfm(time) {
      for (let leaf of this.collection) {
         const curTrans = leaf.transform(time);
         const cameraXfm = leaf.model.getCameraXfm(time);
         if (cameraXfm) {
            return mat4.multiply(mat4.create(), curTrans, cameraXfm);
         }
      }
      return null;
   }
}

class TestAnimation extends CompoundModel {
   constructor(gl, texture) {
      super();
      
      const jsa = new JackStackAttack(gl, texture);

      const pivotJack = jsa.collection[1].model.collection[1].model;

      this.camera = {
         model: new Camera(),
         transform: (time) => mat4.translate(mat4.create(), mat4.create(), [0, 0, 5])
      };

      pivotJack.addChild(this.camera.model, this.camera.transform);

      super.addChild(jsa, function (time) {
         return mat4.create();
      });
   }
}