<template>
  <el-button>
    <el-upload
      action=""
      :show-file-list="false"
      :on-change="handleChangeFile"
      :http-request="handlePreview"
      >导入
    </el-upload>
  </el-button>
</template>

<script>
import { importFile } from "@/api/upload";

export default {
  name: "UploadFile",

  props: {
    action: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: "错误信息",
    },

    flash: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      fileData: [],
    };
  },

  methods: {
    async handlePreview() {
      let formData = new FormData();

      formData.append("file", this.fileData[0]);

      let status = await importFile(this.action, formData);

      if (status.type === "application/json") {
        const reader = new FileReader();
        reader.readAsText(status, "utf-8");
        reader.onload = async (e) => {
          let { data, err, ok } = JSON.parse(reader.result);

          if (!ok) {
            this.$message({
              type: "error",
              message: err.msg,
            });
          } else {
            this.flash && (await this.flash());

            this.$message({
              type: "success",
              message: "操作成功",
            });
          }
        };
      } else {
        this.$message({
          type: "error",
          message: "数据存在部分错误，请根据下载提示修改后重新上传",
        });
        // 开始数据下载
        let blob = new Blob([status]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = `${this.name}.xls`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    },

    handleChangeFile(e) {
      this.fileData = [];

      this.fileData.push(e.raw);
    },
  },
};
</script>

<style scoped></style>
