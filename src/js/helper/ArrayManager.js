class ArrayManager {
	constructor() {
		this.items = [];
	}

	getLength() {
		return this.items.length;
	}

	top() {
		return this.items[0];
	}

	bottom() {
		return this.items[this.items.length - 1];
	}

	clear() {
		this.items.splice(0, this.items.length);
	}

	find(query, options) {
		const isObject = typeof options == "object";

		const returnItem = Boolean(
			(isObject ? options.returnItem : arguments[1]) || false
		);
		const fastReturn = Boolean(
			(isObject ? options.fastReturn : arguments[2]) || true
		);
		// if fastReturn sẽ làm cho hàm này giống với find trong mongoDB, nhưng nếu không bật thì
		// bạn phải truyền vào biến query là chính object bạn cần tìm (ko phải shallow copy)

		const indexFind = this.items.findIndex(item => {
			const queries = fastReturn == false ? item : query;
			for (const property in queries) {
				if (query[property] != item[property]) {
					return false;
				}
			}
			return true;
		});
		if (returnItem) return this.items[indexFind];
		return indexFind;
	}

	add(item, checkDuplicate = true) {
		// addingCondition is a condition for checking duplicate of the item before adding
		if (checkDuplicate) {
			const index = this.find(item);
			if (index == -1) {
				this.items.push(item);
				return this.bottom();
			}
			return this.items[index];
		}
		this.items.push(item);
		return this.bottom();
	}

	delete(queryObject) {
		const itemIndex = this.find(queryObject);
		if (itemIndex != -1) this.items.splice(itemIndex, 1);
	}
}

export default ArrayManager;
