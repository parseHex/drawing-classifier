import allData, { load, getTestingData, getTrainingData } from './data';
import { download } from './utils';
import { Message, StateUpdate } from './ifc';

const w = new Worker('build/nn.worker.bundle.js');

let latestState: StateUpdate = <any>{};
let active = false;

document.getElementById('start').addEventListener('click', () => {
	const msg: Message = {
		type: 'start',
	};
	w.postMessage(msg);
});
document.getElementById('stop').addEventListener('click', () => {
	const msg: Message = {
		type: 'stop',
	};
	w.postMessage(msg);
});
document.getElementById('save').addEventListener('click', () => {
	const model = JSON.stringify(latestState.nn);
	fetch('/save-model', {
		body: model,
		headers: {
			'content-type': 'application/json'
		},
		method: 'POST',
	});
});

(async function () {
	await load();

	// console.log('loaded');

	w.addEventListener('message', handleMessage);

	let msg: Message = {
		type: 'add-training-data',
		data: getTrainingData(),
	};
	w.postMessage(msg);

	msg = {
		type: 'add-testing-data',
		data: getTestingData(),
	};
	w.postMessage(msg);

	msg = {
		type: 'start',
	};
	w.postMessage(msg);
})();

function handleMessage(event: MessageEvent) {
	const msg: Message = event.data;
	switch (msg.type) {
		case 'state-update': {
			latestState = msg.data;
			console.group('Epoch ' + latestState.epoch);
			console.log('Accuracy: ' + latestState.accuracy + '%');
			console.log('Correct: ' + latestState.correct);
			console.log('Incorrect: ' + latestState.incorrect);
			console.log(latestState.time.toFixed(2) + 'ms');
			console.groupEnd();
			break;
		}
		case 'early-stop': {
			console.log('Training has stopped.');
			break;
		}
	}
}
