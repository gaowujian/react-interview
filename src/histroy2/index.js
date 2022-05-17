import React from "react";
import ReactDOM from "react-dom";

const vdom = <div>hello</div>;
console.log("vdom:", vdom);
function FunctionComponent(params) {
  return vdom;
}
class ClassComponent extends React.Component {
  render() {
    return vdom;
  }
}
console.log("函数组件的vdom", <FunctionComponent />);
const fnVdom = FunctionComponent();
console.log("fnVdom.isReactComponent:", fnVdom.isReactComponent);
console.log("类组件的vdom", <ClassComponent />);
const classVdom = new ClassComponent();
console.log("classVdom.isReactComponent:", classVdom.isReactComponent);

// console.log("React.createElement(ClassComponent):", React.createElement(ClassComponent));

// console.log("函数组件执行结果的vdom", FunctionComponent());
ReactDOM.render(React.createElement(ClassComponent), document.getElementById("root"));
