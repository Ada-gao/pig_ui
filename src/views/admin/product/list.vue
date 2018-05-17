
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
      <el-row :gutter="20">
        <el-col :lg="2" class="query-title">产品名称</el-col>
        <el-col :md="12" :lg="6">
          <el-input
            placeholder="请输入产品名称"
            v-model="listQuery.username">
          </el-input>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :lg="2" class="query-title">产品分类</el-col>
        <el-col :lg="20">
          <el-checkbox-group v-model="listQuery.typeGroup1">
            <el-checkbox-button v-for="item in productTypes" :label="item.name" :key="item.productTypeId">{{item.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :lg="2" class="query-title">产品状态</el-col>
        <el-col :lg="21">
          <el-checkbox-group v-model="listQuery.statusGroup2">
            <!-- <el-checkbox-button label="不限">不限</el-checkbox-button> -->
            <el-checkbox-button v-for="status in productStatus" :label="status.label" :key="status.value">{{status.label}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :lg="2" class="query-title">年化收益</el-col>
        <el-col :lg="20">
          <el-checkbox-group v-model="listQuery.incomeGroup3">
            <el-checkbox-button v-for="income in productIncome" :label="income" :key="income">{{income}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      
      <el-row style="margin-top: 20px; text-align: center;">
        <el-button class="btn-padding" @click="handleFilter">筛选</el-button>
        <el-button class="btn-padding" @click="resetFilter">重置</el-button>
      </el-row>
    </div>

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;">

      <el-table-column align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{scope.row.productId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'">
            {{scope.row.productName}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品分类" show-overflow-tooltip>
        <template slot-scope="scope">
        <!-- <span>{{scope.row.productTypeName}}</span> -->
        <span>{{scope.row.productTypeId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品期限" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.investmentHorizon}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="风险等级" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.productRiskLevel}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="募集规模" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.collectionAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="起投金额">
        <template slot-scope="scope">
          <span>{{scope.row.minimalAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年化收益率">
        <template slot-scope="scope">
          <span>{{scope.row.annualizedReturn}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="产品状态">
        <template slot-scope="scope">
          <!-- <el-tag>{{scope.row.delFlag | statusFilter}}</el-tag> -->
          {{scope.row.productStatus | statusFilter}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <!-- <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button> -->
          <!-- <el-button v-if="sys_user_del" size="small" type=""
                     @click="upper(scope.row)">产品上架
          </el-button> -->
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree
        class="filter-tree"
        :data="treeDeptData"
        :default-checked-keys="checkedKeys"
        check-strictly
        node-key="id"
        highlight-current
        ref="deptTree"
        :props="defaultProps"
        @node-click="getNodeData"
        default-expand-all
      >
      </el-tree>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- <el-form v-if="!nextToUpdate" :model="form" :rules="rules" ref="form" label-width="100px"> -->
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品编号" prop="productId">
              <el-input v-model="form.productId" placeholder="请输入产品编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品类型" prop="productTypeId">
              <el-select class="filter-item" v-model="form.productTypeId" placeholder="请选择">
                <el-option v-for="item in productTypes" :key="item.productTypeId" :value="item.productTypeId" :label="item.name">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="white-space: nowrap">
            <el-form-item label="产品风险级别" prop="productRiskLevel">
              <el-select class="filter-item" v-model="form.productRiskLevel" placeholder="请选择">
                <el-option v-for="item in productRiskLevel" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品LP数量" prop="productLp">
              <el-input v-model="form.productLp" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品业绩" prop="historyPerformance">
              <el-input v-model="form.historyPerformance" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="基金管理人" prop="manager">
              <el-input v-model="form.manager" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易币种" prop="currencyId">
              <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择">
                <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
          
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="募集额度" prop="collectionAmount">
              <el-input v-model="form.collectionAmount" placeholder="请输入"></el-input>
            </el-form-item>
            
          </el-col>
          <el-col :span="11">
            <el-form-item label="净值" prop="netValue">
              <el-input v-model="form.netValue" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="起投金额" prop="minimalAmount">
              <el-input v-model="form.minimalAmount" placeholder="请输入起投金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="追加金额" prop="minimalAddAmount">
              <el-input v-model="form.minimalAddAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品期限" prop="investmentHorizon">
              <el-input v-model="form.investmentHorizon" style="width: 80%; margin-right: 20px;"></el-input><span>月</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="收益" prop="isFloat">
              <el-radio-group v-model="radio2" @change="radioChange">
                <el-radio :label="3" style="display: inline-block">浮动收益率</el-radio>
                <el-radio :label="6" style="display: inline-block">收益对标基准</el-radio>
                <el-input style="display: inline-block; width: 100px; margin-left: 20px;" :disabled="isDisabled" v-model="form.annualizedReturn"></el-input>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="收益分配方式" prop="incomeDistribution">
              <el-input
                type="textarea"
                :row="2"
                v-model="form.incomeDistribution">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="产品亮点" prop="highlight">
              <el-input
                type="textarea"
                :row="2"
                v-model="form.highlight">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品状态" prop="deptName">
              <el-select class="filter-item" v-model="productStus" placeholder="请选择">
                <el-option v-for="item in productStatus" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        
        <!-- <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="role">
              <el-input type="textarea" v-model="form.role"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" >
          <el-select class="filter-item" v-model="form.delFlag" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <!-- <div v-if="!nextToUpdate" slot="footer" class="dialog-footer"> -->
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
      <div class="upfile-group" v-if="nextToUpdate">
        <div class="trade-item">
          <h3>交易所需材料</h3>
          <el-table
            :data="fileList1"
            @select="handleSelectionChange1"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="材料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="fileSize"
              label="大小/k"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="附件">
            </el-table-column>
          </el-table>
          <el-row style="text-align: right;">
            <el-upload
              class="upload-demo"
              style="display: inline-block;"
              :headers="headers"
              :action="importFile1('transaction')"
              :on-change="handleChange1"
              :auto-upload="false"
              :show-file-list="false"
              accept=".pdf, .doc">
              <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
            </el-upload>
            <el-button type="info" class="btn-padding" @click="delfiles1">删除材料</el-button>
          </el-row>
        </div>

        <div class="trade-item">
          <h3>产品说明所需材料</h3>
          <el-table
            :data="fileList2"
            @select="handleSelectionChange2"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="材料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="fileSize"
              label="大小/k"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="附件">
            </el-table-column>
          </el-table>
          <el-row style="text-align: right;">
            <el-upload
              class="upload-demo"
              style="display: inline-block;"
              :headers="headers"
              :action="importFile2('product')"
              :on-error="uploadError2"
              :on-change="handleChange2"
              :auto-upload="false"
              :show-file-list="false">
              <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
            </el-upload>
            <el-button type="info" class="btn-padding" @click="delfiles2">删除材料</el-button>
          </el-row>
        </div>

        <div class="trade-item">
          <h3>产品公告</h3>
          <el-table
            :data="fileList3"
            @select="handleSelectionChange3"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="材料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="fileSize"
              label="大小/k"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="附件">
            </el-table-column>
          </el-table>
          <el-row style="text-align: right;">
            <el-upload
              class="upload-demo"
              style="display: inline-block;"
              :headers="headers"
              :action="importFile3('announcement')"
              :on-change="handleChange3"
              :auto-upload="false"
              :show-file-list="false">
              <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
            </el-upload>
            <el-button type="info" class="btn-padding" @click="delfiles3">删除材料</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/product/product'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getFiles, delFiles } from '@/api/qiniu'
  import { fetchCurrency } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    components: {
      ElOption,
      ElRadioGroup },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          // username: '',
          typeGroup1: [],
          statusGroup2: [],
          incomeGroup3: []
        },
        role: undefined,
        form: {
          username: undefined,
          password: undefined,
          delFlag: undefined,
          deptId: undefined
        },
        rules: {
          productName: [
            {
              required: true,
              message: '请输入产品名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          productId: [
            {
              required: true,
              message: '请输入产品编号',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          productTypeId: [
            {
              required: true,
              message: '请选择产品类型',
              trigger: 'blur'
            }
          ],
          productRiskLevel: [
            {
              required: true,
              message: '请选择产品风险级别',
              trigger: 'blur'
            }
          ],
          manager: [
            {
              required: true,
              message: '请输入基金管理人',
              trigger: 'blur'
            }
          ],
          currencyId: [
            {
              required: true,
              message: '请选择交易币种',
              trigger: 'blur'
            }
          ],
          collectionAmount: [
            {
              required: true,
              message: '请输入募集额度',
              trigger: 'blur'
            }
          ],
          minimalAmount: [
            {
              required: true,
              message: '请输入起投金额',
              trigger: 'blur'
            }
          ],
          minimalAddAmount: [
            {
              required: true,
              message: '请输入追加金额',
              trigger: 'blur'
            }
          ],
          investmentHorizon: [
            {
              required: true,
              message: '请输入产品期限',
              trigger: 'blur'
            }
          ],
          isFloat: [
            {
              required: true,
              message: '请选择收益',
              trigger: 'blur'
            }
          ],
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
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0,
        sex: '',
        eduOptions: [
          {
            label: '博士',
            value: 1
          }, {
            label: '硕士',
            value: 2
          }, {
            label: '本科',
            value: 3
          }, {
            label: '大专',
            value: 4
          }, {
            label: '高中',
            value: 5
          }, {
            label: '初中',
            value: 6
          }, {
            label: '小学',
            value: 7
          }
        ],
        edu: '',
        currencyList: [],
        IDsType: '',
        entryDate: '',
        fileList: [],
        productTypes: [],
        productTypesList: [],
        productIncome: ['不限', '10%以下', '10-15%', '15%以上', '浮动'],
        input2: '',
        nextToUpdate: false,
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        indexList1: [],
        indexList2: [],
        indexList3: [],
        productStus: '',
        radio2: null,
        profitTextarea: '',
        highlight: '',
        uploadData: {
          productId: ''
        },
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        isDisabled: null
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel'
      ])
    },
    filters: {
      // statusFilter(status) {
      //   const statusMap = {
      //     0: '在职',
      //     1: '离职',
      //     9: '锁定'
      //   }
      //   return statusMap[status]
      // },
      productTypeFilter(type) {
        fetchProductTypeList().then(res => { // 获取产品类型
          let obj = {}
          res.data.forEach((val, idx) => {
            let key = val.productTypeId
            obj[key] = val.name

            type = obj[type]
          })
          return type
        })
      },
      statusFilter(status) {
        const statusMap = {
          0: '在建',
          1: '预热中',
          2: '募集中',
          3: '募集完成',
          4: '存续期',
          5: '已下架'
        }
        return statusMap[status]
      }
    },
    created() {
      // console.log(this.productStatus)
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      productTypeFilter(type) {
        fetchProductTypeList().then(res => { // 获取产品类型
          let obj = {}
          res.data.forEach((val, idx) => {
            let key = val.productTypeId
            obj[key] = val.name

            type = obj[type]
          })
          return type
        })
      },
      getList() {
        this.listLoading = true
        fetchProductTypeList().then(res => { // 获取产品类型
          this.productTypes = res.data
        })
        fetchList(this.listQuery).then(response => {
          let list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          list.forEach(item => {
            let obj = {}
            // fetchProductTypeList().then(res => { // 获取产品类型
              this.productTypes.forEach((val, idx) => {
                let key = val.productTypeId
                obj[key] = val.name
              })
              item.productTypeId = obj[item.productTypeId]
              
              // for(let key in obj) {
              //   console.log(key)
              //   if(item.productTypeId === key) {
              //     item.productTypeName = obj[key]
              //     console.log(item.productTypeName)
              //   }
              //   return item.productTypeId
              // }
            // })
          })
          this.list = list
        })
        fetchCurrency(this.listQuery).then(response => {
          this.currencyList = response.data.records
        })
      },
      getNodeData(data) {
        this.dialogDeptVisible = false
        this.form.deptId = data.id
        this.form.deptName = data.name
        deptRoleList(data.id)
          .then(response => {
            this.rolesOptions = response.data
          })
      },
      handleDept() {
        fetchDeptTree()
          .then(response => {
            this.treeDeptData = response.data
            this.dialogDeptVisible = true
          })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.nextToUpdate = false
      },
      handleUpdate(row) {
        this.nextToUpdate = false
        getObj(row.productId)
          .then(response => {
            this.form = response.data
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            if(this.form.isFloat === 0) { // 0 代表 正常
              this.radio2 = 3
            } else if(this.form.isFloat === 1 || this.form.annualizedReturn) {
              this.radio2 = 6
            } else {
              this.radio2 = 1
            }
          })
        
      },
      create(formName) {
        this.nextToUpdate = true
        const set = this.$refs
        // this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.nextToUpdate = true
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = true
            this.form.password = undefined
            let productId = this.form.productId
            putObj(this.form).then(response => {
              if(response.data) {
                this.nextToUpdate = true
                this.getList()
                this.uploadData.productId = this.form.productId
                let uploadData1 = {
                  productId: this.uploadData.productId,
                  fileType: 'transaction'
                }
                let uploadData2 = {
                  productId: this.uploadData.productId,
                  fileType: 'product'
                }
                let uploadData3 = {
                  productId: this.uploadData.productId,
                  fileType: 'announcement'
                }
                getFiles(uploadData1).then(response => {
                  // console.log(response.data)
                  this.fileList1 = response.data
                })
                getFiles(uploadData2).then(response => {
                  // console.log(response.data)
                  this.fileList2 = response.data
                })
                getFiles(uploadData3).then(response => {
                  // console.log(response.data)
                  this.fileList3 = response.data
                })
              }
              // this.$notify({
              //   title: '成功',
              //   message: '修改成功',
              //   type: 'success',
              //   duration: 2000
              // })
            })
          } else {
            return false
          }
        })
      },
      resetTemp() {
        this.form = {
          id: undefined,
          username: '',
          password: '',
          role: undefined
        }
      },
      resetFilter() {
        this.listQuery = {
          username: '',
          type: []
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        // console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      beforeUpload(file) { // 限制上传文档类型
        // console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      handleChange1(file, fileList) { // 上传材料，列表展示
        // this.fileList1 = fileList.slice(-3)
        this.uploadData.fileType = 'transaction'
        getFiles(this.uploadData).then(response => {
          console.log('上传1')
          console.log(response.data)
          this.fileList1 = response.data
        })
      },
      handleSelectionChange1(selection, row) { // 选中材料
        let productFileId = row.productFileId
        this.indexList1.push(productFileId)
      },
      delfiles1() { // 删除材料
        this.indexList1.forEach(id => {
          delFiles({fileType: 'transaction', productFileId: id}).then(response => {
            this.handleChange1()
          })
        })
      },
      handleChange2(file, fileList) { // 上传材料，列表展示
        // this.fileList2 = fileList.slice(-3)
        this.uploadData.fileType = 'product'
        getFiles(this.uploadData).then(response => {
          this.fileList2 = response.data
        })
      },
      handleSelectionChange2(selection, row) { // 选中材料
        let productFileId = row.productFileId
        this.indexList2.push(productFileId)
      },
      delfiles2() { // 删除材料
        this.indexList2.forEach(id => {
          delFiles({fileType: 'product', productFileId: id}).then(response => {
            this.handleChange2()
          })
        })
      },
      handleChange3(file, fileList) { // 上传材料，列表展示
        // this.fileList3 = fileList.slice(-3)
        this.uploadData.fileType = 'announcement'
        getFiles(this.uploadData).then(response => {
          this.fileList3 = response.data
        })
      },
      handleSelectionChange3(selection, row) { // 选中材料
        let productFileId = row.productFileId
        this.indexList3.push(productFileId)
      },
      delfiles3() { // 删除材料
        this.indexList3.forEach(id => {
          delFiles({fileType: 'announcement', productFileId: id}).then(response => {
            this.handleChange3()
          })
        })
      },
      radioChange(value) {
        if(value === 3) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      },
      uploadError2(err, file, fileList) {
        console.log(err)
      },
      importFile1(fileType) {
        let url = '/zuul/product/products/' + this.uploadData.productId + '/' + fileType + '/files'
        return url
      },
      importFile2(fileType) {
        let url = '/zuul/product/products/' + this.uploadData.productId + '/' + fileType + '/files'
        return url
      },
      importFile3(fileType) {
        let url = '/zuul/product/products/' + this.uploadData.productId + '/' + fileType + '/files'
        return url
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
}
.btn-padding {
  @include padding;
}
</style>

