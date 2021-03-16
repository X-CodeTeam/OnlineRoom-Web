<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    class="bind-menus"
    @close="close"
  >
    <el-tree
      ref="menusTree"
      :data="menusData"
      :props="menusProps"
      default-expand-all
      show-checkbox
      node-key="menuId"
      class="menus-tree"
      :default-checked-keys="menusDefaultChecked"
    >
      <span slot-scope="{ node }">
        {{ node.label }}
      </span>
    </el-tree>
  </el-dialog>
</template>

<script>
import { sysMenusTree } from "@/api/menu";

export default {
  name: "BindMenus",

  data() {
    return {
      title: "",

      dialogFormVisible: false,

      isAdd: false,

      menusData: null,

      menusProps: {
        children: "child",
        label: "menuName",
        isLeaf: "leaf",
      },

      menusDefaultChecked: [],
    };
  },

  async created() {
    await this._initMenus();
  },

  methods: {
    async _initMenus() {
      const { data: menusData } = (await sysMenusTree()) || {};

      if (menusData) this.menusData = menusData;
    },

    showEdit(row) {
      if (!row) {
        this.isAdd = true;
        this.title = "添加";
      } else {
        this.isAdd = false;
        this.title = "编辑";
        this.form = Object.assign({}, row);
      }
      this.dialogFormVisible = true;
    },

    close() {
      this.dialogFormVisible = false;
    },

    save() {},
  },
};
</script>

<style scoped lang="scss">
.bind-menus {
  ::v-deep {
    .el-dialog {
      min-height: 70%;
      max-height: 85%;
    }
  }

  .menu-tree {
    ::v-deep .el-tree-node__content {
      height: 42px;
      margin-bottom: 2px;
      border-radius: 5px;
    }
  }
}
</style>
