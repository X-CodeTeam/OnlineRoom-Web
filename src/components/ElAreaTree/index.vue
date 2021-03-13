<template>
  <div ref="elAreaTree" class="el-areaTree">
    <div class="selectInput">
      <el-input
        :value.sync="zoneName"
        v-bind="$attrs"
        readonly
        clearable
        suffix-icon="el-icon-arrow-down"
        @focus="handleFocus"
      />
      <span class="el-icon-circle-close cleanIcon" @click="handleClear" />
    </div>

    <div class="popover" :class="inputTreeVisible ? 'popover_active' : ''">
      <el-tree
        v-if="inputTreeVisible"
        ref="areaCascader"
        :data="zones"
        :props="defaultProps"
        clearable
        style="width: 100%"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ElAreaTree",

  inheritAttrs: false,

  props: {
    zoneName: {
      type: String,
      default: null,
    },

    zoneCode: {
      type: String,
      default: null,
    },

    zoneId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      defaultProps: {
        children: "child",
        label: "zoneName",
      },

      inputTreeVisible: false,
    };
  },

  computed: {
    ...mapGetters("zones", ["areaZones", "policeZones", "zones"]),
  },

  async created() {
    await this._initZones();

    console.log(this.zoneName, "name");
  },

  mounted() {
    // 注册监听事件
    document.addEventListener("click", (e) => {
      this.docMouseup(e);
    });
  },

  methods: {
    ...mapActions("zones", ["_initZones"]),

    // 如果点击元素不在组件内隐藏下拉框
    docMouseup(e) {
      if (this.$refs.elAreaTree && !this.$refs.elAreaTree.contains(e.target)) {
        this.inputTreeVisible = false;
      }
    },

    handleNodeClick(data) {
      this.$emit("update:zoneName", data.zoneName);

      this.$emit("update:zoneCode", data.zoneCode);

      this.$emit("update:zoneId", data.zoneId);

      this.inputTreeVisible = false;
    },

    handleClear() {
      this.$emit("update:zoneName", null);

      this.$emit("update:zoneCode", null);

      this.$emit("update:zoneId", null);
    },

    handleFocus() {
      this.inputTreeVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree .el-tree-node__content {
  padding: 2px 0;

  .custom-tree-node {
    svg {
      padding-right: 5px;
    }
  }
}

.popover {
  display: none;
  width: 100%;
  opacity: 0;
  height: 300px;
  position: absolute;
  overflow-y: auto;
  z-index: 999;
  background: #fff;
  border: 1px solid #eee;
}

.popover_active {
  opacity: 1;
  display: block;
}

.selectInput {
  .cleanIcon {
    display: none;
    position: absolute;
    top: 13px;
    right: 10px;
    color: #c0c4cc;
    cursor: pointer;
    z-index: 999;
    background: #fff;
  }

  .cleanIcon:hover {
    color: #909399;
  }
}

.selectInput:hover {
  .cleanIcon {
    display: block;
  }
}

.alicon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
