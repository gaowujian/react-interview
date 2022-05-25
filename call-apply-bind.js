Function.prototype.MyCall = function (context, ...args) {
  console.log("this:", this);
  context.fn = this;
  return context.fn(...args);
};

const obj = {
  name: "tony",
};
function getName(age) {
  return this.name + ":" + `${age}`;
}

console.log(getName.MyCall(obj, 28));

// Function.prototype.Mybind = function (context, ...args) {
//   const fn = this;
//   return function () {
//     context.fn = fn;
//     return context.fn(...args);
//   };
// };

// const newGetName = getName.Mybind(obj, 28);
// const result = newGetName();
// console.log("result:", result);
