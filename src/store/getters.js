const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  access_token: state => state.user.access_token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  routerList: state => state.user.RouterList,
  roles: state => state.user.roles,
  buttonPermission: state => state.user.ButtonPermission
};
export default getters;
