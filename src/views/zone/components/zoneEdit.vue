<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    class="ly-zone__dialog"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="上级名称：" prop="parentZoneCode">
        <el-area-tree
          :zone-code.sync="form.parentZoneCode"
          :zone-name.sync="form.parentZoneName"
        ></el-area-tree>
      </el-form-item>
      <el-form-item label="编号：" prop="zoneCode">
        <el-input v-model.trim="form.zoneCode"></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="zoneName"
        ><el-input v-model.trim="form.zoneName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="负责人：" prop="principalName"
        ><el-input
          v-model.trim="form.principalName"
          maxlength="50"
          placeholder="请填写负责人姓名、联系方式等信息"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addZone, modifyZone } from "@/api/zones";
import ElAreaTree from "@/components/ElAreaTree";
import { isNumber } from "@/utils/validate";

export default {
  name: "StoreEdit",

  components: {
    ElAreaTree,
  },

  data() {
    return {
      form: {},
      rules: {
        parentZoneCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "请选择上级行政区划",
          },
        ],
        zoneCode: [
          // { required: true, trigger: "blur", message: "请输入编号" },
          {
            validator: (_, val, cb) => {
              return val && !isNumber(val)
                ? cb(new Error("编号只能为数字"))
                : cb();
            },
          },
        ],
        zoneName: [
          { required: true, trigger: "blur", message: "请输入行政区划名称" },
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
            const res = await addZone(this.form);
            res.ok && this.$baseMessage("添加成功!", "success");
          } else {
            const res = await modifyZone(this.form);
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
