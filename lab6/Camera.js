class Camera extends LeafModel {
   constructor() {
      super(null);
   }

   render(time, gl, program, transFtn) {}

   getCameraXfm() {
      return mat4.create();
   }
}