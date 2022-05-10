//目标基类（被观察者）
class Subject {
  //一个目标包含自己本身的数据和一个观察者的列表
  constructor(data) {
    this.observerList = [];
    this.data = data;
  }
  //向列表中添加观察者（即观察动作的实现）
  add(obj) {
    if (arguments.length >= 1) {
      Array.from(arguments).forEach((item) => this.observerList.push(item));
    }
  }
  //向列表中移除观察者
  remove(observer) {
    let i = this.observerList.findIndex((ele) => ele === observer);
    if (i >= 0) {
      this.observerList.splice(i, 1);
    }
  }
  //当被观察者本身的数据发生改变时，通知观察者做出相应的改变
  notify() {
    //通过调用观察者提供的更新接口来实现更新操作
    this.observerList.forEach((item) => {
      item.update(this.data);
    });
  }
}

//观察者基类
class Observer {
  constructor(id) {
    this.id = id;
  }
  update(data) {
    console.log(`我是${this.id}, 我观察的人有最新数据是${data}`);
  }
}

//测试观察者模式的函数
function test() {
  //创建了一个目标sub 和三个观察者obj1,obj2,obj3
  let sub = new Subject("test");
  let ob1 = new Observer(1);
  let ob2 = new Observer(2);
  let ob3 = new Observer(3);

  //通过add方法实现“观察”的动作
  sub.add(ob1, ob2, ob3);
  sub.data = "new111";
  sub.notify();

  sub.remove(ob2);
  sub.data = "news222";
  sub.notify();
}

test();
