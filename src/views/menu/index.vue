<template>
  <el-row class="per-menu" type="flex" :gutter="20" justify="space-around">
    <el-col :span="8">
      <el-input
        v-model="menuForm.keyWord"
        class="menu-search"
        placeholder="搜索"
        suffix-icon="el-icon-search"
      />
      <el-tree
        ref="menuTree"
        :data="menusData"
        :props="menuProps"
        :highlight-current="true"
        :expand-on-click-node="false"
        :default-checked-keys="[1]"
        node-key="menuId"
        class="menu-tree"
        @node-click="echoModifyMenuToPanel"
      >
        <span slot-scope="{ node, data }">
          <i class="zw-icon-zu381" />
          {{ node.label }}
          <span class="tree-operator">
            <el-dropdown size="mini" trigger="click">
              <el-button type="text" class="ts-rotate-90">
                <i class="el-icon-more color-pal" />
              </el-button>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="echoAddMenuToPanel(data)">
                  增加
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="node.level !== 1"
                  @click.native="deleteMenusData(data)"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </el-col>
    <el-col :span="10">
      <p class="title">{{ currentInfo.addOrModifyTag }} 菜单</p>
      <el-form :model="menuDataForm" :rules="menuDataFormRule">
        <transition name="fade-transform">
          <el-form-item v-if="menuDataForm.parentMenuName" label="父级菜单名称">
            <el-input v-model="menuDataForm.parentMenuName" disabled />
          </el-form-item>
        </transition>
        <el-form-item label="菜单名称">
          <el-input v-model="menuDataForm.menuName" />
        </el-form-item>
        <el-form-item label="菜单编码">
          <el-input v-model="menuDataForm.menuCode" :disabled="isModify" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-input v-model="menuDataForm.menuPermission" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-dics
            :value-prop-name.sync="menuDataForm.menuType"
            :is-query="false"
            type-code="menusType"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMenusData">确定</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { addMenus, deleteMenus, editMenus, sysMenusTree } from "@/api/menu";

const originMenuData = Object.freeze({
  description: null, // 描述信息
  enableMark: true, // 默认开启
  menuCode: null, // 菜单编码
  menuIcon: null, // 菜单图标
  menuName: null, // 菜单名称
  menuPath: null, // 菜单路径
  menuPermission: null, // 菜单权限
  menuType: 0, // 菜单类型
  parentMenuCode: null, // 上级菜单编号
  sortValue: 0, // 排序码
  parentMenuName: null, // 上级菜单名称（自定义）
});

export default {
  name: "PerMenus",

  data() {
    return {
      menusData: [],

      menuForm: {
        keyWord: null,
      },

      menuDataForm: {
        ...originMenuData,
      },

      menuDataFormRule: {},

      menuProps: {
        children: "child",
        label: "menuName",
        isLeaf: "leaf",
      },

      currentInfo: {
        menuData: null,

        menuKey: null,

        addOrModifyTag: "修改",
      },
    };
  },

  computed: {
    isAdd() {
      return this.currentInfo.addOrModifyTag === "增加";
    },
    isModify() {
      return this.currentInfo.addOrModifyTag === "修改";
    },
  },

  async created() {
    await this._initMenus();
  },

  methods: {
    async _initMenus() {
      const { data: menusData } = (await sysMenusTree()) || {};

      if (menusData) this.menusData = menusData;
    },

    setCurrentKey(key, data) {
      this.currentInfo.menuKey = key; // set current key

      this.currentInfo.menuData = data;
    },

    setCurrentTag(key) {
      this.currentInfo.addOrModifyTag = key;
    },

    echoModifyMenuToPanel(data) {
      this.setCurrentKey(data.menuId, data);

      this.setCurrentTag("修改");

      this.menuDataForm = this.$lodash.omit(data, ["child"]);
    },

    setMenusDataFormToOrigin: function () {
      this.menuDataForm = { ...originMenuData }; // 清空数据
    },

    echoAddMenuToPanel(data) {
      this.setCurrentKey(data.menuId, data);

      this.setCurrentTag("增加");

      this.setMenusDataFormToOrigin();

      Object.assign(this.menuDataForm, {
        parentMenuName: data.menuName,
        parentMenuCode: data.menuCode,
      });
    },

    async addMenusData() {
      const res =
        this.currentInfo.addOrModifyTag === "增加"
          ? await addMenus(this.menuDataForm)
          : await editMenus(
              Object.assign(
                this.$lodash.omit(this.menuDataForm, ["menuCode"]),
                { id: this.menuDataForm.menuId, sortValue: 0 }
              )
            );

      if (!res.ok) return;

      this.currentInfo.addOrModifyTag === "增加"
        ? this.appendMenuToTree(
            Object.assign({ menuId: res?.data[0] }, this.menuDataForm)
          )
        : this.modifyMenuFromTree(this.currentInfo.menuData, this.menuDataForm);

      this.$baseMessage(`${this.currentInfo.addOrModifyTag}成功`, "success");

      this.setMenusDataFormToOrigin();

      // this.currentInfo.addOrModifyTag === "增加" && this.setCurrentTag("修改"); // 添加完成后，转变为修改
    },

    async deleteMenusData(data) {
      const res = await deleteMenus(data.menuId);

      if (!res.ok) return;

      this.deleteMenuFromTree(data);

      this.setMenusDataFormToOrigin();

      this.$baseMessage("删除成功", "success");
    },

    appendMenuToTree(data) {
      this.$refs.menuTree.append(data, this.currentInfo.menuKey);
    },

    deleteMenuFromTree(data) {
      this.$refs.menuTree.remove(data);
    },

    modifyMenuFromTree(data, newData) {
      Object.assign(data, newData);
    },
  },
};
</script>

<style lang="scss" scoped>
.per-menu {
  padding: 1.5rem;

  .title {
    margin-top: 0.5rem;
  }

  .menu-search {
  }

  .menu-tree {
    margin-top: 0.6rem;

    ::v-deep .el-tree-node__content {
      height: 42px;
      margin-bottom: 2px;
      border-radius: 5px;
    }

    ::v-deep .el-tree-node {
      position: relative;
    }

    .tree-operator {
      position: absolute;
      top: 0;
      right: 10px;
      transform: rotate(90deg);
    }
  }
}
</style>
