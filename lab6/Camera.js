class Camera extends LeafModel {
   constructor(trans) {
      super(null);
      this.trans = mat4.create();
   }

   render(time, gl, program, transform) {}

   getCameraXfm() {
      return this.trans;
   }

   transform(newTrans) {
      this.trans = newTrans;
   }
}