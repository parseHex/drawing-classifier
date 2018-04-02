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

http.createServer(function (request, response) {
	let h = Object.assign({}, headers);
	let status = 200;

	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri);

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
				// console.log(request.headers);
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
