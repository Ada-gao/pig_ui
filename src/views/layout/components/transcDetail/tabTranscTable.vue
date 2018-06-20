<template>

  <div class="tabs">
    <div class="tab-title" @click="records=1">历史预约记录</div>
    <div class="tab-title" @click="records=2">历史打款记录</div>
    <div class="tab-title" @click="records=3">交易成功记录</div>
    <div class="tab-item" v-show="records == 1">
      <transc-table-component
        :orderStatus="2"
        :aptCol="true"
        :aptStatusCol="true">
      </transc-table-component>
    </div>
    <div class="tab-item" v-if="records == 2">
      <transc-table-component
        :orderStatus="3"
        :paymentCol="true"
        :payStatusCol="true">
      </transc-table-component>
    </div>
    <div class="tab-item" v-if="records == 3">
      <transc-table-component
        :orderStatus="1"
        :statusCol="true"
        :aptCol="true">
      </transc-table-component>
    </div>
  </div>
</template>

<script>
  import { getObj, putObj, getFileObj } from '@/api/transc/transc'
  import transcTableComponent from 'components/transcTable'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    components: {
      ElOption,
      transcTableComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        form: {},
        statusOptions: ['0', '1'],
        rolesOptions: [],
        nextToUpdate: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        idType: '',
        isClientType: '',
        failReason: '',
        tip: false,
        activeName2: 'first',
        tableKey: 0,
        list: [],
        total: null,
        records: 1,
        orderStatus: 1,
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'appointmentStatus'
      ])
    }
  }
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-select,
.el-date-editor {
  width: 100%;
}
.upfile-group {
  .btn-padding {
    @include padding;
  }
}
.tab-title {
  display: inline-block;
  padding: 0 18px;
  &:active {
    color: red;
  }
}

</style>

