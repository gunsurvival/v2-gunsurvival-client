class Bullet extends Sprite {
    constructor(config) {
        super(config);
        let { ownerID, speed, imgName } = config;
        this.ownerID = ownerID;
        this.speed = speed;
        this.img = images[imgName];
        this.invisible = false;
        this.target = { ...this.pos };
        this.resetLifeTime();
    }

    resetLifeTime() {
        this.lifeTime = 40;
    }

    update() {
        super.update();
        this.degree = atan2(this.y - this.target.y, this.x - this.target.x);
        this.pos.x = lerp(this.pos.x, this.target.x, 0.35);
        this.pos.y = lerp(this.pos.y, this.target.y, 0.35);
    }

    draw() {
        if (this.invisible) {
            return;
        }
        push();
        imageMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(this.degree);
        scale(this.size);
        image(this.img, 0, 0);
        pop();
    }

    moveTo(pos) {
        super.moveTo(pos);
        this.resetLifeTime();
    }
}