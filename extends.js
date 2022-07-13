function Parent(name) {
  this.name = name || "kevin";
  this.address = ["beijing"];
}

Parent.prototype.getName = function () {
  return this.name;
};

//继承就是可以使用Parent的所有属性和方法

// 1. 第一种就是原型链
// function Child() {}
// Child.prototype = new Parent();
// const c1 = new Child();
// console.log("c1.name:", c1.name);
// console.log("c1.getName:", c1.getName());
// const c2 = new Child();
// console.log("c2.name:", c2.address);
// c1.address.push("shanghai");
// console.log("c2.name:", c2.address);
// !缺陷：
// 1. 没办法传参
// 2. 所有子元素共享一个父亲，由于对象上的引用类型属性变化，会影响到其他人

// 2. 第二种构造函数继承

// function Child(name) {
//   Parent.call(this, name);
// }

// const c1 = new Child();
// console.log("c1.name:", c1.name);
// console.log("c1.getName:", c1.getName());
// const c2 = new Child();
// console.log("c2.name:", c2.address);
// c1.address.push("shanghai");
// console.log("c2.name:", c2.address);
// ! 缺陷
// 1. 没办法使用Parent的原型链上的方法

// 第三种 组合继承

// function Child(name) {
//   Parent.call(this, name);
// }
// Child.prototype = new Parent();
// Child.prototype.constructor = Child;
// const c1 = new Child("hua");
// console.log("c1.name:", c1.name);
// console.log("c1.getName:", c1.getName());

// const c2 = new Child();
// console.log("c2.name:", c2.address);
// c1.address.push("shanghai");
// console.log("c2.name:", c2.address);
// // * 比较完美的解决方案，保留了构造函数方式和原型链方式的优点
// // ! 缺陷: 调用了两次Parent方法, 所以实例上有address属性，并且Child.prototype上也有address，但是第二个没有必要
// console.log("child.address:", c2.address);
// console.log("Child.prototype.address:", Child.prototype.address);

// 第四种 寄生组合式继承
// 核心要解决一个问题 Child.prototype 使用非new Parent 指向 Parent.Prototype

function Child(name) {
  Parent.call(this, name);
}

// ===== 使用了一个中间的方法
// function Fn() {}
// Fn.prototype = Parent.prototype;
// const fn = new Fn();
// Child.prototype = fn;
// ====
// 上边的逻辑就是Object.create的核心逻辑
// function create(parent) {
//   function Fn() {}
//   Fn.prototype = parent.prototype;
//   const fn = new Fn();
//   return fn;
// }
// function prototype(child, parent) {
//   child.prototype = create(parent);
//   child.prototype.constructor = child;
// }
// prototype(Child, Parent);

// =====

// Child.prototype = Object.create(Parent.prototype);
// Object.setPrototypeOf(Child.prototype, Parent.prototype);
// Child.prototype.constructor = Child;

// const c1 = new Child("hua");
// console.log("c1.constructor:", c1.constructor);
// console.log("c1.name:", c1.name);
// console.log("c1.getName:", c1.getName());

// const c2 = new Child();
// console.log("c2.address:", c2.address);
// c1.address.push("shanghai");
// console.log("c2.address:", c2.address);
// console.log("child.address:", c2.address);
// // 没有构造函数指向错误
// console.log("Child.prototype.constructor:", Child.prototype.constructor);
// // 没有额外属性
// console.log("Child.prototype.constructor:", Child.prototype.address);
