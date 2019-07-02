class Jack extends CompoundModel {
    constructor(gl){
        super();
        
        const bar = new CubeModel(gl);

        const xTrans = mat4.create();
        const yTrans = mat4.create();
        const zTrans = mat4.create();

        mat4.scale(xTrans, xTrans, [1, 0.1, 0.1]);
        
        mat4.rotateZ(yTrans, yTrans, Math.PI / 2);
        mat4.scale(yTrans, yTrans, [1, 0.1, 0.1]);

        mat4.rotateY(zTrans, zTrans, Math.PI / 2);
        mat4.scale(zTrans, zTrans, [1, 0.1, 0.1]);

        super.addChild(bar, xTrans);
        super.addChild(bar, yTrans);
        super.addChild(bar, zTrans);
    }
}
