class Bullet extends Sprite {
    constructor(config) {
        super(config);
        let { owner, name, radian, speed, imgName } = config;
        this.owner = owner;
        this.name = name;
        this.speed = speed;
        this.img = images[imgName];
        this.invisible = false;
        this.target = { ...this.pos };
        this.lifeTime = 50;
    }

    update() {
        super.update();
        this.pos.x = lerp(this.pos.x, this.target.x, 0.35);
        this.pos.y = lerp(this.pos.y, this.target.y, 0.35);
        if (Math.sqrt(Math.pow(this.speed.x, 2) + Math.pow(this.speed.y, 2)) <= 0)
            this.delete = true;
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

    moveTo({ x = this.target.x, y = this.target.y } = {}) {
        let newDegree = atan2(y - this.target.y, x - this.target.x);
        if (newDegree != 0)
            this.degree = newDegree;
        this.target.x = x;
        this.target.y = y;
    }
}