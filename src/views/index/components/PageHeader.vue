<template>
  <div class="ly-echarts ds-row">
    <div class="echart-container-left ds-col">
      <div class="echart-line-one">
        <div v-for="index in 6" :key="index" class="number-flex border" />
      </div>
      <div class="echart-line-two">
        <p>基本概况</p>
        <div class="condition ds-row wrap">
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
          <div class="count-item">经营单位总数：{{}}</div>
        </div>
      </div>
      <div class="echart-line-three ds-row">
        <div class="mage-one border"></div>
        <div class="mage-two border"></div>
      </div>
    </div>
    <div class="echart-container-right ds-col">
      <div class="echart-left-one border">sd</div>
      <div class="echart-left-two border">sd</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import echarts from "echarts";

export default {
  data() {
    return {
      description: "",
    };
  },

  computed: {
    ...mapGetters({
      avatar: "user/avatar",
      username: "user/username",
    }),
  },

  mounted() {
    // this.initEcharts();
  },

  methods: {
    initEcharts() {
      const id = window.document.getElementById("echarts");

      console.log(id, "id");

      const myChart = echarts.init(id);

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.ly-echarts {
  flex: 1;

  height: 100%;
  background: #ffffff !important;

  .h-100 {
    height: 100%;
  }

  .fx-1 {
    flex: 1;
  }

  &.ds-col,
  .ds-col {
    display: flex;
    flex-flow: column nowrap;
  }

  &.ds-row,
  .ds-row {
    display: flex;
    flex-flow: row nowrap;
  }

  .wrap {
    flex-wrap: wrap !important;
  }

  .count-item {
    width: 25%;
    height: 50px;
    line-height: 50px;
  }

  .echart-container-left {
    box-sizing: border-box;
    width: 65%;
    padding: 10px 16px;
  }

  .echart-container-right {
    box-sizing: border-box;
    flex: 1;
    padding: 10px 16px;
  }

  .echart-line-one {
    display: flex;
    flex-flow: row nowrap;

    .number-flex {
      flex: 1;
      height: 150px;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .echart-line-two {
    margin: 16px 0;
  }

  .echart-line-three {
    flex: 1;

    .mage-one {
      flex: 1;
      width: 50%;
      height: 100%;
    }

    .mage-two {
      flex: 1;
      height: 100%;
      margin-left: 16px;
    }
  }

  .echart-left-one {
    height: 350px;
  }

  .echart-left-two {
    flex: 1;
    margin-top: 16px;
  }

  .border {
    border: 1px solid black;
  }

  .echart-item {
    width: 300px;
    height: 300px;
  }
}
</style>
