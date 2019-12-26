let a = [
  {
    pid: 0,
    id: 16,
    name: "托班",
    children: [{ id: 60, name: "朱思伟", pid: 16 }]
  },
  {
    pid: 0,
    id: 2,
    name: "总务室",
    children: [{ id: 1, name: "张三", pid: 2 }]
  },
  {
    pid: 0,
    id: 15,
    name: "非编人员",
    children: [
      { id: 70, name: "薛晨", pid: 15 },
      { id: 80, name: "刘涛", pid: 15 }
    ]
  },
  {
    pid: 0,
    id: 13,
    name: "大班组",
    children: [
      { id: 53, name: "邓佳慧", pid: 13 },
      { id: 55, name: "范铭珺", pid: 13 }
    ]
  },
  {
    pid: 0,
    id: 12,
    name: "中班组",
    children: [
      { id: 45, name: "李利民", pid: 12 },
      { id: 47, name: "李井泉", pid: 12 },
      { id: 48, name: "潘辰怡", pid: 12 },
      { id: 49, name: "沈雅萍", pid: 12 },
      { id: 52, name: "陈丽丽", pid: 12 },
      { id: 58, name: "李倩文", pid: 12 },
      { id: 64, name: "李杨", pid: 12 },
      { id: 66, name: "沈静", pid: 12 }
    ]
  },
  {
    pid: 0,
    id: 11,
    name: "小班组",
    children: [
      { id: 50, name: "徐晶", pid: 11 },
      { id: 51, name: "许娟娟", pid: 11 },
      { id: 57, name: "蒋昊", pid: 11 },
      { id: 59, name: "陆飞鸣", pid: 11 },
      { id: 61, name: "侯梦晓", pid: 11 },
      { id: 62, name: "徐莉", pid: 11 },
      { id: 63, name: "金恬", pid: 11 },
      { id: 65, name: "钱丽", pid: 11 },
      { id: 67, name: "许思慧", pid: 11 }
    ]
  },
  {
    pid: 0,
    id: 3,
    name: "财务室",
    children: [{ id: 40, name: "付宏莹", pid: 3 }]
  },
  {
    pid: 0,
    id: 9,
    name: "档案室",
    children: [{ id: 44, name: "高永明", pid: 9 }]
  },
  {
    pid: 0,
    id: 1,
    name: "行政室",
    children: [
      { id: 39, name: "何项麒", pid: 1 },
      { id: 42, name: "孙凯", pid: 1 },
      { id: 43, name: "许琼威", pid: 1 }
    ]
  },
  {
    pid: 0,
    id: 5,
    name: "保健室",
    children: [{ id: 41, name: "戴燕", pid: 5 }]
  },
  {
    pid: 0,
    id: 14,
    name: "园长室",
    children: [
      { id: 16, name: "张建德", pid: 14 },
      { id: 38, name: "顾文取", pid: 14 }
    ]
  },
  {
    pid: 0,
    id: 999,
    name: "其他",
    children: [
      { id: 46, name: "胡懿芃", pid: 999 },
      { id: 54, name: "薛静婷", pid: 999 },
      { id: 56, name: "张敏", pid: 999 },
      { id: 71, name: "周晨丽", pid: 999 },
      { id: 72, name: "朱吉吉", pid: 999 },
      { id: 81, name: "陈鸿伟", pid: 999 },
      { id: 82, name: "周倩", pid: 999 },
      { id: 83, name: "堵佳平", pid: 999 },
      { id: 84, name: "方久永", pid: 999 },
      { id: 85, name: "郑涵", pid: 999 },
      { id: 86, name: "张艺聪", pid: 999 },
      { id: 87, name: "黄依轩", pid: 999 },
      { id: 88, name: "黄竞", pid: 999 },
      { id: 89, name: "诸敏芳", pid: 999 },
      { id: 90, name: "齐红岩", pid: 999 },
      { id: 91, name: "徐丽群", pid: 999 },
      { id: 92, name: "刘璐璐", pid: 999 },
      { id: 93, name: "高怡", pid: 999 },
      { id: 94, name: "庄斐", pid: 999 },
      { id: 95, name: "顾乾文", pid: 999 },
      { id: 96, name: "李森飞", pid: 999 },
      { id: 97, name: "钱蕴喆", pid: 999 },
      { id: 98, name: "顾子鸣", pid: 999 },
      { id: 99, name: "张源悦", pid: 999 },
      { id: 100, name: "王珂玮", pid: 999 },
      { id: 101, name: "王静", pid: 999 },
      { id: 102, name: "吴颖越", pid: 999 },
      { id: 103, name: "严浩卿", pid: 999 },
      { id: 104, name: "陈娟", pid: 999 },
      { id: 105, name: "王美华", pid: 999 },
      { id: 106, name: "徐洁", pid: 999 },
      { id: 107, name: "陆君莉", pid: 999 },
      { id: 108, name: "周丽英", pid: 999 },
      { id: 109, name: "陆夏", pid: 999 },
      { id: 112, name: "ories", pid: 999 },
      { id: 113, name: "孙悟空", pid: 999 },
      { id: 114, name: "特朗普", pid: 999 }
    ]
  }
];

let b = [
  {
    pid: 0,
    id: 2,
    name: "总务室",
    children: [{ id: 1, name: "张三", pid: 2 }]
  },
  {
    pid: 0,
    id: 15,
    name: "非编人员",
    children: [{ id: 70, name: "薛晨", pid: 15 }]
  }
];

let c = [
  {
    pid: 0,
    id: 2,
    name: "总务室",
    children: [{ id: 1, name: "张三", pid: 2 }]
  },
  {
    pid: 0,
    id: 15,
    name: "非编人员",
    children: [
      { id: 70, name: "薛晨", pid: 15 },
      { id: 80, name: "刘涛", pid: 15 }
    ]
  },
  {
    pid: 0,
    id: 13,
    name: "大班组",
    children: [
      { id: 53, name: "邓佳慧", pid: 13 },
      { id: 55, name: "范铭珺", pid: 13 }
    ]
  }
];

let d = [
  {
    pid: 0,
    id: 2,
    name: "总务室",
    children: [{ id: 1, name: "张三", pid: 2 }]
  },
  {
    pid: 0,
    id: 15,
    name: "非编人员",
    children: [{ id: 70, name: "薛晨", pid: 15 }]
  }
];

function filterObj(c, d) {
  let numberList = [];
  let indexList = [];
  for (let i = 0; i < c.length; i++) {
    for (let j = 0; j < d.length; j++) {
      if (c[i].id === d[j].id) {
        let obj = {};
        console.log(i, j, c[i].id, d[j].id);
        indexList.push(i);
        numberList.push(obj);
      }
    }
  }

  let tempnamelist = {};
  for (let i of d) {
    for (let j of i.children) {
      let name = j.name;
      tempnamelist[name] = null;
    }
  }
  console.log(tempnamelist);

  ids = [];
  for (let i = 0; i < d.length; i++) {
    for (let j = 0; j < d[i].children.length; j++) {
      ids.push(d[i].children[j].id);
    }
  }

  let e = c[1].children;
  let filterE = e.filter(i => {
    return i.name in numberList;
  });
  for (let i of indexList) {
    c[i].children = c[i].children.filter(i => {
      return !(i.name in tempnamelist);
    });
  }
  return c;
}

console.log(c);
console.log(d);

let ids = d.map(v => v.id);
let result = c.filter(v => !ids.includes(v));

console.log("rrr");
console.log(result);
// console.log(filterObj(c, d));

// let numberList = [];
// let indexList = [];
// for (let i = 0; i < c.length; i++) {
//   for (let j = 0; j < d.length; j++) {
//     if (c[i].id === d[j].id) {
//       let obj = {};
//       //   obj[c[i].id.toString()] = null;
//       //   obj[c[i].name.toString()] = null;
//       console.log(i, j, c[i].id, d[j].id);
//       indexList.push(i);
//       numberList.push(obj);
//     }
//   }
// }

// let tempnamelist = {};
// for (let i of d) {
//   for (let j of i.children) {
//     let name = j.name;
//     tempnamelist[name] = null;
//   }
// }
// console.log(tempnamelist);

// ids = [];
// for (let i = 0; i < d.length; i++) {
//   for (let j = 0; j < d[i].children.length; j++) {
//     ids.push(d[i].children[j].id);
//   }
// }

// let e = c[1].children;
// let filterE = e.filter(i => {
//   return i.name in numberList;
// });
// for (let i of indexList) {
//   c[i].children = c[i].children.filter(i => {
//     return i.name in tempnamelist;
//   });
// }
// return c
