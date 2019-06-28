function makeIcoModel(){
    const vertices = [];
    for (var k = 0; k < 10; k++){
        vertices.push(
            Math.sin(Math.PI/2 - Math.tan(1/2))*Math.cos(k*0.628318530717959),
            Math.pow(-1,k)*Math.cos(Math.PI/2 - Math.tan(1/2)),
            Math.sin(Math.PI/2 - Math.tan(1/2))*Math.sin(k*0.628318530717959),
        );
    }
    vertices.push(0, 1, 0,   0, -1, 0);

    console.log(vertices);
    
    const faceColors = [];
    for (var clrIdx = 0; clrIdx <= vertices.length - 3; clrIdx += 3){
        faceColors.push(...computeColor(vertices[clrIdx], vertices[clrIdx + 1], vertices[clrIdx + 2]));
    }

    console.log(faceColors);
    
    const idxs = [];
    for (var vdx = 0; vdx < 10; vdx++){
        idxs.push(vdx % 10, (vdx + 1) % 10, (vdx + 2) % 10);
    }

    for (var vdx = 0; vdx < 5; vdx++){
        idxs.push(10, (vdx*2) % 10, ((vdx+1)*2) % 10);
        idxs.push(11, (1 + vdx*2) % 10, (1 + (vdx+1)*2) % 10);
    }

    for (var vdx = 0; vdx < 5; vdx++){
    }

    console.log(idxs);
    
    return {
        positions: vertices,
        indices: idxs,
        properties: {
            colors: faceColors
        }
    }
}

function computeColor(x, y, z){
    var r, g, b;

    r = (x + 1)/2;
    g = (y + 1)/2;
    b = (z + 1)/2;

    return [r, g, b, 1.0];
}