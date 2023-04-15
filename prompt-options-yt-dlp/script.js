// --------- DESCRIPTION ---------
// how it download + merge: there different type file (video/audio only, or both) - can check with `--list-formats`
// -- Filter -> Download -> Merge audio/viode (if required) -> Post-processing

/* --------- EXAMPLE COMMAND (1 line): ---------
yt-dlp
https://www.youtube.com/watch?v=U3ASj1L6_sY
-r 1M // --limit-rate
--merge-output-format mp4 // ignored if merge is not required
-S "res:720, vext:mp4, aext:mp3" // prefer larger resolution but not largen than 720p; video/audio extension
-x // --extract-audio ; prefer audio-only file
--audio-format mp3
--audio-quality 128K // equivalent to "5"           
*/

// -------- PROMPT OPTIONS (start) --------
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});
const fsPromises = require('fs/promises');
const options = {};

// listen users' input is async
const promptPromise = (query) =>
	new Promise((resolve, reject) => {
		try {
			readline.question(query, (input) => {
				resolve(input);
			});
			// (TODO) how/when to close program?
		} catch (err) {
			reject(err);
		}
	});

const promptOptions = async () => {
	options.URL = await promptPromise(`URL: `);
	options.downloadSpeed = await promptPromise(
		`Maximum download speed ( 50K OR 4.2M (bytes) ): `
	);
	console.log();

	const availableElements = ['video', 'subtitle', 'audio'];
	let keepElements = [];
	for (const el of availableElements) {
		const isKeep = await promptPromise(
			`Download ${
				el === 'audio' ? `${el}-only`.toUpperCase() : el.toUpperCase()
			} (y/n)? ` //(!) urgly hack for `audio-only`
		);
		isKeep.trim().toLowerCase() === 'y' && keepElements.push(el);
	}
	// (TODO) handle error/non-exist input
	console.log('keepElements: ', keepElements);

	for (el of keepElements) {
		console.log();
		switch (el) {
			case 'video':
				options.video = {
					quality: await promptPromise(
						`${el.toUpperCase()} quality/height ( 360, 480, 720, 1080 ): `
					),
					format: await promptPromise(
						`${el.toUpperCase()} format ( mp4, m4a wav, webm ): `
					),
					isSplitChapter: await promptPromise(
						`${el.toUpperCase()} split chapters ( y/n ): `
					),
				};
				break;
			case 'audio':
				options.audio = {
					quality: await promptPromise(
						`${el.toUpperCase()} quality ( 0~10 (best-worst) OR 128K ): `
					),
					format: await promptPromise(
						`${el.toUpperCase()} format ( mp3, aac, alac, flac, m4a, wav ): `
					),
				};
				// (TODO) improve + shorten list example: search about format + frequent use
				break;
			case 'subtitle':
				options.subtitle = {
					languages: await promptPromise(
						`${el.toUpperCase()} language ( vi(,en) ): `
					),
					format: 'srt',
					// (TODO) how to set prefer inserted sub > auto sub
				};
			default:
				break;
		}
	}

	readline.close();
	return;
};

// -------- PROMPT OPTIONS (end) --------

// ------------ CREATE COMMAND (start) ------------

let command = `yt-dlp `;
const sortingFormats = []; // (!) workaround because 1 line `-S` need data taken
// - from 2 diff iterations (video, audio)
const commandOptions = [];

// (CREDIT) setting chapter folder: https://www.reddit.com/r/youtubedl/comments/rrbu0f/how_do_i_set_a_directory_for_split_chapter_files/
// (CREDIT) prefixed width string: https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting
commandOptions.push(
	`-o "%(title)s/%(title)s.%(ext)s" -o "chapter:%(title)s/chapters/%(section_number)03d - %(section_title)s.%(ext)s"`
); // set template filename/path

const invoke = async () => {
	try {
		await promptOptions();

		for (const [opt, value] of Object.entries(options)) {
			switch (opt) {
				case 'URL':
					commandOptions.push(`${value}`);
					// (FIXME) options won't effect if URl copied from search page: e.g. https://www.youtube.com/watch?v=U3ASj1L6_sY&pp=ygUFYWRlbGU%3D
					// -must included only id: https://www.youtube.com/watch?v=U3ASj1L6_sY
					// -try write a regex: delete after `&pp`
					break;
				case 'downloadSpeed':
					commandOptions.push(`-r ${value.toUpperCase()}`);
					break;
				case 'video':
					commandOptions.push(`--merge-output-format ${value.format}`);
					commandOptions.push(
						`${value.isSplitChapter === 'y' ? '--split-chapter' : ''}`
					);
					// (!) urgly hack for coerce y/n to boolean

					sortingFormats.push(`res:${value.quality}`); //(TODO) handle 'undefined'
					sortingFormats.push(`vext:${value.format}`);
					break;
				case 'audio':
					commandOptions.push(
						`-x --audio-format ${value.format} --audio-quality ${value.quality}`
					);

					// sortingFormats.push(`aext:${value.format}`);
					break;
				case 'subtitle':
					commandOptions.push(
						`--write-subs --write-auto-subs --sub-format ${
							value.format
						} --convert-subs ${value.format} --sub-lang "${value.languages
							.split(',')
							.map((l) => l.trim() + '.*')
							.join(',')}"`
					);
				default:
					break;
			}
		}

		commandOptions.push(`-S "${sortingFormats.join(',')}"`);

		// (IDEA) not find option to split subtitle file into chapters
		options.video && options.subtitle && commandOptions.push('--embed-subs');

		options.video === undefined &&
			options.audio === undefined &&
			commandOptions.push('--skip-download'); // subtitles not need download video
		options.video && options.audio && commandOptions.push('-k'); // keep video after extract audio

		command += commandOptions.join(' ');

		console.log(options);
		console.log(command);

		fsPromises.appendFile('log.txt', `${command}\n`);
		// write and run directly through batch file (replaced child_proccess)
		fsPromises.writeFile('command.bat', `${command.replaceAll('%', '%%')}`);
		// (!) Caution: input to cmd/batch file need escape percent char (%) -> (%%)
	} catch (err) {
		throw err;
	}
};

invoke();
module.exports = invoke;

// ------------ CREATE COMMAND (end) ------------

// ------------ (legacy) EXECUTE COMMAND LINE (start) ------------

// (NOTE) child_process.exec - for buffered + send data at once
// - child_process.spawn - for stream + send data gradually
// - https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js#20643568
/*
const { spawn } = require('child_process');
const child = spawn('cmd', [
	'/c',
	'yt-dlp -o "%(title)s/%(title)s.%(ext)s" https://www.youtube.com/watch?v=U3ASj1L6_sY -r 3M -k --merge-output-format mp4 -x --audio-format mp3 --audio-quality 128K --write-subs --write-auto-subs --sub-format srt --sub-lang "vi.*,en.*" -S "res:720,vext:mp4,aext:mp3"',
	// (FIXME) quote (") works strange in this argument
]);

// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.setEncoding('utf-8');
child.stderr.setEncoding('utf-8');

child.stdout.on('data', (chunk) => {
	console.log(chunk);
});
child.stderr.on('data', (chunk) => {
	console.log(chunk);
});
// (TODO) node not display real-time/report resourceful as cmd

// since these are streams, you can pipe them elsewhere
// child.stderr.pipe(dest);

child.on('close', (code) => {
	console.log(`---- End ${code} ----`);
});
*/

/*
const { exec } = require('child_process');
exec(command, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	console.log(`stderr: ${stderr}`);
	console.log(`stdout: ${stdout}`);
});
*/
// ------------ (legacy) EXECUTE COMMAND LINE (end) ------------

// (IDEA) 'description, thumbnail' elements
// (IDEA) option for playlist download - https://youtu.be/5axVgHHDBvU (18:00)
// (IDEA) embed chapter: --embed-chapters
// (?) mp4 with same resolution - has worse value on youtube, what extension they stream?
// (?) don't fully understand why need down 2 files and merge (though already download desired mp4)
// -> the inital mp4 video not include sound
// (FIXME) hanlder default option when no enter input
// (TODO) option --split-chapters (for Youtube timestamp)
// (IDEA) after finish, prompt if want to start another download
