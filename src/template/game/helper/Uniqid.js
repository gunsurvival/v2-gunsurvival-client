import Manager from "./Manager.js";

class Uniqid extends Manager {
	constructor() {
		super();
	}

	gen(prefix) {
		const c = Date.now() / 1000;
		let d = c
			.toString(16)
			.split(".")
			.join("");
		while (d.length < 14) d += "0";
		return prefix ? prefix + d : d;
	}

	new(checkDuplicate = true) {
		if (checkDuplicate) {
			let uniqid = this.gen();
			while (
				this.find({
					id: uniqid
				}) != -1
			) {
				uniqid = this.gen();
			}
			return this.add({
				id: uniqid
			}).id;
		} else {
			return this.gen();
		}
	}
}

export default Uniqid;
