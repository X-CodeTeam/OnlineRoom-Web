<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    class="ly-store__dialog"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店名称：">{{ form.storeName }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店地点：">{{
            form.storeLocation
          }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区域：">{{
            form.storeAreaname
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管辖警务区："
            >{{ form.policeZoneName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="详细地址：">{{ form.storeDetails }} </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="所属企业名称："
            >{{ form.corporateName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码："
            >{{ form.unifiedSocialCreditCode }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="经营者姓名："
            >{{ form.managerName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营者手机号："
            >{{ form.managerPhone }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="经营者身份证号："
        >{{ form.managerIdcard }}
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "StoreShow",

  components: {},

  data() {
    return {
      form: {},
      title: "",
      dialogFormVisible: false,
      org: {
        policeZoneData: [],
      },
    };
  },

  methods: {
    showEdit(row) {
      if (row) {
        this.title = "详情";
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
  },
};
</script>
