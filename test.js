Function.prototype.myBind = function (context) {
  const fn = this;
  return function (...args) {
    context.fn = fn;
    context.fn(...args);
    delete context.fn;
  };
};

function Fn() {
  console.log("this:", this);
}

const obj = {
  name: "wujian",
};

const bindFn = Fn.myBind(obj);

bindFn("world");
