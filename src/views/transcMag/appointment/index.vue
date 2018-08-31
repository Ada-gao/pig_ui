
<template>
  <div class="app-container calendar-list-container">

    <transc-search-component
      :searchTranscStatus="false"
      :searchRefund="false"
      :status="status"
      :searchContract="false">
    </transc-search-component>

    <transc-table-component
      :activePath="activePath"
      :showValueDate="false"
      :orderStatus="2"
      :aptCol="true"
      :aptCol1="true"
      :aptStatusCol="true">
    </transc-table-component>

  </div>
</template>

<script>
  import transcSearchComponent from 'components/searchBar/transaction'
  import transcTableComponent from 'components/table/transcTable'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      transcSearchComponent,
      transcTableComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        treeDeptData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        list: null,
        total: null,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        form: [],
        status: 10,
        activePath: this.$route.path
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel'
      ])
    },
    created() {
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
    }
  }
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-select,
.el-date-editor {
  width: 100%;
}
.filter-container {
  .query-title {
    white-space: nowrap;
    min-width: 85px;
    padding: 0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    vertical-align: center;
  }
  .el-checkbox-button:hover {
    color: #00C1DF;
  }
  .el-checkbox-button__inner:hover {
    color: #00C1DF;
  }
  .el-checkbox-button__inner:active {
    background-color: #00C1DF;
    color: #fff;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #00C1DF;
  }
}
.btn-padding {
  @include padding;
}
.query-color {
  @include mainColor;
}
</style>

