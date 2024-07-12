import { readFileToPathLanguage, writeFileUse } from "./function.js";

const readDataFileVi = readFileToPathLanguage("vi.json");

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
writeFileUse("useKeys.json", arrKeysVi);
