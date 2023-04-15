const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

const promptPromise = (query) =>
	new Promise((resolve, reject) => {
		try {
			readline.question(query, (input) => {
				resolve(input.trim());
			});
			// (TODO) how/when to close program?
		} catch (err) {
			reject(err);
			process.exit();
		}
	});

module.exports = promptPromise;
