<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="姓名：" prop="username">
        <el-input v-model.trim="form.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model.trim="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="身份证：" prop="idcard">
        <el-input v-model.trim="form.idcard" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="管辖区域：" prop="zoneName">
        <!--   不能同时改变code和id     -->
        <base-area-select
          :zone-name.sync="form.zoneName"
          :zone-id.sync="form.zoneId"
          :level="[0, 2]"
          :show-all-levels="false"
          :load-props="{ multiple: true, value: 'zoneId' }"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addZoom, modifyZoom } from "@/api/zoom";
import { isIdCard, isPhone } from "@/utils/validate";
import BaseAreaSelect from "@/components/BaseAreaSelect";

export default {
  name: "StoreEdit",

  components: {
    BaseAreaSelect,
  },

  data() {
    return {
      form: {
        description: null,
        idcard: null,
        phone: null,
        username: null,
        zoneId: null,
        zoneName: null,
      },

      rules: {
        username: [{ required: true, trigger: "blur", message: "请输入姓名" }],
        phone: [
          { required: true, trigger: "blur", message: "请输入手机号" },
          {
            trigger: "blur",
            validator: (_, value, cb) => {
              if (!isPhone(value)) return cb(new Error("手机号码不正确"));

              return cb();
            },
          },
        ],
        idcard: [
          { required: true, trigger: "blur", message: "请输入身份证号" },
          {
            validator: (_, value, cb) => {
              if (!isIdCard(value)) return cb(new Error("身份证号码格式错误"));

              return cb();
            },
          },
        ],
        zoneName: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "请选择管辖警务区",
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
      this.form.storeAreaname = null;
      this.form.storeAreacode = null;
    },

    save() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.isAdd) {
            const res = await addZoom(this.form);
            res.ok && this.$baseMessage("操作成功", "success");
          } else {
            const res = await modifyZoom(
              this.$lodash.omit(this.form, ["idcard"])
            );
            res.ok && this.$baseMessage("操作成功", "success");
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
