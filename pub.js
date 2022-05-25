const { EventEmitter } = require("events");

class Subject {
  constructor(channel) {
    this.data = "默认数据";
    this.channel = channel;
  }
  notify() {
    this.channel.emit("message", this.data);
  }
}
class Observer {
  constructor(channel, name) {
    this.name = name;
    this.channel = channel;
    this.channel.on("message", (data) => {
      console.log(`我是${this.name}, 我观察的人有最新数据是${data}`);
    });
  }
}

function test() {
  // 创建一个事件中心
  const channel = new EventEmitter();

  //创建了一个目标sub 和三个观察者obj1,obj2,obj3
  let sub = new Subject(channel, "test");
  let ob1 = new Observer(channel, 1);
  let ob2 = new Observer(channel, 2);
  let ob3 = new Observer(channel, 3);

  // ! 这是一个简单的发布订阅，发布者默认发布的是message消息
  // ! 订阅者监听的也是message消息
  sub.data = "new111";
  sub.notify();

  sub.data = "news222";
  sub.notify();
}

test();
