import React, { Component } from "react";

export default class Child extends Component {
  componentWillReceiveProps() {
    console.log("receiive props");
  }
  render() {
    return <div>Child:{this.props.count}</div>;
  }
}
