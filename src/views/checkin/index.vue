<template>
  <div class="userManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="objectTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="objectTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.keyword"
            clearable
            placeholder="姓名/手机号/身份证号"
          />
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
import { queryObjects } from "@/api/order";
import show from "./components/checkinShow";
import ElTablePlus from "@/components/ElTablePlus";

const objectQueryInfo = Object.freeze({
  keyword: null,
  startTime: null,
  endTime: null,
});

export default {
  name: "UserManagement",
  components: { show, ElTablePlus },
  data() {
    return {
      objectTableProps: [
        { name: "姓名", prop: "objectName" },
        { name: "手机号", prop: "objectPhone" },
        { name: "身份证号", prop: "objectIdcard" },
        {
          name: "性别",
          prop: "objectGender",
          formatter: (row) => {
            return row.objectGender == 1 ? "男" : "女";
          },
        },
        { name: "籍贯", prop: "objectHometown" },
        { name: "入住时间", prop: "checkInTime" },
      ],
      queryForm: { ...objectQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryObjects,
    handleShow(row) {
      if (row.reserveId) {
        this.$refs["show"].showEdit(row);
      }
    },

    async handleReset() {
      Object.assign(this.queryForm, objectQueryInfo);
      await this.queryData();
    },
    async queryData() {
      this.$refs.objectTable && (await this.$refs.objectTable.flashTable());
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
