const fs = require('fs');

async function getFiles(filepath) {
	return new Promise(function (resolve, reject) {
		fs.readdir(filepath, function (err, files) {
			if (err) reject(err);
			resolve(files);
		});
	});
}
async function getSizeB(filepath) {
	return new Promise(function (resolve, reject) {
		fs.stat(filepath, function (err, stats) {
			if (err) reject(err);
			resolve(stats.size);
		});
	});
}
async function readBytes(filepath, startIndex = 0, endIndex) {
	if (endIndex === undefined) endIndex = await getSizeB(filepath) - 1;

	return new Promise(function (resolve, reject) {
		fs.open(filepath, 'r', function (err, fd) {
			if (err) reject(err);

			const buffer = new Buffer(endIndex + 1);
			fs.read(fd, buffer, 0, endIndex + 1, startIndex, function (err) {
				if (err) reject(err);
				resolve(buffer);
			});
		});
	});
}

module.exports = {
	getFiles,
	getSizeB,
	readBytes,
	createWriteStream: fs.createWriteStream,
};
