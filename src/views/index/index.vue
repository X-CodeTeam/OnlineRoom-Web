<template>
  <div class="index-container">
    <div id="line" style="width: 50vw; height: 100vh"></div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",

  data() {
    return {
      option: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
    };
  },

  mounted() {
    this.myEcharts();
  },

  methods: {
    myEcharts() {
      const myChart = this.$echarts.init(document.getElementById("line"));
      //配置图表
      const option = {
        title: {
          text: "echarts入门示例",
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

<style lang="scss" scoped></style>
