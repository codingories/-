import store from "@/store";
const buttonpermission = {
  data() {
    return {
      name: undefined,
      buttonPermission: store.getters.buttonPermission
    };
  },

  computed: {
    buttonfunctionlist: function() {
      let k;
      let title = this.title;
      if (!title) {
        throw new Error("need title");
      }
      let buttonPermission = this.buttonPermission;

      k = buttonPermission.filter(v => v.title === title);

      for (let i of buttonPermission) {
        k = i.children.filter(v => v.title === title);
        if (k.length !== 0) {
          return k[0].children.map(v => v.title);
        }
      }

      return 123;
      // console.log("kkkk");
      // console.log(title);
      // console.log(buttonPermission);
      // console.log(k);

      // k = buttonPermission;
      // return k;

      //   buttonfunctionlist: function() {
      //     let k;
      //     let title = this.tilte;
      //     for (let i of this.mocklist) {
      //       k = i.children.filter(v => v.title === this.title);
      //     }
      //     let buttonlist = k[0].children.map(v => v.title);
      //     return buttonlist;
      //   }
    }
  }
};

export default buttonpermission;
