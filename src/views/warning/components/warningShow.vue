<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="160px">
      <div v-if="warningType == 1">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="姓名：">{{ form.objectName }} </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="身份证号："
                >{{ form.objectIdcard }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="手机号："
                >{{ form.objectPhone }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="性别："
                >{{ form.objectGender }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="籍贯："
                >{{ form.storeLocation }}
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <!-- <el-image
              :src=""
              alt="error"
              fit="contain"
              style="width: 45px; height: 45px"
            ></el-image> -->
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
          预警处置
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人：">{{ form.handler }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理方式："
              >{{ form.handleType }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="处理时间：">{{ form.handleTime }} </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="处理情况说明："
            >{{ form.handleRemark }}
          </el-form-item>
        </el-row>
      </div>

      <div v-if="warningType == 2">
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店名称："
              >{{ form.storeName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店地点："
              >{{ form.storeLocation }}
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
            <el-form-item label="管辖警务区："
              >{{ form.policeZoneName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="详细地址："
            >{{ form.storeDetails }}
          </el-form-item>
        </el-row>
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
              >{{ form.handler }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营者手机号："
              >{{ form.handleType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="经营者身份证号："
            >{{ form.handler }}
          </el-form-item>
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
          预警处置
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人：">{{ form.handler }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理方式："
              >{{ form.handleType }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="处理时间：">{{ form.handleTime }} </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="处理情况说明："
            >{{ form.handleRemark }}
          </el-form-item>
        </el-row>
      </div>

      <div v-if="warningType == 3">
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
            <el-form-item label="房间别名："
              >{{ form.roomAlias }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属门店："
              >{{ form.storeLocation }}
            </el-form-item>
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
            background-color: rgba(242, 242, 242, 1);
            margin: 10px 0;
          "
        >
          {{ form.checkInTime }} 入住
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
          预警处置
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人：">{{ form.handler }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理方式："
              >{{ form.handleType }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="处理时间：">{{ form.handleTime }} </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="处理情况说明："
            >{{ form.handleRemark }}
          </el-form-item>
        </el-row>
      </div>

      <div v-if="warningType == 4">
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
            <el-form-item label="房间别名："
              >{{ form.roomAlias }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属门店："
              >{{ form.storeLocation }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属企业名称："
              >{{ form.corporateName }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="订单信息："> </el-form-item>
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
            <el-row>
              <el-form-item label="姓名：">{{ form.objectName }} </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="身份证号："
                >{{ form.objectIdcard }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="手机号："
                >{{ form.objectPhone }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="性别："
                >{{ form.objectGender }}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="籍贯："
                >{{ form.storeLocation }}
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <!-- <el-image
              :src=""
              alt="error"
              fit="contain"
              style="width: 45px; height: 45px"
            ></el-image> -->
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
          预警处置
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人：">{{ form.handler }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理方式："
              >{{ form.handleType }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="处理时间：">{{ form.handleTime }} </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="处理情况说明："
            >{{ form.handleRemark }}
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryWarnings } from "@/api/warning";
export default {
  name: "CheckinShowShow",

  components: {},

  data() {
    return {
      warningType: null,
      form: {},
      title: "入住详情",
      dialogFormVisible: false,
    };
  },

  methods: {
    showEdit(row) {
      if (row) {
        var result = Object.assign({}, row);
        this.warningType = result.warningType;
        this.fetchData(result.warningId);
      }
      this.dialogFormVisible = true;
    },
    async fetchData(warningId) {
      this.listLoading = true;
      const { data } = await queryWarnings(warningId);
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
