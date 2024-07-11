import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import UserAgent from "user-agents";

export const awaitAll = (list, asyncFn) => {
  const promises = [];

  list.map((x, i) => {
    promises.push(asyncFn(x, i));
  });

  return Promise.all(promises);
};

export const fetchTranstion = async ({ q, lng1 = "auto", lng2 = "en" }) => {
  const userAgent = new UserAgent();
  const url = new URL(
    "https://t11.freetranslations.org/freetranslationsorg.php"
  );
  url.searchParams.append("p1", lng1);
  url.searchParams.append("p2", lng2);
  url.searchParams.append("p3", q);

  const headers = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "t11.freetranslations.org",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
    "user-agent": userAgent.toString(),
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  };

  try {
    const data = await fetch(url, {
      headers: headers,
    });

    return await data?.text();
  } catch {
    return "";
  }
};

export function convertViToEn(str, toUpperCase = false) {
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

export const funcConvertValue = (target_lang) => {
  switch (target_lang) {
    case "zh-CHS":
      target_lang = "zh-CN";
      break;
    case "zh-CHT":
      target_lang = "zh-TW";
      break;
    case "nb":
      target_lang = "no";
      break;
    case "kmr":
      target_lang = "ku";
      break;
    case "mn-Cyrl":
      target_lang = "mn";
      break;
    case "mww":
      target_lang = "hmn";
      break;
  }
  return target_lang;
};

export const readFileToPath = (path, isJson = true) =>
  isJson ? JSON.parse(fs.readFileSync(path)) : fs.readFileSync(path);

export const writeFilePath = (path, data, isJson = true) =>
  fs.writeFileSync(path, isJson ? JSON.stringify(data) : data);

const __dirname = path.resolve();
const pathTranslate = path.join(__dirname, "language");

export const readFileToPathLanguage = (...arg) =>
  readFileToPath(path.join(pathTranslate, arg?.[0] ?? ""), ...arg?.slice(1));

export const writeFileLanguage = (...arg) =>
  writeFilePath(path.join(pathTranslate, arg?.[0] ?? ""), ...arg?.slice(1));
