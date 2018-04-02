import * as nn from './nn';
import data, { getTestingData } from './data';
import * as constants from './constants';
import { shuffle } from './utils';

interface TData {
	inputs: Uint8Array;
	label: string;
}

const crrEl: HTMLSpanElement = document.getElementById('crr');
const wrnEl: HTMLSpanElement = document.getElementById('wrn');
const cntEl: HTMLSpanElement = document.getElementById('cnt');
const accEl: HTMLSpanElement = document.getElementById('acc');

export default function test() {
	const allData = getTestingData();
	shuffle(allData);

	let correct = 0;
	let wrong = 0;
	for (let i = 0; i < allData.length; i++) {
		const prediction = nn.predict(allData[i].data);
		if (prediction === allData[i].label) {
			correct++;
		} else {
			wrong++;
		}
	}

	const accuracy = (correct / allData.length) * 100;

	crrEl.textContent = correct + '';
	wrnEl.textContent = wrong + '';
	cntEl.textContent = allData.length + '';
	accEl.textContent = (accuracy).toFixed(2);

	return accuracy;
}
