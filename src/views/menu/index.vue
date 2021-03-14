<template>
  <div class="userManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="roleTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="roleTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.roleName"
            clearable
            placeholder="请输入角色名称"
          />
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
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
import { doDelete, queryPage } from "@/api/menu";
import Edit from "./components/menuEdit";
import ElTablePlus from "@/components/ElTablePlus";

const roleQueryInfo = Object.freeze({
  roleName: null,
});

export default {
  name: "RoleManagement",
  components: { Edit, ElTablePlus },
  data() {
    return {
      roleTableProps: [
        { name: "角色名称", prop: "roleName" },
        { name: "角色编码", prop: "roleCode" },
        {
          name: "状态",
          prop: "enableMark",
          formatter: (row) => {
            return row.enableMark == 1 ? "启用" : "禁用";
          },
        },
        { name: "描述", prop: "description" },
      ],
      queryForm: { ...roleQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryPage,

    handleEdit(row) {
      if (row.id) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm("你确定要删除当前项吗", null, async () => {
          const res = await doDelete({ id: row.id });
          res.ok && this.$baseMessage("删除成功!", "success");
          await this.fetchData();
        });
      }
    },
    async queryData() {
      this.$refs.roleTable && (await this.$refs.roleTable.flashTable());
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
