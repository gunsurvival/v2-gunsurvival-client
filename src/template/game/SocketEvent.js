import * as Sprite from "./animation/sprite/index.js";

export default ({socket, utils, s} = {}) => {
	socket.on("updategame", datas => {
		for (const data of datas) {
			const sprite = s.renderer.find({
				id: data.id
			});
			if (sprite) {
				sprite.onAlive(data);
			} else {
				// console.log(data)
				// s.noLoop();
				const sprite = s.renderer.add(new Sprite[data.name](data));
				sprite.onBorn();
				if (data.name == "Player" && data.id == socket.id) {
					s.renderer.find({name: "Camera"}).follow(sprite);
				}
				if (data.name == "Bullet") {
					s.renderer.find({
						name: "Camera"
					}).shake(3);
				}
			}
		}
	})
};