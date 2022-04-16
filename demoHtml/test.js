// 对页面内的元素进行一个出现次数的排序

// const elements = document.querySelectorAll("*");
// console.log("element.length:", elements.length);
// const resultObj = {};
// for (const item of Array.from(elements)) {
//   resultObj[item.tagName] = (resultObj[item.tagName] || 0) + 1;
// }
// console.log("resultObj:", resultObj);

// const sorted = Object.entries(resultObj).sort((a, b) => {
//   return b[1] - a[1];
// });
// console.log("sorted:", sorted);

const html = document.querySelector("html");

const resultObj2 = {};
function next(el) {
  resultObj2[el.tagName] = (resultObj2[el.tagName] || 0) + 1;
  if (el.children) {
    Array.from(el.children).forEach(next);
  }
}

next(html);
console.log("resultObj2:", resultObj2);
const sorted = Object.entries(resultObj2).sort((a, b) => {
  return b[1] - a[1];
});
console.log("sorted:", sorted);
