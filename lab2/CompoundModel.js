class CompoundModel {
    constructor(){
        this.collection = [];
    }

    addChild(child, transform){
        this.collection.push({child, transform});
    }

    remove(leaf){
        for (let i = 0; i < this.collection.length; i++){
            if (this.collection[i] === leaf) {
                this.collection.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    getChild(key){
        return this.collection[key];
    }

    render(gl, prgInfo, transform) {
        for (let leaf of this.collection){
            leaf.child.render(gl, prgInfo, 
                mat4.multiply(mat4.create(), leaf.transform, transform));
        }
    }
}