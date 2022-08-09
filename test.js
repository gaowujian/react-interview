// const nums = [1000, 2000, 3000];

// // 构建一个数组，每个元素是一个返回promise的函数, 如果每个元素是promise的话，那么相当于开始就已经同步发送了请求
// const promiseFns = nums.map((item) => {
//   return () => {
//     return new Promise((resolve, reject) => {
//       console.log(`等待${item}ms`);
//       setTimeout(() => {
//         console.log(`执行`);
//         resolve(item);
//       }, item);
//     });
//   };
// });

// async function serial(queries) {
//   const arr = [];
//   for (const query of queries) {
//     const data = await query();
//     arr.push(data);
//   }
//   return arr;
// }
// console.time("total");
// serial(promiseFns).then((data) => {
//   console.timeEnd("total");
//   console.log("data:", data);
// });

const myAsyncIterable = new Object();
myAsyncIterable[Symbol.asyncIterator] = async function* () {
  yield "hello";
  yield "async";
  yield "iteration!";
};

(async () => {
  for await (const x of myAsyncIterable) {
    console.log(x);
    // expected output:
    //    "hello"
    //    "async"
    //    "iteration!"
  }
})();
