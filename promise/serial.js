const nums = [2, 1, 3];

// 构建一个数组，每个元素是一个返回promise的函数, 如果每个元素是promise的话，那么相当于开始就已经同步发送了请求
const promiseFns = nums.map((time) => {
  return function delay() {
    return new Promise((resolve, reject) => {
      console.log(`等待${time}s`);
      setTimeout(() => {
        console.log(`执行`);
        resolve(time);
      }, time * 1000);
    });
  };
});

// 1. 第一种 使用 reduce
// ! 第一个.then是实现多个promise的串行，第二个.then是为了获取每个promise的解析值

function serial(queries) {
  return new Promise((resolve, reject) => {
    const arr = [];
    queries
      .myReduce((memo, current, index) => {
        return memo.then(current).then((data) => {
          arr.push(data);
        });
      }, Promise.resolve())
      .then(() => resolve(arr));
  });
}
console.time("total");
serial(promiseFns).then((data) => {
  console.timeEnd("total");
  console.log("data:", data);
});

// 2. 第二种使用 async + 循环 + await
// 使用for循环才能进行阻塞，使用forEach，map等不行
// 普通for循环，forin, forof都可以，forof最常用，可以直接获取到迭代对象的每个元素最方便

// async function serial(queries) {
//   const arr = [];
//   // for (let i = 0; i < queries.length; i++) {
//   //   const query = queries[i];
//   //   const data = await query();
//   //   arr.push(data);
//   // }
//   // for (const key in queries) {
//   //   const query = queries[key];
//   //   const data = await query();
//   //   arr.push(data);
//   // }
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

// 3. while循环
// 参考和reduce的写法对比，reduce可以把上一次的结果作为下一次的输入，所以写法更加精简
// 由于while是不会阻塞的，所以query最后渠道的是一个3000的promise，所以我们需要利用利用额外的变量进行捕获
// async function serial(queries) {
//   const arr = [];
//   const totalLength = queries.length;
//   return new Promise((resolve, reject) => {
//     let p = Promise.resolve();
//     let query;

//     while (queries.length > 0) {
//       query = queries.shift();
//       const cachedQuery = query;
//       p = p
//         .then(() => {
//           // while 是循环的同步代码，第一个then是微任务，已经是同步代码执行完之后的结果了
//           // console.log("queries.length:", queries.length);
//           // 同时我们shift也是同步代码，所以query也已经变成了最后一个3秒的promise,
//           // 我们需要利用闭包的特性，缓存每一次query, 之前必须有一个变量进行缓存
//           return cachedQuery();
//         })
//         .then((data) => {
//           arr.push(data);
//           if (arr.length === totalLength) {
//             resolve(arr);
//           }
//         });
//     }
//   });
// }

// console.time("total");
// serial(promiseFns).then((data) => {
//   console.timeEnd("total");
//   console.log("data:", data);
// });

// 4. for await of
// Symbol.asyncIterator 符号指定了一个对象的默认异步迭代器。如果一个对象设置了这个属性，它就是异步可迭代对象，可用于for await...of循环。
// ! 目前没有任何类型，内置异步迭代器，我们通过自定义 Symbol.asyncIterator

// function delay(time) {
//   return new Promise((resolve, reject) => {
//     console.log(`等待${time}s`);
//     setTimeout(() => {
//       console.log(`执行`);
//       resolve();
//     }, time * 1000);
//   });
// }

// const arr = [2, 1, 3];
// function createAsyncIterable(arr) {
//   const result = [];
//   return {
//     [Symbol.asyncIterator]() {
//       return {
//         i: 0,
//         next() {
//           //   console.log("xxx:");
//           if (this.i < arr.length) {
//             return delay(arr[this.i]).then(() => {
//               result.push(arr[this.i]);
//               return {
//                 value: {
//                   current: result[this.i++],
//                   total: result,
//                 },
//                 done: false,
//               };
//             });
//           }

//           return Promise.resolve({ value: result, done: true });
//         },
//       };
//     },
//   };
// }

// (async function () {
//   console.time("total");
//   for await (item of createAsyncIterable(arr)) {
//     console.log("item:", item);
//   }
//   console.timeEnd("total");
// })();
