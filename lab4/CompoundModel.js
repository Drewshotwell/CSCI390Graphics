class CompoundModel {
   constructor() {
      this.collection = [];
   }

   addChild() {
      for (let i = 0; i < arguments.length; i += 2) {
         let child = arguments[i];
         let transform = arguments[i+1];
         this.collection.push([child, transform]);
      }
   }

   render(gl, prgInfo, transform) {
      for (let leaf of this.collection) {
         leaf[0].render(gl, prgInfo,
            mat4.multiply(mat4.create(), transform, leaf[1]));
      }
   }
}