/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a: any[]) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
}

export function map(num: number, in_min: number, in_max: number, out_min: number, out_max: number) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export function download(data: any, filename: string) {
	if (typeof data !== 'string') data = JSON.stringify(data);

	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

/**
 * Return the index of the highest element.
 */
export function maxIndex(arr: number[]) {
	let value: number = 0;
	let index: number = 0;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] > value) {
			value = arr[i];
			index = i;
		}
	}
	return index;
}
