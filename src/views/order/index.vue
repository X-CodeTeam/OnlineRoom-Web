<template>
  <div class="order-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="orderTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="orderTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.storeLocation"
            clearable
            placeholder="门店地址"
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

        <el-form-item class="grow-1 justify-self-end">
          <upload-file
            action="/reserves/upload"
            name="订单错误信息"
            :flash="queryData"
          ></upload-file>
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
import { queryPage } from "@/api/order";
import show from "./components/orderShow";
import ElTablePlus from "@/components/ElTablePlus";
import UploadFile from "@/components/UploadFile";

const orderQueryInfo = Object.freeze({
  storeLocation: null,
  startTime: null,
  endTime: null,
});

export default {
  name: "UserManagement",

  components: { show, ElTablePlus, UploadFile },

  data() {
    return {
      orderTableProps: [
        { name: "门店地点", prop: "storeLocation" },
        { name: "房间号", prop: "roomNo" },
        { name: "入住日期", prop: "reserveStartTime" },
        { name: "退房日期", prop: "reserveEndTime" },
        { name: "预订人数", prop: "reservePeopleNum" },
        { name: "订单状态", prop: "reserveStatusString" },
      ],
      queryForm: { ...orderQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryPage,

    handleShow(row) {
      if (row.reserveId) {
        this.$refs["show"].showEdit(row);
      }
    },

    async handleReset() {
      Object.assign(this.queryForm, orderQueryInfo);
      await this.queryData();
    },
    async queryData() {
      this.$refs.orderTable && (await this.$refs.orderTable.flashTable());
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
