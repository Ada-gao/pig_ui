<template>

  <div class="tabs">
    <div class="tab-title" :class="{ active: records == 1 }" @click="changeTab('1')">历史预约记录</div>
    <div class="tab-title" :class="{ active: records == 2 }" @click="changeTab('2')">历史打款记录</div>
    <div class="tab-title" :class="{ active: records == 3 }" @click="changeTab('3')">交易成功记录</div>
    <div class="tab-item" v-if="records == 1">
      <transc-table-component
        :id="clientId"
        :showValueDate="true"
        :dealHistory="data"
        :aptCol="true"
        :aptCol1="true"
        :aptStatusCol="true">
      </transc-table-component>
    </div>
    <div class="tab-item" v-if="records == 2">
      <transc-table-component
        :id="clientId"
        :showValueDate="true"
        :dealHistory="data"
        :paymentCol="true"
        :payStatusCol="true">
      </transc-table-component>
    </div>
    <div class="tab-item" v-if="records == 3">
      <transc-table-component
        :id="clientId"
        :showValueDate="true"
        :dealHistory="data"
        :statusCol="true"
        :aptCol1="true"
        :aptCol="true">
      </transc-table-component>
    </div>
  </div>
</template>

<script>
  import { getObj, putObj, getFileObj } from '@/api/transc/transc'
  import transcTableComponent from 'components/table/transcTable'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import Bus from '@/assets/js/bus'
  import { fetchRecords } from '@/api/transc/records'

  export default {
    components: {
      ElOption,
      transcTableComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    props: {
      clientId: {
        default: 0
      }
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
        listQuery: {
          page: 1,
          limit: 20,
          isFloat: null
        },
        data: {}
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'appointmentStatus'
      ])
    },
    watch: {
      clientId(newVal, oldVal) {
        console.log(newVal)
        if(newVal) {
          this.changeTab()
        }
      }
    },
    created() {
      // console.log(this.clientId)
      if(this.clientId) {
        this.changeTab()
      }
    },
    methods: {
      changeTab(Num = 1) {
        this.records = Num
        this.listQuery.clientId = this.clientId
        if(Num == 1) {
          this.listQuery.status = 10
          console.log('111')
        } else if(Num == 2) {
          this.listQuery.status = 20
        } else if(Num == 3) {
          this.listQuery.status = 3004
        }
        this.getHistory()
        // Bus.$emit('searchRecords', this.listQuery)
      },
      getHistory() {
        // this.queryId = 2
        // if(this.historyStatus) {
        // console.log(this.historyStatus)
        fetchRecords(this.listQuery).then(response => {
          this.data = response.data
          // this.data.list = response.data.records
          // this.data.total = response.data.total
          this.listLoading = false
          console.log(this.data.records)
          this.data.records.forEach(item => {
            item.statusText = transformText(this.appointmentStatus, item.status)
            // item.valueDate = item.valueDate ? parseTime(item.valueDate, '{y}-{m}-{d}') : ''
          })
        })
        // }
      }
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
  cursor: pointer;
}
.active {
  @include mainColor;
}

</style>

