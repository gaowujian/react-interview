function callback(prev, current) {
  return prev + current;
}

// 手写 reduce
Array.prototype.myReduce = function (cb, initialValue) {
  let count = 0;
  let len = this.length;
  let prev = initialValue;
  while (count < len) {
    console.log("prev:", prev);
    prev = cb(prev, this[count]);
    count++;
  }
  return prev;
};

function sum(arr) {
  return arr.myReduce(callback, 0);
}

const arr = [1, 2, 3];
const result = sum(arr);
console.log("result:", result);
