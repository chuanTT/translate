import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { funcConvertValue } from "./function.js";
const html = readFileSync("./config/language.html", {
  encoding: "utf8",
});
const dom = new JSDOM(html);

writeFileSync("./config/language-support.txt", "", {
  encoding: "utf8",
});

dom.window.document
  .querySelectorAll("a:not([href='#'])")
  .forEach(async (elem) => {
    const text = elem.textContent.trim();
    const value = elem.getAttribute("href")?.slice(1);
    appendFileSync(
      "./config/language-support.txt",
      `${funcConvertValue(value)} - ${text}\r\n`,
      {
        encoding: "utf8",
      }
    );
  });
