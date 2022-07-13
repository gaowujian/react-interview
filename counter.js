// 使用this和self都可以指向自己作为全局对象

// 主进程给worker发送消息的回调函数
self.addEventListener("message", function (e) {
  let count = e.data;
  const timer = setInterval(() => {
    console.log("count:", count);
    // 子进程给父进程发送消息
    self.postMessage(count);
    count--;
    if (count < 0) {
      console.log("web worker倒计时结束");
      clearInterval(timer);
      // Dedicated Worker 线程中 自己关闭自己
      self.close();
    }
  }, 1000);
});
