<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="700px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="门店名称：" prop="storeName">
        <el-input v-model.trim="form.storeName"></el-input>
      </el-form-item>
      <el-form-item label="门店地点：" prop="storeLocation">
        <el-input v-model.trim="form.storeLocation"></el-input>
      </el-form-item>
      <el-form-item label="行政区域：" prop="storeAreaname">
        <el-input v-model.trim="form.storeAreaname"></el-input>
      </el-form-item>
      <el-form-item label="管辖派出所：" prop="policeZoneName">
        <el-input v-model.trim="form.policeZoneName"></el-input>
      </el-form-item>
      <el-form-item label="详细地址：" prop="storeDetails">
        <el-input v-model.trim="form.storeDetails"></el-input>
      </el-form-item>
      <el-form-item label="所属企业名称：" prop="corporateName">
        <el-input v-model.trim="form.corporateName"></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码：" prop="managerIdcard">
        <el-input v-model.trim="form.managerIdcard"></el-input>
      </el-form-item>
      <el-form-item label="经营者姓名：" prop="managerName">
        <el-input v-model.trim="form.managerName"></el-input>
      </el-form-item>
      <el-form-item label="经营者手机号：" prop="managerPhone">
        <el-input v-model.trim="form.managerPhone"></el-input>
      </el-form-item>
      <el-form-item label="经营者身份证号：" prop="managerIdcard">
        <el-input v-model.trim="form.managerIdcard"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, doAdd } from "@/api/store";

export default {
  name: "StoreEdit",
  data() {
    return {
      form: {},
      rules: {
        storeName: [
          { required: true, trigger: "blur", message: "请输入门店名称" },
        ],
        storeLocation: [
          { required: true, trigger: "blur", message: "请输入门店地址" },
        ],
        storeAreaname: [
          { required: true, trigger: "blur", message: "请选择行政区域" },
        ],
        policeZoneName: [
          { required: true, trigger: "blur", message: "请选择管辖派出所" },
        ],
        managerIdcard: [
          { required: true, trigger: "blur", message: "请选择行政身份证号" },
        ],
        storeDetails: [
          { required: true, trigger: "blur", message: "请输入详细地址" },
        ],
        managerName: [
          { required: true, trigger: "blur", message: "请输入经营者姓名" },
        ],
        managerPhone: [
          { required: true, trigger: "blur", message: "请输入经营者手机号" },
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
