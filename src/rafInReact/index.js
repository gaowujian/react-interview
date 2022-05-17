import React from "react";
import ReactDOM from "react-dom";
// import * as ReactDOM from "react-dom/client";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // list: new Array(100000).fill(0),
      list: [],
    };
  }
  render() {
    return (
      <div>
        <h1>app组件</h1>
        <input type="text" />
        <button
          onClick={() => {
            const newList = [...this.state.list];
            const sec = newList.concat(new Array(1000).fill(0));
            this.setState({ list: sec });
          }}
        >
          添加1000
        </button>
        {this.state.list.map((item, index) => {
          return <p key={index}>{item}</p>;
        })}
      </div>
    );
  }
  componentDidMount() {
    //需要插入的容器
    // let ul = document.getElementById("container");
    let ul = document.getElementById("root");
    // 插入十万条数据
    let total = 100000;
    let pageCount = 70;
    let pages = total / pageCount;
    let curPage = 0;
    const that = this;
    function render() {
      if (curPage < pages) {
        const result = [];
        for (let i = 0; i < pageCount; i++) {
          result.push(`${curPage}:数据${Math.random()}`);
          let li = document.createElement("li");
          li.textContent = `${curPage}:数据${Math.random()}`;
          ul.appendChild(li);
        }
        const newList = that.state.list.concat(result);
        // that.setState({ list: newList });
        curPage++;
        requestAnimationFrame(render);
      }
    }

    requestAnimationFrame(render);
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
