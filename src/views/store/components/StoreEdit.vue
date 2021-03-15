<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店名称：" prop="storeName">
            <el-input v-model.trim="form.storeName" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店地点：" prop="storeLocation">
            <el-input
              v-model.trim="form.storeLocation"
              placeholder="所在大楼或小区名称"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区域：" prop="storeAreaname">
            <base-area-select
              :zone-name.sync="form.storeAreaname"
              :zone-code.sync="form.storeAreacode"
              :police-zone-data.sync="org.policeZoneData"
            ></base-area-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管辖警务区：" prop="policeZoneName">
            <base-police-select
              :zone-data="org.policeZoneData"
              :police-zone-id.sync="form.policeZoneId"
              :police-zone-name.sync="form.policeZoneName"
            ></base-police-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="详细地址：" prop="storeDetails">
        <el-input v-model.trim="form.storeDetails" maxlength="50"></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="所属企业名称：" prop="corporateName">
            <el-input
              v-model.trim="form.corporateName"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="统一社会信用代码："
            prop="unifiedSocialCreditCode"
          >
            <el-input v-model.trim="form.unifiedSocialCreditCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="经营者姓名：" prop="managerName">
            <el-input v-model.trim="form.managerName" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营者手机号：" prop="managerPhone">
            <el-input v-model.trim="form.managerPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

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
import BaseAreaSelect from "@/components/BaseAreaSelect";
import BasePoliceSelect from "@/components/BasePoliceSelect";
import { isIdCard, isPhone } from "@/utils/validate";

export default {
  name: "StoreEdit",

  components: {
    BaseAreaSelect,
    BasePoliceSelect,
  },

  data() {
    return {
      form: {},
      rules: {
        storeName: [
          { required: true, trigger: "blur", message: "请输入门店名称" },
        ],
        storeLocation: [
          { required: true, trigger: "blur", message: "请输入门店地点" },
        ],
        storeAreaname: [
          { required: true, trigger: "blur", message: "请选择行政区域" },
        ],
        policeZoneName: [
          { required: true, trigger: "blur", message: "请选择管辖警务区" },
        ],
        managerIdcard: [
          { required: true, trigger: "blur", message: "请输入经营者身份证号" },
          {
            validator: (_, value, cb) => {
              if (!isIdCard(value)) return cb(new Error("身份证号码格式错误"));

              return cb();
            },
          },
        ],
        storeDetails: [
          { required: true, trigger: "blur", message: "请输入详细地址" },
        ],
        managerName: [
          { required: true, trigger: "blur", message: "请输入经营者姓名" },
        ],
        managerPhone: [
          { required: true, trigger: "blur", message: "请输入经营者手机号" },
          {
            trigger: "blur",
            validator: (_, value, cb) => {
              if (!isPhone(value)) return cb(new Error("手机号码不正确"));

              return cb();
            },
          },
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
