<template>
  <div class="paging-table hp-100 ly-panel ly-search-table">
    <el-form
      v-if="searchForm"
      :inline="true"
      class="paging-table__form flex-row-warp"
    >
      <slot name="search-form" />
    </el-form>

    <el-table
      ref="theTable"
      v-loading="tableLoading"
      :data="content ? content : localData"
      height="1000"
      v-bind="$attrs"
      :stripe="true"
      size="medium"
      class="paging-table__content"
      @selection-change="selectionChange"
    >
      <el-table-column v-if="isSelection" type="selection" width="50" />
      <el-table-column
        v-if="isIndex"
        label="序号"
        type="index"
        align="center"
        :index="indexStart"
        show-overflow-tooltip
        width="60"
      />
      <el-table-column
        v-for="table in tableProps"
        :key="table.name"
        :prop="table.prop"
        :label="table.name"
        :align="table.align || 'center'"
        :width="table.width"
        :formatter="table.formatter"
        show-overflow-tooltip
      ></el-table-column>
      <slot name="table-self" />
    </el-table>

    <el-pagination
      v-if="isPagingShow"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="paging.pageTotal"
      :pager-count="5"
      :page-sizes="[10, 20, 30]"
      class="paging-table__page text-right"
      :current-page.sync="paging.pageIndex"
      :page-size.sync="paging.pageSize"
    />
  </div>
</template>

<script>
import { compact } from "lodash";

const [INIT_QUERY, MIN_HEIGHT] = [Symbol("initQuery"), Symbol.for("440")];

export default {
  name: "PagingTable",

  inheritAttrs: false,

  props: {
    content: {
      type: [Boolean, Array],
      default: false,
    },

    props: {
      type: Object,
      default: () => {},
    },

    searchForm: {
      type: Boolean,
      default: false,
    },

    queryParams: {
      type: Object,
      default: () => {},
    },

    dataMethod: {
      type: Function,
      default: () => function () {},
    },

    tableProps: {
      type: Array,
      default: () => [],
    },

    isIndex: {
      type: Boolean,
      default: false,
    },

    isSelection: {
      type: Boolean,
      default: false,
    },

    isPagingShow: {
      type: Boolean,
      default: true,
    },

    // 是否开启自动适应高度
    isAutoHeight: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      localData: [],

      tableLoading: false,

      indexStart: 1,

      paging: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: null,
      },

      cache: { oldRows: null },

      flashSelection: false,
    };
  },

  computed: {
    theTable() {
      return this.$refs.theTable;
    },
  },

  watch: {
    tableLoading: {
      // 用于消除loading不正确处理的时候，也能正常退出
      handler(_tableLoading) {
        if (_tableLoading) {
          setTimeout(() => {
            this.tableLoading = false;
          }, 3000);
        }
      },
    },

    paging: {
      handler(_paging) {
        this.indexStart = (_paging.pageIndex - 1) * _paging.pageSize + 1; // 索引的计数
      },
      deep: true,
    },

    "paging.pageIndex": {
      // 监视页面索引的变化
      async handler(newVal, oldVal) {
        if (this.content) return;

        await this._initTableData();

        oldVal && this.$emit("is-paging", false);
      },
      immediate: true,
    },

    "paging.pageSize": {
      // 监视页面大小的变化
      async handler() {
        await this._initTableData();
      },
    },
  },

  updated() {
    this.autoFillHeight();
  },

  methods: {
    // 回到滚动条的顶部
    scrollToTop() {
      if (!this.theTable) return;

      if (this.theTable.bodyWrapper) {
        this.theTable.bodyWrapper.scrollTop = 0;
      }
    },

    /**
     * 从res中获取分页信息
     * @param responseData
     */
    mountedPaging(responseData) {
      const _paging = this.$lodash.pick(responseData, Object.keys(this.paging));

      if (!Object.keys(_paging).length && !this.props.paging) {
        // 默认格式不正确，👎且未能提供数据的分页格式
        return console.warn(
          "The response data struct dont`t like " +
            "{pageIndex, pageSize, pageTotal}. we recommend you support the map named pagingProp " +
            "that can change you structure to this inside prop"
        );
      }

      if (this.props && this.props.paging) {
        for (const key in this.props.paging) {
          if (Object.prototype.hasOwnProperty.call(this.props.paging, key)) {
            if (!Object.keys(this.paging).includes(key)) {
              // 未按照格式进行书写
              return console.warn(
                `${key} should be equal to the one of {pageIndex, pageSize, pageTotal}`
              );
            }

            _paging[key] = responseData[this.props.paging[key]]; // 格式正确，获取数据
          }
        }
      }

      Object.assign(this.paging, _paging); // Object.assign will cache paging
    },

    /**
     * 挂载表格数据
     * @private
     */
    async _initTableData() {
      this.tableLoading = true;

      const res = await this.dataMethod(
        Object.assign({}, this.paging, this.queryParams)
      ); // {} avoid cache redundant data

      if (!res) return console.warn("request`s response has no data");

      this.localData = res.data; // 保证数据的始终在正确范围

      this.mountedPaging(res);

      this.scrollToTop();

      this.tableLoading = false;
    },

    // 设置页码，改变页面会自动更新数据
    setPageIndex(pageIndex) {
      this.paging.pageIndex = pageIndex;
    },

    // 手动更新数据
    async flashTable() {
      await this._initTableData();
    },

    // row选择
    selectionChange(rows) {
      this.$emit("selection-change", rows);
    },

    /**
     * @description 自适应列表高度（只有设置isAutoHeight为true且数据长度为10时触发）
     */
    autoFillHeight() {
      // 此处的三个return都是为了提高性能
      // 设置自动适应高度属性和表格高度为10才能执行
      if (!(this.isAutoHeight && this.localData?.length >= 3)) {
        // 当不需要自适应高度的时候，恢复到正常值
        this.cache.size = "medium";

        this.cache.height = 1000;

        return;
      }

      // 表头也会改变
      const height = this.$el.querySelector(
        ".ly-search-table > div"
      ).offsetHeight;

      // 是否能正常获取高度
      if (height && height < Symbol.keyFor(MIN_HEIGHT))
        return console.warn(
          `${height} < ${Symbol.keyFor(
            MIN_HEIGHT
          )} 表格区域高度小于自适应的最小高度， 无法自适应高度`
        );

      const tdAndRrs = this.contentTdAndTr(
        ".el-table__body-wrapper",
        ".el-table__header-wrapper"
      ).concat(
        this.contentTdAndTr(
          ".el-table__fixed-body-wrapper",
          ".el-table__fixed-header-wrapper"
        )
      );

      // 是否能获取到内部元素
      if (!tdAndRrs.length) return;

      const everyRowHeight = height / 11;

      // 默认为最小的padding值
      this.cache.size = "mini";

      this.$el
        .querySelector(".el-table__fixed-body-wrapper")
        ?.setAttribute("style", `top: ${everyRowHeight}px`);

      // 不设置固定高度
      this.cache.height = null;

      tdAndRrs.map((node) => {
        return node.setAttribute(
          "style",
          `height: ${everyRowHeight}px !important`
        );
      });
    },

    contentTdAndTr(bodySelector, headerSelector) {
      return compact([
        ...this.$el.querySelectorAll(`${bodySelector} .el-table__row`),
        this.$el.querySelector(`${headerSelector} > table > thead > tr`),
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.paging-table {
  display: flex;
  flex-flow: column nowrap;

  .no-flex {
    flex: 0 0;
  }

  &__form {
    @extend .no-flex;

    ::v-deep {
      .el-form-item {
        display: flex;

        &__content {
          flex: 1;
        }
      }
    }
  }

  &__content {
    border: 1px solid rgba(150, 150, 150, 0.1);
  }

  &__apge {
    @extend .no-flex;
  }
}

::v-deep {
  .el-table th.is-leaf,
  .el-table td {
    border: none;
  }
}
</style>
