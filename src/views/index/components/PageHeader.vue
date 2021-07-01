<template>
  <div class="ly-echarts ds-row">
    <div class="echart-container-left ds-col">
      <div class="echart-line-one">
        <div
          v-for="item in Object.keys(todayCount)"
          :key="item"
          class="number-flex bg-white r-2"
        >
          <div>{{ todayCount[item].message }}</div>
          <div>{{ todayCount[item].value }}</div>
        </div>
      </div>
      <div class="echart-line-two bg-white r-2">
        <p>基本概况</p>
        <div class="condition ds-row wrap">
          <div class="count-item">
            经营单位总数：{{ baseInfo.corporateTotal }}
          </div>
          <div class="count-item">门店总数：{{ baseInfo.storeTotal }}</div>
          <div class="count-item">
            住宅房间：{{ baseInfo.residentialRoomTotal }}
          </div>
          <div class="count-item">
            公寓房间：{{ baseInfo.condominiumRoomTotal }}
          </div>
          <div class="count-item">房间总数：{{ baseInfo.roomTotal }}</div>
          <div class="count-item">订单总数：{{ baseInfo.reserveTotal }}</div>
          <div class="count-item">入住人数：{{}}</div>
          <div class="count-item">入住人次：{{ baseInfo.joinPeopleTotal }}</div>
        </div>
      </div>
      <div class="echart-line-three ds-row">
        <div id="pie" class="mage-one border bg-white r-2"></div>
        <div id="treeGuests" class="mage-two border bg-white r-2"></div>
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
import {
  basicOverview,
  getTodayCount,
  nearlyWeekCheckInPeople,
} from "@/api/counts";

export default {
  data() {
    return {
      originTodayCount: null,

      nearlyWeekCheckInPeople: null,

      baseInfo: {
        avgPeopleTotal: 1,
        condominiumRoomTotal: 36,
        corporateTotal: 1,
        joinPeopleTotal: 1,
        reserveTotal: 1,
        residentialRoomTotal: 0,
        roomTotal: 36,
        storeTotal: 4,
      },

      todayCount: {
        order: {
          message: "今日订单",
          value: "1",
        },
        guestNumber: {
          message: "今日入住人数",
          value: "",
        },
        orderRooms: {
          message: "今日预定房间",
          value: "",
        },
        emptyRooms: {
          message: "今日空闲房间",
          value: "",
        },
        roomPre: {
          message: "房间使用率",
          value: "",
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      avatar: "user/avatar",
      username: "user/username",
    }),
  },

  watch: {
    originTodayCount: {
      handler(res) {
        res && this.initEchartsPie();
      },
      immediate: true,
    },

    nearlyWeekCheckInPeople: {
      handler(res) {
        res && this.initEchartsTreeGuests();
      },
    },
  },

  async mounted() {
    await Promise.all([
      this.initTodayCount(),
      this.initBaseView(),
      this.initWeekGuestContent(),
    ]);
  },

  methods: {
    initEcharts(id, options) {
      const myChart = echarts.init(window.document.getElementById(id));

      myChart.setOption(options);
    },

    initEchartsPie() {
      // 指定图表的配置项和数据
      const options = {
        title: {
          text: "今日旅客性别比例",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: this.originTodayCount["todayCheckInPeopleTotalByMan"],
                name: "今日入住男性",
              },
              {
                value: this.originTodayCount["todayCheckInPeopleTotalByWoman"],
                name: "今日入住女性",
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      this.initEcharts("pie", options);
    },

    initEchartsTreeGuests() {
      const yAxis = [];

      const xAxis = [];

      const extractYAxis = () => {
        this.nearlyWeekCheckInPeople.forEach((item) => {
          yAxis.push(item.date);
        });
      };

      const extractXAxis = () => {
        this.nearlyWeekCheckInPeople.forEach((item) => {
          xAxis.push(item.checkInPeopleTotal);
        });
      };

      extractXAxis();
      extractYAxis();

      const option = {
        title: {
          text: "近一周入住人数",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: yAxis,
        },
        series: [
          {
            type: "bar",
            data: xAxis,
          },
        ],
      };

      this.initEcharts("treeGuests", option);
    },

    async initTodayCount() {
      let { data: _todayCount } = await getTodayCount();

      _todayCount = _todayCount[0];

      this.originTodayCount = _todayCount;

      this.todayCount.order.value = _todayCount.todayReserveTotal;
      this.todayCount.guestNumber.value = _todayCount.todayCheckInPeopleTotal;
      this.todayCount.orderRooms.value = _todayCount.todayReserveRoomTotal;
      this.todayCount.emptyRooms.value = _todayCount.todayReserveTotal;
      this.todayCount.roomPre.value = _todayCount.roomUsageRate;
    },

    async initBaseView() {
      const { data } = await basicOverview();

      this.baseInfo = data[0];
    },

    async initWeekGuestContent() {
      const { data } = await nearlyWeekCheckInPeople();

      this.nearlyWeekCheckInPeople = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.ly-echarts {
  flex: 1;

  height: 100%;

  .bg-white {
    background: #ffffff !important;
  }

  .r-2 {
    border-radius: 4px;
  }

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
