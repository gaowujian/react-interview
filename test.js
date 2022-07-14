// 一个圆桌 有2n个座位，男的n个，女的n个，第一个人开始报数，报到m之后，。有一个人离席，经过n轮游戏之后剩下的人全是男生。求原来的座位序列。
// 例如 n = 3 m=2
// 男生是'B'，女生是'G', 那么序列就是 BGBGBG

function getTheOrder(n, m) {
  let allPersons = new Array(2 * n);
  let initialM = m;
  // 用于遍历数组，然后记录哪些位置的人已经走了
  let pos = 0;
  // 游戏走了n轮
  while (n > 0) {
    // 报数报了m-1次之后，退出循环开始插入
    while (m - 1 > 0) {
      // 当一个人没有离席，才有资格报数
      if (allPersons[pos] !== "G") {
        // 只有在当前位置的人没有离席才能够报数
        m--;
      }
      pos++;
      //   处理越界
      if (pos > allPersons.length - 1) {
        pos = 0;
      }
    }
    // 这时候pos是需要离席的人的下标，但是如果有人离席的话，需要找到下一个没有离席的人让他离席
    if (allPersons[pos] !== "G") {
      allPersons[pos] = "G";
    } else {
      while (allPersons[pos] === "G") {
        pos++;
        if (pos > allPersons.length - 1) {
          pos = 0;
        }
      }
      allPersons[pos] = "G";
    }

    // 报数为0之后，重置一下
    m = initialM;
    n--;
  }

  //   剩余的位置正好是N个男生，把其他位置填充为B
  for (let i = 0; i < allPersons.length; i++) {
    if (allPersons[i] !== "G") {
      allPersons[i] = "B";
    }
  }
  return allPersons;
}

console.log(getTheOrder(5, 4));
