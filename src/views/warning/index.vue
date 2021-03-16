<template>
  <div class="warningManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="warningTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="warningTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item prop="warningType">
          <el-dics
            :is-query="false"
            type-code="EXCEPTION_WARNING_TYPE"
            :value-prop-name.sync="queryForm.warningType"
            style="width: 100%"
          >
          </el-dics>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="queryForm.startTime"
            type="date"
            placeholder="选择开始日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryForm.endTime"
            type="date"
            placeholder="选择结束日期"
          >
          </el-date-picker>
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
            <el-button type="text" @click="handleShow(row)">详情</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table-plus>
    <!--    -->
    <show ref="show" @fetch-data="fetchData"></show>
  </div>
</template>

<script>
import { queryPage } from "@/api/warning";
import show from "./components/warningShow";
import ElTablePlus from "@/components/ElTablePlus";

const warningQueryInfo = Object.freeze({
  warningType: null,
  startTime: null,
  endTime: null,
});

export default {
  name: "UserManagement",
  components: { show, ElTablePlus },
  data() {
    return {
      warningTableProps: [
        { name: "预警时间", prop: "warningTime" },
        { name: "预警类型", prop: "warningTypeString" },
        { name: "姓名", prop: "warningObjectName" },
        { name: "手机号", prop: "warningObjectPhone" },
        { name: "身份证号", prop: "warningObjectIdcard" },
        {
          name: "性别",
          prop: "warningObjectGender",
          formatter: (row) => {
            return row.objectGender == 1 ? "男" : "女";
          },
        },
      ],
      queryForm: { ...warningQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryPage,
    handleShow(row) {
      if (row.warningId) {
        this.$refs["show"].showEdit(row);
      }
    },

    async handleReset() {
      Object.assign(this.queryForm, warningQueryInfo);
      await this.queryData();
    },
    async queryData() {
      this.$refs.warningTable && (await this.$refs.warningTable.flashTable());
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
