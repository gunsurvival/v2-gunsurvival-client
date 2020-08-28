class Grid extends Sprite {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.radius = 5;
	}

	draw() {
		push();
		if (
			!collideRectCircle(
				_camera.x - WIDTH / _camera.scale / 2,
				_camera.y - HEIGHT / _camera.scale / 2,
				WIDTH / _camera.scale,
				HEIGHT / _camera.scale,
				this.x,
				this.y,
				this.radius
			)
		)
			return;
		ellipse(this.x, this.y, this.radius);
		pop();
	}
}
