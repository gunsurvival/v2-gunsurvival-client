import * as Sprite from "./animation/sprite/index.js";

export default ({socket, utils, renderer} = {}) => {
	socket.on("updategame", datas => {
		for (const data of datas) {
			const sprite = renderer.find({
				id: data.id
			});
			if (sprite) {
				sprite.onAlive(data);
			} else {
				renderer.add(new Sprite[data.name](data));
			}
		}
	})
};