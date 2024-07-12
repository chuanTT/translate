import {
  appendFileConfig,
  convertViToEn,
  readFileToPathInput,
  writeFileConfig,
} from "./function.js";
const dataJson = readFileToPathInput("data.json");
writeFileConfig("input.txt", "");
Object.keys(dataJson).map((key) => {
  const current = dataJson?.[key];
  const newKey = convertViToEn(key);
  appendFileConfig("input.txt", `*${newKey}\r\n`);

  Object.keys(current).forEach((keyChild) => {
    const text = current?.[keyChild];
    if (typeof text === "string") {
      appendFileConfig("input.txt", `${text}\r\n`);
    }
  });
});
