var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs")
port = process.argv[2] || 8080,
	mimeTypes = {
		"html": "text/html",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"png": "image/png",
		"js": "text/javascript",
		"css": "text/css",
		"wasm": "application/wasm"
	};

const headers = {
	'cache-control': 'max-age=-1',
	'content-type': 'text/plain',
};

http.createServer(async function (request, response) {
	let h = Object.assign({}, headers);
	let status = 200;

	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri);

	if (uri === '/save-model') {
		let body = await getBody(request);
		fs.writeFile(path.resolve(__dirname, 'model.json'), body, () => { })
		response.writeHead(200);
		response.end();
		return;
	} else if (uri === '/get-model') {
		fs.readFile(path.resolve(__dirname, 'model.json'), { encoding: 'utf-8' }, (err, data) => {
			response.writeHead(200, Object.assign({}, h, {
				'content-type': 'application/json',
				// 'cache-control': 'public, max-age=360',
			}));
			response.write(data);
			response.write('\n');
			response.end();
		});

		return;
	}

	fs.exists(filename, function (exists) {
		if (!exists) {
			status = 404;
			response.writeHead(status, h);
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory())
			filename += '/index.html';

		fs.readFile(filename, "binary", function (err, file) {
			if (err) {
				status = 500;
				response.writeHead(status, h);
				response.write(err + "\n");
				response.end();
				return;
			}

			const ext = filename.split('.').pop();

			if (['bin'].includes(ext)) {
				// allow caching
				h["cache-control"] = 'public, max-age=31536000';
				status = 200;
				// status = request.headers['cache-control'] === 'no-cache' ? 200 : 304;
			}

			var mimeType = mimeTypes[ext];

			if (!mimeType) {
				mimeType = 'text/plain';
			}

			response.writeHead(status, Object.assign({}, h, { 'content-type': mimeType }));
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

function getBody(req) {
	return new Promise(function (resolve) {
		let body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			resolve(body);
		});
	})
}
