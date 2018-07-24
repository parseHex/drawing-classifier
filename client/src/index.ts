import * as c from 'proto-canvas';
import * as nn from './nn';
import * as utils from './train/utils';
import * as tf from '@tensorflow/tfjs';
import m from '../../../nn-ts/src/matrix';

const guess = <HTMLSpanElement>document.getElementById('guess');
const reset = <HTMLButtonElement>document.getElementById('reset');

const mainCanvas = <HTMLCanvasElement>document.getElementById('main');
const helperCanvas = <HTMLCanvasElement>document.getElementById('helper');
const helperCtx = helperCanvas.getContext('2d');
const mainCtx = mainCanvas.getContext('2d');

(<any>window).tf = tf;
(<any>window).m = m;
(<any>window).s = (t: any) => (
	t.toString().
		replace(/tensor/i, '').
		trim()
		.split('\n')
		.map((v: string, i: number) => i > 0 ? ' ' + v.trim() : v.trim())
		.join('\n')
		.replace(/^\[/, '')
		.replace(/]$/, '')
);

let changed = true;

c.setCanvas(mainCanvas);

function drawLoop() {
	if (!changed) return;

	helperCtx.drawImage(mainCtx.canvas, 0, 0, 28, 28);
	const img = helperCtx.getImageData(0, 0, 28, 28);
	let px = [];
	for (let i = 0; i < img.data.length; i += 4) {
		px.push(utils.map(img.data[i], 0, 255, 0, 1));
	}
	const g = nn.predict(px);
	guess.textContent = g;
}

c.setLoop({
	loopFunction: drawLoop,
	clearEachFrame: false,
	background: 'black',
	framerate: 10,
});

c.utility.onDrag(function (position) {
	changed = true;

	c.draw.ellipse({
		pos: {
			x: position.x,
			y: position.y,
		},
		rx: 10,
		ry: 10,
		fill: 'white',
	});
});

reset.addEventListener('click', function () {
	changed = true;
	c.utility.clear();
});
