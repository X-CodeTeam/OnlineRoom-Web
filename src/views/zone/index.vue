<template>
  <div class="userManagement-container flex-column">
    <el-table-plus
      ref="zoneTable"
      :is-index="true"
      :search-form="true"
      :table-props="zoneTableProps"
      :data-method="_initZonesInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item>
          <el-input
            v-model.trim="zoneQueryForm.username"
            clearable
            placeholder="请输入门店名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
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
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table-plus>

    <edit ref="edit" @fetch-data="queryData"></edit>
  </div>
</template>

<script>
import { doDelete, queryPage } from "@/api/zoom";
import { queryPagingZones } from "@/api/zones";
import Edit from "./components/zoneEdit";

export default {
  name: "ZoomManagement",

  components: { Edit },

  data() {
    return {
      zoneTableProps: [
        { name: "行政区划名称", prop: "zoneName" },
        { name: "行政区划编码", prop: "zoneCode" },
        { name: "行政区划id", prop: "zoneId" },
        { name: "父级行政区划名称", prop: "parentZoneName" },
        { name: "负责人姓名", prop: "principalName" },
      ],

      zoneQueryForm: {},
    };
  },

  methods: {
    _initZonesInfo: queryPagingZones,

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

          this.$baseMessage(res.message, "success");

          await this.queryData();
        });
      }
    },

    async queryData() {
      await this.$refs.zoneTable.flashTable();
    },
  },
};
</script>
