<template>
  <div>
    <h1>TODO 报数记录</h1>
  </div>
</template>

<script>
export default {
  name: "CountList",
  components: {
    // UserList
  },
  beforeRouteEnter(to, from, next) {
    console.log(`from: ${from.path} practiceId: ${to.params.practiceId}`);
    next();
    // if (!from || !from.path || !from.path.startsWith("/user")) {
    //   store.dispatch(FETCH_USERS).then(() => {
    //     next();
    //   });
    // } else {
    //   next();
    // }
  },
  mounted() {
    //this.$forceUpdate();
  }
};
</script>
