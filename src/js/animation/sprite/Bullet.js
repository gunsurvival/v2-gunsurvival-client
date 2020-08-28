import Sprite from "./Sprite.js";

class Bullet extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Bullet",
				liveTime: 40,
				smoothRotate: false,
				speedRotate: 0.06
			},
			config
		);
		super(config);
		const {ownerID} = config;
		this.ownerID = ownerID;
	}

	update(s) {
		super.update(s);
		this.setRotate(
			s.atan2(this.target.y - this.pos.y, this.target.x - this.pos.x)
		);
	}

	draw(s) {
		s.push();
		s.translate(this.pos.x, this.pos.y);
		s.rotate(this.rotate);
		s.scale(this.scale);
		s.image(window.GameImages[this.name], 0, 0);
		s.pop();
	}

	moveTo(pos) {
		super.moveTo(pos);
		this.resetLifeTime();
	}
}

export default Bullet;
