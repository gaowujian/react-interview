# 对 react 的理解

用于构建用户界面的 javascript 库

1. 声明式编程
   1. reactDom.render 就是一个声明式的 api
   2. 使用 document.createElment 等 去进行 dom 的创建，事件的绑定等属于面向过程变成，也就是命令式方式
   3. 原理：基于 jsx 语法
2. 组件化
   1. 方便页面的拆分
   2. 增强复用性
3. 一次学习，随处编写
   1. 可以用于开发 web，移动端和桌面端等不同产品
   2. 利用虚拟 dom 实现跨平台

在 react17 增添了更新优先级 lane 模型，替代了之前的 expireTime

# 为什么引入 jsx

1. jsx 是一个 js 语法的拓展，虽然是 js，但是能很好的描述 UI 的样子
2. 本质是一个 React.createElement()
3. 实现声明式，需要一个 App 的 div，就创建一个 <App/>
4. 不像 vue 和 angular 等模板语法，不引入新概念和新语法，只写 javascript
5. 在使用 babel/plugin-transform-react-jsx 的时候，可以使用 {runtime: classic/automatic}

# 对 virtual dom 的理解

- vdom 就是一个 js 对象，用来描述真实 dom 的样子。
  ```
   const vdom = <div id="1">hello</div>
   等价于
   const vdom = React.createElement("div",{"id":1},"hello")
  ```
  - 不同类型组件，返回的 vdom 的 type 类型不同
    - 普通的 html 标签: type: "div"
    - 函数组件: type: function Func(){}
    - 类组件: type: function ClassComp(){}
    -
- ReactNode 和 ReactElement， 一般在开发中都是用到了 ReactElement
  1.  reactNode 可以认为是任何可以渲染的内容，
  2.  reactelement 是具有 key,props,ref,type 等属性的一个供 react 使用的 js 对象
- vdom
  ## 优势
  1.  vdom 解决了不同浏览器真实 dom 操作方式的差异，例如真实 dom 的事件绑定，减少出错
  2.  可以防范 xss 攻击
      1.  会对内容进行转义
  3.  vdom 实现了跨平台，因为只是一个 js 对象，在不同平台提供了 js 运行环境即可
      1. vdom 由 react 包提供
      2. 把 vdom 渲染到不同的位置需要其他的包
         1. react-dom 可以把 vdom 渲染到 web 页面中
  4.  实现差异化的更新，减少更新 dom 的操作，但是不一定会比操作真实 dom 更加快
  ## 劣势
  1. 需要消耗额外的内存
  2. 首次渲染不一定会比直接写 html css js 更快

# 类组件和函数组件的不同

## 区别类组件和函数组件

```
 不使用JSX的方式，直接调用或者创建类实例的方式生成vdom对象
 根据vdom上是否有isReactComponent表示，来判断是否是一个类创建的vdom
 原型上的属性 Component.prototype.isReactComponent={}, 业务的类组件会继承这个react的Component组件
 const fnVdom = FunctionComponent();
 console.log("fnVdom.isReactComponent:", fnVdom.isReactComponent);// undefined
 const classVdom = new ClassComponent();
 console.log("classVdom.isReactComponent:", classVdom.isReactComponent); // {}
```

## 相同

    都可以接受props并返回 react元素

## 不同

1.  类组件有实例，有状态；函数组件，之前没有状态，在使用 hooks 之后也有状态
2.  类组件有声明周期，可以在不同的周期写自己的逻辑；函数组件，在有 hooks 之后通过 ueseffect 实现类似生命周期的效果
3.  类组件的逻辑分布在不同的声明周期中，服用到其他组件使用，HOC 或者 renderProps；函数组件的逻辑复用可以使用 hooks，在平级就可以进行实现
4.  优化：类组件可以 pureComponent 或者自定义 shouldComponentUpdate 控制组件是否跳过渲染，函数组件可以通过 React.memo
    1.  pureComponent 内使用的是浅比较，例如两个对象类型只比较对象的第一层属性，不会深层比较；
    2.  既想要实现深层比较的效果，又不想损失性能，需要使用 immer 或者 immuatablejs

# react 的渲染流程

## 大纲

1. 设计理念
2. 关键原理，抽象和具象
3. 工程实践

## 设计理念

    1. 跨平台渲染=>虚拟DOM
    2. 快速响应=>异步可中断+增量更新
       1. 渲染10w条数据
       2. ReactDOM.render()同步，也使用了fiber架构，但是没有中断功能
       4. 增量更新：根据dom diff进行准确更新

## 实现一次渲染流程

主要有几个函数用于提示

1. workloop：一个 while 循环，执行所有的 fiber 单元
2. performUnitOfWork：用于处理一个 fiber 所有的操作
3. beginWork：根据当前 fiber 和子 vdom 创建所有的子 fiber，并建立父亲和儿子，儿子和儿子以及儿子返回父亲所需的所有 fiber 结构指针
4. completeWork：从子 fiber 归，
   1. 在这个函数内创建真实 dom
   2. 构建一个 dom 操作的 effectlist，同时用于合并给父亲
5. commitRoot：
   1. 等 rootFiber 完成 completeWork 之后，从子 fiber 中合并的 effectlist 也已经准备就绪
   2. 遍历 effectlist，把创建的 dom 元素插入到页面中去

## ReactDOM.render

1. 确定哪些更新 调度
2. 确定更新内容 调和 （异步可中断)
3. 提交 commit 提交 （同步不可终端）

## vdom 和 fiber 节点

需要根据 jsx 的 vdom 对象去创建 fiber 节点，在保留了 vdom 上的属性之上，添加 tag 属性表明 fiber 节点类型，以及 return sibling 等链条

```
// 准备工作
function workLoop() {
  while (workInProgress) {
      workInProgress = performUnitOfWork(workInProgress);
  }
}
let rootFiber = {
  tag: TAG_ROOT,
  key: 'ROOT',
  stateNode: document.getElementById('root'),
  props: { children: [A] }
}

workInProgress=rootFiber;
workLoop();

// 从rootFiber开始处理真个fiber链条

function performUnitOfWork(fiber) {
  // 在beginfiber函数中，根据当前fiber和fiber中的children vdom去创建子fiber
  // 建立当前fiber和所有儿子之间，儿子和儿子之间，以及儿子返回父亲的所有fiber指针
  beginWork(fiber);

  if (fiber.child) {
    //如果子节点就返回第一个子节点
      return fiber.child;
  }

  while (fiber) {
    //如果没有子节点说明当前节点已经完成了渲染工作
    // 在complete函数中，开始针对当前的fiber节点进行真实dom的创建
    // 这是最难点！！！！！completeUnitOfWork中有一个makeEffectlist函数
    // 构建一个副作用列表，例如dom的创建，更新，删除等
     completeUnitOfWork(fiber);//可以结束此fiber的渲染了

      if (fiber.sibling) {//如果它有弟弟就返回弟弟
          return fiber.sibling;
      }
      fiber = fiber.return;//如果没有弟弟让爸爸完成，然后找叔叔
  }
}
```

### 构建 effectlist 链表，用于真实 dom 的修改

```
+function makeEffectList(completedWork){
+  const returnFiber = completedWork.return;
+  if (returnFiber) {
+    if (!returnFiber.firstEffect) {//父亲为空就指向儿子的子链表
+      returnFiber.firstEffect = completedWork.firstEffect;
+    }
+    if (completedWork.lastEffect) {//父亲非空就父亲老尾下一个指向儿子子链表头,父亲尾指出儿子子链表头
+      if (returnFiber.lastEffect) {
+          returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
+      }
+      returnFiber.lastEffect = completedWork.lastEffect;//父亲的尾指向自己的尾
+    }
+    if (completedWork.flags) {
+          if (returnFiber.lastEffect) {//如果父亲有尾，尾巴下一个指向自己
+              returnFiber.lastEffect.nextEffect = completedWork;
+          } else {//如果父亲没有尾，父亲的头毛都指向自己
+              returnFiber.firstEffect = completedWork;
+          }
+          returnFiber.lastEffect = completedWork;
+    }
+  }

```

### 渲染真实 dom

渲染真实 dom 的过程就很简单了，就是遍历 rootFiber 上的 effectList 链表，然后根据不同的 flags 类型进行 dom 元素的增删改查

# dom diff 算法

dom diff 的两个比较对象是 渲染页面上的 fiber 对象和新的 vdom 进行对比，结果就是一个新的 fiber 树

## 遵循 dom diff 的规则，可以优化效率

优化也就是尽可能去复用老的 dom，减少 dom 的操作

1. dom 节点的复用发生在同层，dom 节点跨层移动不会复用
2. 不同类型的元素会产生不同的结果，react 也不会复用
3. 可以通过 key 来识别移动的元素，并进行复用（同层，通类型）

### 不建议使用 index 作为 key

https://blog.csdn.net/weixin_46318413/article/details/122546587

## 老 fiber 多个节点，新 vdom 只有一个节点

1.

## 老 fiber 多个节点，对应的新 vdom 也有多个节点

# 合成事件的理解

- **触发时机**：等到事件对象冒泡到 document 对象上之后
- React 把事件委托到 document 对象上
- 当真实 DOM 元素触发事件,先处理原生事件，然后会冒泡到 document 对象后,再处理 React 事件
- React 事件绑定的时刻是在 reconciliation 阶段,会在原生事件的绑定前执行，也就是通过 ref 添加事件处理函数
- 目的和优势
  - 进行浏览器兼容,React 采用的是顶层事件代理机制，能够保证冒泡一致性
  - 事件对象可能会被频繁创建和回收，因此 React 引入事件池,在事件池中获取或释放事件对象(React17 中被废弃)

1. 磨平浏览器的差异
2. 减少内存的开销，可以对事件对象进行重用

## 模拟实现 react 事件机制

1. react 提前就在 document 已经注册好了 click 等事件处理函数
2. 等原生 dom 事件触发的时候，会先进行原生事件的捕获，然后原生事件的冒泡
3. 等冒泡到 document 的时候，开始执行 react 模拟的事件捕获和冒泡顺序，也就是触发了 dispatchEvent 事件处理函数，内部模拟合成事件流程
4. 由于 react 提前绑定好了冒泡的事件处理函数函数，所以自己绑定的原生 document 函数也会在 react 事件处理机制后才执行

```
document.addEventListener('click',dispatchEvent);
function dispatchEvent(event,isCapture){
    let paths = [];
    let current = event.target;
    while(current){
        paths.push(current);
        current=current.parentNode;
    }
    for(let i=paths.length-1;i>=0;i--){
        let eventHandler = paths[i].onClickCapture;
        eventHandler&&eventHandler()
    }
    for(let i=0;i<paths.length;i++){
        let eventHandler = paths[i].onClick;
        eventHandler&&eventHandler()
    }
}
```

## react 16 实现模态框

效果

1. 点击按钮弹出模态框 btn 添加事件 显示
2. 点击其他区域让模态框消失 document 添加事件 消失

需要利用到原生事件的 stopImmediatePropagation，来阻止我们绑定在 document 上的点击事件触发；
因为我们所有的合成事件处理函数都绑定在了 document 上，所以现在 document 上有两个 click，先是 react 的合成事件让模态框显示，然后是原生事件让模态框消失，所以必须要阻止，同时要使用 stopImmediatePropagation 来阻止同级事件的触发

```
import * as React from "react";
import * as ReactDOM from "react-dom";
class Dialog extends React.Component {
  state = { show: false };
  componentDidMount() {
    document.addEventListener("click", () => {
      this.setState({ show: false });
    });
  }
  handleButtonClick = (event) => {
    //event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({ show: true });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleButtonClick}>显示</button>
        {this.state.show && <div onClick={(event) => event.nativeEvent.stopImmediatePropagation()}>Modal</div>}
      </div>
    );
  }
}
ReactDOM.render(<Dialog />, document.getElementById("root"));

```

## react 17 实现模态框

不用使用 event.nativeEvent.stopImmediatePropagation(), 而是可以直接使用 event.stopPropagation()。 这是因为我们的事件绑定在 root 上，属于 document 的子元素，阻止事件传播的时候直接阻止向上冒泡传播就可以，而不用使用阻止同级冒泡传播。

# setState 是同步还是异步的

lane:赛道 有 31 条
priority：优先级 有 16 条
他们之间有一个对应关系

合成事件内是异步的；setTimeout 中是同步的；
默认的情况下，所有的都是同步的；但是在合成事件中，会在事件处理函数外层包裹一个 batchedUpdate 用于切换上下文到批量更新，所以会产生异步的效果

# react 15 和 16 的区别
