<template>
  <div class="home-user-management"><UserList type="feed" /></div>
</template>

<script>
import UserList from "@/components/UserList";

export default {
  name: "home-user-management",
  components: {
    UserList
  }
};
</script>
