class Leaf extends Sprite {
    constructor({ pos } = {}) {
        super();
        this.x = pos.x + 120 + random(-50, 50);
        this.y = pos.y + 120 + random(-50, 50);
        this.img = images['leaf' + Random(1,3,true)];
        this.triggerFrame = 100 + Math.round(random(300));
        this.degree = random(180);
        this.shakeStage = false;
        this.shakeFrame = 0;
    }

    update() {
        if (frameCount % this.triggerFrame == 0) {
            this.shake();
        }
        if (this.shakeStage) {
            this.shakeFrame--;
            if (this.shakeFrame > 25)
                this.degree += 1;
            else
                this.degree -= 1;
            if (this.shakeFrame < 0)
                this.shakeStage = false;
        }
    }

    draw() {
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.degree);
        image(this.img, 0, 0, 40, 40);
        pop();
    }

    shake() {
        this.shakeFrame = 50;
        this.shakeStage = true;
    }
}