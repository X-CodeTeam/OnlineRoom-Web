<template>
  <div class="roleManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel> </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name"
              clearable
              placeholder="请输入角色"
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
        label="名称"
        prop="nickName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="IP"
        prop="ip"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="浏览器"
        prop="browser"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="操作系统"
        prop="os"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="设备"
        prop="device"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="浏览器信息"
        prop="browserInfo"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="执行时间"
        prop="elapsedMilliseconds"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="登录时间"
        prop="createdTime"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getList } from "@/api/loginLog";

export default {
  name: "LoginLog",
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
        name: "",
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
      const { data } = await getList(this.queryForm);
      this.list = data.data;
      this.total = data.total;
      this.listLoading = false;
    },
  },
};
</script>
