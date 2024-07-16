import { getTranslate } from "./function.js";

const data = await getTranslate({
  q: "tôi có thể giúp gì cho bạn~Xin chào",
  from: "vi",
  to: "en",
});

console.log(data)
