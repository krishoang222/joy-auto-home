const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fsPromises = require("fs/promises");
const path = require("path");

const options = {
  folderPath: undefined,
  extension: undefined,
  textAppend: undefined,
};
const questions = Object.keys(options).map(
  (opt) => `${opt[0].toUpperCase()}${opt.slice(1).toLowerCase()}: `,
);

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

const prompt = async () => {
  for (const [i, prop] of Object.entries(Object.keys(options))) {
    options[prop] = await promptPromise(questions[i]);
  }

  options.extension = "." + options.extension.replace(/\./g, "");
  console.log(options + "\n");
  return { ...options };
};

const getDirFiles = async ({ folderPath, extension }) => {
  try {
    let files = await fsPromises.readdir(folderPath);
    return files.filter((f) => path.extname(f) === extension);
  } catch (err) {
    throw err;
  }
};

const appendText = async ({ folderPath, extension, textAppend }) => {
  const files = await getDirFiles({ folderPath, extension });
  for await (const f of files) {
    const newName = path.basename(f, extension) + textAppend + path.extname(f);
    const oldPath = path.join(folderPath, f);
    const newPath = path.join(folderPath, newName);
    await fsPromises.rename(oldPath, newPath);
  }
  console.log(`Appended "${textAppend}" to (${files.length}) files`);
};

// getDirFiles('E:\\me_storage\\courses\\abc');
const invoke = async () => {
  const options = await prompt();
  await appendText(options);
  process.exit();
};

invoke();

// prompt();
// (TODO) create file varialbe outside *.js (require them) -> easier for GitHub upload
// (TODO) check is Absolute to avoid misuse
// (TODO) handler extension input not have '.'
// (TODO) use readlinePromise to avoid boilerplate
// (IDEA) rename extension
// (IDEA) find & replace
