import * as React from "react";
import * as ReactDOM from "react-dom";

class Counter extends React.Component {
  state = { number: 0 };
  buttonClick = () => {
    console.log("buttonClick");
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    // 针对上边的代码，都发生在调和阶段
    // 第一次setState之后，把第一个更新对象放到了updateQueue，
    // 然后放到把更新任务放到了scheduleSyncCallback里，
    // 然后把flushSyncCallbackQueue作为一个放到一个微任务中去
    // 打印当前宏任务内的this.state.number
    // 第二次setSte的时候，检测到root上的更新级别相同就不会再创建一次更新并放到微任务中
    // 只是会把自己的update对象放到了fiber的updateQueue里
    // 然后打印当前宏任务的this.state.number
    //然后等待宏任务结束，需要执行微任务中的更新操作，遍历调和完所有的fiber节点
    // 后commitRoot渲染到页面中
    setTimeout(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        console.log("buttonClick");
        this.setState({ number: this.state.number + 1 });
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 });
        console.log(this.state.number);
      });
    });
  };
  divClick = () => {
    console.log("divClick");
  };
  render() {
    return (
      <div onClick={this.divClick} id="counter">
        <p>{this.state.number}</p>
        <button onClick={this.buttonClick}>+</button>
      </div>
    );
  }
}
ReactDOM.render(<Counter />, document.getElementById("root"));
