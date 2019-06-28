class LeafModel {
    info;
    constructor(gl, vertices, faceColors, idxs){
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(idxs), gl.STATIC_DRAW);
            
        info = {
            positions: vertices,
            indices: idxs,
            properties: {
                colors: faceColors
            },
            buffers: {
                position: positionBuffer,
                color: colorBuffer,
                indices: indexBuffer,
            },
        };
    }

    render(program, tranform){

    }
}
