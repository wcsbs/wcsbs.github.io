<template>
  <div class="home-my-feed"><RwvArticleList type="feed" /></div>
</template>

<script>
import RwvArticleList from "@/components/ArticleList";

export default {
  name: "home-my-feed",
  components: {
    RwvArticleList
  }
};
</script>
