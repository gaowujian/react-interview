function foo() {
  const data = new ArrayBuffer(10000000);
  return function (params) {
    console.log("data:", data);
  };
}
setInterval(() => {
  const closureFn = foo();
  closureFn();
}, 100);
