import {ArrayManager} from "./helper/index.js";

class Renderer extends ArrayManager {
	constructor() {
		super();
		// this.items is render queue
		this.priorityQueue = new ArrayManager(); // queue render priority (not render queue)
	}

	render(s) {
		const deleteQueue = [];
		for (const item of this.items) {
			item.update(s);
			item.draw(s);
			if (item.deleted) deleteQueue.push(item);
		}
		for (const item of deleteQueue) {
			this.delete(item);
		}
	}

	addPriorityQueue(name) {
		this.priorityQueue.add({
			name,
			index: this.priorityQueue.getLength()
		});
	}

	usePriorityQueue(priorityQueue) {
		this.priorityQueue.clear();
		for (const name of priorityQueue) {
			this.addPriorityQueue(name);
		}
	}

	sort() {
		this.items.sort((a, b) => {
			const itemA = this.priorityQueue.find(
				{
					name: a.name
				},
				{
					returnItem: true,
					fastReturn: true
				}
			);
			const itemB = this.priorityQueue.find(
				{
					name: b.name
				},
				{
					returnItem: true,
					fastReturn: true
				}
			);
			if (!itemA) itemA.index = 9999999;
			if (!itemB) itemB.index = 9999999;
			return itemA.index - itemB.index;
		});
	}
}

export default Renderer;
