const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const bindResolve = this.resolve.bind(this);
    const bindReject = this.reject.bind(this);
    try {
      executor(bindResolve, bindReject);
    } catch (error) {
      bindReject(error);
    }
  }
  resolve(value) {
    if (this.state === PENDING) {
      this.state = RESOLVED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((cb) => {
        cb.call(null);
      });
    }
  }
  reject(reason) {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((cb) => {
        cb.call(null);
      });
    }
  }
  // 必须是throw不能是reject，这样前一个promise如果没有给onReject的时候才能把错误交给下一个promise,否则会出现reject未定义的问题
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    const promise2 = new MyPromise((resolve, reject) => {
      // pending的时候传入的如果是同步代码，那么resolve之后
      if (this.state === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }

      if (this.state === RESOLVED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });
    return promise2;
  }
  catch(reject) {
    return this.then(null, reject);
  }
  finally(cb) {
    return this.then(cb, cb);
  }
  static resolve(x) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (typeof x === "function" || (typeof x === "object" && x !== null)) {
        let called = false;
        try {
          const then = x.then;
          // 如果then是一个函数

          if (typeof then === "function") {
            // console.log(".then是一个函数");
            then.call(
              x,
              (y) => {
                if (called) return;
                called = true;
                resolvePromise(promise2, y, resolve, reject);
              },
              (r) => {
                if (called) return;
                called = true;
                reject(r);
              }
            );
          } else {
            resolve(x);
          }
        } catch (error) {
          if (called) return;
          called = true;
          reject(error);
        }
      } else {
        resolve(x);
      }
    });
    return promise2;
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  static All(promiseList) {
    return new Promise((resolve, reject) => {
      let counter = 0;
      const len = promiseList.length;
      const result = [];
      promiseList.forEach((promise, index) => {
        promise.then(
          (data) => {
            counter++;
            result[index] = data;
            if (counter === len) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
  static race(promiseList) {
    return new Promise((resolve, reject) => {
      promiseList.forEach((promise) => {
        promise.then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    throw new TypeError("cycling detected");
  }
  // 如果返回值 不是对象也不是函数，那么直接resolve，例如普通的数字字符串和布尔值
  // 负责需要判断thenable的情况
  // *兼容所有遵循规范的promise
  if (typeof x === "function" || (typeof x === "object" && x !== null)) {
    let called = false;
    try {
      const then = x.then;
      // 如果then是一个函数

      if (typeof then === "function") {
        // console.log(".then是一个函数");
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = MyPromise;
