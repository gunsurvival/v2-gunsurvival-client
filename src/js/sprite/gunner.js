class Gunner extends Sprite {
	constructor(config) {
		super(config);
		let {
			gun,
			name,
			id,
			img
		} = config;
		this.name = name || id;
		this.id = id;
		this.img = images[img];
		this.deadImg = images.dead;
		this.dead = false;
		this.gun = gun;
		this.toSize = 1;
		this.toDegree = 0;

		this.changeWeaponJob = {
			default: 1,
			frame: 1
		};
		this.reloadWeaponJob = {
			default: 1,
			frame: 1,
			x: 0
		};

		this.leftHand = {
			x: -30 + 80,
			y: 20
		};

		this.rightHand = {
			x: 8 + 80,
			y: 20
		};
	}

	update() {
		this.degree = lerp(this.degree, this.toDegree, 0.3);
		this.pos.x = lerp(this.pos.x, this.target.x, 0.2);
		this.pos.y = lerp(this.pos.y, this.target.y, 0.2);
	}

	draw() {
		if (this.invisible) {
			return;
		}
		push();
		imageMode(CENTER);
		translate(this.pos.x, this.pos.y);
		textAlign(CENTER, CENTER);

		textSize(18); // draw name
		stroke("white");
		strokeWeight(1);
		fill("white");
		text(this.name, 0, -65);
		this.size = lerp(this.size, this.toSize, 0.12);
		scale(this.size);

		if (!this.dead) {
			let scaleWidth = 80 / this.img.width;
			rotate(this.degree);
			image(this.img, 0, 0, this.img.width * scaleWidth, this.img.height * scaleWidth);
			if (this.changeWeaponJob.frame < this.changeWeaponJob.default) {
				this.changeWeaponJob.frame++;
			}
			let scale = this.changeWeaponJob.frame / this.changeWeaponJob.default;
			let gunImg = images[this.gun.name];
			image(gunImg, 80, 15, gunImg.width * 0.15 * scale, gunImg.height * 0.15 * scale);


			if (this.reloadWeaponJob.frame < this.reloadWeaponJob.default) {
				this.reloadWeaponJob.frame++;
				let percentLoad = this.reloadWeaponJob.frame / this.reloadWeaponJob.default;
				if (percentLoad < .5)
					this.reloadWeaponJob.x -= 80 / BULLET_CONFIG[this.gun.name].reload;
				else
					this.reloadWeaponJob.x += 80 / BULLET_CONFIG[this.gun.name].reload;
			}
			ellipse(this.leftHand.x, this.leftHand.y, 20);
			ellipse(this.rightHand.x + this.reloadWeaponJob.x, this.rightHand.y, 20);
		} else
			image(this.deadImg, 0, 0, 80, 80);
		pop();
	}

	addChat(text) {
		chats.push(new ChatText({
			id: this.id,
			pos: this.pos,
			name: this.name,
			text
		}));
	}

	hideInTree() {
		this.invisible = true;
	}

	unHideInTree() {
		this.invisible = false;
	}

	getCurrentPos() {
		return this.target;
	}

	moveTo({
		x = this.target.x,
		y = this.target.y
	} = {}) {
		this.target.x = x;
		this.target.y = y;
	}

	rotateTo(degree) {
		this.degree %= 360;
		let num = [],
			alpha = this.degree,
			beta = degree;
		num.push({
			result: abs(alpha - beta),
			beta
		});
		num.push({
			result: abs(alpha - (beta + 360)),
			beta: beta + 360
		});
		num.push({
			result: abs(alpha - (beta - 360)),
			beta: beta - 360
		});
		num.sort((a, b) => a.result - b.result);
		this.toDegree = num[0].beta;
	}

	hurt() {
		_camera.shake(10);
	}

	updateSize(size) {
		this.toSize = size;
	}

	updateGun(gun) {
		this.gun = gun;
		this.changeWeaponJob.default = 20;
		this.changeWeaponJob.frame = 1;

		this.reloadWeaponJob.default = BULLET_CONFIG[gun.name].holdWait;
		this.reloadWeaponJob.frame = 1;
		this.reloadWeaponJob.x = 0;
		this.gun = gun;
	}

	reloadGun(method) {
		if (method == "reload")
			this.gun.bulletCount = "RELOADING";
		this.reloadWeaponJob.default = BULLET_CONFIG[this.gun.name][method];
		this.reloadWeaponJob.frame = 1;
		this.reloadWeaponJob.x = 0;
	}
}
