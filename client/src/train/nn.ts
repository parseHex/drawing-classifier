import NN from '../../../../learning-machine-learning/src/lib/nn';
import allData, { getTrainingData } from './data';
import * as constants from './constants';
import { shuffle } from './utils';

const savedNN = localStorage.getItem('nn-data');
let nn: NN;
if (savedNN) {
	nn = NN.deserialize(savedNN);
} else {
	nn = new NN(784, 64, 4);
}

export function trainRandom() {
	const labelI = Math.floor(Math.random() * (constants.labels.length - 1));
	const label = constants.labels[labelI];

	const dataI = Math.floor(Math.random() * allData.training[label].length);
	const data = allData.training[label][dataI];
	const output = constants.labelOutputs[labelI];
	nn.train(data, output);
}
export function trainAll() {
	const data = getTrainingData();
	shuffle(data);

	for (let i = 0; i < data.length; i++) {
		nn.train(<any>data[i].data, constants.labelOutputs[data[i].label]);
	}
}

export function predict(data: Uint8Array) {
	const prediction = nn.predict(<any>data);

	let highestVal = 0;
	let highestIndex = 0;
	for (let i = 0; i < prediction.length; i++) {
		if (prediction[i] > highestVal) {
			highestVal = prediction[i];
			highestIndex = i;
		}
	}

	return highestIndex;
}
export function save() {
	const s = nn.serialize();
	localStorage.setItem('nn-data', s);
	return s;
}
