function add(num1, num2, num3, num4) {
  return num1 + num2 + num3 + num4;
}

function curry(fn, limit) {
  if (!fn || !limit) {
    throw new Error("params requred");
  }
  console.log(11);
  let counter = 0;
  const result = [];
  return function next(...args) {
    const len = args.length;
    counter += len;
    result.push(...args);
    if (counter >= limit) {
      return result.reduce((a, b) => a + b, 0);
    } else {
      return next;
    }
  };
}
try {
  const curryAdd = curry(add);
  const result = curryAdd(1)(2)(3)(4);
  console.log("result:", result);
} catch (error) {
  console.log("error:", error);
}
