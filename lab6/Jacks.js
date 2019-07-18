class Jack extends CompoundModel {
   constructor(gl, texture) {
      super();

      const bar = new Cylinder(gl, texture, 1, 1);

      const transFtn1 = function (time) {
         const trans = mat4.create();
         mat4.scale(trans, trans, [0.2, 1, 0.2]);
         return trans;
      }
      const transFtn2 = function (time) {
         const trans = mat4.create();
         mat4.rotateZ(trans, trans, Math.PI / 2);
         mat4.scale(trans, trans, [0.2, 1, 0.2]);
         return trans;
      }
      const transFtn3 = function (time) {
         const trans = mat4.create();
         mat4.rotateX(trans, trans, Math.PI / 2);
         mat4.scale(trans, trans, [0.2, 1, 0.2]);
         return trans;
      }

      super.addChild(bar, transFtn1);
      super.addChild(bar, transFtn2);
      super.addChild(bar, transFtn3);
   }
}

class JackStack extends CompoundModel {
   constructor(gl, [rot1, rot2, rot3], texture) {
      super();

      const jack = new Jack(gl, texture);
      
      var transFtn1 = function(time) {
         const trans1 = mat4.create();
         mat4.translate(trans1, trans1, [0, -2, 0]);
         mat4.rotateY(trans1, trans1, rot1*time);
         return trans1;
      }
      
      var transFtn2 = function(time) {
         const trans2 = mat4.create();
         mat4.translate(trans2, trans2, [0, 0, 0]);
         mat4.rotateY(trans2, trans2, rot2*time);
         return trans2;
      }
      
      var transFtn3 = function(time) {
         const trans3 = mat4.create();
         mat4.translate(trans3, trans3, [0, 2, 0]);
         mat4.rotateY(trans3, trans3, rot3*time);
         return trans3;
      }

      super.addChild(jack, transFtn1);
      super.addChild(jack, transFtn2);
      super.addChild(jack, transFtn3);
   }
}

class JackStackAttack extends CompoundModel {
   constructor(gl, texture) {
      super();

      const jackStack1 = new JackStack(gl, [Math.PI / 3, -Math.PI / 3, Math.PI / 4], texture);
      const jackStack2 = new JackStack(gl, [Math.PI / 3, -Math.PI / 3, Math.PI / 4], texture);
      const jackStack3 = new JackStack(gl, [Math.PI / 3, -Math.PI / 3, Math.PI / 4], texture);

      const transFtn1 = function (time) {
         const trans = mat4.create();
         mat4.rotateY(trans, trans, time);
         mat4.translate(trans, trans, [-2 - 0.1*time, 0, 0]);
         mat4.scale(trans, trans, [0.5, 0.5, 0.5]);
         return trans;
      }
      const transFtn2 = function (time) {
         return mat4.create();
      }
      const transFtn3 = function (time) {
         const trans = mat4.create();
         mat4.rotateY(trans, trans, time);
         mat4.translate(trans, trans, [2 + 0.1 * time, 0, 0]);
         mat4.scale(trans, trans, [0.5, 0.5, 0.5]);
         return trans;
      }

      super.addChild(jackStack1, transFtn1);
      super.addChild(jackStack2, transFtn2);
      super.addChild(jackStack3, transFtn3);
   }
}