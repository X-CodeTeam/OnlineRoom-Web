<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="角色名称:" prop="roleName">
        <el-input v-model.trim="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色编码:" prop="roleCode">
        <el-input v-model.trim="form.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model.trim="form.description"></el-input>
      </el-form-item>

      <el-form-item label="状态:" prop="enableMark">
        <el-radio v-model="form.enableMark" label="true">启用</el-radio>
        <el-radio v-model="form.enableMark" label="false">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, doAdd } from "@/api/role";

export default {
  name: "RoleManagementEdit",
  data() {
    return {
      form: {},
      comfirmLoginPassword: "",
      rules: {
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" },
        ],
        roleCode: [
          { required: true, trigger: "blur", message: "请输入角色编码" },
        ],
        enableMark: [
          { required: true, trigger: "blur", message: "请选择状态" },
        ],
      },
      title: "",
      dialogFormVisible: false,
      isAdd: false,
    };
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.isAdd = true;
        this.title = "添加";
      } else {
        this.isAdd = false;
        this.title = "编辑";
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
            res.ok && this.$baseMessage("添加成功!", "success");
          } else {
            const res = await doEdit(this.form);
            res.ok && this.$baseMessage("修改成功!", "success");
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
