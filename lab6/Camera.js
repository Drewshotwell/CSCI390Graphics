class Camera extends LeafModel {
   constructor() {
      super(null);
   }

   render(time, gl, program, transFtn) {}

   getCameraXfm() {
      return time => mat4.create();
   }
}