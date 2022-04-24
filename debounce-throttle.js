function debounce(fn, ms) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, ms);
  };
}

function throttle(fn, ms) {
  let timer;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, ms);
  };
}
