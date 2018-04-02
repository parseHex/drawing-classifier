const path = require('path');
const fs = require('./fs');

const num = +process.argv[2] || 100; // how many samples to generate
const dataStartIndex = 80;
const dataSizeB = 784;

(async function () {
	const datapath = path.resolve(__dirname, '../data');
	let files = await fs.getFiles(datapath);
	// get rid of mischievous files like .DS_Store
	files = files.filter((file) => file[0] !== '.');

	files.map(makeFile);
})();

async function checkFile(file) {
	const filepath = path.resolve(__dirname, '../data', file);

	const size = await fs.getSizeB(filepath);
	const count = (size - dataStartIndex) / dataSizeB;

	console.log(`${file.replace('.npy', '')}: ${count} drawings`);
}

async function makeFile(file) {
	const filepath = path.resolve(__dirname, '../data', file);
	const destPath = path.resolve(__dirname, '../client/data', file.replace('.npy', num + '.bin'));

	const startIndex = dataStartIndex;
	const endIndex = num * dataSizeB;

	const buffer = await fs.readBytes(filepath, startIndex, endIndex);

	const wStream = fs.createWriteStream(destPath);
	wStream.write(buffer);
	wStream.end();
}
