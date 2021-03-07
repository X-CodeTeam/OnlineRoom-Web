<template>
  <el-select
    ref="policeSelect"
    v-model="select"
    v-bind="$attrs"
    style="width: 100%"
    filterable
    @change="handleSelect"
  >
    <el-option
      v-for="zone in zoneData"
      :key="zone['zoneId']"
      :label="zone['zoneName']"
      :value="zone['zoneId']"
    />
  </el-select>
</template>

<script>
export default {
  name: "BaseOrgSelect",

  props: {
    policeZoneName: {
      type: String,
      default: "",
    },

    policeZoneId: {
      type: Number,
      default: null,
    },

    zoneData: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      select: "",
    };
  },

  watch: {
    zoneData: {
      handler(res) {
        if (!res.length) {
          this.select = null;
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    handleSelect(res) {
      const _res = this.zoneData.find((item) => {
        return item.zoneId === res;
      });

      this.$emit("update:policeZoneId", _res.zoneId);

      this.$emit("update:policeZoneName", _res.zoneName);
    },
  },
};
</script>

<style scoped></style>
