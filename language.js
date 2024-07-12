import { JSDOM } from "jsdom";
import { appendFileConfig, funcConvertValue, readFileToPathConfig, writeFileConfig } from "./function.js";
const html = readFileToPathConfig("language.html")
const dom = new JSDOM(html);

writeFileConfig("language-support.txt", "")

dom.window.document
  .querySelectorAll("a:not([href='#'])")
  .forEach(async (elem) => {
    const text = elem.textContent.trim();
    const value = elem.getAttribute("href")?.slice(1);
    appendFileConfig("language-support.txt", `${funcConvertValue(value)} - ${text}\r\n`)
  });
