export default file => {
  return map[file] || null;
};

const map = {
  // 基础设置
  "/basic-settings": () => import("@/views/layout/Layout"),
  "/grade_names": () => import("@/views/basicsettings/gradenames"),
  "/classes": () => import("@/views/basicsettings/classes"),
  "/basic-classrooms": () => import("@/views/basicsettings/classrooms"),
  "/grades": () => import("@/views/basicsettings/grades"),
  // 物品基础设置
  "/basic-goods": () => import("@/views/layout/Layout"),
  "/warehouses": () => import("@/views/basicgoods/warehouses"),
  "/suppliers": () => import("@/views/basicgoods/suppliers"),
  "/web/categories": () => import("@/views/basicgoods/categories"),
  "/goods": () => import("@/views/basicgoods/goods"),
  // 物品仓储管理
  "/basic-stocks": () => import("@/views/layout/Layout"),
  "/goods/out_actions": () => import("@/views/goods/out_actions"),
  "/goods/stocks": () => import("@/views/goods/stocks"),
  "/goods/storage_actions": () => import("@/views/goods/storage_actions"),
  // 教室物品管理
  "/classroomgoodsmanage": () => import("@/views/layout/Layout"),
  "/classroom-count-records": () =>
    import("@/views/classroomgoods/classroom-count-records"),
  "/grade-classes": () => import("@/views/classroomgoods/grade-classes"),
  "/classrooms": () => import("@/views/classroomgoods/classrooms"),
  "/classroom-goods": () => import("@/views/classroomgoods/classroom-goods"),
  // 个人中心
  "/personal-center": () => import("@/views/layout/Layout"),
  "/auth/setting": () => import("@/views/personal-center/setting"),
  "/user-goods": () => import("@/views/personal-center/user-goods"),
  "/user-awards": () => import("@/views/personal-center/user-awards"),
  // 流程管理
  "/process-manage": () => import("@/views/layout/Layout"),
  "/emp": () => import("@/views/process-manage/emp"),
  "/dept": () => import("@/views/process-manage/dept"),
  "/flow": () => import("@/views/process-manage/flow"),
  "/template": () => import("@/views/process-manage/template"),
  // 报修中心
  "/repair-records": () => import("@/views/layout/Layout"),
  "/repair-maintains": () => import("@/views/repair-records/repair-maintains"),
  "/repair-total": () => import("@/views/repair-records/repair-total"),
  "/user-repairs": () => import("@/views/repair-records/user-repairs"),
  // 考勤设置
  "/attendance": () => import("@/views/layout/Layout"),
  "/attendance-rules": () => import("@/views/attendance/attendance-rules"),
  "/attendance-groups": () => import("@/views/attendance/attendance-groups"),
  "/attendance-rules-items": () =>
    import("@/views/attendance/attendance-rules-items"),
  "/attendance-statistics": () =>
    import("@/views/attendance/attendance-statistics"),
  // 部门管理
  "/depart-manage": () => import("@/views/layout/Layout"),
  "/department/market": () => import("@/views/department/market"),
  "/department/teach": () => import("@/views/department/teach"),
  // 后台设置
  "/backstage": () => import("@/views/layout/Layout"),
  "/backstage/role-management": () =>
    import("@/views/backstage/role-management"),
  "/backstage/menu-manage": () => import("@/views/backstage/menu-manage"),
  "/backstage/authority-management": () =>
    import("@/views/backstage/authority-management"),
  "/backstage/user-management": () =>
    import("@/views/backstage/user-management")
};
