// Defining a Moving Object

export class MovingShape {
    constructor (
        public position: [number, number],
        public velocity: [number,number],
        public size: number,
        public timeRemaining: number,
        public vao: WebGLVertexArrayObject,
        public numVertices: number,
        public force: [number, number],
        public id: number,
        public type: string,
        
    ) {}

    isAlive() {
        return this.timeRemaining > 0;
    }

    update(dt: number) {

        this.velocity[0] += this.force[0] * dt;
        this.velocity[1] += this.force[1] * dt;

        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;

        this.timeRemaining -= dt;
        if (this.timeRemaining < 0) {
            this.timeRemaining = +0;
        }
    }

}