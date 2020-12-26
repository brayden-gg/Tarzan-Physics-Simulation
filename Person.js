class Person extends Body {
    constructor(options) {
        super(options);
        this.img = options.img;
        this.rot = 0;
    }

    move() {
        let oldVel = this.vel.y;
        let oldAcc = this.acc.y;
        if (done && (this.x > topGround.x && this.y + this.height / 2 * cos(this.rot) > topGround.y || this.x < bottomGround.width && this.y + this.height / 2 * cos(this.rot) > bottomGround.y)) {
            this.vel.set(0);
            this.acc.set(0);
            if ((this.y > topGround.y && this.x > rope.x) || (this.y > bottomGround.y && this.x < rope.x)) {
                // if (this.y < -500) {
                this.vel.y = oldVel;
                this.acc.y = oldAcc;
                super.move();
                // }
            }
            return;
        }
        super.move();
        return this;
    }

    show() {
        push();
        translate(tarzan.x, tarzan.y);
        if (!running /* && !(tarzan.x > topGround.x && tarzan.y + tarzan.height / 2 > topGround.y)*/ ) {
            this.rot = map(tarzan.x, topGround.x, topGround.x + 50, -theta, 0, true);
            this.rot += map(tarzan.x, bottomGround.width - 50, bottomGround.width, theta, 0, true)
            rotate(this.rot);
        }

        translate(-tarzan.x, -tarzan.y);



        noStroke();

        let factor = this.height / this.img.height;

        image(this.img, this.pos.x - tarzan.width * 3 / 2, this.pos.y - tarzan.height / 2, this.img.width * factor, tarzan.height)

        pop();
        return this;
    }

}