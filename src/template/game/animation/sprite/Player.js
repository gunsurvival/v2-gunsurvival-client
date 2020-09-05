import Sprite from "./Sprite.js";

class Player extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				// name: "Guest Gunner"
				infinite: true,
				speedRotate: 0.3,
			},
			config
		);
		super(config);
		const {id} = config;
		if (!this.name) this.name = id;
		this.dead = false;
		// this.gun = gun;

		// this.changeWeaponJob = {
		// 	default: 1,
		// 	frame: 1
		// };
		// this.reloadWeaponJob = {
		// 	default: 1,
		// 	frame: 1,
		// 	x: 0
		// };

		// this.leftHand = {
		// 	x: -30 + 80,
		// 	y: 20
		// };

		// this.rightHand = {
		// 	x: 8 + 80,
		// 	y: 20
		// };
	}

	update(s) {
		super.update(s);
	}

	draw(s) {
		super.draw(s);
		s.push();
		s.translate(this.pos.x, this.pos.y);
		s.textAlign(s.CENTER, s.CENTER);
		s.textSize(18); // draw name
		s.stroke("white");
		s.strokeWeight(1);
		s.fill("white");
		s.text(this.name, 0, -65);

		if (!this.dead) {
			// vẫn còn sống
			const img = window.GameImages["Gunner"];
			const scaleWidth = 80 / img.width;
			s.rotate(this.rotate);
			s.image(img, 0, 0, img.width * scaleWidth, img.height * scaleWidth);
			// if (this.changeWeaponJob.frame < this.changeWeaponJob.default) {
			// 	this.changeWeaponJob.frame++;
			// }
			// const scale = this.changeWeaponJob.frame / this.changeWeaponJob.default;
			// const gunImg = images[this.gun.name];
			// image(gunImg, 80, 15, gunImg.width * 0.15 * scale, gunImg.height * 0.15 * scale);

			// if (this.reloadWeaponJob.frame < this.reloadWeaponJob.default) {
			// 	this.reloadWeaponJob.frame++;
			// 	const percentLoad = this.reloadWeaponJob.frame / this.reloadWeaponJob.default;
			// 	if (percentLoad < .5)
			// 		this.reloadWeaponJob.x -= 80 / BULLET_CONFIG[this.gun.name].reload;
			// 	else
			// 		this.reloadWeaponJob.x += 80 / BULLET_CONFIG[this.gun.name].reload;
			// }
			// ellipse(this.leftHand.x, this.leftHand.y, 20);
			// ellipse(this.rightHand.x + this.reloadWeaponJob.x, this.rightHand.y, 20);
		} else {
			s.image(window.GameImages["GunnerDead"], 0, 0, 80, 80);
		}
		s.pop();
	}

	onAlive({rotate, position} = {}) {
		this.setRotate(rotate);
		this.setPos(position);
	}

	// addChat(text) {
	// 	chats.push(new ChatText({
	// 		id: this.id,
	// 		pos: this.pos,
	// 		name: this.name,
	// 		text
	// 	}));
	// }

	// updateGun(gun) {
	// 	this.gun = gun;
	// 	this.changeWeaponJob.default = 20;
	// 	this.changeWeaponJob.frame = 1;

	// 	this.reloadWeaponJob.default = BULLET_CONFIG[gun.name].holdWait;
	// 	this.reloadWeaponJob.frame = 1;
	// 	this.reloadWeaponJob.x = 0;
	// 	this.gun = gun;
	// }

	// reloadGun(method) {
	// 	if (method == "reload")
	// 		this.gun.bulletCount = "RELOADING";
	// 	this.reloadWeaponJob.default = BULLET_CONFIG[this.gun.name][method];
	// 	this.reloadWeaponJob.frame = 1;
	// 	this.reloadWeaponJob.x = 0;
	// }
}

export default Player;
