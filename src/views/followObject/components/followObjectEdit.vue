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
        <el-input v-model.trim="form.objectIdcard" disabled="true"></el-input>
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
import { isIdCard, isPhone } from "@/utils/validate";

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
          {
            validator: (_, value, cb) => {
              if (!isPhone(value)) return cb(new Error("手机号码格式错误"));
              return cb();
            },
          },
        ],
        objectIdcard: [
          { required: true, trigger: "blur", message: "请输入身份证号" },
          {
            validator: (_, value, cb) => {
              if (!isIdCard(value)) return cb(new Error("身份证号码格式错误"));
              return cb();
            },
          },
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
    },

    save() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.form.followContent = this.checkList.join(",");
          if (this.isAdd) {
            const res = await doAdd(this.form);
            if (res.ok) {
              this.$baseMessage("添加成功!", "success");
            } else {
              this.$baseMessage("添加失败!", "error");
            }
          } else {
            var editData = {};
            editData.objectPhone = this.form.objectPhone;
            editData.objectName = this.form.objectName;
            editData.objectMac = this.form.objectMac;
            editData.objectId = this.form.objectId;
            editData.followContent = this.form.followContent;
            editData.description = this.form.description;
            const res = await doEdit(editData);
            if (res.ok) {
              this.$baseMessage("修改成功", "success");
            } else {
              this.$baseMessage("修改失败!", "error");
            }
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
