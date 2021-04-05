<template>
  <div class="userManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="sysUserTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="sysUserTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.loginUser"
            clearable
            placeholder="请输入登录名"
          />
        </el-form-item>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="fetchData">
            查询
          </el-button>
          <el-button @click="handleReset"> 重置 </el-button>
        </el-form-item>
        <el-form-item class="grow-1 justify-self-end">
          <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
            添加
          </el-button>
        </el-form-item>
      </template>
      <template #table-self>
        <el-table-column
          align="center"
          label="操作"
          show-overflow-tooltip
          width="120"
        >
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table-plus>
    <!--    -->

    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
import { deleteSysUser, queryUsersPage } from "@/api/sysUser";
import Edit from "./components/userEdit";

const sysUserQueryInfo = Object.freeze({
  loginUser: null,
  email: null,
  phone: null,
});

export default {
  name: "UserManagement",

  components: { Edit },

  data() {
    return {
      sysUserTableProps: [
        { name: "登录名", prop: "loginUser" },
        { name: "昵称", prop: "nickname" },
        { name: "邮箱", prop: "email" },
        { name: "手机号", prop: "phone" },
        { name: "状态", prop: "statusString" },
        { name: "描述", prop: "description" },
      ],

      queryForm: { ...sysUserQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryUsersPage,

    handleEdit(row) {
      if (row.userId) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },

    handleDelete(row) {
      this.$baseConfirm("你确定要删除当前项吗z", null, async () => {
        const res = await deleteSysUser({ userId: row.userId });
        res.ok && this.$baseMessage("操作成功", "success");
        await this.fetchData();
      });
    },

    async handleReset() {
      Object.assign(this.queryForm, sysUserQueryInfo);
      await this.fetchData();
    },

    async fetchData() {
      this.$refs.sysUserTable && (await this.$refs.sysUserTable.flashTable());
    },
  },
};
</script>
