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
          <el-form-item label="楼栋层：">{{
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

      <el-row>
        <el-col>
          <el-form-item label="订单信息："></el-form-item>
        </el-col>
      </el-row>
      <el-row
        style="
          text-align: center;
          height: 36px;
          line-height: 36px;
          border-radius: 5px;
          background-color: rgba(242, 242, 242, 1);
          margin: 10px 0;
        "
      >
        {{ form.checkInTime }} 入住
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：">{{ form.objectName }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：">{{ form.objectGender }} </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证号："
            >{{ form.objectIdcard }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号：">{{ form.objectPhone }} </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="籍贯：">{{ form.objectHometown }} </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getObjects } from "@/api/order";
export default {
  name: "CheckinShowShow",

  components: {},

  data() {
    return {
      form: {},
      title: "入住详情",
      dialogFormVisible: false,
    };
  },

  methods: {
    showEdit(row) {
      if (row) {
        var result = Object.assign({}, row);
        this.fetchData(result.objectId);
      }
      this.dialogFormVisible = true;
    },
    async fetchData(objectId) {
      this.listLoading = true;
      const { data } = await getObjects(objectId);
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
