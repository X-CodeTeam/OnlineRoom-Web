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
        label="门店地点"
        prop="storeLocation"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="房间号"
        prop="roomNo"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="入住日期"
        prop="reserveStartTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="退房日期"
        prop="reserveEndTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="预订人数"
        prop="reservePeopleNum"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="订单状态"
        prop="reserveStatusString"
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
import { queryPage } from "@/api/order";
import show from "./components/orderShow";

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
      const { data, pageTotal } = await queryPage(this.queryForm);
      this.list = data;
      this.total = pageTotal;
      this.listLoading = false;
    },
  },
};
</script>
