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
          <el-form-item label="所属门店：">{{ form.storeName }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼栋号："
            >{{ form.buildingNumber }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="房间号：">{{ form.roomNo }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房间别名：">{{ form.roomAlias }} </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="户型："
            >{{ form.roomHouseTypeString }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房屋类型："
            >{{ form.roomTypeString }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="面积：">{{ form.area }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房东姓名："
            >{{ form.landlordName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="房东电话：">{{ form.landlordPhone }} </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RoomShow",
  data() {
    return {
      form: {},
      title: "",
      dialogFormVisible: false,
    };
  },
  methods: {
    showEdit(row) {
      if (row) {
        this.title = "房间详情";
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
