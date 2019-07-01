class LeafModel {
    constructor(){}

    render(gl, programInfo, transform){}
}

class CubeModel extends LeafModel {
    constructor(gl) {
        super();
        this.info = this.makeCubeModel(gl);
        this.modelViewMatrix = mat4.create();
    }

    render(gl, programInfo, transform){
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        /*mat4.translate(this.modelViewMatrix,     // destination matrix
                       this.modelViewMatrix,     // matrix to translate
                       [-0.0, 0.0, -6.0]);  // amount to translate*/

        /*mat4.rotate(this.modelViewMatrix,
                    this.modelViewMatrix,
                    Math.PI / 4,
                    [0, 1, 0]);*/

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.info.posBuf);
            gl.vertexAttribPointer(
                programInfo.attribLocations.aVertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.aVertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.

        for (var p in this.info.properties){
            const numComponents = this.info.properties[p].numComponents;
            const type = this.info.properties[p].type;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.info.properties[p].buf);
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.info.indexBuf);

        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.uProjectionMatrix,
            false,
            transform);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.uModelViewMatrix,
            false,
            this.modelViewMatrix);

        {
            const vertexCount = this.info.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    scaleBy(vec){
        mat4.scale(this.modelViewMatrix,
                   this.modelViewMatrix,
                   vec);
    }

    rotateBy(rad, axisVec){
        mat4.rotate(this.modelViewMatrix,
                    this.modelViewMatrix,
                    axisVec,
                    rad);
    }

    makeCubeModel(gl){
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
        
        return {
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
}

class CompoundModel extends LeafModel {
    collection;
    constructor(){
        super();
        this.collection = [];
    }

    addChild(child, translateVec){
        mat4.translate(child.modelViewMatrix,
                       child.modelViewMatrix,
                       translateVec);
        this.collection.push(child);
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
        for (let l of this.collection){
            l.render(gl, prgInfo, transform);
        }
    }
}

class Jack extends CompoundModel {
    constructor(gl, translateVec){
        super();

        var xBar = new CubeModel(gl);
        var yBar = new CubeModel(gl);
        //var zBar = new CubeModel(gl);
        
        /*xBar.scaleBy([1, 0.1, 0.1]);
        yBar.scaleBy([0.1, 1, 0.1]);
        zBar.scaleBy([0.1, 0.1, 1]);*/
        
        xBar.scaleBy([1, 0.1, 1]);

        yBar.scaleBy([1, 0.1, 1]);
        yBar.rotateBy(Math.PI / 2, [0, 0, 1]);

        //zBar.scaleBy([1, 0.1, 1]);
        
        super.addChild(xBar, translateVec);
        super.addChild(yBar, translateVec);
        //super.addChild(zBar, translateVec);
    }
}

function computeColor(x, y, z){
    var r, g, b;

    r = (x + 1)/2;
    g = (y + 1)/2;
    b = (z + 1)/2;

    return [r, g, b, 1.0];
}
