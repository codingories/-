export default file => {
  return map[file] || null;
};

const map = {
  "/basic-settings": () => import("@/views/layout/Layout"),
  // 报修汇总: () => import("@/views/nested/menu1/index"),
  "/grade_names": () => import("@/views/basicsettings/gradenames"),
  "/classes": () => import("@/views/basicsettings/classes"),
  "/classrooms": () => import("@/views/basicsettings/classrooms"),
  "/grades": () => import("@/views/basicsettings/grades"),
  "/basic-goods": () => import("@/views/layout/Layout"),
  "/warehouses": () => import("@/views/basicgoods/warehouses"),
  "/suppliers": () => import("@/views/basicgoods/suppliers"),
  "/web/categories": () => import("@/views/basicgoods/categories"),
  "/goods": () => import("@/views/basicgoods/goods")
};
