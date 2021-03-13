<template>
  <div class="userManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="zoomTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="zoomTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.username"
            clearable
            placeholder="姓名"
          />
        </el-form-item>

        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.nickname"
            clearable
            placeholder="昵称"
          />
        </el-form-item>

        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.phone"
            clearable
            placeholder="手机号"
          />
        </el-form-item>

        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.idcard"
            clearable
            placeholder="身份证号"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
          <el-button @click="handleReset"> 重置 </el-button>
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
import { doDelete, queryPage } from "@/api/zoom";
import Edit from "./components/zoomEdit";
import ElTablePlus from "@/components/ElTablePlus";
const zoomQueryInfo = Object.freeze({
  username: null,
  nickname: null,
  phone: null,
  idcard: null,
});
export default {
  name: "ZoomManagement",
  components: { Edit, ElTablePlus },
  data() {
    return {
      zoomTableProps: [
        { name: "姓名", prop: "username" },
        { name: "昵称", prop: "nickname" },
        { name: "手机号", prop: "phone" },
        { name: "身份证号", prop: "idcard" },
        {
          name: "性别",
          prop: "gender",
          formatter: (row) => {
            return row.gender == 1 ? "男" : "女";
          },
        },
      ],
      queryForm: { ...zoomQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryPage,

    handleEdit(row) {
      if (row.userId) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },
    handleShow(row) {
      if (row.storeId) {
        this.$refs["show"].showEdit(row);
      }
    },
    handleDelete(row) {
      if (row.userId) {
        this.$baseConfirm("你确定要删除当前项吗", null, async () => {
          const res = await doDelete({ zoneManagerId: row.userId });
          if (res.ok) {
            this.$baseMessage("删除成功", "success");
          } else {
            this.$baseMessage("删除失败", "success");
          }
          await this.fetchData();
        });
      }
    },

    async handleReset() {
      Object.assign(this.queryForm, zoomQueryInfo);
      await this.queryData();
    },
    async queryData() {
      this.$refs.zoomTable && (await this.$refs.zoomTable.flashTable());
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
