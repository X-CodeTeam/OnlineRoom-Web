<template>
  <el-select
    :value="valuePropName"
    :label="labelPropName"
    class="dictionary-select"
    :disabled="disabled"
    clearable
    :multiple="multiple"
    v-bind="$attrs"
    :style="selectStyle"
    @change="handleChange"
  >
    <el-option
      v-for="item in optionValues"
      :key="item.value + item.label"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { dictionariesByTypeCode } from "@/api/dictionary";

const selfTypeData = {
  storeStatus: [
    {
      label: "正常",
      value: true,
    },
    { label: "注销", value: false },
  ],
};

export default {
  name: "BaseDictionarySelect",

  props: {
    valuePropName: {
      type: [String, Number],
      default: 1,
    },

    labelPropName: {
      type: String,
      default: "",
    },

    typeCode: {
      type: String,
      required: true,
    },

    selectStyle: {
      type: String,
      default: "width: 150px;",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    excludeCodes: {
      type: Array,
      default: () => [],
    },

    includeCodes: {
      type: [String, Array],
      default: "",
    },

    isQuery: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      optionValues: [],

      defaultSelected: [{ label: "全部", value: null }],
    };
  },

  async created() {
    // 加载字典项
    this.optionValues = (await this.getDic(this.typeCode)) || [];

    // 排除不需要展示的内容
    if (this.includeCodes) {
      const _includeCodes = Array.isArray(this.includeCodes)
        ? this.includeCodes
        : [this.includeCodes];

      this.optionValues = this.optionValues.filter((item) => {
        return _includeCodes.includes(item.code);
      });
    } else if (this.excludeCodes) {
      this.optionValues = this.optionValues.filter((item) => {
        return !this.excludeCodes.includes(item.code);
      });
    }

    this.optionValues = this.optionValues.map((item) => {
      return {
        value: item.value || item.dictValue,
        label: item.label || item.dictLabel,
      };
    });

    if (!this.isQuery) return;

    this.optionValues = [...this.defaultSelected, ...this.optionValues];

    await this.getDic(this.typeCode);
  },

  methods: {
    handleChange(value) {
      const item = this.optionValues.filter(
        (dictionary) => dictionary.value === value
      )[0] || { value: null, label: null };

      this.$emit("update:valuePropName", item.value);

      this.$emit("update:labelPropName", item.label);
    },

    async getDic(typeCode, force = false) {
      if (!typeCode) {
        console.warn(
          "typeCode is not set. it will not" +
            "get data from remote serve. please set."
        );
      }

      // 从session中获取数据
      const dicData = sessionStorage.getItem(typeCode || "");

      if (force || dicData === "[]" || !dicData) {
        // session中没有，从远程获取。issue 防止数据为[]时造成的错误

        let dicData = null;

        if (Object.keys(selfTypeData).indexOf(typeCode) !== -1) {
          dicData = selfTypeData[typeCode];
        } else {
          const { data } = await dictionariesByTypeCode(typeCode);

          dicData = data;
        }

        dicData &&
          sessionStorage.setItem(typeCode, JSON.stringify(dicData || {}));
      }

      return JSON.parse(sessionStorage.getItem(typeCode || ""));
    },
  },
};
</script>
