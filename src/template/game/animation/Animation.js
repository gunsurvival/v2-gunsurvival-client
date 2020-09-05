class Animation {
	constructor({
		id, //***
		index,
		name = "Unknow Animation Name",
		deleted = false,
		frameCount = 0,
		liveTime = 0,
		infinite = false,
		invisible = false,
		// vị trí
		pos = {
			x: 0,
			y: 0
		},
		targetPos = {
			...pos
		},
		smoothPos = true,
		speedPos = 0.1,
		// phóng to/nhỏ
		scale = 1,
		targetScale = scale,
		smoothScale = true,
		speedScale = 0.05,
		// góc quay (rotation)
		rotate = 0,
		targetRotate = rotate,
		smoothRotate = true,
		speedRotate = 0.05
	} = {}) {
		this.id = id; // identify cho animation
		this.index = index; // index view (nhỏ thì nó sẽ đc vẽ trước)
		this.name = name; // tên của animation (hiện tại đang dùng cái này để duyệt ảnh cho window.GameImages)
		this.deleted = deleted; // deleted = true thì auto bị bay ra khỏi hàng chờ vẽ animation
		this.frameCount = frameCount; // đếm frame
		this.liveTime = liveTime; // thông số chỉ thời gian sống sót
		this._liveTime = liveTime; // lưu trữ liveTime lại cho function this.reBorn()
		this.infinite = infinite; // bật mode thanos éo bao giờ hết liveTime nhưng bị counter bằng this.delete()
		this.invisible = invisible; // bật mode tàng hình cho animation

		this.pos = {
			...pos
		}; // vị trí
		this._pos = {
			...pos
		}; // lưu vị trí đầu tiên
		this.targetPos = targetPos; // đích đến của pos
		this.smoothPos = smoothPos; // làm mượt độ biến thiên giá trị của this.pos
		this.speedPos = speedPos; // tốc độ làm mượt (càng nhỏ càng chậm)

		this.scale = scale; // chỉ số tăng size (1 = bình thường)
		this._scale = scale; // lưu chỉ số scale đầu tiên
		this.targetScale = targetScale; // đích đến của scale
		this.smoothScale = smoothScale; // làm mượt độ biến thiên giá trị của this.scale
		this.speedScale = speedScale; // tốc độ làm mượt (càng nhỏ càng chậm)

		this.rotate = rotate; // góc quay (radians)
		this._rotate = rotate; // lưu chỉ số rotate đầu tiên
		this.targetRotate = targetRotate; // đích đến của rotate
		this.smoothRotate = smoothRotate; // làm mượt độ biến thiên giá trị của this.rotate
		this.speedRotate = speedRotate; // tốc độ làm mượt (càng nhỏ càng chậm)
	}

	onBorn() {
		// socket update for on born
	}

	onAlive() {
		// socket update for on alive
	}

	onDestroy() {
		// socket update for on destroy
	}

	update(s) {
		// update các logic của animation (position, image, status ...)
		this.frameCount++;
		if (!this.infinite) {
			// nếu không bất tử thì sẽ tính thời gian sống
			this.liveTime--;
			if (this.liveTime <= 0) this.deleted = true;
		}

		// cập nhật this.pos
		if (this.smoothPos) {
			this.pos.x = s.lerp(this.pos.x, this.targetPos.x, this.speedPos);
			this.pos.y = s.lerp(this.pos.y, this.targetPos.y, this.speedPos);
		} else {
			this.pos.x = this.targetPos.x;
			this.pos.y = this.targetPos.y;
		}
		// cập nhật this.scale
		if (this.smoothScale) {
			this.scale = s.lerp(this.scale, this.targetScale, this.speedScale);
		} else {
			this.scale = this.targetScale;
		}
		// cập nhật this.rotate
		if (this.smoothRotate) {
			this.rotate = s.lerp(
				this.rotate,
				this.targetRotate,
				this.speedRotate
			);
		} else {
			this.rotate = this.targetRotate;
		}
	}

	draw(/*s*/) {
		// drawing animation
		// bạn có thể thêm debug cho animation tại đây
	}

	isInCamera() {
		// nếu đang ở trong camera thì mới được xài this.draw()
		return true || this.invisible;
	}

	delete() {
		this.deleted = true;
	}

	reBorn() {
		// có thể hiểu là reset lại this.liveTime
		this.liveTime = this._liveTime;
	}

	hide() {
		this.invisible = true;
	}

	show() {
		this.invisible = false;
	}

	follow(sprite) {
		// copy vị trí của 1 sprite
		this.targetPos = sprite.pos;
	}

	unfollow() {
		// ngừng copy vị trí của 1 sprite
		this.targetPos = {
			...this.targetPos
		};
	}

	setPos(x, y) {
		// set vị trí, hay nói cách khác là di chuyển tới 1 tọa độ x, y
		if (typeof x == "object") {
			// moveTo(pos = {x: , y: })
			this.targetPos.x = x.x;
			this.targetPos.y = x.y;
		} else {
			this.targetPos.x = x; // (moveTo(x,y))
			this.targetPos.y = y;
		}
	}

	stopPos() {
		// dừng di chuyển, có thể hiểu là stopMoving() hay stand()
		this.targetPos.x = this.pos.x;
		this.targetPos.y = this.pos.y;
	}

	setScale(scaleValue) {
		// set giá trị phóng to hoặc làm nhỏ
		this.targetScale = scaleValue;
	}

	stopScale() {
		// dừng scale lại
		this.targetScale = this.scale;
	}

	setRotate(rotateValue) {
		// set giá trị góc, (quay nó ở x radians)
		const rotates = [];
		this.rotate %= 2 * Math.PI;
		const alpha = this.rotate;
		const beta = rotateValue;
		
		rotates.push({
			result: Math.abs(alpha - beta),
			beta
		});
		rotates.push({
			result: Math.abs(alpha - (beta + 2 * Math.PI)),
			beta: beta + 2 * Math.PI
		});
		rotates.push({
			result: Math.abs(alpha - (beta - 2 * Math.PI)),
			beta: beta - 2 * Math.PI
		});
		rotates.sort((a, b) => a.result - b.result);
		this.targetRotate = rotates[0].beta; // lấy giá trị nhỏ nhất của góc quay
	}

	stopRotate() {
		// dừng quoay dòng dòng :v
		this.targetRotate = this.rotate;
	}
}

export default Animation;
