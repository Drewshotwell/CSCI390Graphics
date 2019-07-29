class Camera extends LeafModel {
   constructor() {
      super(null);
      this.trans = mat4.create();
      const self = this;
      const camTrans = mat4.create();

      var rotateYAxis = [0, 1, 0];

      document.addEventListener('keydown', (event) => {
         if (!event.shiftKey) {
            switch (event.code) {
               case 'ArrowLeft':
                  mat4.rotate(camTrans, camTrans, Math.PI / 20, rotateYAxis);
                  break;
               case 'ArrowRight':
                  mat4.rotate(camTrans, camTrans, -Math.PI / 20, rotateYAxis);
                  break;
               case 'ArrowUp':
                  mat4.rotateX(camTrans, camTrans, Math.PI / 20);
                  vec3.transformMat4(rotateYAxis, rotateYAxis, mat4.invert(mat4.create(), mat4.fromXRotation(mat4.create(), Math.PI / 20)));
                  break;
               case 'ArrowDown':
                  mat4.rotateX(camTrans, camTrans, -Math.PI / 20);
                  vec3.transformMat4(rotateYAxis, rotateYAxis, mat4.invert(mat4.create(), mat4.fromXRotation(mat4.create(), -Math.PI / 20)));
                  break;
               case 'KeyA':
                  mat4.translate(camTrans, camTrans, [0, 0, -0.2]);
                  break;
               case 'KeyS':
                  mat4.translate(camTrans, camTrans, [0, 0, 0.2]);
                  break;
            }
         }

         self.trans = camTrans;
      });
   
   }

   render(time, gl, program, transform) {}

   getCameraXfm() {
      return this.trans;
   }
}

