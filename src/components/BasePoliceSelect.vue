<template>
  <!--  <el-select-->
  <!--    ref="policeSelect"-->
  <!--    v-model="select"-->
  <!--    v-bind="$attrs"-->
  <!--    style="width: 100%"-->
  <!--    filterable-->
  <!--    @change="handleSelect"-->
  <!--  >-->
  <!--    <el-option-->
  <!--      v-for="zone in zoneData"-->
  <!--      :key="zone['zoneId']"-->
  <!--      :label="zone['zoneName']"-->
  <!--      :value="zone['zoneId']"-->
  <!--    />-->
  <el-cascader
    ref="areaCascader"
    v-bind="$attrs"
    :key="diffKey"
    v-model="select"
    :options="zoneData"
    :props="Object.assign(defaultProps, loadProps)"
    clearable
    style="width: 100%"
    @change="handleSelect"
  />
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

    loadProps: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      select: "",

      diffKey: 1,

      defaultProps: {
        children: "child",
        label: "zoneName",
        value: "zoneCode",
        leaf: "leaf",
        emitPath: false,
      },
    };
  },

  watch: {
    zoneData: {
      handler(res) {
        console.log(res, "res");

        this.diffKey += 1;

        if (!res.length) {
          this.select = null;
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    handleSelect() {
      const _res = this.$lodash.last(this.$refs.areaCascader.getCheckedNodes());

      const { data } = _res;

      this.$emit("update:policeZoneId", data.zoneId);

      this.$emit("update:policeZoneName", data.zoneName);
    },
  },
};
</script>

<style scoped></style>
