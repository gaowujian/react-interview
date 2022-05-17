import React, { Component } from "react";
import "./style.css";
import Child from "./Child";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "gaowujan",
      age: 28,
      count: 0,
    };
  }

  handleAdd = () => {
    this.setState({ count: this.state.count + 1 }, () => {
      console.log("this.state:", this.state);
    });
    console.log("同步:", this.state);
    this.setState({ count: this.state.count + 1 }, () => {
      console.log("this.state:", this.state);
    });
    console.log("同步:", this.state);

    setTimeout(() => {
      this.setState({ count: this.state.count + 1 }, () => {
        console.log("this.state:", this.state);
      });
      console.log("同步:", this.state);
      this.setState({ count: this.state.count + 1 }, () => {
        console.log("this.state:", this.state);
      });
      console.log("同步:", this.state);
    }, 1000);
  };
  render() {
    const { count } = this.state;
    return (
      <div>
        <div className="form">
          <Child count={this.state.count} />
          {count}
          <button onClick={this.handleAdd}>+</button>
          <br />
          {JSON.stringify(this.state)}
          <div className="form-item">
            <label htmlFor="user">用户名</label>
            <input type="text" name="user" />
          </div>
          <div className="form-item">
            <label htmlFor="age">年龄</label>
            <input type="text" name="age" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
