import Middleware from "./Middleware.js";
import ArrayManager from "./ArrayManager.js";

class World extends Middleware {
	constructor(queueIndex = [0, 1, 2]) {
		// queueIndex là queue để vẽ sprite theo mức độ ưu tiên (0 ->> 2)
		// bình thường 0 là cho mặt đất (lá cây, cục đá các thứ); 1 là cho player (nhân vật); 2 là cây cối, đá cuội (map)
		super("World");
		this.queueIndex = queueIndex;
		this.spriteManager = new ArrayManager(); // manager cho các sprite
	}

	getSpriteByIndex(index) {
		const sprites = [];
		for (const index of this.queueIndex) {
			for (const sprite of this.spriteManager.items) {
				if (sprite.index == index) sprites.push(sprite);
			}
		}
		return sprites;
	}

	update(s) {
		for (const index of this.queueIndex) {
			for (const sprite of this.getSpriteByIndex(index)) {
				sprite.update(s);
			}
		}
	}

	// draw(s) {
	//     if (this.x == "done")
	//         return;
	//     s.push();
	//     s.textSize(20);
	//     s.text(this.queue[0], this.x, this.y);
	//     s.pop();
	// }

	// add(text) {
	//     this.queue.push(text);
	// }
}

export default World;
