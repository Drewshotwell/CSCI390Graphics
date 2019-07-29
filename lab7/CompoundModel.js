class CompoundModel {
   constructor() {
      this.collection = [];
      this.camera = null;
      this.skyBox = null;
   }

   addChild(child, makeTransform) {
      this.collection.push({model: child, transform: makeTransform});
   }

   render(time, gl, prgInfo, transform) {
      for (let leaf of this.collection) {
         if (leaf.model instanceof SkyBox) {
            const skyBoxTrans = Array.from(transform);
            skyBoxTrans.splice(12, 4, ...[0, 0, 0, 1]);
            leaf.model.render(time, gl, prgInfo,
               mat4.multiply(mat4.create(), skyBoxTrans, leaf.transform(time)));
         }
         else {
            leaf.model.render(time, gl, prgInfo,
               mat4.multiply(mat4.create(), transform, leaf.transform(time)));
         }
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
   constructor(gl) {
      super();
      
      const skyTex = new Texture(gl, 'Skybox.jpg', null, null, null, null, 0);
      const sphereTex1 = new Texture(gl, 'Brick_Wall_011_COLOR.jpg', null, null, null, null, 10);
      const sphereTex2 = new Texture(gl, 'Brick_Wall_011_COLOR.jpg', 'Brick_Wall_011_NORM.jpg', null, null, null, 10);
      const sphereTex3 = new Texture(gl, 'Brick_Wall_011_COLOR.jpg', 'Brick_Wall_011_NORM.jpg', 'Brick_Wall_011_DISP.png', null, null, 10);
      const sphereTex4 = new Texture(gl, 'Brick_Wall_011_COLOR.jpg', 'Brick_Wall_011_NORM.jpg', 'Brick_Wall_011_DISP.png', 'Brick_Wall_011_ROUGH.jpg', null, 10);
      const sphereTex5 = new Texture(gl, 'Brick_Wall_011_COLOR.jpg', 'Brick_Wall_011_NORM.jpg', 'Brick_Wall_011_DISP.png', 'Brick_Wall_011_ROUGH.jpg', 'Brick_Wall_011_OCC.jpg', 10);
      
      this.camera = {
         model: new Camera(),
         transform: time => mat4.fromTranslation(mat4.create(), [0, 0, 5])
      };

      this.skyBox = new SkyBox(gl, skyTex);
      /**
       * 1. Only diffuse texture
       * 2. Diffuse plus bump or normal mappings
       * 3. Diffuse plus bump plus displacement
       * 4. Diffuse plus bump plus displacement plus specular
       * 5. All five components, including ambient occlusion
       */
      const globe1 = new BandedSphere(gl, sphereTex1, 10, 20);
      const globe2 = new BandedSphere(gl, sphereTex2, 10, 20);
      const globe3 = new BandedSphere(gl, sphereTex3, 10, 20);
      const globe4 = new BandedSphere(gl, sphereTex4, 10, 20);
      const globe5 = new BandedSphere(gl, sphereTex5, 10, 20);
      
      const scene = new CompoundModel();
      scene.addChild(this.camera.model, this.camera.transform);
      scene.addChild(globe1, time => mat4.fromTranslation(mat4.create(), [-3, 0, 0]));
      scene.addChild(globe2, time => mat4.fromTranslation(mat4.create(), [-1.5, 0, 0]));
      scene.addChild(globe3, time => mat4.fromTranslation(mat4.create(), [0, 0, 0]));
      scene.addChild(globe4, time => mat4.fromTranslation(mat4.create(), [1.5, 0, 0]));
      scene.addChild(globe5, time => mat4.fromTranslation(mat4.create(), [3, 0, 0]));

      super.addChild(this.skyBox, time => mat4.create());
      super.addChild(scene, time => mat4.create());
   }
}