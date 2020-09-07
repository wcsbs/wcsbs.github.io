<template>
  <div v-if="isLoadingPracticeCounts" class="classSession-preview">
    正在获取报数记录...
  </div>
  <div v-else>
    <Practice
      :practice="practiceInfo.practice"
      :latestPracticeCount="buildLatestPracticeCount()"
      :practiceCounts="practiceInfo.counts"
    />
  </div>
</template>

<script>
import store from "@/store";
import { FETCH_PRACTICE_COUNTS } from "../store/actions.type";
import { mapGetters } from "vuex";
import Practice from "@/components/Practice";

export default {
  name: "CountList",
  components: {
    Practice
  },
  computed: {
    ...mapGetters(["isLoadingPracticeCounts", "practiceInfo"])
  },
  beforeRouteEnter(to, from, next) {
    const practiceId = to.params.practiceId;
    console.log(`from: ${from.path} practiceId: ${practiceId}`);

    store.dispatch(FETCH_PRACTICE_COUNTS, practiceId).then(() => {
      next();
    });
  },
  methods: {
    buildLatestPracticeCount() {
      var latestPracticeCount = {};
      if (this.practiceInfo.counts[0]) {
        latestPracticeCount = {
          count: this.practiceInfo.counts[0].get("count"),
          reportedAt: this.practiceInfo.counts[0].get("reportedAt"),
          accumulatedCount: this.practiceInfo.counts[
            this.practiceInfo.counts.length - 1
          ].get("count")
        };
      }
      return latestPracticeCount;
    }
  },
  mounted() {
    //this.$forceUpdate();
  }
};
</script>
