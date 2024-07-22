import { JSDOM } from "jsdom";
import {
  appendFileConfig,
  funcConvertValue,
  readFileToPathConfig,
  writeFileConfig,
} from "./function.js";
const html = readFileToPathConfig("language.html", false);
const dom = new JSDOM(html);

writeFileConfig("language-support.txt", "");

const objLang = {};
dom.window.document
  .querySelectorAll("a:not([href='#'])")
  .forEach(async (elem) => {
    const text = elem.textContent.trim();
    const value = elem.getAttribute("href")?.slice(1);
    const key = funcConvertValue(value)
    objLang[key] = text;
    appendFileConfig(
      "language-support.txt",
      `${funcConvertValue(value)} - ${text}\r\n`
    );
  });

writeFileConfig("lang.json", objLang);
