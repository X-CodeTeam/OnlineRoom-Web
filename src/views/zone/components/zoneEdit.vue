<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="上级名称：" prop="username">
        <el-input v-model.trim="form.username"></el-input>
      </el-form-item>
      <el-form-item label="编号：" prop="zoneCode">
        <el-input v-model.trim="form.zoneCode"></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="zoneName"
        ><el-input v-model.trim="form.zoneName"></el-input>
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
// import BasePoliceSelect from "@/components/BasePoliceSelect";

export default {
  name: "StoreEdit",

  components: {
    // BasePoliceSelect,
  },

  data() {
    return {
      form: {},
      rules: {
        zoneName: [{ required: true, trigger: "blur", message: "请输入名称" }],
        zoneCode: [{ required: true, trigger: "blur", message: "请输入编号" }],
        zoneName: [
          { required: true, trigger: "blur", message: "请选择管辖派出所" },
        ],
      },
      title: "",
      dialogFormVisible: false,
      isAdd: false,
      org: {
        policeZoneData: [],
      },
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
      this.org.policeZoneData = [];
      this.form.storeAreaname = null;
      this.form.storeAreacode = null;
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
