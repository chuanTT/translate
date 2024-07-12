import {
  convertKey,
  readFileToPathLanguage,
  writeFileInput,
} from "./function.js";

const readDataFileVi = readFileToPathLanguage("vi.json");

const functionArr = (obj) => {
  const arrObj = Object.keys(obj);
  return arrObj.reduce((total, key) => {
    const newKey = convertKey(key);
    if (typeof obj[key] !== "string") {
      return {
        ...total,
        [newKey]: { ...(total?.[newKey] ?? ""), ...functionArr(obj[key]) },
      };
    }

    return {
      ...total,
      [newKey]: obj[key],
    };
  }, {});
};

const newDataConvert = functionArr(readDataFileVi);
writeFileInput("data.json", newDataConvert);
