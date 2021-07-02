<template>
  <div class="ly-echarts ds-row">
    <div class="echart-container-left ds-col">
      <div class="echart-line-one">
        <div
          v-for="item in Object.keys(todayCount)"
          :key="item"
          class="number-flex bg-white r-2"
        >
          <div class="number-title">{{ todayCount[item].message }}</div>
          <div class="number-value">{{ todayCount[item].value }}</div>
        </div>
      </div>
      <div class="echart-line-two bg-white r-2">
        <p class="base-title">基本概况</p>
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
          <div class="count-item">入住人数：{{ baseInfo.avgPeopleTotal }}</div>
          <div class="count-item">入住人次：{{ baseInfo.joinPeopleTotal }}</div>
        </div>
      </div>
      <div class="echart-line-three ds-row">
        <div id="pie" class="mage-one border bg-white r-2"></div>
        <div id="treeGuests" class="mage-two border bg-white r-2"></div>
      </div>
    </div>
    <div class="echart-container-right ds-col">
      <div class="echart-left-one bg-white r-2">
        <p class="new-stay-title">最近入住</p>
        <transition-group name="list">
          <div
            v-for="reserve in reserves"
            :key="reserve['objectId']"
            class="new-stay-value"
          >
            <span>{{ reserve | reserveTime }}</span>
            <span class="mlp-2">{{ reserve | reserveNameAndIdcard }}</span>
          </div>
        </transition-group>
      </div>
      <div class="echart-left-two bg-white r-2">
        <p class="waring-title">异常预警</p>
        <transition-group name="list" mode="out-in">
          <div
            v-for="warning in exceptionWarnings"
            :key="warning['warningId']"
            class="waring-value"
            @click="orderShow(warning)"
          >
            <span>{{ warning | timeString }}</span>
            <span class="mlp-3">{{ warning | typeString }}</span>
          </div>
        </transition-group>
      </div>
    </div>

    <order-show ref="orderShow"></order-show>
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
import { queryPage } from "@/api/warning";
import { queryObjects as reservesQueryPage } from "@/api/order";
import OrderShow from "@/views/warning/components/warningShow";

const defaultRollUpLength = 8;

export default {
  filters: {
    timeString(waring) {
      return `${waring["warningTime"]}`;
    },

    typeString(waring) {
      return waring["warningTypeString"];
    },

    reserveTime(reserve) {
      return reserve["checkInTime"];
    },

    reserveNameAndIdcard(reserve) {
      return `${reserve["objectName"]} -- ${reserve["objectIdcard"]}`;
    },
  },

  components: {
    OrderShow,
  },

  data() {
    return {
      originTodayCount: null,

      nearlyWeekCheckInPeople: null,

      exceptionWarnings: [],

      rollUpWaring: [],

      reserves: [],

      rollUpReserves: [],

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

      rollUp: {
        waringSize: defaultRollUpLength, // 固定值，默认展示数量
        waringTotal: null,
        waringIndex: 1,
        waringTimeId: null,

        reserveSize: defaultRollUpLength,
        reserveTotal: null,
        reserveIndex: 1,
        reserveTimeId: null,
      },
    };
  },

  computed: {
    ...mapGetters({
      avatar: "user/avatar",
      username: "user/username",
    }),

    todayCheckInPeopleTotal() {
      return this.todayCount["todayCheckInPeopleTotal"];
    },
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

  async created() {
    await Promise.all([
      this.initTodayCount(),
      this.initBaseView(),
      this.initWeekGuestContent(),
    ]);

    this.autoRollUpWaring();
    this.autoRollUpReserves();
  },

  beforeDestroy() {
    this.rollUp.waringTimeId = null;
    this.rollUp.reserveTimeId = null;
  },

  methods: {
    orderShow(row) {
      if (row.warningId) {
        this.$refs["orderShow"].showEdit(row);
      }
    },

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
      this.todayCount.roomPre.value = _todayCount.roomUsageRate * 100 + "%";
    },

    async initBaseView() {
      const { data } = await basicOverview();

      this.baseInfo = data[0];
    },

    async initWeekGuestContent() {
      const { data } = await nearlyWeekCheckInPeople();

      this.nearlyWeekCheckInPeople = data;
    },

    async initExceptionWarnings() {
      const { data, pageTotal, pageIndex } = await queryPage({
        pageIndex: this.rollUp.waringIndex,
        pageSize: this.rollUp.waringSize,
      });

      this.rollUp.waringTotal = pageTotal;
      this.rollUp.waringIndex = pageIndex;

      this.rollUpWaring = data;
    },

    autoRollUpWaring() {
      this.rollUp.waringTimeId = setInterval(async () => {
        if (!this.rollUpWaring.length) {
          if (
            this.rollUp.waringTotal >
            this.rollUp.waringIndex * this.rollUp.waringSize
          ) {
            this.rollUp.waringIndex += 1;
          } else {
            this.rollUp.waringIndex = 1;
          }

          await this.initExceptionWarnings();
        }

        if (!this.exceptionWarnings.length) {
          this.exceptionWarnings = this.rollUpWaring;
          this.rollUpWaring = [];
        }

        if (
          this.rollUpWaring.length &&
          this.exceptionWarnings.length === defaultRollUpLength
        ) {
          this.exceptionWarnings.shift();
          this.exceptionWarnings.push(this.rollUpWaring.shift());
        }
      }, 2000);
    },

    async initReserves() {
      const { data, pageTotal, pageIndex } = await reservesQueryPage({
        pageIndex: this.rollUp.reserveIndex,
        pageSize: this.rollUp.reserveSize,
      });

      this.rollUp.reserveTotal = pageTotal;
      this.rollUp.reserveIndex = pageIndex;

      this.reserves = data;
    },

    autoRollUpReserves() {
      this.rollUp.reserveTimeId = setInterval(async () => {
        if (!this.rollUpReserves.length) {
          if (
            this.rollUp.reserveTotal >
            this.rollUp.reserveIndex * this.rollUp.reserveSize
          ) {
            this.rollUp.reserveIndex += 1;
          } else {
            this.rollUp.reserveIndex = 1;
          }

          await this.initReserves();
        }

        if (!this.reserves.length) {
          this.reserves = this.rollUpReserves;
          this.rollUpReserves = [];
        }

        if (
          this.reserves.length &&
          this.reserves.length === defaultRollUpLength
        ) {
          this.reserves.shift();
          this.reserves.push(this.rollUpReserves.shift());
        }
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active {
  transition: all 1s;
}
.list-enter
  /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

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

  .mlp-2 {
    margin-left: 10%;
  }

  .mlp-3 {
    margin-left: 15%;
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
    width: 70%;
    padding: 10px 16px;
  }

  .echart-container-right {
    box-sizing: border-box;
    flex: 1;
    padding: 10px 16px;
  }

  %title {
    font-size: 1em;
    font-weight: bold;
  }

  %line {
    height: 32px;
    line-height: 32px;
  }

  .echart-line-one {
    display: flex;
    flex-flow: row nowrap;

    .number-flex {
      flex: 1;
      height: 120px;
      padding: 0.8rem;
      margin-right: 12px;

      &:last-child {
        margin-right: 0;
      }
    }

    .number-title {
      @extend %title;
    }

    .number-value {
      margin-top: 2rem;
      font-size: 2em;
      font-weight: bolder;
      text-align: center;
    }
  }

  .echart-line-two {
    padding: 0 1em;
    margin: 16px 0;

    .base-title {
      @extend %title;
    }
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
    padding: 0 1em;

    .new-stay-title {
      @extend %title;
    }

    .new-stay-value {
      @extend %line;
    }
  }

  .echart-left-two {
    flex: 1;
    padding: 0 1em;
    margin-top: 16px;

    .waring-title {
      @extend %title;
    }

    .waring-value {
      @extend %line;
      cursor: pointer;
    }
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
