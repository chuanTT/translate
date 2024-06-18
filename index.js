import { readFileSync, writeFileSync } from "fs";

function convertViToEn(str, toUpperCase = false) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  str = str.replace(/\s/g, "_");

  return toUpperCase ? str.toUpperCase() : str;
}

const readDataFile = readFileSync("./data.json", {
  encoding: "utf8",
});
const dataJson = JSON.parse(readDataFile);
const arrKeys = Object.keys(dataJson);

const convertObjKey = (currentItem, value = "value") => {
  const newKey = convertViToEn(currentItem?.key);
  const objValue = {
    [newKey]: currentItem?.[value],
  };
  return objValue;
};

const funcObjChild = (currentValue) => {
  return currentValue?.reduce((total, currentItem) => {
    if (!currentItem?.key && !currentItem?.value) {
      const newObj = Object.keys(currentItem);
      const newChildObj = newObj.reduce((totalChild, keyChild) => {
        const keyStr = convertViToEn(keyChild);
        let arrCurrent = currentItem?.[keyChild];

        if (typeof arrCurrent === "string") {
          return {
            ...totalChild,
            [keyStr]: arrCurrent,
          };
        } else if(!Array.isArray(arrCurrent)) {
          arrCurrent = [arrCurrent];
        }

        return {
          ...totalChild,
          [keyStr]: funcObjChild(arrCurrent),
        };
      }, {});
      return { ...total, ...newChildObj };
    }
    const objValue = convertObjKey(currentItem);
    return { ...total, ...objValue };
  }, {});
};

const renderVi = arrKeys.reduce((total, key) => {
  const currentValue = dataJson[key];
  const newKey = convertViToEn(key)
  if (Array.isArray(currentValue)) {
    const objValue = funcObjChild(currentValue);
    return { ...total, [newKey]: objValue };
  } else if (
    typeof currentValue === "object" &&
    !currentValue?.key &&
    !currentValue?.value
  ) {
    const objValue = funcObjChild([currentValue]);
    return { ...total, [newKey]: objValue };
  } else if (typeof currentValue === "string") {
    return { ...total, [newKey]: currentValue };
  }
  return { ...total, [newKey]: convertObjKey(currentValue) };
}, {});

writeFileSync("./vi.json", JSON.stringify(renderVi));

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
