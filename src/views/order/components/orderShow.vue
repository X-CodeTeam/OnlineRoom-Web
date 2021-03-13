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

      <el-row
        style="
          text-align: center;
          height: 36px;
          line-height: 36px;
          border-radius: 5px;
          background-color: rgba(0, 0, 0, 0.3);
          margin: 10px 0;
        "
      >
        {{ form.reserveStartTime }} 至 {{ form.reserveEndTime }}({{
          form.reserveStatusString
        }})
      </el-row>

      <el-row
        v-for="order in form.reserveObjects"
        :key="order.objectName + order.objectPhone"
        style="width: 90%; margin: 0 auto"
      >
        <el-col :span="7">
          <el-form-item label="预定人：" label-width="80px">{{
            order.objectName
          }}</el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="手机号：" label-width="80px"
            >{{ order.objectPhone }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="身份证号：" label-width="100px"
            >{{ order.objectIdcard }}
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
        const result = Object.assign({}, row);

        this.fetchData(result.reserveId);
      }
      this.dialogFormVisible = true;
    },

    async fetchData(reserveId) {
      this.listLoading = true;
      const { data } = await queryReserve(reserveId);
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
