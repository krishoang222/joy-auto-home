const fsPromises = require('fs/promises');
const path = require('path');
const getDateLocale = require('./getDateLocale');
const promptPromise = require('./promptPromise');

(async () => {
	const folderPath = await promptPromise('Folder path: ');
	const curriculum = {};
	const allNames = await fsPromises.readdir(folderPath);
	const folders = allNames.filter((name) => !path.extname(name));
	folders.unshift('.');

	// get essential lessons (pdf, html, mp4)
	for (let folder of folders) {
		const allNames_2 = await fsPromises.readdir(path.join(folderPath, folder));
		const lessons = allNames_2.filter((name) => {
			if (['.html'].includes(path.extname(name))) {
				// only allow unique .html
				// check .pdf
				const fileName = path.basename(name, '.html');
				const arrName = fileName.split(' ');
				const index = arrName[0];
				const dashedBaseName = arrName.slice(1).join('-');
				return !allNames_2.includes(index + ' ' + dashedBaseName + '.pdf');
			} else if (['.mp4', '.pdf'].includes(path.extname(name))) {
				return true;
			}
		});

		curriculum[folder] = lessons;
	}

	const fileExtOutput = '.txt';
	let fileOutput = getDateLocale() + fileExtOutput;
	// pattern: <fileOutput>[(<num>)].<ext>
	const strRegexForBaseName = path
		.basename(fileOutput, path.extname(fileOutput))
		.replace(/[\/\\^$*+?.()|[\]{}]/g, '\\$&');
	const strRegexForExtName = fileExtOutput.replace(
		/[\/\\^$*+?.()|[\]{}]/g,
		'\\$&'
	); // (!) remove '-' regex case
	const regexSuffixFiles = new RegExp(
		String.raw`^${strRegexForBaseName}(|\(\d+\))${strRegexForExtName}$`
	); //.replace() need '//' because JS will process process that part at normal string (could use another String.raw for that)
	/* (!) .replace() use to convert normal string -> regex
  (not opposite, this specific rule can't not apply origin-regex ("^$"" -> "/^/$") )
  */

	const filesInCurrentFolder = await fsPromises.readdir('./');
	// add highest-suffix if file name exist
	if (filesInCurrentFolder.includes(fileOutput)) {
		const duplicatedFiles = filesInCurrentFolder.filter((file) =>
			regexSuffixFiles.test(file)
		);
		const highestSuffixIndex = Math.max(
			...duplicatedFiles.map((file) => {
				const index = +file
					.match(new RegExp(String.raw`\(\d+\)(?=${strRegexForExtName}$)`))?.[0]
					?.replace(/\(|\)/g, '');

				return index ? index : '';
			})
		);
		fileOutput = fileOutput.replace(
			new RegExp(String.raw`${strRegexForExtName}$`),
			`(${highestSuffixIndex + 1})$&`
		);
	}

	// write to txt file
	for (let topic in curriculum) {
		await fsPromises.appendFile(fileOutput, topic + '\n'); // to enable new block in Notion
		for (lesson of curriculum[topic]) {
			await fsPromises.appendFile(fileOutput, lesson + '\n');
		}
		await fsPromises.appendFile(fileOutput, '---' + '\n\r');
	}

	process.exit();
})();
