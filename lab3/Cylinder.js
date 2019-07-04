class Cylinder extends LeafModel {
    makeModel(gl){
        var vertices = [], norms = [];
        /*** Vertices ****/
        // Top face
        for (var vert = 1; vert <= 60; vert++) {
            vertices.push(Math.cos(2*Math.PI/vert), 1, Math.sin(2*Math.PI/vert));
            norms.push(0, 1, 0);
        }

        // Middle Band
        for (var vert = 1; vert <= 60; vert++) {
            vertices.push(Math.cos(2*Math.PI/vert), 1, Math.sin(2*Math.PI/vert));
            norms.push(Math.cos(2*Math.PI/vert), 0, Math.sin(2*Math.PI/vert));
        }
        for (var vert = 1; vert <= 60; vert++) {
            vertices.push(Math.cos(2*Math.PI/vert), -1, Math.sin(2*Math.PI/vert));
            norms.push(Math.cos(2*Math.PI/vert), 0, Math.sin(2*Math.PI/vert));
        }
        
        // Bottom Face
        for (var vert = 1; vert <= 60; vert++) {
            vertices.push(Math.cos(2*Math.PI/vert), -1, Math.sin(2*Math.PI/vert));
            norms.push(0, -1, 0);
        }

        // Poles
        vertices.push(0,  1, 0,
                      0, -1, 0);
        norms.push(0,  1, 0,
                   0, -1, 0);
        
        /*** Indices ****/
        var idxs = [];
        // Top Face
        for (let i = 0; i < 60; i++) {
            idxs.push(i, 240, (i + 1) % 60);
        }

        // Middle Band (2 triangles each)
        for (let i = 0; i < 60; i++) {
            idxs.push(
                (i % 60) + 60, (i % 60) + 60 + 1, (i % 60) + 120,
                (i % 60) + 60 + 1, (i % 60) + 120, (i % 60) + 120 + 1);
        }
        // Bottom Face
        for (let i = 0; i < 60; i++) {
            idxs.push((i % 60) + 180, 241, ((i + 1) % 60) + 180);
        };

        /*** FaceColors ****/
        var faceColors = [];
        for (let i = 0; i < 60; i++){
            for (let j = 0; j < 3; j++){
                faceColors.push(1, 1, 1, 1);
            }
        }
        for (let i = 0; i < 120; i++){
            for (let j = 0; j < 3; j++){
                faceColors.push(1, 0, 0, 1);
            }
        }
        for (let i = 0; i < 60; i++){
            for (let j = 0; j < 3; j++){
                faceColors.push(1, 1, 1, 1);
            }
        }
        faceColors.push(1, 1, 1, 1,
                        1, 1, 1, 1);
        console.log(vertices);
        console.log(norms);
        console.log(idxs);
        console.log(faceColors);

        return {
            positions: vertices,
            normals: norms,
            indices: idxs,
            properties: {
                color: {
                    vals: faceColors,
                    type: gl.FLOAT,
                    numComponents: 4,
                },
            },
        };
    }
}

function computeColor(x, y, z){
    var r, g, b;

    r = (x + 1)/2;
    g = (y + 1)/2;
    b = (z + 1)/2;

    return [r, g, b, 1.0];
}