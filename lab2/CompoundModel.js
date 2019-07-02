class CompoundModel {
    constructor(){
        this.collection = [];
    }

    addChild(child, transform){
        this.collection.push({child, transform});
    }

    render(gl, prgInfo, transform) {
        for (let leaf of this.collection){
            leaf.child.render(gl, prgInfo,
                mat4.multiply(mat4.create(), leaf.transform, transform));
        }
    }
}