class Texture {
   constructor(gl, diffuseURL, shininess, wrap, minFilter) {
      this.shininess = shininess;
      this.wrap = wrap;
      this.minFilter = minFilter;
      // Create a texture.
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      // Fill the texture with a 1x1 blue pixel.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
      
      // Asynchronously load an image
      var image = new Image();
      image.src = diffuseURL;
      image.addEventListener('load', function() {
         // Now that the image has loaded make copy it to the texture.
         gl.bindTexture(gl.TEXTURE_2D, texture);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
         if (this.wrap) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
         }
         else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         }
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[`${minFilter}`]);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.generateMipmap(gl.TEXTURE_2D);
      });
      this.glTexture = texture;
   }
   
   setUniform(gl, program, name) {
      program.use();
      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);
      if (this.wrap) {
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      }
      else {
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[`${this.minFilter}`]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
      // Tell the shader we bound the texture to texture unit
      program.uniform1i(program.uniformLocations[`${name}.diffuse`], 0);
      program.uniform1f(program.uniformLocations[`${name}.shininess`], this.shininess);
   }
}