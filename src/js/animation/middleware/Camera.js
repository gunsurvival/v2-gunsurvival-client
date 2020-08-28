import Middleware from "./Middleware.js";
import {random} from "../../helper/helper.js";

class Camera extends Middleware {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Camera"
			},
			config
		);
		super(config);
		// this.speedMove = 0.1;
		// this.speedScale = 0.08;
		this.isShaking = false;
	}

	update(s) {
		super.update(s);
		s.translate(-this.pos.x, -this.pos.y);
		s.rotate(this.rotate);
		s.scale(this.scale);
		s.translate(s.width * 0.5, s.height * 0.5);
	}

	shake(noise) {
		if (this.isShaking) return;
		let cX = this.pos.x; // current X
		let cY = this.pos.y; // current Y
		// let random = [-1, 1][Random(0, 1, true)];
		this.x = cX + random(-noise, noise);
		this.y = cY + random(-noise, noise);
	}

	// Chuyển đổi vị trí thực của vật thể (theo hệ toạ độ của mapgame) về vị trí trên màn hình (theo hệ toạ độ màn hình)
	worldToScreen(screenSize, worldPos) {
		return {
			x: (worldPos.x - this.x) * this.scale + screenSize.width * 0.5,
			y: (worldPos.y - this.y) * this.scale + screenSize.height * 0.5
		};
	}

	// Ngược lại của worldToScreen()
	screenToWorld(screenSize, worldPos) {
		return {
			x: (worldPos.x - screenSize.width * 0.5) / this.scale + this.x,
			y: (worldPos.y - screenSize.height * 0.5) / this.scale + this.y
		};
	}
}

export default Camera;
