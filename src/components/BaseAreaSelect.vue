<template>
  <el-cascader
    ref="areaCascader"
    v-model="select"
    v-bind="$attrs"
    :options="levelZones"
    :props="Object.assign(defaultProps, loadProps)"
    clearable
    style="width: 100%"
    @change="_handleAreaCode"
  />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { splitLevelToLevel } from "@/store/modules/zones";

export default {
  name: "BaseAreaSelect",

  inheritAttrs: false,

  props: {
    zoneName: {
      type: String,
      default: "",
    },

    zoneCode: {
      type: String,
      default: "",
    },

    zoneId: {
      type: String,
      default: "",
    },

    level: {
      type: Array,
      default: null,
    },

    loadProps: {
      type: Object,
      default: () => {},
    },

    policeZoneData: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      select: null,

      defaultProps: {
        children: "child",
        label: "zoneName",
        value: "zoneCode",
        leaf: "leaf",
        emitPath: false,
      },
    };
  },

  computed: {
    ...mapGetters("zones", ["zones", "areaZones", "policeZones"]),

    levelZones() {
      return !this.level
        ? this.areaZones
        : splitLevelToLevel(this.zones, this.level[0], this.level[1]);
    },
  },

  watch: {
    zoneName(res) {
      if (!res) {
        this.select = null;
      }
    },

    zoneCode: {
      handler(res) {
        if (!res) {
          this.select = null;
        } else {
          this.select = res;

          this.upPoliceZoneData(this.zoneCode); // 一开始时为police加载数据
        }
      },
      immediate: true,
    },

    zoneId(res) {
      if (!res) {
        this.select = null;
      } else {
        this.select = res.split(",");
      }
    },
  },

  async created() {
    await this._initZones();
  },

  methods: {
    ...mapActions("zones", ["_initZones"]),

    upPoliceZoneData: function (zoneCode) {
      const _policeZoneData = this.policeZones.filter((item) => {
        return zoneCode === item.parentZoneCode;
      });

      this.$emit("update:policeZoneData", _policeZoneData);
    },

    _handleAreaCode() {
      const pinJie = (areaList, key) => {
        const dataList = [];

        areaList.forEach((item) => {
          dataList.push(item.data[key]);
        });

        return dataList.join(",");
      };

      const lastData = this.$refs.areaCascader.getCheckedNodes();

      this.$emit("update:zoneName", pinJie(lastData, "zoneName"));

      this.$emit("update:zoneCode", pinJie(lastData, "zoneCode"));

      this.$emit("update:zoneId", pinJie(lastData, "zoneId"));

      this.upPoliceZoneData(lastData[0].data.zoneCode);
    },
  },
};
</script>

<style scoped></style>
