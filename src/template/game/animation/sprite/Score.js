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
		const {_value = 10, value = 10} = config;
		this._value = _value;
		this.value = value;
	}

	update(s) {
		super.update(s);
		this.setScale(this.value / this._value);
	}

	draw(s) {
		super.draw(s);
		s.push();
		s.translate(this.pos.x, this.pos.y);
		s.stroke("gray");
		s.strokeWeight(4);
		s.fill("white");
		s.scale(this.scale);
		s.ellipse(0, 0, 10);
		s.pop();
	}

	onAlive({position, value, _value} = {}) {
		this.setPos(position);
		this.value = value;
		this._value = _value;
		console.log(this.pos)
	}

	setPos(x, y) {
		super.setPos(x, y);
		this.reBorn();
	}
}

export default Score;
