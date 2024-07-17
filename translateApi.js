import {
  awaitAll,
  readFileToPathConfig,
  readFileToPathLanguage
} from "./function.js";

const ignoreLang = ["vi", "en"];
const lang = readFileToPathConfig("lang.txt", false).toString();
// const inputFile = readFileToPathConfig("input.txt", false).toString();

const listLang = lang?.split("\r\n");
// const listInputData = inputFile?.split("\r\n");

// const func = (list, objFnc, index, arr, key) => {
//   if (list?.length <= index) {
//     console.log("stop");
//     return;
//   }
//   let arrNew = key ? arr : [];
//   let current = list?.[index];
//   let keyW = key;
//   if (current.indexOf("*") !== -1) {
//     const newKey = convertViToEn(current.slice(1));
//     keyW = newKey;
//     key = "";
//     arrNew = [];
//   } else {
//     current && arrNew.push(current);
//   }
//   key && (objFnc[key] = arrNew);
//   func(list, objFnc, index + 1, arrNew, keyW);
// };

// const obj = {};
// func(listInputData, obj, 0, []);

// writeFileConfig("log.txt", "", false);
// let ObjLang = {};
// await awaitAll(Object.keys(obj), async (key) => {
//   const currentArr = obj?.[key];
//   const newQ = currentArr?.join("~");
//   const data = await getTranslate({
//     q: newQ,
//     from: "vi",
//     to: "en",
//   });

//   let ObjVi = {};
//   let ObjEn = {};

//   Object.keys(data)?.map((key) => {
//     const value = data?.[key];
//     const newKey = convertViToEn(value);
//     ObjVi = { ...ObjVi, [newKey]: key };
//     ObjEn = { ...ObjEn, [newKey]: value };
//   });
//   ObjLang = {
//     vi: { ...(ObjLang?.vi ?? {}), [key]: ObjVi },
//     en: { ...(ObjLang?.en ?? {}), [key]: ObjEn },
//   };
// });

// Object.keys(ObjLang).map((lang) => {
//   writeFileLanguage(`${lang}.json`, ObjLang?.[lang] ?? {});
// });

const dataVi = readFileToPathLanguage("vi.json");
await awaitAll(listLang, async (lang) => {
  if (ignoreLang.includes(lang)) return;

  console.log(dataVi)
})
// await awaitAll(listLang, async (lang) => {
//   if (ignoreLang.includes(lang)) return;
//   const arrObj = Object.keys(dataVi);
//   let obj = {};
//   await awaitAll(arrObj, async (key) => {
//     let objChild = {};
//     const currentObj = dataVi[key];
//     await awaitAll(Object.keys(currentObj), async (keyChild) => {
//       const text = currentObj?.[keyChild];
//       if (typeof text === "string") {
//         const value = await fetchTranstion({
//           q: text,
//           lng2: lang,
//           lng1: "vi",
//         });
//         objChild = { ...objChild, [keyChild]: value };
//       }
//     });
//     obj = { ...obj, [key]: objChild };
//   });
//   writeFileLanguage(`${lang}.json`, obj);
// });
