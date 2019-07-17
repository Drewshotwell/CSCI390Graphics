class Light {
   constructor(ambient, diffuse, specular, position) {
      this.ambient = ambient;
      this.diffuse = diffuse;
      this.specular = specular;
      this.position = position;
   }

   static stdLight = new Light(
      [0.0, 0.0, 0.0, 1.0],
      [1.0, 1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0, 1.0],
      [0, 0, 10]);

   setUniform(program, name) {
      program.use();
      program.uniform4fv(program.uniformLocations['light.ambient'], name.ambient);
      program.uniform4fv(program.uniformLocations['light.diffuse'], name.diffuse);
      program.uniform4fv(program.uniformLocations['light.specular'], name.specular);
      program.uniform3fv(program.uniformLocations['light.position'], name.position);
   }
}