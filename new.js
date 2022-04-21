function User(name = "tony") {
  this.name = name;
  return false;
}
User.prototype.getName = function () {
  return this.name;
};

const user = new User();
console.log("user:", user);

// new操作都做了那些事情
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new

function _new(Fn, name) {
  // 1. 创建了一个新的对象并返回
  const obj = new Object();
  // 2.有一个__proto__指针指向构造函数的prototype属性
  obj.__proto__ = Fn.prototype;
  // 3. 我们需要让Fn执行创建的上下文中，this指向这个实例对象
  const result = Fn.call(obj, name);
  //   4.返回该对象
  return typeof result === "object" && result !== null ? result : obj;
}

const user2 = _new(User, "wujian");
console.log("user2:", user2);

// ! 实现一个_new操作符的过程，类似于实现继承
