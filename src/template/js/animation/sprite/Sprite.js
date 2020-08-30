import Animation from "../Animation.js";

class Sprite extends Animation {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Unknown Sprite Name"
			},
			config
		);
		super(config);
		this.sprite = true;
	}

	update(s) {
		super.update(s);
	}

	draw(s) {
		super.draw(s);
	}
}

export default Sprite;
