<template>
  <el-cascader
    ref="areaCascader"
    v-model="select"
    v-bind="$attrs"
    :options="options"
    :props="props"
    clearable
    style="width: 100%"
    @change="_handleAreaCode"
  />
</template>

<script>
import { queryZones } from "@/api/zones";
import { cloneDeep, omit } from "lodash";

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
      select: "",

      originOptions: [],

      options: [],

      props: {
        children: "child",
        label: "zoneName",
        value: "zoneCode",
        leaf: "leaf",
        emitPath: false,
        checkStrictly: true,
      },

      cache: {},
    };
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
    await this.initAreaCode();
  },

  methods: {
    async initAreaCode() {
      const { data } = await queryZones();

      if (!data) return;

      this.originOptions = data;

      this.omitNullChild(data, "child");

      this.options = this.splitLevelToLevel(data, 0, 1);
    },

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

      let _policeZoneData = this.splitLeaveNode(this.originOptions);

      _policeZoneData = _policeZoneData.filter((item) => {
        return lastData.zoneCode === item.parentZoneCode;
      });

      this.$emit("update:policeZoneData", _policeZoneData);
    },

    splitLevelToLevel(root, startLevel, endLevel) {
      const newRoot = [];

      const _splitHead = (nodes, deep = 0) => {
        for (const item of nodes) {
          if (item.child && item.child.length) {
            if (deep === startLevel) {
              return newRoot.push(cloneDeep(item));
            }

            _splitHead(item.child, deep + 1);
          }
        }
      };

      const _splitFooter = (nodes, deep = 0) => {
        for (let index = 0; index < nodes.length; index++) {
          const item = nodes[index];

          if (item.child && item.child.length) {
            if (deep >= endLevel) {
              nodes[index] = omit(nodes[index], "child");
            }

            _splitFooter(item.child, deep + 1);
          }
        }
      };

      _splitHead(root);

      _splitFooter(newRoot, startLevel);

      return newRoot;
    },

    splitLeaveNode(root) {
      const newRoot = [];

      const _split = (nodes) => {
        nodes?.forEach((item) => {
          if (!item.child) {
            newRoot.push(item);
          }

          _split(item.child);
        });
      };

      _split(root);

      return newRoot;
    },

    omitNullChild(root, key) {
      const _omit = (node) => {
        for (let i = 0; i < node.length; i++) {
          if (node[i].child && !node[i].child.length) {
            node[i] = omit(node[i], key);

            return;
          }
          _omit(node[i].child);
        }
      };

      return _omit(root);
    },
  },
};
</script>

<style scoped></style>
