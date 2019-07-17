class Light {
   constructor(diffuse, specular, position) {
      this.diffuse = diffuse;
      this.specular = specular;
      this.position = position;
   }

   static stdLight = new Light(
      [1.0, 1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0, 1.0],
      [0, 0, 10]);

   setUniform(program, name) {
      program.use();
      program.uniform4fv(program.uniformLocations[`${name}.diffuse`], this.diffuse);
      program.uniform4fv(program.uniformLocations[`${name}.specular`], this.specular);
      program.uniform3fv(program.uniformLocations[`${name}.position`], this.position);
   }
}