import {
  awaitAll,
  convertViToEn,
  fetchTranstion,
  readFileToPathConfig,
  readFileToPathLanguage,
  writeFileLanguage
} from "./function.js";

const lang = readFileToPathConfig('lang.txt', false).toString()
const inputFile = readFileToPathConfig('input.txt', false).toString()

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
    key = "";
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
      const value = await fetchTranstion({
        q: tran,
      });
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
  writeFileLanguage(`${lng}.json`, data?.[lng])
);

const dataVi = readFileToPathLanguage("vi.json");
await awaitAll(listLang, async (lang) => {
  const arrObj = Object.keys(dataVi);
  let obj = {};
  await awaitAll(arrObj, async (key) => {
    let objChild = {};
    const currentObj = dataVi[key];
    await awaitAll(Object.keys(currentObj), async (keyChild) => {
      const text = currentObj?.[keyChild];
      if (typeof text === "string") {
        const value = await fetchTranstion({
          q: text,
          lng2: lang,
          lng1: "vi"
        });
        objChild = { ...objChild, [keyChild]: value };
      }
    });
    obj = { ...obj, [key]: objChild };
  });
  writeFileLanguage(`${lang}.json`, obj)
});
