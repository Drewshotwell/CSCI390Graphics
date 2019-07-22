class Camera extends LeafModel {
   constructor(trans) {
      super(null);
      this.trans = mat4.create();
   }

   render(time, gl, program, transform) {
      console.log(mat4.str(transform));
   }

   getCameraXfm() {
      return this.trans;
   }

   transform(newTrans) {
      this.trans = newTrans;
   }
}