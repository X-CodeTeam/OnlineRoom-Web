<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    class="ly-room__dialog"
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
          <el-form-item label="楼栋层："
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
          <el-form-item label="所属门店：">{{ form.storeName }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属企业名称："
            >{{ form.corporateName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区域："
            >{{ form.storeAreaname }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店地址："
            >{{ form.storeDetails }}
          </el-form-item>
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
import { getRoom } from "@/api/room";

export default {
  name: "RoomShow",
  data() {
    return {
      form: {},
      title: "房间详情",
      dialogFormVisible: false,
    };
  },
  methods: {
    showEdit(row) {
      if (row) {
        const result = Object.assign({}, row);

        this.fetchData(result.roomId);
      }
      this.dialogFormVisible = true;
    },

    async fetchData(roomId) {
      this.listLoading = true;
      const { data } = await getRoom(roomId);
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
