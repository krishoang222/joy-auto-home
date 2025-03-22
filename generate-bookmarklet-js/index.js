import fs from "fs";

// Source: https://github.com/caiorss/bookmarklet-maker
// format of bookmarklet: "javascript:(function:{__jscode__})();"

const bookmarkletTemplates = {
  prefix: "javascript:",
  wrapperStart: "(function(){",
  wrapperEnd: "})();",
};

function generateBookMarkLet(jsCode) {
  const bookMarklet =
    bookmarkletTemplates.prefix +
    encodeURIComponent(
      bookmarkletTemplates.wrapperStart +
        jsCode.trim() +
        bookmarkletTemplates.wrapperEnd,
    );

  return bookMarklet;
}

function decodeBookMarklet(bookmarlet) {
  const trimmedBookmarklet = bookmarlet.trim();

  if (!trimmedBookmarklet.startsWith(bookmarkletTemplates.prefix))
    throw new Error('Bookmarket must starts with prefix "javascript:"');

  const jsCodeInsideWrapper = decodeURIComponent(
    bookmarlet.trim().slice(bookmarkletTemplates.prefix.length),
  );

  const jsCode = jsCodeInsideWrapper.slice(
    bookmarkletTemplates.wrapperStart.length,
    jsCodeInsideWrapper.lastIndexOf(bookmarkletTemplates.wrapperEnd),
  );

  return jsCode;
}

const code = fs.readFileSync("./input/code_input.js", "utf8");
console.log(generateBookMarkLet(code));
