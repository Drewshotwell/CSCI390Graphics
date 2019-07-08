class Jack extends CompoundModel {
   constructor(gl) {
      super();

      const bar = new Cylinder(gl);

      const xTrans = mat4.create();
      const yTrans = mat4.create();
      const zTrans = mat4.create();

      mat4.scale(xTrans, xTrans, [0.2, 1, 0.2]);

      mat4.rotateZ(yTrans, yTrans, Math.PI / 2);
      mat4.scale(yTrans, yTrans, [0.2, 1, 0.2]);

      mat4.rotateX(zTrans, zTrans, Math.PI / 2);
      mat4.scale(zTrans, zTrans, [0.2, 1, 0.2]);

      super.addChild(bar, xTrans);
      super.addChild(bar, yTrans);
      super.addChild(bar, zTrans);
   }
}

class JackStack extends CompoundModel {
   constructor(gl, rot) {
      super();

      const jack = new Jack(gl);

      const trans1 = mat4.create();
      const trans2 = mat4.create();
      const trans3 = mat4.create();

      mat4.translate(trans1, trans1, [0, -2, 0]);
      mat4.rotateY(trans1, trans1, rot);

      mat4.rotateY(trans2, trans2, 2 * rot);

      mat4.translate(trans3, trans3, [0, 2, 0]);
      mat4.rotateY(trans3, trans3, 3 * rot);

      super.addChild(jack, trans1);
      super.addChild(jack, trans2);
      super.addChild(jack, trans3);
   }
}

class JackStackAttack extends CompoundModel {
   constructor(gl) {
      super();

      const jackStack1 = new JackStack(gl, 120 * Math.PI / 180);
      const jackStack2 = new JackStack(gl, 90 * Math.PI / 180);
      const jackStack3 = new JackStack(gl, 30 * Math.PI / 180);

      const trans1 = mat4.create();
      const trans2 = mat4.create();
      const trans3 = mat4.create();

      mat4.translate(trans1, trans1, [-2, 0, 0]);
      mat4.translate(trans3, trans3, [2, 0, 0]);

      mat4.scale(trans1, trans1, [0.5, 0.5, 0.5]);
      mat4.scale(trans3, trans3, [0.5, 0.5, 0.5]);

      super.addChild(jackStack1, trans1);
      super.addChild(jackStack2, trans2);
      super.addChild(jackStack3, trans3);
   }
}