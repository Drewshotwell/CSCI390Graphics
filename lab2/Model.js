class LeafModel {
    render(gl, prgInfo, transform){}
}

class CubeModel extends LeafModel {
    info;
    constructor(gl) {
        var vertices = [], faceColors = [];
        for (var x = 1; x >= -1; x -= 2){
            for (var y = 1; y >= -1; y -= 2){
                for (var z = 1; z >= -1; z -= 2){
                    vertices.push(x, y, z);
                    faceColors.push(...computeColor(x, y, z));
                }
            }
        }

        const idxs = [
            0, 1, 3,   0, 3, 2,
            0, 2, 6,   0, 6, 4,
            6, 4, 5,   6, 5, 7,
            7, 3, 1,   7, 1, 5,
            1, 0, 4,   1, 4, 5,
            3, 2, 6,   3, 6, 7,
        ];
        
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idxs), gl.STATIC_DRAW);
        
        this.info = {
            positions: vertices,
            posBuf: positionBuffer,
            indices: idxs,
            indexBuf: indexBuffer,
            properties: {
                color: {
                    vals: faceColors,
                    buf: colorBuffer,
                    type: gl.FLOAT,
                    numComponents: 4,
                },
            },
        };
    }

    render(gl, prgInfo, transform){
        mat4.translate(transform,     // destination matrix
                       transform,     // matrix to translate
                       [-0.0, 0.0, -6.0]);  // amount to translate
        mat4.rotate(transform,  // destination matrix
            transform,  // matrix to rotate
            transform,     // amount to rotate in radians
            [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(transform,  // destination matrix
            transform,  // matrix to rotate
            transform * .7,// amount to rotate in radians
            [0, 1, 0]);       // axis to rotate around (X)

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, modelInfo.posBuf);
            gl.vertexAttribPointer(prgInfo.attribLocations.aVertexPosition,
                                   numComponents,
                                   type,
                                   normalize,
                                   stride,
                                   offset);
            gl.enableVertexAttribArray(
                            prgInfo.attribLocations.aVertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.

        for (var p in modelInfo.properties){
            const numComponents = modelInfo.properties[p].numComponents;
            const type = modelInfo.properties[p].type;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, modelInfo.properties[p].buf);
            gl.vertexAttribPointer(
                programInfo.attribLocations[p],
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations[p]);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelInfo.indexBuf);

        // Tell WebGL to use our program when drawing
        gl.useProgram(prgInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(prgInfo.uniformLocations.uProjectionMatrix,
                            false,
                            projectionMatrix);
                            
        gl.uniformMatrix4fv(prgInfo.uniformLocations.uModelViewMatrix,
                            false,
                            modelViewMatrix);

        {
            const vertexCount = modelInfo.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}

class LeafCollection extends LeafModel {
    collection;

    constructor() {
        this.collection = [];
    }

    addChild(leaf){
        this.collection.push(leaf);
    }

    remove(leaf){
        for (let i = 0; i < this.collection.length; i++){
            if (this.collection[i] === leaf){
                this.collection.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    getChild(key){
        return this.collection[key];
    }

    render(gl, prgInfo, transform){
        for (let l of collection){
            l.render(gl, prgInfo, transform);
        }
    }
}
