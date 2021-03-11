<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="160px">
      <el-form-item label="门店地点：">{{ form.storeLocation }} </el-form-item>
      <el-form-item label="房间号：">{{ form.roomNo }} </el-form-item>
      <el-form-item label="入住日期："
        >{{ form.reserveStartTime }}
      </el-form-item>
      <el-form-item label="退房日期：">{{ form.reserveEndTime }} </el-form-item>
      <el-form-item label="预订人数：">{{
        form.reservePeopleNum
      }}</el-form-item>
      <el-form-item label="订单状态："
        >{{ form.reserveStatusString }}
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "OrderShow",
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
        this.form = Object.assign({}, row);
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.$refs["form"].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
  },
};
</script>
