<template>
  <div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

          <el-table-column align="center" label="序号" type="index" width="50">
            <!-- <template slot-scope="scope">
              <span>{{scope.row.productTypeId}}</span>
            </template> -->
          </el-table-column>

          <el-table-column align="center" label="时间" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作人" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="客户姓名" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="产品名称" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="结果" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="listQuery.page"
                    :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getObj } from '@/api/transc/transc'
  import transcTableComponent from 'components/transcTable'
  // import { getClientStatus, getClientBankcard } from '@/api/client/client'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
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
        treeDeptData: [],
        checkedKeys: [],
        listLoading: true,
        role: undefined,
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
        listQuery: {
          page: 1,
          limit: 20
        },
        orderStatus: 1,
        statusH: false,
        dialogVisible: false,
        status: '',
        activeName1: 'first'
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'appointmentStatus',
        'genderType',
        'certificationStatus',
        'clientType',
        'idTypeOptions',
        'nationality',
        'expressType'
      ])
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)
      this.orderStatus = this.$route.params.orderStatus
      // this.status = this.$route.params.status
      // console.log(this.status)
    },
    methods: {
      getList() {
        let id = this.$route.params.appointmentId

        getObj(id).then(response => {
          this.list = []
          // this.status = this.form.status
          // this.statusH = this.status.indexOf('100') == -1 ? true : false
          // this.form.status = transformText(this.appointmentStatus, this.form.status)
        })
        // getFileObj(id).then(response => {
        //   this.dealFiles = response.data.dealFiles
        //   this.remitFiles = response.data.remitFiles
        // })
        
      },
      handleDept() {
        console.log('产品状态')
      },
      rejectResult(sts) {
        this.result.status = sts
        this.dialogReject = true
      },
      handleClick(tab) {
        console.log(tab)
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
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
  &:active {
    color: red;
  }
}

</style>

