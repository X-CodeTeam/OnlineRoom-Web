<template>
  <div class="userManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="storeTable"
      :search-form="true"
      :query-params="queryForm"
      :table-props="storeTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-width">
          <el-input
            v-model.trim="queryForm.keyworld"
            clearable
            placeholder="门店名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item class="grow-1 res-select-middle">
          <el-area-select
            :zone-code.sync="queryForm.storeAreacode"
            clearable
            placeholder="门店区划"
          />
        </el-form-item>
        <el-form-item class="grow-1 res-select-mini">
          <el-dics
            type-code="storeStatus"
            :value-prop-name.sync="queryForm.enableMark"
            style="width: 100%"
          ></el-dics>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
          <el-button @click="handleReset"> 重置</el-button>
        </el-form-item>
        <el-form-item class="grow-1 justify-self-end">
          <upload-file
            action="/stores/upload"
            name="门店错误信息"
            :flash="queryData"
          ></upload-file>
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
            <el-button type="text" @click="handleShow(row)">详情</el-button>
            <el-button
              v-if="row.enableMark"
              type="text"
              @click="handleEdit(row)"
              >编辑
            </el-button>
            <el-button
              v-if="row.enableMark"
              type="text"
              @click="handleDelete(row)"
              >注销
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table-plus>
    <!--    -->

    <edit ref="edit" @fetch-data="fetchData"></edit>
    <show ref="show" @fetch-data="fetchData"></show>
  </div>
</template>

<script>
import { doLogout, queryStorePage } from "@/api/store";
import Edit from "./components/StoreEdit";
import Show from "./components/StoreShow";
import ElTablePlus from "@/components/ElTablePlus";
import UploadFile from "@/components/UploadFile";

const originStoreQueryInfo = Object.freeze({
  keyworld: null, // 门店名称
  storeAreacode: null, // 门店区域编码
  enableMark: null, // 门店状态
});

export default {
  name: "StoreManagement",

  components: { Edit, Show, ElTablePlus, UploadFile },

  data() {
    return {
      storeTableProps: [
        { name: "门店编号", prop: "storeId" },
        { name: "门店名称", prop: "storeName" },
        { name: "门店区域", prop: "storeAreaname" },
        { name: "门店地点", prop: "storeDetails" },
        { name: "经营者姓名", prop: "managerName" },
        { name: "经营者手机号", prop: "managerPhone" },
        { name: "门店房间数", prop: "roomNum" },
        {
          name: "状态",
          prop: "enableMark",
          formatter: (row) => {
            return row.enableMark ? "正常" : "注销";
          },
        },
      ],

      queryForm: { ...originStoreQueryInfo },
    };
  },

  methods: {
    _initStoreInfo: queryStorePage,

    handleEdit(row) {
      if (row.storeId) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },

    async handleReset() {
      Object.assign(this.queryForm, originStoreQueryInfo);

      await this.queryData();
    },

    handleShow(row) {
      if (row.storeId) {
        this.$refs["show"].showEdit(row);
      }
    },

    handleDelete(row) {
      if (row.storeId) {
        this.$baseConfirm("注销后不可恢复，请谨慎操作", null, async () => {
          const res = await doLogout({ storeId: row.storeId });
          if (res.ok) {
            this.$baseMessage("注销成功！", "success");
          } else {
            this.$baseMessage("注销失败！", "error");
          }
          await this.queryData();
        });
      }
    },

    async queryData() {
      await this.$refs.storeTable.flashTable();
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
