const random = (start, end, round = false) => {
	let out = Math.random() * (end - start + 1) + start;
	if (round) out = Math.floor(out);
	return out;
};

const shuffle = arr => {
	// thuật toán bogo-sort
	let count = arr.length,
		temp,
		index;

	while (count > 0) {
		index = Math.floor(Math.random() * count);
		count--;
		temp = arr[count];
		arr[count] = arr[index];
		arr[index] = temp;
	}

	return arr; //Bogosort with no điều kiện dừng
};

export {random, shuffle};
