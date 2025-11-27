export default class DNA {

    constructor(weights) {
        if (weights) {
            this.weights = weights;
        } else {
            this.weights = [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 90 + 10, Math.random() * 90 + 10];
        }
    }

    getWeight(index) {
        return this.weights[index];
    }
    
    setWeight(index, weight) {
        this.weights[index] = weight;
    }

    getPerceptionRadius(index) {
        return this.weights[index];
    }
    
    setPerceptionRadius(index, perceptionRadius) {
        this.weights[index] = perceptionRadius;
    }

    getPoisonSteer(index) {
        return this.weights[index];
    }
    
    setPoisonSteer(index, poisonSteer) {
        this.weights[index] = poisonSteer;
    }

}