import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { convertViToEn } from "./function.js";
const readDataFile = readFileSync("./data.json", {
  encoding: "utf8",
});
const dataJson = JSON.parse(readDataFile);
writeFileSync("./config/input.txt", "");
Object.keys(dataJson).map((key) => {
  const current = dataJson?.[key];
  const newKey = convertViToEn(key);
  appendFileSync("./config/input.txt", `*${newKey}\r\n`, {
    encoding: "utf8",
  });

  Object.keys(current).forEach((keyChild) => {
    const text = current?.[keyChild];
    if (typeof text === "string") {
      appendFileSync("./config/input.txt", `${text}\r\n`, {
        encoding: "utf8",
      });
    }
  });
});
