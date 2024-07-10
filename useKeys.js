import { readFileSync, writeFileSync } from "fs";

const readDataFileVi = JSON.parse(
  readFileSync("./vi.json", {
    encoding: "utf8",
  })
);

const arrKeysVi = [];

const functionArr = (obj, arrKeys = [], str = "") => {
  const arrObj = Object.keys(obj);
  arrObj?.forEach((key) => {
    if (typeof obj[key] === "string") {
      const valueStr = `${str}.${key}`.slice(1);
      const value = obj[key];
      const useT = `t('${valueStr}')`;
      const useJSX = `{${useT}}`;
      arrKeys.push({
        key: valueStr,
        value,
        useT,
        useJSX,
      });
    } else {
      functionArr(obj[key], arrKeys, `${str}.${key}`);
    }
  });
};

functionArr(readDataFileVi, arrKeysVi);
writeFileSync("./useKeys.json", JSON.stringify(arrKeysVi));
