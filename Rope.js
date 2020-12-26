class Rope extends Body {
    constructor(options) {
        super(options);
        // this.theta = theta;
        // this.omega = omega;
        // this.alpha = alpha;
    }

    // move() {
    //     this.omega += this.alpha;
    //     this.theta += this.omega;
    // }

    show() {

        push();
        translate(rope.x, rope.y);
        rotate(-theta);
        translate(-rope.x, -rope.y);
        noStroke()
        fill(this.color || "#FF0000")
        rect(this.pos.x, this.pos.y, this.w, this.h + tarzan.height / 2);
        pop();

        return this;

    }

}