main();

function main() {
   //var lat = 38.948 * Math.PI / 180, lng = -90.351 * Math.PI / 180;
   //var r = 6500;

   const trans = mat4.create();
   mat4.translate(trans, trans, [0, 0, -2]);
   mat4.rotateZ(trans, trans, -Math.PI / 2)
   mat4.scale(trans, trans, [1, 3, 1]);

   var pole1 = [0, 1, 0, 1];
   var pole2 = [0, -1, 0, 1];

   console.log(vec4.str(vec4.transformMat4(pole1, pole1, trans)));
   console.log(vec4.str(vec4.transformMat4(pole2, pole2, trans)));

   //console.log(lat, lng);
   //console.log(vec3.str(vec3.transformMat4(vec3.create(), [r, 0, 0], mat4.rotateY(mat4.create(), mat4.fromRotateZ(mat4.create(), mat4.create(), -lat), lng))));
}
