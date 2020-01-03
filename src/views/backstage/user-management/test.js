let a = {
  Administrator: 1,
  辅导员: 5,
  委员长: 6,
  歌手: 9,
  作词: 10,
  阿土曼: 11,
  权限管理员: 23,
  角色测试1223: 24,
  角色测试2222: 25,
  新增角色3333: 26,
  新增角色4444: 27
};
let b = ["Administrator", "角色测试1223", "角色测试2222"];
console.log(b);

let c = b.map(v => a[v]);
console.log(c);
