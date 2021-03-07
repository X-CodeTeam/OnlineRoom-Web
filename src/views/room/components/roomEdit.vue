<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="所属门店：" prop="storeName">
        <el-input v-model.trim="form.storeName"></el-input>
      </el-form-item>
      <el-form-item label="楼栋号：" prop="buildingNumber">
        <el-input v-model.trim="form.buildingNumber"></el-input>
      </el-form-item>
      <el-form-item label="房间号：" prop="roomNo">
        <el-input v-model.trim="form.roomNo"></el-input>
      </el-form-item>
      <el-form-item label="房间别名：" prop="roomAlias">
        <el-input v-model.trim="form.roomAlias"></el-input>
      </el-form-item>
      <el-form-item label="户型：" prop="roomHouseType">
        <el-input v-model.trim="form.roomHouseType"></el-input>
      </el-form-item>
      <el-form-item label="房屋类型：" prop="roomType">
        <el-input v-model.trim="form.roomType"></el-input>
      </el-form-item>
      <el-form-item label="面积：" prop="area">
        <el-input v-model.trim="form.area"></el-input>
      </el-form-item>
      <el-form-item label="房东姓名：" prop="landlordName">
        <el-input v-model.trim="form.landlordName"></el-input>
      </el-form-item>
      <el-form-item label="房东电话：" prop="landlordPhone">
        <el-input v-model.trim="form.landlordPhone"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, doAdd } from "@/api/room";

export default {
  name: "RoomEdit",
  data() {
    return {
      form: {},
      rules: {
        storeName: [
          { required: true, trigger: "blur", message: "请选择所属门店" },
        ],
        roomNo: [{ required: true, trigger: "blur", message: "请输入房间号" }],
        roomHouseType: [
          { required: true, trigger: "blur", message: "请选择户型" },
        ],
        roomType: [
          { required: true, trigger: "blur", message: "请选择房屋类型" },
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
