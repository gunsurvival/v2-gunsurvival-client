class Tree extends Sprite {
    constructor(config) {
        super(config);
        this.id = config.id;
        this.img = images.tree;
        this.gunnerCount = 0;
        this.toggleShake = 'up';
        this.defaultDegree = this.degree;
        this.mode = config.mode;
    }

    update() {
        if (this.gunnerCount < 0)
            this.gunnerCount = 0;
    }

    draw() {
        super.draw();
        if (!this.isInCamera()) {
            return;
        }
        if (this.gunnerCount > 0) {
            if (this.toggleShake == 'up')
                this.degree -= 1;
            if (this.toggleShake == 'down')
                this.degree += 1;
            if (this.degree <= this.defaultDegree - 7)
                this.toggleShake = 'down';
            if (this.degree >= this.defaultDegree + 7)
                this.toggleShake = 'up';
        } else {
            this.degree = lerp(this.degree, this.defaultDegree, 0.1);
        }
        push();
        imageMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(this.degree);
        scale(this.size);
        if (this.mode != 'draw') {
            let me = gunners[gunners.findIndex(e => e.id == socket.id)];
            if (me && collideCircleCircle(this.pos.x, this.pos.y, 200*this.size - 120, me.pos.x, me.pos.y, 80)) {
                image(this.img.tint, 0, 0);
            } else {
                image(this.img, 0, 0);
            }
        } else
        image(this.img, 0, 0);
        pop();
    }
}