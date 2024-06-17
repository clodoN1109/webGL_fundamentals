// Defining a Moving Object
export class MovingShape {
    constructor(position, velocity, size, timeRemaining, vao, numVertices, force, id, type) {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.timeRemaining = timeRemaining;
        this.vao = vao;
        this.numVertices = numVertices;
        this.force = force;
        this.id = id;
        this.type = type;
    }
    isAlive() {
        return this.timeRemaining > 0;
    }
    update(dt) {
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
