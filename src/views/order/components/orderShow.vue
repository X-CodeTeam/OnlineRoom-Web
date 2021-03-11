<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店地点："
            >{{ form.storeLocation }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼栋号：">{{
            form.buildingNumber
          }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="房间号：">{{ form.roomNo }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房间别名：">{{ form.roomAlias }} </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="所属门店：">{{ form.storeName }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属企业名称："
            >{{ form.corporateName }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryReserve } from "@/api/order";
export default {
  name: "OrderShow",

  components: {},

  data() {
    return {
      form: {},
      title: "订单详情",
      dialogFormVisible: false,
    };
  },

  methods: {
    showEdit(row) {
      if (row) {
        var result = Object.assign({}, row);
        this.fetchData(result.reserveId);
      }
      this.dialogFormVisible = true;
    },
    async fetchData(reserveId) {
      this.listLoading = true;
      const { data } = await queryReserve(reserveId);
      debugger;
      if (data.length >= 1) {
        this.form = data[0];
      }
      this.listLoading = false;
    },
    close() {
      this.$refs["form"].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
  },
};
</script>
