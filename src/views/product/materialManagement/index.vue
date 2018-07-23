
<template>
  <div class="app-container calendar-list-container">

    <div class="main-tab">
      <el-radio-group v-model="step" @change="changeStep" style="margin-bottom: 0;">
        <el-radio-button label="1">交易所需材料</el-radio-button>
        <el-radio-button label="2">客户所需提交材料</el-radio-button>
      </el-radio-group>
    </div>
    <div class="second-tab" v-show="step==='2'">
      <span class="second-item" @click="changeSecStep('1')" :class="{'query-color': secStep==='1'}">专业投资者</span>
      <span class="second-item" @click="changeSecStep('2')" :class="{'query-color': secStep==='2'}">普通投资者</span>
    </div>
    <div style="text-align: right">
      <el-upload
        v-if="step==1"
        class="upload-demo"
        style="display: inline-block;"
        :headers="headers"
        :action="importUrl"
        :on-success="handleCreate"
        :show-file-list="false"
        accept=".pdf">
        <el-button
          class="add_btn"><svg-icon icon-class="add"></svg-icon> 新增资料</el-button>
      </el-upload>
      <el-button v-else class="add_btn" @click="openCreate">
        <svg-icon icon-class="add"></svg-icon> 新增资料</el-button>
    </div>

    <div class="table-item" v-if="step==1">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

        <el-table-column align="center" label="材料名称">
          <template slot-scope="scope">
            <el-input
              v-if="transcId===scope.row.transactionFileManageId"
              v-model="scope.row.name"
              @keyup.enter.native="$event.target.blur"
              @blur="updateTranscFile(scope.row)"></el-input>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="附件">
          <template slot-scope="scope">
            <span>{{scope.row.filePath}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="文件大小">
          <template slot-scope="scope">
            <span>{{scope.row.fileSize}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <a size="small" class="common_btn"
                      @click="transcId=scope.row.transactionFileManageId">编辑
                      <!-- @click="handleRouter(scope.row.clientId)">编辑 -->
            </a>
            <span class="space_line"> | </span>
            <a size="small" class="common_btn"
                      @click="deleteTransc(scope.row.transactionFileManageId)">删除
            </a>
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
    <div class="table-item" v-else>
      <product-material-component
        :productList="data"
        @searchProduct="getListQuery"
        @del-client-file="deleteClient"
        @upd-client-file="updateClientFile">
      </product-material-component>
    </div>


  </div>
</template>

<script>
  import productMaterialComponent from 'components/table/material'
  import { getClientFile, addClientFile, updClientFile, delClientFile,
    getTranscFile, addTranscFile, updTranscFile, delTranscFile } from '@/api/product/fileManage'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { decimals } from '@/utils/validate'
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      productMaterialComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        treeDeptData: [],
        checkedKeys: [],
        list: null,
        list1: null,
        total: null,
        total1: null,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          isFloat: null,
          orderByField: 'create_time',
          isAsc: false
        },
        statusOptions: ['0', '1'],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        textMap: {
          update: '编辑产品',
          create: '新增产品'
        },
        tableKey: 0,
        tableKey1: 0,
        sex: '',
        edu: '',
        currencyList: [],
        IDsType: '',
        entryDate: '',
        fileList: [],
        productTypes: [],
        productTypesList: [],
        input2: '',
        // nextToUpdate: false,
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        indexList1: [],
        indexList2: [],
        indexList3: [],
        productStus: '',
        // radio2: null,
        profitTextarea: '',
        highlight: '',
        uploadData: {
          productId: ''
        },
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        isDisabled: true,
        form: [],
        isSpread: false,
        step: 1,
        importUrl: 'zuul/product/productTransactionFileManage/',
        transcId: '',
        secStep: '1',
        data: {}
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
      this.getTranscList()
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
    },
    methods: {
      getListQuery(data) {
        console.log('data')
        console.log(data)
        this.listQuery = data
        this.getClientList()
      },
      changeStep(val) {
        this.step = val
        this.importUrl = 'zuul/product/productClientFileManage/'
        // Bus.$emit('step', this.step)
        if(this.step === 1) {
          this.getTranscList()
        } else {
          this.getClientList()
        }
      },
      changeSecStep(val) {
        this.secStep = val
      },
      handleCreate() { //新增
        this.getTranscList()
        // Bus.$emit('step', this.step)
      },
      openCreate() {
        this.$prompt('请输入材料名称', '新增材料', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          let params = {
            fileName: value
          }
          addClientFile(params).then(res => {
            console.log(res)
            this.getClientList()
          })
          // this.$message({
          //   type: 'success',
          //   message: '你的邮箱是: ' + value
          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });       
        });
      },
      getTranscList() {
        this.listLoading = true
        this.listQuery.isFloat ? this.listQuery.isFloat = 0: this.listQuery.isFloat = null
        getTranscFile(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getClientList() {
        this.listLoading = true
        this.listQuery.isFloat ? this.listQuery.isFloat = 0: this.listQuery.isFloat = null
        getClientFile(this.listQuery).then(response => {
          this.data = response.data
          this.list1 = response.data.records
          this.total1 = response.data.total
          this.listLoading = false
          // this.client = true
        })
      },
      updateTranscFile(item) {
        let params = {
          name: item.name
        }
        updTranscFile(item.transactionFileManageId, params).then(res => {
          this.transcId = ''
          this.getTranscList()
        })
      },
      updateClientFile(item) {
        let params = {
          name: item.fileName
        }
        updClientFile(item.productClientFileManageId, params).then(res => {
          this.transcId = ''
          this.getClientList()
        })
      },
      deleteTransc(id) {
        delTranscFile(id).then(res => {
          this.getTranscList()
        })
      },
      deleteClient(id) {
        delClientFile(id).then(res => {
          this.getClientList()
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getTranscList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getTranscList()
      },
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
.second-tab {
  color: #606266;
  .second-item {
    display: inline-block;
    padding: 16px;
    cursor: pointer;
  }
}
</style>

