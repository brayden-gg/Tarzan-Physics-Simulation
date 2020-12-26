class Body {
    constructor(options) {
        this.pos = createVector(options.x, options.y);
        this.vel = createVector(options.velX, options.velY);

        this.acc = createVector(options.accX, options.accY);

        this.mass = options.mass;
        this.w = options.width;
        this.h = options.height;
        this.color = options.color;
        this.forces = [];
        this.forceSum = createVector();

        this.vel.color = "blue";
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    set x(val) {
        this.pos.x = val;
    }

    set y(val) {
        this.pos.y = val;
    }

    get width() {
        return this.w;
    }

    set width(val) {
        this.w = val;
    }

    get height() {
        return this.h;
    }

    set height(val) {
        this.h = val;
    }

    show() {
        rectMode(CORNER);
        noStroke();
        fill(this.color || "#FF0000")
        rect(this.pos.x, this.pos.y, this.w, this.h);
        return this;
    }

    clear() {
        this.forces = [];
    }

    addForce(force, color, name) {
        force.color = color;
        force.name = name;
        this.forces.push(force);
        return this;
    }

    applyForces() {
        this.forceSum = createVector();

        for (let force of this.forces) {
            this.forceSum.add(force)
        }
        return this;
    }

    move() {
        this.acc = (p5.Vector.div(this.forceSum, this.mass));
        this.vel.add(p5.Vector.div(this.acc, STEPS));
        this.pos.add(p5.Vector.div(this.vel, STEPS));

        return this;
    }



    showVectors(vectors, units, names, conversion) {
        let len = 25;
        for (let i = 0; i < vectors.length; i++) {

            let v = vectors[i];


            noStroke()
            fill(v.color || "black")
            textSize(50)

            let mag = ((v.mag ? v.mag() : v) * conversion[i]).toFixed(1);
            let dir = (v.heading ? (", " + ((-v.heading() * 180 / PI + 270) % 360).toFixed(0) + "º") : "");
            text(`${(v.name || names[i])}: ${mag} ${units[i]}${dir}`, 25 + topGround.x, v instanceof p5.Vector ? 75 * (i + 1) + topGround.y : height * 2 - 75 * i)

            if (!(v instanceof p5.Vector)) {
                continue;
            }

            let scaled = p5.Vector.mult(v, 20);
            push();
            translate(this.x, this.y);
            rotate(scaled.heading() - PI / 2);


            triangle(-len, scaled.mag(), len, scaled.mag(), 0, len * 1.7 + scaled.mag());

            stroke(v.color || "black");
            strokeWeight(15);
            line(0, 0, 0, scaled.mag());

            pop();


        }
        return this;

    }

}