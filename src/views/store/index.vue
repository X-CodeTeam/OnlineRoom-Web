<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          添加
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              clearable
              placeholder="请输入门店名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        show-overflow-tooltip
        type="selection"
      ></el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="门店名称"
        prop="storeName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="门店区域"
        prop="storeAreaname"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="门店地点"
        prop="storeDetails"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="经营者姓名"
        prop="managerName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="经营者手机号"
        prop="managerPhone"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="状态"
        prop="enableMark"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>
            {{ row.enableMark ? "正常" : "注销" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleShow(row)">详情</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button
            v-if="row.enableMark"
            type="text"
            @click="handleDelete(row)"
            >注销</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryForm.pageIndex"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>
    <show ref="show" @fetch-data="fetchData"></show>
  </div>
</template>

<script>
import { doLogout, queryPage } from "@/api/store";
import Edit from "./components/StoreEdit";
import Show from "./components/StoreShow";

export default {
  name: "StoreManagement",
  components: { Edit, Show },
  data() {
    return {
      list: [],
      listLoading: true,
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      selectRows: "",
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        username: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    setSelectRows(val) {
      this.selectRows = val;
    },
    handleEdit(row) {
      if (row.storeId) {
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
      if (row.storeId) {
        this.$baseConfirm("你确定要注销当前项吗", null, async () => {
          const res = await doLogout({ storeId: row.storeId });
          if (res.ok) {
            this.$baseMessage("注销成功！", "success");
            // await this.fetchData();
          } else {
            this.$baseMessage("注销成功！", "error");
          }
        });
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.pageIndex = val;
      this.fetchData();
    },
    queryData() {
      this.queryForm.pageIndex = 1;
      this.fetchData();
    },
    async fetchData() {
      this.listLoading = true;
      const { data, pageTotal } = await queryPage(this.queryForm);
      this.list = data;
      this.total = pageTotal;
      this.listLoading = false;
    },
  },
};
</script>
