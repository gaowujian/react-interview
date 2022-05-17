let jsonData = [
  {
    id: "1",
    pid: "0",
    name: "家用电器",
  },
  {
    id: "4",
    pid: "1",
    name: "大家电",
  },
  {
    id: "5",
    pid: "1",
    name: "生活电器",
  },
  {
    id: "2",
    pid: "0",
    name: "服饰",
  },
  {
    id: "3",
    pid: "0",
    name: "化妆",
  },
  {
    id: "7",
    pid: "4",
    name: "空调",
  },
  {
    id: "8",
    pid: "4",
    name: "冰箱",
  },
  {
    id: "9",
    pid: "4",
    name: "洗衣机",
  },
  {
    id: "10",
    pid: "4",
    name: "热水器",
  },
  {
    id: "11",
    pid: "3",
    name: "面部护理",
  },
  {
    id: "12",
    pid: "3",
    name: "口腔护理",
  },
  {
    id: "13",
    pid: "2",
    name: "男装",
  },
  {
    id: "14",
    pid: "2",
    name: "女装",
  },
  {
    id: "15",
    pid: "7",
    name: "海尔空调",
  },
  {
    id: "16",
    pid: "7",
    name: "美的空调",
  },
  {
    id: "19",
    pid: "5",
    name: "加湿器",
  },
  {
    id: "20",
    pid: "5",
    name: "电熨斗",
  },
];

function list2Tree(arr) {
  if (!arr || arr.length === 0) return null;

  //   第一层元素
  const roots = arr.filter((item) => item.pid === "0");

  //  buildTree 的定义 参数是一个树的头节点，返回值是一课构建好的树
  function buildTree(node) {
    //  查看该节点能不能作为父亲节点
    const filtered = arr.filter((item) => item.pid === node.id);
    if (filtered.length === 0) {
      return node;
    }
    // 说明有儿子节点
    const children = [];
    for (let i = 0; i < filtered.length; i++) {
      children.push(buildTree(filtered[i]));
    }

    return { ...node, children };
  }
  for (let i = 0; i < roots.length; i++) {
    roots[i] = buildTree(roots[i]);
  }
  return roots;
}
const result = list2Tree(jsonData);
console.dir(result, { depth: null });

// !实现一个无限层级 数组转树的方法
