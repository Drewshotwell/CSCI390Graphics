function makeCubeModel(gl){
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

function computeColor(x, y, z){
    var r, g, b;

    r = (x + 1)/2;
    g = (y + 1)/2;
    b = (z + 1)/2;

    return [r, g, b, 1.0];
}
