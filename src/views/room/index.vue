<template>
  <div class="userManagement-container flex-column">
    <el-table-plus
      ref="roomTable"
      :search-form="true"
      :query-params="roomQueryForm"
      :table-props="roomTableProps"
      :data-method="_initRoomsInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item>
          <el-input
            v-model.trim="roomQueryForm.keyworld"
            clearable
            placeholder="房间号 / 房间别名"
          />
        </el-form-item>
        <el-form-item v-if="false">
          <base-area-select
            :zone-code.sync="cache.areaCode"
            placeholder="行政区划"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model.trim="roomQueryForm.storeId"
            clearable
            placeholder="所属门店"
          >
            <el-option
              v-for="store in options.belongStore"
              :key="store.storeId"
              :label="store.storeName"
              :value="store.storeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
          <el-button @click="handleReset"> 重置 </el-button>
        </el-form-item>
        <el-form-item class="grow-1 justify-self-end">
          <upload-file
            action="/rooms/upload"
            name="房间错误信息"
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
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table-plus>

    <edit
      ref="edit"
      :need-data="{ stores: options.belongStore }"
      @fetch-data="queryData"
    ></edit>
    <show ref="show" @fetch-data="queryData"></show>
  </div>
</template>

<script>
import { doDelete, queryPage } from "@/api/room";
import { queryStorePage } from "@/api/store";
import Edit from "./components/roomEdit";
import show from "./components/roomShow";
import BaseAreaSelect from "@/components/BaseAreaSelect";
import UploadFile from "@/components/UploadFile";

const originRoomQueryInfo = Object.freeze({
  keyworld: null, // 房间别名
  storeId: null, // 所属门店
});

export default {
  name: "UserManagement",

  components: { BaseAreaSelect, Edit, show, UploadFile },

  data() {
    return {
      roomTableProps: [
        { name: "房间编号", prop: "roomId" },
        { name: "门店名称", prop: "storeName" },
        { name: "门店地点", prop: "storeLocation" },
        { name: "楼栋层", prop: "buildingNumber" },
        { name: "房间号", prop: "roomNo" },
        { name: "房间别名", prop: "roomAlias" },
        { name: "户型", prop: "roomHouseTypeString" },
      ],

      roomQueryForm: { ...originRoomQueryInfo },

      cache: {
        areaCode: null,
      },

      options: {
        belongStore: [],
      },
    };
  },

  async created() {
    await this._initStoreOptions();
  },

  methods: {
    _initRoomsInfo: queryPage,

    async _initStoreOptions() {
      const { data: storeData } = await queryStorePage({
        pageSize: 999,
        pageIndex: 1,
      });

      this.options.belongStore = storeData;
    },

    handleEdit(row) {
      if (row.roomId) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },

    handleShow(row) {
      if (row.roomId) {
        this.$refs["show"].showEdit(row);
      }
    },

    async handleReset() {
      Object.assign(this.roomQueryForm, originRoomQueryInfo);

      await this.queryData();
    },

    handleDelete(row) {
      if (row.roomId) {
        this.$baseConfirm("你确定要删除当前项吗", null, async () => {
          const res = await doDelete({ roomId: row.roomId });
          if (res.ok) {
            this.$baseMessage("删除成功！", "success");
          }
          await this.queryData();
        });
      }
    },

    async queryData() {
      await this.$refs.roomTable?.flashTable();
    },
  },
};
</script>
