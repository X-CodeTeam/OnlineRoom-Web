<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    class="ly-room__dialog"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属门店：" prop="storeId">
            <el-select
              v-model.trim="form.storeId"
              clearable
              placeholder="所属门店"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="store in needData['stores']"
                :key="store.storeId"
                :label="store.storeName"
                :value="store.storeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼栋层：" prop="buildingNumber">
            <el-input
              v-model.trim="form.buildingNumber"
              placeholder="几栋几单元几楼"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="房间号：" prop="roomNo">
            <el-input
              v-model.trim="form.roomNo"
              maxlength="5"
              type="number"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房间别名：" prop="roomAlias">
            <el-input v-model.trim="form.roomAlias" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="户型：" prop="roomHouseType">
            <el-dics
              :is-query="false"
              type-code="HOUSE_TYPE"
              :value-prop-name.sync="form.roomHouseType"
              style="width: 100%"
            >
            </el-dics>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房屋类型：" prop="roomType">
            <el-dics
              :is-query="false"
              type-code="ROOM_TYPE"
              :value-prop-name.sync="form.roomType"
              style="width: 100%"
            >
            </el-dics>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="面积：" prop="area">
            <el-input
              v-model.trim="form.area"
              placeholder="m²"
              maxlength="3"
              type="number"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房东姓名：" prop="landlordName">
            <el-input
              v-model.trim="form.landlordName"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="房东电话：" prop="landlordPhone">
        <el-input v-model.trim="form.landlordPhone"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, doAdd } from "@/api/room";
import { isPhone } from "@/utils/validate";

export default {
  name: "RoomEdit",

  props: {
    needData: {
      type: Object,
      default: () => {
        return {
          stores: [],
        };
      },
    },
  },

  data() {
    return {
      form: {
        roomHouseType: null,
        roomType: null,
      },
      rules: {
        storeId: [
          { required: true, trigger: "blur", message: "请选择所属门店" },
        ],
        roomNo: [{ required: true, trigger: "blur", message: "请输入房间号" }],
        roomHouseType: [
          { required: true, trigger: "blur", message: "请选择户型" },
        ],
        roomType: [
          { required: true, trigger: "blur", message: "请选择房屋类型" },
        ],
        landlordPhone: [
          {
            required: false,
            trigger: "blur",
            validator: (r, v, b) => {
              v && !isPhone(v) ? b("房东电话格式错误") : b();
            },
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
    },

    save() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.isAdd) {
            const res = await doAdd(this.form);

            res.ok && this.$baseMessage("操作成功", "success");
          } else {
            const res = await doEdit(this.form);

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
