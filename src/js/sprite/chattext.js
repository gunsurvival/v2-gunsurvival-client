class ChatText extends Sprite {
	constructor(config) {
		super(config);
		let {
			text,
			margin = 10
		} = config;
		this.text = text;
		textSize(23);
		this.width = textWidth(text);
		this.height = textAscent() * 0.8;
		this.lifeTime = 180;
		this.relativePos = {
			y: -100 // vị trí ban đầu của chat
		};
		this.margin = margin;
	}

	update() {
		super.update();
	}

	draw() {
		push();
		// debugger;
		if (this.relativePos.y > -150) // lam binh thuong di :)) lerp nó nhún nhún :))
			this.relativePos.y -= this.frameCount / 80; // đc ko nhỉ
		noStroke();
		fill("black");
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y + this.relativePos.y, this.width + this.margin * 2, this.height + this.margin * 2, 20);

		textAlign(CENTER, CENTER);
		textSize(23); // draw chat
		fill("white");
		text(this.text, this.pos.x, this.pos.y + this.relativePos.y + 2);

		pop();
	}
}
