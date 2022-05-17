import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
// import * as ReactDOM from "react-dom/client";

function useMount(fn) {
  const fnRef = useRef(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = function (caller, ...args) {
      return fnRef.current.apply(caller, args);
    };
  }
  useEffect(() => {
    memoizedFn.current();
  }, []);

  // return memoizedFn.current;

  // const memoFn = useMemo(() => fn, []);
  // useEffect(() => {
  //   memoFn();
  // }, []);
}
function App() {
  const [data, setData] = useState("init");
  useMount(() => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("真实数据");
      }, 2000);
    }).then((data) => {
      setData(data);
    });
  });
  return (
    <div>
      <h1>title</h1>
      <div>数据:{data}</div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
