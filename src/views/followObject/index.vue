<template>
  <div class="userManagement-container flex-column">
    <!-- 自定义位置 -->
    <el-table-plus
      ref="followTable"
      :is-index="true"
      :search-form="true"
      :query-params="queryForm"
      :table-props="followTableProps"
      :data-method="_initStoreInfo"
      class="grow"
    >
      <template #search-form>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.objectName"
            clearable
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.objectPhone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.objectMac"
            clearable
            placeholder="请输入mac地址"
          />
        </el-form-item>

        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.objectIdcard"
            clearable
            placeholder="请输入身份证号"
          />
        </el-form-item>

        <el-form-item class="grow-1 res-select-middle">
          <el-input
            v-model.trim="queryForm.followContent"
            clearable
            placeholder="请输入关注内容"
          />
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
          <el-button @click="handleReset"> 重置 </el-button>
        </el-form-item>
        <el-form-item class="grow-1 justify-self-end">
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
            <el-button type="text" @click="handleDelete(row)"
              >取消关注</el-button
            >
          </template>
        </el-table-column>
      </template>
    </el-table-plus>
    <!--    -->

    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
import { doDelete, queryPage } from "@/api/followObject";
import Edit from "./components/followObjectEdit";
import ElTablePlus from "@/components/ElTablePlus";

const followQueryInfo = Object.freeze({
  followContent: null,
  objectIdcard: null,
  objectMac: null,
  objectName: null,
  objectPhone: null,
});

export default {
  name: "FollowObjectManagement",
  components: { Edit, ElTablePlus },
  data() {
    return {
      followTableProps: [
        { name: "姓名", prop: "objectName" },
        { name: "身份证", prop: "objectIdcard" },
        { name: "关注内容", prop: "followContent" },
        { name: "Mac地址", prop: "objectMac" },
        { name: "手机号", prop: "objectPhone" },
      ],
      queryForm: { ...followQueryInfo },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    _initStoreInfo: queryPage,

    handleEdit(row) {
      if (row.objectId) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },

    handleDelete(row) {
      if (row.objectId) {
        this.$baseConfirm("你确定要取消关注吗？", null, async () => {
          const res = await doDelete({ objectId: row.objectId });
          this.$baseMessage("取消成功！", "success");
          await this.fetchData();
        });
      }
    },

    async handleReset() {
      Object.assign(this.queryForm, followQueryInfo);
      await this.queryData();
    },

    async queryData() {
      this.$refs.followTable && (await this.$refs.followTable.flashTable());
    },

    async fetchData() {
      await this.queryData();
    },
  },
};
</script>
