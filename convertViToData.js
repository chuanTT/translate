import { readFileSync, writeFileSync } from "fs";

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

const convertKey = (key) => {
  let str = key;
  if (str.indexOf("_")) {
    str = str.replace(/_+/g, " ");
  }
  str = capitalize(str);
  return str;
};

const readDataFileVi = JSON.parse(
  readFileSync("./vi.json", {
    encoding: "utf8",
  })
);

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
writeFileSync("./data.json", JSON.stringify(newDataConvert));
