import { convertViToEn, readFileToPathInput, writeFileLanguage } from "./function.js";

const dataJson = readFileToPathInput("data.json")
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
        } else if (!Array.isArray(arrCurrent)) {
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
  const newKey = convertViToEn(key);
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

writeFileLanguage("vi1.json", renderVi)
