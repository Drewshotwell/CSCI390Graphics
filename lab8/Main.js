main();

function main() {
   var scene = new THREE.Scene();

   var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
   camera.position.z = 10;

   var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
   renderer.setClearColor("#e5e5e5");
   renderer.setSize(window.innerWidth, window.innerHeight);

   document.body.appendChild(renderer.domElement);

   const skyTex = new THREE.CubeTextureLoader()
      .setPath('fadeaway/')
      .load([
         'fadeaway_lf.png',
         'fadeaway_rt.png',
         'fadeaway_up.png',
         'fadeaway_dn.png',
         'fadeaway_ft.png',
         'fadeaway_bk.png',
      ]);
   scene.background = skyTex;

   window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();
   });

   const textureLoader = new THREE.TextureLoader().setPath('Brickwall/');
   const map = textureLoader.load('Brick_Wall_011_COLOR.jpg');
   const displacementMap = textureLoader.load('Brick_Wall_011_DISP.png');
   const normalMap = textureLoader.load('Brick_Wall_011_NORM.jpg');
   const aoMap = textureLoader.load('Brick_Wall_011_OCC.jpg');
   const specularMap = textureLoader.load('Brick_Wall_011_ROUGH.jpg');

   var geometry = new THREE.SphereGeometry(1, 100, 100);

   var stdMat = new THREE.MeshPhongMaterial({ map });
   var bMat = new THREE.MeshPhongMaterial({ map, normalMap});
   var bdMat = new THREE.MeshPhongMaterial({ map, normalMap, displacementMap, displacementScale: 0.1, });
   var bdsMat = new THREE.MeshPhongMaterial({ map, normalMap, displacementMap, displacementScale: 0.1, specularMap });
   var bdsoMat = new THREE.MeshPhongMaterial({ map, normalMap, displacementMap, displacementScale: 0.1, specularMap, aoMap });

   var stdSphere = new THREE.Mesh(geometry, stdMat);
   stdSphere.position.set(-4, 0, 0);
   var bSphere = new THREE.Mesh(geometry, bMat);
   bSphere.position.set(-2, 0, 0);
   var bdSphere = new THREE.Mesh(geometry, bdMat);
   bdSphere.position.set(0, 0, 0);
   var bdsSphere = new THREE.Mesh(geometry, bdsMat);
   bdsSphere.position.set(2, 0, 0);
   var bdsoSphere = new THREE.Mesh(geometry, bdsoMat);
   bdsoSphere.position.set(4, 0, 0);

  scene.add(stdSphere, bSphere, bdSphere, bdsSphere, bdsoSphere);

   var light = new THREE.PointLight(0xFFFFFF, 1, 100);
   light.position.set(1, 0, 0);
   scene.add(light);
   
   var rotateYAxis = new THREE.Vector3(0, 1, 0);
   document.addEventListener('keydown', (event) => {
      switch (event.code) {
         case 'ArrowLeft':
            camera.rotateOnAxis(rotateYAxis, Math.PI / 20);
            break;
         case 'ArrowRight':
            camera.rotateOnAxis(rotateYAxis, -Math.PI / 20);
            break;
         case 'ArrowUp':
            camera.rotateX(Math.PI / 20);
            rotateYAxis.applyMatrix4(new THREE.Matrix4().getInverse(new THREE.Matrix4().makeRotationX(Math.PI / 20)));
            break;
         case 'ArrowDown': 
            camera.rotateX(-Math.PI / 20);
            rotateYAxis.applyMatrix4(new THREE.Matrix4().getInverse(new THREE.Matrix4().makeRotationX(-Math.PI / 20)));
            break;
         case 'KeyA':
            camera.translateZ(-1);  
            break;
         case 'KeyS':
            camera.translateZ(1);
            break;
      }  
   });

   var theta = 0;
   const lightRadius = 15;
   function render () {
      requestAnimationFrame(render);
      light.position.set(lightRadius * Math.cos(theta), 0, lightRadius * Math.sin(theta));
      theta += Math.PI / 1000;
      renderer.render(scene, camera);
   }

   render();
}