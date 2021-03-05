<template>
  <div :class="classObj" class="vue-admin-wrapper">
    <div
      :class="{
        fixed: true,
        'no-tabs-bar': false,
      }"
      class="layout-container-vertical"
    >
      <div
        v-if="device === 'mobile' && !collapse"
        class="mask"
        @click="handleFoldSideBar"
      ></div>
      <side-bar></side-bar>
      <div :class="collapse ? 'is-collapse-main' : ''" class="vab-main">
        <div :class="true ? 'fixed-header' : ''" class="layout-header">
          <nav-bar></nav-bar>
          <tabs-bar />
        </div>
        <app-main></app-main>
      </div>
    </div>

    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { tokenName } from "@/config";

export default {
  name: "Layout",

  data() {
    return {
      oldLayout: "",
      width: 0,
    };
  },

  computed: {
    ...mapGetters({
      layout: "settings/layout",
      collapse: "settings/collapse",
      device: "settings/device",
      handleFoldSideBar: "settings/foldSideBar",
    }),
    classObj() {
      return {
        mobile: this.device === "mobile",
      };
    },
  },

  created() {
    document.getElementsByTagName("body")[0].className = `theme-white`;
  },

  beforeMount() {
    window.addEventListener("resize", this.handleLayouts);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleLayouts);
  },

  mounted() {
    this.oldLayout = this.layout;
    this.handleLayouts();

    this.$nextTick(() => {
      window.addEventListener(
        "storage",
        (e) => {
          if (e.key === tokenName && (e.key === null || e.value === null))
            window.location.reload();
        },
        false
      );
    });
  },

  methods: {
    ...mapActions({
      handleChangeLayout: "settings/changeLayout",
      handleToggleDevice: "settings/toggleDevice",
    }),

    handleLayouts() {
      const width = document.body.getBoundingClientRect().width;
      if (this.width !== width) {
        const isMobile = width - 1 < 992;
        this.handleChangeLayout(isMobile ? "vertical" : this.oldLayout);
        this.handleToggleDevice(isMobile ? "mobile" : "desktop");
        this.width = width;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vue-admin-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  /* 手机端开始 */
  &.mobile {
    ::v-deep {
      .el-pager,
      .el-pagination__jump {
        display: none;
      }
      .layout-container-vertical {
        .el-scrollbar.side-bar-container.is-collapse {
          width: 0;
        }
        .vab-main {
          width: 100%;
          margin-left: 0;
        }
      }
      .vab-main {
        .fixed-header {
          left: 0 !important;
          width: 100% !important;
        }
      }
    }
  }
  /* 手机端结束 */
}

.layout-header {
  box-shadow: $base-box-shadow;
}

.layout-container-vertical {
  position: relative;

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index - 1;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #000;
    opacity: 0.5;
  }

  &.fixed {
    padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
  }

  &.fixed.no-tabs-bar {
    padding-top: $base-nav-bar-height;
  }

  .vab-main {
    position: relative;
    width: auto;
    min-height: 100%;
    margin-left: $base-left-menu-width;
    background: #f6f8f9;
    transition: $base-transition;

    ::v-deep {
      .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        left: $base-left-menu-width;
        z-index: $base-z-index - 2;
        width: $base-right-content-width;
        overflow: hidden;
        transition: $base-transition;
      }

      .nav-bar-container {
        position: relative;
        box-sizing: border-box;
      }

      .tabs-bar-container {
        box-sizing: border-box;
      }

      .app-main-container {
        width: calc(100% - #{$base-padding} - #{$base-padding});
        margin: $base-padding auto;
        background: $base-color-white;
        border-radius: $base-border-radius;
      }
    }

    &.is-collapse-main {
      margin-left: $base-left-menu-width-min;

      ::v-deep {
        .fixed-header {
          left: $base-left-menu-width-min;
          width: calc(100% - 65px);
        }
      }
    }
  }
}
</style>
