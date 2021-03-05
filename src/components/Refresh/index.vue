<template>
  <remix-icon icon-class="refresh-line" @click="refreshRoute"></remix-icon>
</template>
<script>
export default {
  name: "Refresh",
  methods: {
    async refreshRoute() {
      this.$baseEventBus.$emit("reload-router-view");
    },
  },
};
</script>
