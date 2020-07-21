class Score extends Sprite {
	constructor(config) {
		super(config);
		let {
			value
		} = config;
		this.width = this.height = 0;
		this.lifeTime = 35;
	}

	update() {
		super.update();
		this.width = this.height = this.value / 10 * 10;
		this.pos.x = lerp(this.pos.x, this.target.x, 0.2);
		this.pos.y = lerp(this.pos.y, this.target.y, 0.2);
	}

	draw() {
		super.draw();
		if (!this.isInCamera()) {
			return;
		}
		push();
		ellipseMode(CENTER);
		translate(this.pos.x, this.pos.y);
		stroke("gray");
		strokeWeight(4);
		fill("white");
		ellipse(0, 0, this.width);
		pop();
	}

	moveTo(pos) {
		super.moveTo(pos);
		this.resetLifeTime();
	}

	resetLifeTime() {
		this.lifeTime = 35;
	}
}
