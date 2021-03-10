<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="姓名：" prop="objectName">
        <el-input v-model.trim="form.objectName"></el-input>
      </el-form-item>
      <el-form-item label="身份证：" prop="objectIdcard">
        <el-input v-model.trim="form.objectIdcard"></el-input>
      </el-form-item>
      <el-form-item label="Mac地址：" prop="objectMac">
        <el-input v-model.trim="form.objectMac"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="objectPhone">
        <el-input v-model.trim="form.objectPhone"></el-input>
      </el-form-item>
      <el-form-item label="关注内容：" prop="followContent">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="孤寡老人"></el-checkbox>
          <el-checkbox label="涉毒前科"></el-checkbox>
          <el-checkbox label="涉盗前科"></el-checkbox>
          <el-checkbox label="残疾人士"></el-checkbox>
          <el-checkbox label="其他成员"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, doAdd } from "@/api/followObject";

export default {
  name: "StoreEdit",

  components: {},

  data() {
    return {
      form: {},
      checkList: [],
      rules: {
        objectName: [
          { required: true, trigger: "blur", message: "请输入姓名" },
        ],
        objectPhone: [
          { required: true, trigger: "blur", message: "请输入手机号码" },
        ],
        objectIdcard: [
          { required: true, trigger: "blur", message: "请输入身份证号" },
        ],
      },
      title: "",
      dialogFormVisible: false,
      isAdd: false,
    };
  },

  methods: {
    showEdit(row) {
      this.checkList = [];
      if (!row) {
        this.isAdd = true;
        this.title = "添加";
      } else {
        this.isAdd = false;
        this.title = "编辑";
        this.form = Object.assign({}, row);
        this.checkList = this.form.followContent.split(",");
      }
      this.dialogFormVisible = true;
    },

    close() {
      this.$refs["form"].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
      this.form.storeAreaname = null;
      this.form.storeAreacode = null;
    },

    save() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.form.followContent = this.checkList.join(",");
          if (this.isAdd) {
            const res = await doAdd(this.form);
            this.$baseMessage("添加成功!", "success");
          } else {
            const res = await doEdit(this.form);
            this.$baseMessage("修改成功", "success");
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
