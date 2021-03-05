<template>
  <div class="editor-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="URL地址" prop="title">
        <el-input v-model="form.url" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item class="vab-quill-content" label="内容" prop="content">
        <vab-quill v-model="form.content" :min-height="400"></vab-quill>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSee">预览效果</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogTableVisible" title="预览效果">
      <h1 class="news-title">{{ form.title }}</h1>
      <div class="news-content" v-html="form.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import vabQuill from "@/extra/vabQuill";
import { doAdd } from "@/api/flash";

export default {
  name: "RichTextEditor",
  components: { vabQuill },
  data() {
    return {
      borderColor: "#dcdfe6",
      dialogTableVisible: false,
      form: {
        title: "",
        url: "",
        content: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSee() {
      this.$refs["form"].validate((valid) => {
        this.$refs.form.validateField("content", () => {});
        if (valid) {
          this.dialogTableVisible = true;
        } else {
          return false;
        }
      });
    },
    handleSave() {
      this.$refs["form"].validate(async (valid) => {
        this.$refs.form.validateField("content", (errorMsg) => {
          this.borderColor = "#dcdfe6";
          if (errorMsg) {
            this.borderColor = "#F56C6C";
          }
        });
        if (valid) {
          const res = await doAdd(this.form);
          this.$baseMessage(res.message, "success");
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.editor-container {
  .news {
    &-title {
      text-align: center;
    }

    &-content {
      ::v-deep {
        p {
          line-height: 30px;

          img {
            display: block;
            margin-right: auto;
            margin-left: auto;
          }
        }
      }
    }
  }

  .vab-quill-content {
    ::v-deep {
      .el-form-item__content {
        line-height: normal;
      }
    }
  }
}
</style>
