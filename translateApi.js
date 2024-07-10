import fs from "fs";
import { awaitAll, convertViToEn, fetchTranstion } from "./function.js";

const lang = fs
  .readFileSync("./config/lang.txt", {
    encoding: "utf8",
  })
  .toString();

const inputFile = fs
  .readFileSync("./config/input.txt", {
    encoding: "utf8",
  })
  .toString();

const listLang = lang?.split("\r\n");
const listInputData = inputFile?.split("\r\n");

const func = (list, objFnc, index, arr, key) => {
  if (list?.length <= index) {
    console.log("stop");
    return;
  }
  let arrNew = key ? arr : [];
  let current = list?.[index];
  let keyW = key;
  if (current.indexOf("*") !== -1) {
    const newKey = convertViToEn(current.slice(1));
    keyW = newKey;
    key = ""
    arrNew = [];
  } else {
    arrNew.push(current);
  }
  key && (objFnc[key] = arrNew);
  func(list, objFnc, index + 1, arrNew, keyW);
};

const obj = {};
func(listInputData, obj, 0, []);


const functionTrans = async () => {
  let total = {};
  await awaitAll(Object.keys(obj), async (key) => {
    const current = obj?.[key] ?? [];
    let objChildEn = {};
    let objChildVi = {};
    await awaitAll(current, async (tran) => {
      const value = await fetchTranstion(tran);
      const newKey = convertViToEn(value);
      if (!newKey) {
        return;
      }

      if (!Object.hasOwn(objChildVi, newKey)) {
        objChildVi = { ...objChildVi, [newKey]: tran };
        objChildEn = { ...objChildEn, [newKey]: value };
      }
    });

    total = {
      vi: {
        ...(total?.vi ?? {}),
        [key]: objChildVi,
      },
      en: {
        ...(total?.en ?? {}),
        [key]: objChildEn,
      },
    };
  });

  return total;
};

const data = await functionTrans();
Object.keys(data).map((lng) =>
  fs.writeFileSync(`${lng}.json`, JSON.stringify(data?.[lng]))
);
