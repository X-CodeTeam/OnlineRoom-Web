<template>
  <el-cascader
    ref="areaCascader"
    v-model="select"
    v-bind="$attrs"
    :options="areaZones"
    :props="defaultProps"
    clearable
    style="width: 100%"
    @change="_handleAreaCode"
  />
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "BaseAreaSelect",

  props: {
    zoneName: {
      type: String,
      default: "",
    },

    zoneCode: {
      type: String,
      default: "",
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
        checkStrictly: true,
      },
    };
  },

  computed: {
    ...mapGetters("zones", ["areaZones", "policeZones"]),
  },

  watch: {
    zoneName(res) {
      if (!res) {
        this.select = null;
      }
    },

    zoneCode(res) {
      if (!res) {
        this.select = null;
      }
    },
  },

  async created() {
    await this._initZones();
  },

  methods: {
    ...mapActions("zones", ["_initZones"]),

    _handleAreaCode() {
      const { data: lastData } = this.$lodash.last(
        this.$refs.areaCascader.getCheckedNodes()
      ) || {
        data: {
          zoneName: null,
          zoneCode: null,
        },
      };

      this.$emit("update:zoneName", lastData.zoneName);

      this.$emit("update:zoneCode", lastData.zoneCode);

      const _policeZoneData = this.policeZones.filter((item) => {
        return lastData.zoneCode === item.parentZoneCode;
      });

      this.$emit("update:policeZoneData", _policeZoneData);
    },
  },
};
</script>

<style scoped></style>
