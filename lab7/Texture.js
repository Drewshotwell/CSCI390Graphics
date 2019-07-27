class Texture {
   constructor(gl, diffuseURL, bumpURL, heightURL, roughURL, occURL, maxHeight) {
      this.gl = gl;
      this.diffuseURL = diffuseURL;
      this.bumpURL = bumpURL;
      this.maxHeight = maxHeight;
      this.roughURL = roughURL;
      this.occURL = occURL; 

      function generateTextureAsync(gl, url) {
         // Create diffuse texture.
         var texture = gl.createTexture();
         gl.bindTexture(gl.TEXTURE_2D, texture);
         
         // Fill the texture with a 1x1 blue pixel.
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                     new Uint8Array([0, 0, 255, 255]));
         
         // Asynchronously load an image
         var image = new Image();
         if (url) {
            image.src = url
            image.addEventListener('load', function () {
               gl.bindTexture(gl.TEXTURE_2D, texture);
               gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
               gl.generateMipmap(gl.TEXTURE_2D);
            });
            return texture;
         }
         else {
            // Fill the texture with a 1x1 white pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                        new Uint8Array([255, 255, 255, 255]));
            return texture;
         }
      }

      this.diffuseTexture = generateTextureAsync(gl, diffuseURL);
      this.bumpTexture = generateTextureAsync(gl, bumpURL);
      this.heightTexture = generateTextureAsync(gl, heightURL);
      this.roughTexture = generateTextureAsync(gl, roughURL);
      this.occTexture = generateTextureAsync(gl, occURL);
   }
   
   setUniform(gl, program, name) {
      program.use();
      function setSubTex(tex, fieldName, activeTexNum) {
         switch (activeTexNum) {
            case 0: gl.activeTexture(gl.TEXTURE0); break;
            case 1: gl.activeTexture(gl.TEXTURE1); break;
            case 2: gl.activeTexture(gl.TEXTURE2); break;
            case 3: gl.activeTexture(gl.TEXTURE3); break;
            case 4: gl.activeTexture(gl.TEXTURE4); break;
         }
         gl.bindTexture(gl.TEXTURE_2D, tex);
         program.uniform1i(`${name}.${fieldName}`, activeTexNum);
      }

      setSubTex(this.diffuseTexture, 'diffuse', 0);
      setSubTex(this.bumpTexture, 'normMap', 1);
      setSubTex(this.heightTexture, 'heightMap', 2);
      setSubTex(this.roughTexture, 'roughMap', 3);
      setSubTex(this.occTexture, 'occMap', 4);
      program.uniform1f(`${name}.maxHeight`, this.maxHeight)
      //program.uniform1f(`${name}.shininess`, this.shininess);
   }
}