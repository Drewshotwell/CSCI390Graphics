class Camera extends LeafModel {
   constructor(trans) {
      super(null);
      this.trans = mat4.create();

      var cameraTransforms = {
         theta: 0,
         phi: 0,
         distance: 0
      };

      document.addEventListener('keydown', (event) => {
         switch (event.code) {
            case 'ArrowLeft':
               if (!event.shiftKey);
                  cameraTransforms.theta -= Math.PI / 10;
               break;
            case 'ArrowRight':
               if (!event.shiftKey);
                  cameraTransforms.theta += Math.PI / 10;
               break;
            case 'ArrowUp':
               if (!event.shiftKey);
                  cameraTransforms.phi = cameraTransforms.phi < Math.PI / 2 ?
                     cameraTransforms.phi + Math.PI / 10 : Math.PI / 2;
               break;
            case 'ArrowDown':
               if (!event.shiftKey);
                  cameraTransforms.phi = cameraTransforms.phi > -Math.PI / 2 ?
                     cameraTransforms.phi - Math.PI / 10 : -Math.PI / 2;
               break;
            case 'KeyA':
               if (!event.shiftKey);
                  cameraTransforms.distance--;
               break;
            case 'KeyS':
               if (!event.shiftKey);
                  cameraTransforms.distance++;
               break;
         }
         
         let camTrans = mat4.create();
         mat4.translate(camTrans, camTrans, [0, 0, cameraTransforms.distance]);
         mat4.rotateX(camTrans, camTrans, cameraTransforms.phi);
         mat4.rotateY(camTrans, camTrans, -cameraTransforms.theta);

         this.transform = camTrans;
      });
   
   }

   render(time, gl, program, transform) {}

   getCameraXfm() {
      return this.trans;
   }

   set transform(newTrans) {
      this.trans = newTrans;
   }
}

