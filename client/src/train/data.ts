import * as constants from './constants';
import { map } from './utils';
import * as ifc from './ifc';

export interface Data {
	[x: string]: any;
	diamond: Uint8Array[];
	donut: Uint8Array[];
	fork: Uint8Array[];
	hexagon: Uint8Array[];
}
export interface DataList {
	training: Data;
	testing: Data;
}

let merged: ifc.SlimData[] = [];
let training: ifc.SlimData[] = [];
let testing: ifc.SlimData[] = [];

const allData: DataList = {
	training: {
		diamond: null, donut: null, fork: null, hexagon: null,
	},
	testing: {
		diamond: null, donut: null, fork: null, hexagon: null,
	},
}

export async function load() {
	const { labels } = constants;

	for (let i = 0; i < labels.length; i++) {
		const buffer = await download(`data/${labels[i]}1000.bin`);
		const bytes = new Uint8Array(buffer);

		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = map(bytes[i], 0, 255, 0, 1);
		}

		let data: Uint8Array[] = [];
		for (let k = 0; k < bytes.length - 1; k += 784) {
			const d = bytes.slice(k, k + 784);
			// console.log(k / 784);
			const pile = k / 784 < 800 ? training : testing;
			// const pile = Math.random() > constants.TESTING_AMOUNT ? training : testing;
			pile.push({
				data: d,
				label: i,
			});
		}
	}
}
export function getTrainingData() {
	return training.slice();
}
export function getTestingData() {
	return testing.slice();
}
export default allData;

async function download(url: string) {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	return buffer;
}
