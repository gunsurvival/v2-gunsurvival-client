import Sprite from "./Sprite.js";

class Score extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Score",
				liveTime: 35
			},
			config
		);
		super(config);
		const {value = 10} = config;
		this.value = value;
		this.width = this.height = 0;
	}

	update(s) {
		super.update(s);
		this.width = this.height = (this.value / 10) * 10;
	}

	draw(s) {
		super.draw(s);
		s.push();
		s.translate(this.pos.x, this.pos.y);
		s.stroke("gray");
		s.strokeWeight(4);
		s.fill("white");
		s.ellipse(0, 0, this.width);
		s.pop();
	}

	setPos(x, y) {
		super.setPos(x, y);
		this.reBorn();
	}
}

export default Score;
