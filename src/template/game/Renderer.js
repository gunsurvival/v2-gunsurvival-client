import {Manager} from "./helper/index.js";

class Renderer extends Manager {
	constructor() {
		super();
		// this.items is render queue
		this.priorityQueue = new Manager(); // queue render priority (not render queue)
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
				}
			);
			const itemB = this.priorityQueue.find(
				{
					name: b.name
				}
			);
			if (!itemA) itemA.index = 9999999;
			if (!itemB) itemB.index = 9999999;
			return itemA.index - itemB.index;
		});
	}

	clear(forceAll = false) {
		const deleteQueue = [];
		for (const item of this.items) {
			if (item.sprite || forceAll) {
				deleteQueue.push(item);
			}
		}
		for (const item of deleteQueue) {
			this.delete(item);
		}
	}
}

export default Renderer;
