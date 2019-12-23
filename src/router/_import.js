export default file => {
  return map[file] || null;
};

const map = {
  报修中心: () => import("@/views/layout/Layout"),
  // 报修汇总: () => import("@/views/nested/menu1/index"),
  我的报修: () => import("@/views/nested/menu1/menu1-1"),
  我的维修: () => import("@/views/nested/menu1/menu1-2"),
  Menu2: () => import("@/views/nested/menu2/index"),
  form: () => import("@/views/layout/Layout"),
  Form: () => import("@/views/form/index"),
  Example: () => import("@/views/layout/Layout"),
  Table: () => import("@/views/table/index"),
  Tree: () => import("@/views/tree/index")
};
