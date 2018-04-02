import * as c from '../../../canvas/src';
import * as nn from './nn';
import * as utils from './train/utils';

c.setCanvas(<HTMLCanvasElement>document.getElementById('main'));

const guess = <HTMLSpanElement>document.getElementById('guess');
const canvas = <HTMLCanvasElement>document.getElementById('helper');
const ctx = canvas.getContext('2d');

const cx = c.getContext();

function drawLoop() {
	ctx.drawImage(cx.canvas, 0, 0, 28, 28);
	const img = ctx.getImageData(0, 0, 28, 28);
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
	c.draw.circle({
		x: position.x,
		y: position.y,
		rx: 10,
	});
});
