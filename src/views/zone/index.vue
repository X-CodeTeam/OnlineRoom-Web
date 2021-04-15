<template>
  <div class="userManagement-container flex-column">
    <el-table-plus
      ref="zoneTable"
      row-key="zoneCode"
      :lazy="true"
      :load="lazyLoad"
      :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
      :search-form="true"
      :query-params="zoneQueryForm"
      :table-props="zoneTableProps"
      :data-method="_initZonesInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item>
          <el-input
            v-model.trim="zoneQueryForm.zoneName"
            clearable
            placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
        </el-form-item>
        <el-form-item class="grow-1 justify-self-end">
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit(false)"
          >
            添加
          </el-button>
          <el-button class="test" @click="changeArray">测试</el-button>
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
import { queryZoneChild, deleteZone } from "@/api/zones";
import Edit from "./components/zoneEdit";
import config from "@/config/config";

export default {
  name: "ZoomManagement",

  components: { Edit },

  data() {
    return {
      zoneTableProps: [
        { name: "行政区划名称", prop: "zoneName", align: "left" },
        { name: "行政区划编码", prop: "zoneCode" },
        { name: "行政区划id", prop: "zoneId" },
        { name: "父级行政区划名称", prop: "parentZoneName" },
        { name: "负责人姓名", prop: "principalName" },
      ],

      zoneQueryForm: {
        parentZoneCode: config.defaultRootParentAreaCode,
      },

      loadResolve: null,
    };
  },

  methods: {
    _initZonesInfo: queryZoneChild,

    handleEdit(row) {
      if (row) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },

    handleDelete(row) {
      if (row) {
        this.$baseConfirm("你确定要删除当前项吗", null, async () => {
          const res = await deleteZone(row.zoneId);

          res.ok && this.$baseMessage("操作成功", "success");

          const { parentZoneCode, zoneCode } = row;

          // 动态更新树形表格的数据
          if (parentZoneCode && zoneCode) {
            const index = this.$refs.zoneTable.theTable.store.states.lazyTreeNodeMap[
              parentZoneCode
            ].findIndex((item) => item.zoneCode === zoneCode);

            if (index >= 0)
              this.$refs.zoneTable.theTable.store.states.lazyTreeNodeMap[
                parentZoneCode
              ].splice(index, 1);
          }

          // 更新整体Vuex中的数据，全局变化
          await this.queryData();
        });
      }
    },

    async queryData() {
      await this.$refs.zoneTable.flashTable();

      await this.$store.dispatch("zones/_initZones", true);
    },

    changeArray(row) {
      console.log(this.$refs.zoneTable.theTable.store.states.lazyTreeNodeMap);
    },

    async lazyLoad(tree, treeNode, resolve) /* 点击节点、点击节点列表（树） */ {
      const { zoneCode } = tree;

      const { data: areaData } = await queryZoneChild({
        parentZoneCode: zoneCode,
      });

      if (areaData && areaData.length) {
        resolve(areaData);
      }
    },
  },
};
</script>
