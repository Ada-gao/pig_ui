<template>
  <div class="app-container calendar-list-container">
    <h3 v-if="uploadData.productId">修改产品</h3>
    <h3 v-else>新增产品</h3>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品编号" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编号"></el-input>
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
              <el-input v-model.number="form.productLp" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品过往业绩" prop="historyPerformance">
              <el-input v-model.number="form.historyPerformance" placeholder="请输入"></el-input>
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
              <el-input v-model.number="form.collectionAmount" placeholder="请输入" style="width: 85%; margin-right: 10px;"></el-input><span>万</span>
            </el-form-item>
            
          </el-col>
          <el-col :span="11">
            <el-form-item label="净值" prop="netValue">
              <el-input v-model.number="form.netValue" :maxlength="5" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="起投金额" prop="minimalAmount">
              <el-input v-model.number="form.minimalAmount" placeholder="请输入起投金额" style="width: 85%; margin-right: 10px;"></el-input><span>万</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="追加金额" prop="minimalAddAmount">
              <el-input v-model.number="form.minimalAddAmount" style="width: 85%; margin-right: 10px;"></el-input><span>万</span>
            </el-form-item>
          </el-col>
        </el-row>
          
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品期限" prop="investmentHorizon">
              <el-input v-model.number="form.investmentHorizon" style="width: 85%; margin-right: 10px;"></el-input><span>月</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="收益" prop="isFloat">
              <el-radio-group v-model="form.isFloat" @change="radioChange">
                <el-radio :label="0" style="display: inline-block">浮动收益率</el-radio>
                <el-radio :label="1" style="display: inline-block">收益对标基准</el-radio>
                <el-input style="display: inline-block; width: 100px; margin-left: 20px;" v-show="!isDisabled" required="!isDisabled" v-model="form.annualizedReturn"></el-input>
                <span style="display: inline-block" v-show="!isDisabled">%月</span>
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
      
      <!-- <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" >
        <el-select class="filter-item" v-model="form.delFlag" placeholder="请选择">
          <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>

    <div class="upfile-group" v-if="nextToUpdate">
      <div class="trade-item">
        <h3>交易所需材料</h3>
        <el-table
          :data="fileList1"
          @selection-change="handleSelectionChange1"
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
            :action="importFile('transaction')"
            :on-change="handleChange1"
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
          @selection-change="handleSelectionChange2"
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
            :action="importFile('product')"
            :on-error="uploadError2"
            :on-change="handleChange2"
            :show-file-list="false"
            accept=".pdf, .doc">
            <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
          </el-upload>

          <el-button type="info" class="btn-padding" @click="delfiles2">删除材料</el-button>
        </el-row>
      </div>

      <div class="trade-item">
        <h3>产品公告</h3>
        <el-table
          :data="fileList3"
          @selection-change="handleSelectionChange3"
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
            :action="importFile('announcement')"
            :on-change="handleChange3"
            :show-file-list="false"
            accept=".pdf, .doc">
            <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
          </el-upload>
          <el-button type="info" class="btn-padding" @click="delfiles3">删除材料</el-button>
        </el-row>
      </div>
    </div>

    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button @click="cancel()">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-if="dialogStatus=='create' & uploadData.productId" type="primary" @click="createRouter">确 定</el-button>
      <el-button v-if="dialogStatus=='update'" type="primary" @click="update('form')">修 改</el-button>
    </div>

  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/product/product'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { decimals } from '@/utils/validate'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'

  const twoDecimals = (rule, value, callback) => {
    if (!value) {
      return null
    } else if (!decimals(value)) {
      callback(new Error('请输入正确的净值数字'))
    } else {
      callback()
    }
  }

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
        total: null,
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
          productCode: [
            {
              required: true,
              message: '请输入产品编号',
              trigger: 'blur'
            }
          ],
          netValue: [
            {
              // required: false,
              message: '请输入小于100的数字',
              trigger: 'change',
              validator: twoDecimals
            }
          ],
          investmentHorizon: [
            {
              required: true,
              message: '请输入产品期限',
              trigger: 'blur'
            }
          ]
          // isFloat: [
          //   {
          //     required: true,
          //     message: '请选择收益',
          //     trigger: 'blur'
          //   }
          // ],
        },
        statusOptions: ['0', '1'],
        rolesOptions: [],
        nextToUpdate: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: 'create',
        textMap: {
          update: '编辑员工',
          create: '新增员工'
        },
        isDisabled: {
          0: false,
          1: true
        },
        sex: '',
        edu: '',
        maritalStatus: '',
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        indexList: [],
        productStus: '',
        uploadData: {
          productId: '',
        },
        productTypes: [],
        currencyList: '',
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        indexList1: [],
        indexList2: [],
        indexList3: [],
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
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.uploadData.productId = this.$route.params.id
        // if(!this.uploadData.productId) this.nextToUpdate = false
        fetchProductTypeList().then(res => { // 获取产品类型
          this.productTypes = res.data
        })
        getObjList().then(response => { // 获取币种
          this.currencyList = response.data
          this.form.currencyId = 2
        })
        if(this.uploadData.productId) {
          getObj(this.uploadData.productId)
          .then(response => {
            this.form = response.data
            this.nextToUpdate = true
            // this.dialogFormVisible = true
            this.dialogStatus = 'update'
            if(this.form.isFloat === 0) {
              this.form.annualizedReturn = null
              this.isDisabled = true
            } else {
              this.isDisabled = false
            }
          })
          this.getAllFiles(this.uploadData.productId)
        }
      },
      handleDept() {
        console.log('产品状态')
      },
      create(formName) { // 创建提交
        const set = this.$refs
        
        if(!this.form.isFloat) {
          // this.radio2 === 3 ? 0 : 1
          this.form.annualizedReturn = null
          this.isDisabled = true
        }
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(response => {
                this.nextToUpdate = true
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.uploadData.productId = response.data.productId

              })
          } else {
            return false
          }
        })
      },
      createRouter() {
        this.$router.push({path: '/admin/product'})
      },
      cancel(formName) {
        // this.dialogFormVisible = false
        // this.$refs[formName].resetFields()
        this.$router.push({path: '/admin/product'})
      },
      update(formName) { // 修改提交
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            // this.dialogFormVisible = true
            // this.form.password = undefined
            let productId = this.form.productId
            if(!this.form.isFloat) {
              this.form.annualizedReturn = null
              this.isDisabled = true
            }
            putObj(this.form).then(response => {
              if(response.data) {
                this.nextToUpdate = true
                this.getList()
              }
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
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
      getAllFiles(productId) {
        if(!productId) return null
        let uploadData1 = {
          productId: productId,
          fileType: 'transaction'
        }
        let uploadData2 = {
          productId: productId,
          fileType: 'product'
        }
        let uploadData3 = {
          productId: productId,
          fileType: 'announcement'
        }
        getFiles(uploadData1).then(response => {
          this.fileList1 = response.data || []
        })
        getFiles(uploadData2).then(response => {
          // console.log(response.data)
          this.fileList2 = response.data || []
        })
        getFiles(uploadData3).then(response => {
          // console.log(response.data)
          this.fileList3 = response.data || []
        })
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
        console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      handleChange1(file, fileList) { // 上传材料，列表展示
        // this.fileList1 = fileList.slice(-3)
        this.uploadData.fileType = 'transaction'
        // debugger
        getFiles(this.uploadData).then(response => {
          console.log('上传1')
          console.log(response.data)
          this.fileList1 = response.data
        })
      },
      handleSelectionChange1(row) { // 选中材料
        // let productFileId = row.productFileId
        // debugger
        // this.indexList1.push(productFileId)
        this.indexList1 = row
      },
      delfiles1() { // 删除材料
        this.indexList1.forEach(item => {
          delFiles({fileType: 'transaction', productFileId: item.productFileId}).then(response => {
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
      handleSelectionChange2(row) { // 选中材料
        // let productFileId = row.productFileId
        // console.log(productFileId)
        // this.indexList2.push(productFileId)
        this.indexList2 = row
      },
      delfiles2() { // 删除材料
        this.indexList2.forEach(item => {
          delFiles({fileType: 'product', productFileId: item.productFileId}).then(response => {
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
      // handleSelectionChange3(selection, row) { // 选中材料
      handleSelectionChange3(row) { // 选中材料
        // let productFileId = row.productFileId
        // this.indexList3.push(productFileId)
        this.indexList3 = row
      },
      delfiles3() { // 删除材料
        this.indexList3.forEach(item => {
          delFiles({fileType: 'announcement', productFileId: item.productFileId}).then(response => {
            this.handleChange3()
          })
        })
      },
      radioChange(value) {
        if(value === 0) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      },
      uploadError2(err, file, fileList) {
        console.log(err)
      },
      importFile(fileType) {
        return uploadFiles(this.uploadData.productId, fileType)
      },
      handleChange4(file, fileList) {
        this.fileList3 = fileList.slice(-3);
      }
    }
    // mounted() {
    //   console.log(this.$route.params)
    //   this.type_is_update = this.$route.params
    // }
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
</style>

