<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    class="bind-menus ly-role__dialog"
    @close="close"
  >
    <el-tree
      ref="menusTree"
      :data="menuTree"
      :props="menusProps"
      default-expand-all
      show-checkbox
      node-key="menuCode"
      class="menus-tree"
    >
      <span slot-scope="{ node }">
        {{ node.label }}
      </span>
    </el-tree>
    <template #footer>
      <el-button type="primary" @click="handleGrant">授权</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { sysMenusTree } from "@/api/menu";
import { bindMenusToRole, queryRoleMenus } from "@/api/role";
import { pickAttrFromArrObj } from "@/utils/tools";

export default {
  name: "BindMenus",

  data() {
    return {
      title: "",

      dialogFormVisible: false,

      isAdd: false,

      menuTree: null,

      menuData: {},

      menusProps: {
        children: "child",
        label: "menuName",
        isLeaf: "leaf",
      },
    };
  },

  watch: {
    dialogFormVisible: {
      async handler(res) {
        if (!res) return;

        await this._initRoleWithMenuId();
      },
    },
  },

  async created() {
    await this._initMenus();
  },

  methods: {
    async _initMenus() {
      const { data: menusData } = (await sysMenusTree()) || {};

      if (menusData) this.menuTree = menusData;
    },

    async _initRoleWithMenuId() {
      if (!this.menuData["id"]) return;

      const { data: roleData } = await queryRoleMenus(
        this.menuData["roleCode"]
      );

      if (!roleData || !roleData?.length) return;

      this.$refs.menusTree.setCheckedKeys(
        pickAttrFromArrObj(roleData, "menuCode")
      );
    },

    async handleGrant() {
      const keys = this.$refs.menusTree.getCheckedKeys();

      const halfKes = this.$refs.menusTree.getHalfCheckedKeys();

      const { ok } = await bindMenusToRole(
        this.menuData.roleCode,
        keys.concat(halfKes).filter((item) => item !== null)
      );

      if (!ok) return;

      this.$baseMessage("操作成功", "success");

      this.close();
    },

    showEdit(row) {
      if (!row) {
        this.isAdd = true;
        this.title = "添加";
      } else {
        this.isAdd = false;
        this.title = "编辑";
        Object.assign(this.menuData, row);
      }
      this.dialogFormVisible = true;
    },

    close() {
      this.$refs.menusTree.setCheckedKeys([]);

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
