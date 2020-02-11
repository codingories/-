<template>
  <div class="wrapper">
    <el-button
      size="mini"
      type="primary"
      @click="goBack"
    >返回
    </el-button>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad adipisci aperiam architecto aut, dignissimos dolores est fugiat fugit harum illo ipsa ipsam maiores molestias, natus numquam pariatur perferendis porro praesentium quos! Asperiores, eius est laborum nemo non officiis quisquam reiciendis ullam veritatis voluptas! Accusamus, aliquam, cum debitis dolores ducimus ea laboriosam maiores minus modi mollitia nulla odio quia quo reprehenderit, veniam? Culpa expedita fugiat, quisquam quos rem tempore. Beatae impedit quam reprehenderit sapiente. Ad aliquid asperiores dolorum et expedita fugiat illum in ipsam, maiores necessitatibus quos, tempora, temporibus! Alias dignissimos ducimus eum hic iure nesciunt nostrum officiis reiciendis voluptatem!
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    goBack() {
      console.log(333)
      this.$emit('changeFlag')
    }
  }
}
</script>
<style scoped lang="scss">
  .wrapper {
    /*border: 5px solid red;*/
  }
</style>
