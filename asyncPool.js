function asyncPool(fn, arr, limit) {
  //   Promise.all(arr.map((item) => fn(item))).then((data) => {
  //     console.log("data:", data);
  //   });
  const result = [];
  let runningInstance = 0;
  let runningIndex = 0;
  let runningCount = 0;
  return new Promise((resolve, reject) => {
    function run() {
      while (runningInstance <= limit) {
        // 进入之后就立马加1
        runningInstance++;
        runningCount++;
        (function (i) {
          console.log("正在查询", arr[i]);
          fn(arr[i])
            .then((data) => {
              result[i] = data;
            })
            .catch((err) => {
              throw new Error(err);
            })
            .finally(() => {
              runningInstance--;
              console.log("runningCount:", runningCount);
              console.log("arr.length:", arr.length);
              if (runningCount === arr.length) {
                resolve(result);
              } else {
                run();
              }
            });
        })(runningIndex++);
      }
    }
    run();
  });
}

function getWeather(city) {
  console.log(`开始获取${city}的天气`);
  return fetch(`https://api2.jirengu.com/getWeather.php?city=${city}`).then((res) => res.json());
}

let citys = ["北京", "上海", "杭州", "成都", "武汉", "天津", "深圳", "广州", "合肥", "郑州"];
asyncPool(getWeather, citys, 2).then((results) => console.log(results));
