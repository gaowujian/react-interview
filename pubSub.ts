// 参考链接
// !https://blog.csdn.net/weixin_39963132/article/details/85221448

//调度中心
class TopicChannel {
  private publisherMap;
  private subscriberMap;
  //创建一个调度中心需要两个map：一个是发布者（存放发布者），一个是订阅组合
  constructor() {
    this.publisherMap = new Map<string, Publisher>();
    this.subscriberMap = new Map<string, Array<Subscriber>>();
  }

  //添加发布者
  addPublisher(publisher: Publisher) {
    this.publisherMap.set(publisher.id, publisher);
  }

  //移除发布者
  removePublisher(publisher: Publisher) {
    this.publisherMap.delete(publisher.id);
  }

  //订阅操作（Subscriber要订阅id为publisherId的发布者）
  subscribe(publisherId: string, subscriber: Subscriber) {
    //如果发布者-订阅者的map中有该发布者，那么就直接把该订阅者push进去，否则重新创建一组
    if (this.subscriberMap.has(publisherId)) {
      this.subscriberMap.get(publisherId).push(subscriber);
    } else {
      this.subscriberMap.set(publisherId, [subscriber]);
    }
  }

  //发布操作
  publishBaseId(publisherId: string) {
    //判断发布者map中是否有该发布者，若有，则遍历发布-订阅map中的订阅者，分别执行其提供的更
    // 新接口实现更新操作;
    if (this.publisherMap.has(publisherId)) {
      this.subscriberMap.get(publisherId).forEach((item) => {
        item.update(this.publisherMap.get(publisherId)._data);
      });
    } else {
      console.log("There is not the publisher!");
    }
  }
}
//发布者基类
class Publisher {
  private _data;
  private _id;
  private channel; //调度中心

  //创建一个发布者的实例需要指定发布者id，数据，调度中心
  constructor(defaultId, defaultData, defaultChannel: TopicChannel) {
    this._id = defaultId;
    this._data = defaultData;
    this.channel = defaultChannel;
  }

  get id() {
    return this._id;
  }

  set id(newId) {
    this._id = newId;
  }

  //当发布者发布事件时，会通过调度中心来发布
  publish() {
    this.channel.publishBaseId(this.id);
  }
}

//订阅者
class Subscriber {
  readonly _id;
  readonly _publishId;
  private channel;
  //创建一个订阅者需要订阅者id，调度中心
  constructor(id: string, topicChannel: TopicChannel) {
    this._id = id;
    this.channel = topicChannel;

    // this.subscribe(this._publishId);
  }

  //订阅事件
  subscribe(topicId: string) {
    console.log(`我是${this._id},我订阅了${topicId}`);
    this.channel.subscribe(topicId, this);
  }

  //提供的更新接口，调度中心可以调用此接口来实现通知的功能
  update(topicData: string) {
    console.log(`我是${this._id},我订阅的人刚发布的数据是${topicData}`);
  }
}

//分别实例化一个调度中心、两个发布者、两个订阅者
let topicChannel = new TopicChannel();
// 传入自己的 publisherId，并传入一个默认数据，传入绑定的事件中心
let applePublisher1 = new Publisher("apple publisher1", "foo apple1", topicChannel);
let applePublisher2 = new Publisher("apple publisher2", "foo apple2", topicChannel);
// 传入自己的subscriberid，和绑定的时间中心
let fruitSubscriber1 = new Subscriber("fruit1", topicChannel);
let fruitSubscriber2 = new Subscriber("fruit2", topicChannel);

//向调度中心添加发布者
topicChannel.addPublisher(applePublisher1);
topicChannel.addPublisher(applePublisher2);

//订阅者实现订阅操作
fruitSubscriber1.subscribe("apple publisher1");
fruitSubscriber1.subscribe("apple publisher2");
fruitSubscriber1.subscribe("apple publisher1");

// 发布者执行发布动作，实际上交给事件中心去把自己的data传递给观察者
applePublisher1.publish();
applePublisher2.publish();

// ! 实现上和观察者的区别
// 1. 建立绑定关系的时候，发布者会把观察者注册到自己的列表内; 发布订阅模式是把建立链接，维护订阅列表的任务交给了事件中心，在初始化发布者和订阅者的是时候要绑定事件中心
// 2. 通知的时候，发布者直接遍历订阅列表然后通知观察者; 发布订阅模式，发布者执行发布动作后，会交给事件中心先去查询订阅列表，再去通知订阅者
// 3. 观察者模式感觉实现1对多非常方便，发布订阅模式可以藉由事件中心维护多对多的订阅列表，会更加方便
