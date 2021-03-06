<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
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
        label="用户名"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="昵称"
        prop="nickName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="手机号码"
        prop="phone"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="邮箱"
        prop="email"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="邮箱"
        prop="description"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="85"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryForm.index"
      :layout="layout"
      :page-size="queryForm.size"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
import { doDelete, queryPage } from "@/api/users";
import Edit from "./components/userEdit";

export default {
  name: "UserManagement",
  components: { Edit },
  data() {
    return {
      list: [],
      listLoading: true,
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      selectRows: "",
      queryForm: {
        index: 1,
        size: 10,
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
    handleEdit(row) {
      if (row.id) {
        this.$refs["edit"].showEdit(row);
      } else {
        this.$refs["edit"].showEdit();
      }
    },
    handleDelete(row) {
      if (row.id) {
        console.log(row.id);
        this.$baseConfirm("你确定要删除当前项吗", null, async () => {
          const res = await doDelete({ ids: [row.id] });
          this.$baseMessage(res.message, "success");
          await this.fetchData();
        });
      } else {
        if (this.selectRows.length > 0) {
          const ids = this.selectRows.map((item) => item.id);
          this.$baseConfirm("你确定要删除选中项吗", null, async () => {
            const res = await doDelete({ ids });
            this.$baseMessage(res.message, "success");
            await this.fetchData();
          });
        } else {
          this.$baseMessage("未选中任何行", "error");
          return false;
        }
      }
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.index = val;
      this.fetchData();
    },
    queryData() {
      this.queryForm.index = 1;
      this.fetchData();
    },
    async fetchData() {
      this.listLoading = true;
      const { data } = await queryPage(this.queryForm);
      this.list = data;
      this.total = data.total;
      this.listLoading = false;
    },
  },
};
</script>
