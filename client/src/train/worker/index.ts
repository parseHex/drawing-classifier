import NN from '../../../../../learning-machine-learning/src/lib/nn';
import { shuffle, maxIndex } from '../utils';
import { Message, SlimData, StateUpdate } from '../ifc';
import {
	INPUT_NODES,
	HIDDEN_NODES,
	OUTPUT_NODES,
	LEARNING_RATE,
	ACCURACY_LOSS_THRESHOLD,
	MIN_PROGRESS_THRESHOLD,
	PATIENCE,
	labelOutputs,
} from '../constants';
import blankModel from '../../../../models/blank';

const nn = NN.deserialize(blankModel);
// const nn = new NN(INPUT_NODES, HIDDEN_NODES, OUTPUT_NODES);
nn.setLearningRate(LEARNING_RATE);

// const startMsg: Message = {
// 	type: 'new-nn',
// 	data: nn.serialize(),
// };
// postMessage(startMsg);

let trainingData: SlimData[] = [];
let testingData: SlimData[] = [];
let active: boolean = false;
let epochHistory: number[] = [];

let timeStart: number;
let timeEnd: number;

let currentEpoch: number = 0;
let accuracy: number = 0;
let correct: number = 0;
let incorrect: number = 0;

function loop() {
	if (active) {
		timeStart = performance.now();
		train();
		test();
		timeEnd = performance.now();
		epochHistory.push(accuracy);
		sendState();
		checkEarlyStop();
		if (active) {
			currentEpoch++;
		} else {
			const msg: Message = {
				type: 'early-stop',
			};
			postMessage(msg);
		}
	}
	setTimeout(loop, 10);
}
loop();

function train() {
	const data = trainingData.slice();
	data.length = Math.floor(data.length / 3);
	// shuffle(data);

	for (let i = 0; i < data.length; i++) {
		const input = <any>data[i].data;
		const target = labelOutputs[data[i].label];
		nn.train(input, target);
	}
}
function test() {
	let tCorrect: number = 0;
	let tIncorrect: number = 0;

	for (let i = 0; i < testingData.length; i++) {
		const input = <any>testingData[i].data;
		const nnOutput = nn.predict(input);
		const output = maxIndex(nnOutput);
		if (output === testingData[i].label) {
			tCorrect++;
		} else {
			tIncorrect++;
		}
	}

	correct = tCorrect;
	incorrect = tIncorrect;
	accuracy = (correct / testingData.length) * 100;
}
function sendState() {
	const state: StateUpdate = {
		epoch: currentEpoch,
		correct, incorrect, accuracy,
		nn: nn.serialize(),
		time: timeEnd - timeStart,
	};
	const msg: Message = {
		type: 'state-update',
		data: state,
	};
	postMessage(msg);
}
function checkEarlyStop() {
	const max = Math.max(...epochHistory);
	if (max - accuracy >= ACCURACY_LOSS_THRESHOLD) {
		active = false;
		return;
	}

	let streak = 0;
	for (let i = 0; i < epochHistory.length; i++) {
		const lastAccuracy = i > 0 ? epochHistory[i - 1] : 0;
		const thisAccuracy = epochHistory[i];
		if (thisAccuracy - lastAccuracy > MIN_PROGRESS_THRESHOLD) {
			streak = 0;
		} else {
			streak++;
		}

		if (streak >= PATIENCE) {
			active = false;
			return;
		}
	}
}

addEventListener('message', function (event) {
	const msg: Message = event.data;
	switch (msg.type) {
		case 'add-training-data': {
			trainingData = msg.data;
			break;
		}
		case 'add-testing-data': {
			testingData = msg.data;
			break;
		}
		case 'start': {
			active = true;
			console.log('Starting NN.');
			break;
		}
		case 'stop': {
			active = false;
			break;
		}
	}
});
