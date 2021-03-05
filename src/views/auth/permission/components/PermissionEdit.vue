<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="close"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <el-input v-model="form.area"></el-input>
      </el-form-item>
      <el-form-item label="控制器" prop="controller">
        <el-input v-model="form.controller"></el-input>
      </el-form-item>
      <el-form-item label="方法" prop="action">
        <el-input v-model="form.action"></el-input>
      </el-form-item>
      <el-form-item label="是否控制器" prop="isController">
        <el-switch v-model="form.isController"></el-switch>
      </el-form-item>
      <el-form-item label="是否Ajax" prop="isAjax">
        <el-switch v-model="form.isAjax"></el-switch>
      </el-form-item>
      <el-form-item label="是否锁定" prop="isLocked">
        <el-switch v-model="form.isLocked"></el-switch>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, doAdd } from "@/api/permission";

export default {
  name: "PermissionEdit",
  data() {
    return {
      form: {},
      rules: {
        name: [{ required: true, trigger: "blur", message: "请输入名称" }],
        area: [{ required: true, trigger: "blur", message: "请输入区域" }],
        controller: [
          { required: true, trigger: "blur", message: "请输入控制器" },
        ],
      },
      title: "",
      isAdd: false,
      dialogFormVisible: false,
    };
  },
  created() {},
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = "添加";
        this.isAdd = true;
      } else {
        this.title = "编辑";
        this.isAdd = false;
        this.form = Object.assign({}, row);
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.$refs["form"].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
    save() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.isAdd) {
            const res = await doAdd(this.form);
            this.$baseMessage(res.message, "success");
          } else {
            const res = await doEdit(this.form);
            this.$baseMessage(res.message, "success");
          }
          this.$emit("fetch-data");
          this.close();
        } else {
          return false;
        }
      });
    },
  },
};
</script>
