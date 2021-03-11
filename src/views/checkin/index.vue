<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12"> </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              clearable
              placeholder="请输入用户名"
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
        label="姓名"
        prop="objectName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="手机号"
        prop="objectPhone"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="身份证号"
        prop="objectIdcard"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="性别"
        prop="objectGender"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="籍贯"
        prop="objectHometown"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="入住时间"
        prop="checkInTime"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="85"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleShow(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryForm.currentPage"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <show ref="show" @fetch-data="fetchData"></show>
  </div>
</template>

<script>
import { queryObjects } from "@/api/order";
import show from "./components/checkinShow";

export default {
  name: "UserManagement",
  components: { show },
  data() {
    return {
      list: [],
      listLoading: true,
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      selectRows: "",
      queryForm: {
        currentPage: 1,
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
    handleShow(row) {
      if (row.reserveId) {
        this.$refs["show"].showEdit(row);
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.currentPage = val;
      this.fetchData();
    },
    queryData() {
      this.queryForm.currentPage = 1;
      this.fetchData();
    },
    async fetchData() {
      this.listLoading = true;
      const { data, pageTotal } = await queryObjects(this.queryForm);
      this.list = data;
      this.total = pageTotal;
      this.listLoading = false;
    },
  },
};
</script>
