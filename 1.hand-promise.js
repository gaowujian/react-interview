const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(value) {
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((cb) => {
        cb.call(null, this.value);
      });
    }
  }
  reject(reason) {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((cb) => {
        cb.call(null, this.reason);
      });
    }
  }
  then(onfulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      onfulfilled = typeof onfulfilled === "function" ? onfulfilled : null;
      onRejected = typeof onRejected === "function" ? onRejected : null;
      // pending的时候传入的如果是同步代码，那么resolve之后
      if (this.state === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onfulfilled(this.value);
              resolvePromise(promise2, x);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x);
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onfulfilled(this.value);
            resolvePromise(promise2, x);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
    return promise2;
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new Error("promise和x指向同一个目标"));
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("xxx");
  }, 1000);
  console.log("同步代码1");
});
p.then(
  (data) => {
    console.log("data1:", data);
  },
  (err) => {
    console.log("err:", err);
  }
);
p.then(
  (data) => {
    console.log("data2:", data);
  },
  (err) => {
    console.log("err:", err);
  }
);
p.then(
  (data) => {
    console.log("data3:", data);
  },
  (err) => {
    console.log("err:", err);
  }
);

console.log("同步代码2");
// console.log("p:", p);
