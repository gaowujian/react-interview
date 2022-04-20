// 对于字面量对象
const plainObj = {};
console.log(plainObj.__proto__ === Object.prototype);

// 对于new出来的对象来说
function User() {}
const user = new User();
console.log(user.__proto__ === User.prototype);
console.log(User.prototype.constructor === User);

// 因为 User可以看做是 const User = new Function
console.log(User.__proto__ === Function.prototype);

// 有一个特殊的的例子,Function.__proto__指向的是Function.prototype 而不是 Object.prototype
// ! 类似有 Function = new Function()  需要单独记忆，其他情况下，都可以认为__proto__指向了构造函数的prototype属性
console.log(Function.__proto__ === Function.prototype);
console.log(Function.__proto__ === Object.prototype);
