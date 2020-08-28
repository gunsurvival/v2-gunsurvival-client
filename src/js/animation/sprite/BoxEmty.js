import Sprite from "./Sprite.js";

class BoxEmty extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "BoxEmty",
				infinite: true
			},
			config
		);
		super(config);
	}

	draw(s) {
		super.draw(s);
		s.push();
		s.translate(this.pos.x, this.pos.y);
		s.rotate(this.degree);
		s.scale(this.size);
		s.image(window.GameImages.BoxEmty, 0, 0);
		s.pop();
	}
}

export default BoxEmty;
