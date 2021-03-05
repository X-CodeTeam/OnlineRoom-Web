<template>
  <div class="index-container">
    <el-row :gutter="20">
      <page-header></page-header>
    </el-row>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader";

export default {
  name: "Index",

  components: {
    PageHeader,
  },
};
</script>

<style lang="scss" scoped>
.index-container {
  padding: 0 !important;
  margin: 0 !important;
  background: #f5f7f8 !important;

  ::v-deep {
    .chart1,
    .chart2,
    .version-information {
      min-height: 268px;
    }

    .el-card {
      .el-card__header {
        position: relative;

        .card-header-tag {
          position: absolute;
          top: 15px;
          right: $base-padding;
        }

        > div > span {
          display: flex;
          align-items: center;

          i {
            margin-right: 3px;
          }
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 127px;
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }
  }
}
</style>
