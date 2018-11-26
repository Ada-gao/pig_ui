<template>
  <div class="app-container calendar-list-container pro-detail-radio">
    <el-dialog title="提示" :visible.sync="dialogVis" width="30%">
      <span>佣金系数最多增加到第五年</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVis = false">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="createStatus==='update'">
      <el-radio-group v-model="step" @change="changeStep" style="margin-bottom: 30px;">
        <el-radio-button label="1">产品详情</el-radio-button>
        <el-radio-button style="border-radius: 0" label="2">产品操作指南</el-radio-button>
        <el-radio-button v-if="productTran&&stageType!='0'" label="3">交易信息</el-radio-button>
        <!-- <el-radio-button v-if="productStatusNo!==0&&productStatusNo!==1&&stageType!='0'" label="3">交易信息</el-radio-button> -->
      </el-radio-group>
    </div>
    <el-steps v-else :active="activeStep" simple finish-status="success">
        <el-step title="产品详情"></el-step>
        <el-step title="产品操作指南" ></el-step>
      </el-steps>
    <div v-else class="tabs">

      <!-- <div class="tab-item" :class="{'tab-active':step===1,'tab-done':step===2}">产品详情
        <b class="right"><i class="right-arrow1"></i><i class="right-arrow2"></i></b>
      </div>
      <div class="tab-item" :class="{'tab-active':step===2}">产品操作指南
        <b class="right"><i class="right-arrow1"></i><i class="right-arrow2"></i></b>
      </div> -->
    </div>
    <!-- <div class="pageTitle" style="text-align: right" v-if="stage&step===1">
      关联产品
      <el-input v-model="form.productName" style="width: 180px" placeholder="请输入"></el-input>
    </div> -->

    <div class="split-line" style="margin-bottom: 20px;"></div>

    <product-detail
      v-if="step===1"
      :stageType="this.stageType"
      :formData="formData"
      :productId="productId"
      v-on:listen="listenProStatus"
      v-on:productIdByDetail="listenProId"></product-detail>

    <div class="upfile-group" v-if="step===2">

      <product-operation
        :proStatus="productStatusNo"
        :productId="productId"
        :productInfo="productInfo"
        v-on:detailByOperation="listenDetail"></product-operation>

    </div>
    <!-- 交易信息 -->
    <div v-if="step===3">
      <div class="bref">
        <el-row :gutter="12" class="def-el">
          <el-col :md="8" :lg="4" class="first-col">
            <el-card shadow="always">
              <div class="card-box">
                <div class="left-box orange-box">
                  <svg-icon icon-class="appointpeo"></svg-icon>
                </div>
                <div class="right-box">
                  <div class="title">预约成功人数</div>
                  <div class="btm-box"><span>{{statistic.appointNums||0}}</span><i>人</i></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :md="8" :lg="5">
            <el-card shadow="always">
              <div class="card-box">
                <div class="left-box orange-box">
                  <svg-icon icon-class="appointmon"></svg-icon>
                </div>
                <div class="right-box">
                  <div class="title">预约成功金额</div>
                  <div class="btm-box"><span>{{statistic.appointAmounts||0}}</span><i>万</i></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :md="8" :lg="5">
            <el-card shadow="always">
              <div class="card-box">
                <div class="left-box green-box">
                  <svg-icon icon-class="successpeo"></svg-icon>
                </div>
                <div class="right-box green-right">
                  <div class="title">打款成功人数</div>
                  <div class="btm-box"><span>{{statistic.remitNums||0}}</span><i>人</i></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :md="8" :lg="5">
            <el-card shadow="always">
              <div class="card-box">
                <div class="left-box green-box">
                  <svg-icon icon-class="successmon"></svg-icon>
                </div>
                <div class="right-box green-right">
                  <div class="title">打款成功金额</div>
                  <div class="btm-box"><span>{{statistic.remitAmounts||0}}</span><i>万</i></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :md="8" :lg="5">
            <el-card shadow="always">
              <div class="card-box">
                <div class="left-box red-box">
                  <svg-icon icon-class="surplus"></svg-icon>
                </div>
                <div class="right-box red-right">
                  <div class="title">剩余额度</div>
                  <div class="btm-box"><span>{{statistic.surplusAmounts||0}}</span><i>万</i></div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="transc-tab">
        <el-button @click="handleAppoint('0')" class="first_btn" :class="{'search_btn': listQuery.type=='0'}" label="1">预约成功人数</el-button>
        <el-button @click="handleAppoint('1')" class="sec_btn" :class="{'search_btn': listQuery.type=='1'}" label="2">打款成功人数</el-button>
        <el-button class="filter-item add_btn"
          style="margin-left: 10px; padding: 10px; border-radius: 5px; float: right;"
          @click="batchExport" type="primary">
          <svg-icon icon-class="add"></svg-icon> 批量导出</el-button>
      </div>
      <transc-table-component
        :productCollect="true"
        :productNameCol="false"
        :clientNoCol="true"
        :clientGenderCol="true"
        :clientMobileCol="true"
        :cityCol="true"
        :aptCol="showFlag"
        :paymentCol="!showFlag"
        :showValueDate="false"
        :transcStatus="true">
      </transc-table-component>
    </div>

  </div>
</template>

<script>
  import productDetail from 'components/productDetail/pdcDetail'
  import productOperation from 'components/productDetail/pdcOperation'
  import transcTableComponent from 'components/table/transcTable'
  import { getObj, addObj, putObj, delObj, getAppointList,
    addOperationObj, putFileObj, delCustFile, getCustFile,
    addCustFile, updCustFile, fetchOperation, updProductType,
    getProductStage, updProductStage, getBriefReport, updProductPause,
    updProductDisplay, batchExportProduct, postTranscFile } from '@/api/product/product'
  import { getClientFile, getTranscFile } from '@/api/product/fileManage'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { transformText, sortKey } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { decimals, isNumber } from '@/utils/validate'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import Bus from '@/assets/js/bus'

  const twoDecimals = (rule, value, callback) => {
    if (!value) {
      return null
    } else if (!decimals(value)) {
      callback(new Error('请输入正确的净值数字'))
    } else {
      callback()
    }
  }

  const certNumber = (rule, value, callback) => {
    if (!value) {
      return null
    } else if(!Number.isInteger(value)) {
      callback(new Error('只能输入整数金额'))
    } else if (!isNumber(value)) {
      callback(new Error('请输入10位以内的数字'))
    } else {
      callback()
    }
  }

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      transcTableComponent,
      productDetail,
      productOperation
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        showFlag: true, // 显示打款金额还是预约金额
        dialogVis: false,
        total: null,
        form: {
          username: undefined,
          password: undefined,
          delFlag: undefined,
          deptId: undefined
        },
        keyProRules: {
          keyProduct: [
            { required: true, trigger: 'blur, change', message: '请标注产品' }
          ]
        },
        rules2: {
          aging: [
            { required: true, trigger: 'bulr'}
          ],
          visiblePeople: [
            { required: true, trigger: 'change'}
          ]
        },
        userAdd: false,
        userUpd: false,
        userDel: false,
        isDisabled: {
          0: false,
          1: true
        },
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        clientFiles: [],
        uploadData: {
          productId: '',
        },
        // productTypes: [],
        // currencyList: [],
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        productStatusNo: '',
        // elDate: {
        //   inputStyle: 'number',
        //   model: 'product_name',
        //   text: '产品名称'
        // },
        step: 1,
        // checked: 0,
        importantDate: [],
        activeDate: [],
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        form2: {
          activityDTO: [],
          normalDTO: {
            normalBrokerageCoefficients: []
          },
          keyProduct: 1
        },
        normalList: [{
          age: 1,
          brokerageCoefficient: ''
        }],
        addNormList: [],
        cmsIndex: 1,
        normalData: {},
        activityData: [
          {
            activeDate: ['', '']
          }
        ],
        addActivityList: [],
        activityList: [],
        brokerageCoefficient: '',
        productFileId: 0,
        clientFileList: [],
        dialogComVisible: false,
        clientFile: '',
        collectDisabled: false,
        shortNameDisabled: false,
        closeDateDisabled: true, // 关账日
        establishedDisabled: true, // 成立日
        valueDateDisabled: false, // 起息日
        operationDisabled: false,
        allDisabled: true,
        someDisabled: true,
        stage: false,
        spanNum: 5,
        statistic: {},
        listQuery: {
          page: 1,
          limit: 20,
          productId: '',
          type: '0'
        },
        stageType: '',
        // pause: '1',
        // display: '1',
        ada_url: '',
        url: '',
        fileType: '',
        createStatus: 'create',
        selectFile: null,
        radio2: 1,
        productId: '',
        productStatus: '',
        formData: {},
        activeStep: 0,
        productInfo: {},
        productTran: false // 控制交易tab
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        // 'productStatus',
        'productRiskLevel',
        'investHorizonUnit',
        'productStatusNum'
      ]),
      normalList1() {
        return sortKey(this.normalList, 'age')
      }
    },
    created() {
      this.listQuery.productId = this.$route.params.id
      this.productId = this.$route.params.id
      const proStatusText = this.$route.query.productStatus
      // 获取状态速度更快，提升用户体验
      if (proStatusText - 0 !== 0&& proStatusText - 0 !== 1) {
        this.productTran = true
      }
      if(this.productId) {
        this.createStatus = 'update'
      }
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.activeStep = this.step - 1
    },
    mounted() {
      Bus.$on('activeRouter', activeRouter => {
        this.ada_url = activeRouter
        console.log(this.ada_url)
      })
    },
    watch: {
      activeRouter(curVal, oldVal) {
        console.log(curVal)
      },
      step(val) {
        this.activeStep = val - 1
        // console.log(this.activeStep)
      }
    },
    methods: {
      listenProStatus(msg) { // 从产品详情接收(产品状态转换所需字段)
        this.productStatusNo = msg.productStatusNo
        this.productInfo = msg
      },
      listenProId(val) { // 从产品详情接收
        this.productId = val
        this.step = 2
        this.activeStep = this.step - 1
        this.changeStep(this.step)
      },
      listenDetail(params) { // 从操作指南接收
        this.stageType = params.stageType
        this.formData = params.data
        this.step = 1
        this.activeStep = this.step - 1
        // this.changeStep(this.step)
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
                // this.nextToUpdate = true
                // this.getList()
                if(response.status === 200) {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.productId = response.data.productId
                  this.step = 2
                }
              })
          } else {
            return false
          }
        })
      },
      addCommission() {
        if(this.cmsIndex > 4) return
        this.cmsIndex++
        this.addNormList.push({
          age: this.cmsIndex,
          brokerageCoefficient: ''
        })
      },
      addActivity() {
        this.addActivityList.push({
          activeDate: '',
          brokerageCoefficient: ''
        })
        this.activityList = this.activityList.concat(this.addActivityList)
      },
      createRouter() {
        this.$router.push({path: '/product/productList'})
      },
      cancel(formName) {
        // this.dialogFormVisible = false
        // this.$refs[formName].resetFields()
        this.$router.push({path: '/product/productList'})
      },
      update(formName) { // 产品详情修改提交（第一步）
        const set = this.$refs
        if(this.stageType==='0' || this.productStatusNo == '0') formName = 'form'
        if(!this.form.isFloat) {
          this.form.annualizedReturn = null
          this.isDisabled = true
        }
        this.form.productStatus = this.productStatusNo
        this.form.currencyId = this.form.currencyIdNo
        this.form.productTypeId = this.form.productTypeIdNo
        this.form.investmentHorizonUnit = this.form.investmentHorizonUnitNo
        // console.log(formName)
        set[formName].validate(valid => {
          if (valid) {
            if (this.stage) { //分期

              updProductStage(this.form).then(response => {
                if(!response.data || response.status !== 200) {
                  return
                  // this.getList()
                }
                console.log(response)
                this.form = response.data
                this.productId = this.form.productId
                this.step = 2
                this.changeStep(this.step)
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                })
                // this.$router.push({path: '/product/productList'})
              })
            } else {
              // this.form.productStatus = this.productStatusNo
              putObj(this.productId, this.form).then(res => {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                })
                this.step = 2
                console.log(res)
              })
            }

          } else {
            return false
          }
        })
      },
      updateRouter() { // 操作指南新建或编辑提交
        this.activityList = this.activityList.concat(this.activityData)
        this.activityList.forEach(item => {
          item.activityEnd = item.activeDate[1]
          item.activityStart = item.activeDate[0]
        })
        if (this.importantDate) {
          this.form2.importantStart = this.importantDate[0]
          this.form2.importantEnd = this.importantDate[1]
        } else {
          // console.log('this.radio2 is not important product')
          this.form2.importantStart = ''
          this.form2.importantEnd = ''
        }
        this.form2.normalDTO = this.normalData
        // this.normalList = this.form2.normalDTO.normalBrokerageCoefficients
        this.form2.activityDTO = this.activityList
        this.form2.normalDTO.normalBrokerageCoefficients = this.normalList.concat(this.addNormList)
        // this.form2.normalDTO.normalBrokerageCoefficients = this.normalList1
        this.form2.productId = this.productId
        // this.form2.keyProduct = this.radio2
        addOperationObj(this.form2).then(res => {
          this.$notify({
            title: '成功',
            message: '产品指南保存成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      updateProductType(status, url) { // 产品状态转化
        let params = {
          status: status
        }
        let msgText = ''
        if(status == 1) {
          msgText = '预热'
        } else if(status == 2) {
          msgText = '募集中'
        } else if(status == 3) {
          msgText = '已关账'
        } else if(status == 4) {
          msgText = '已成立'
        } else if(status == 5) {
          msgText = '兑付中'
        } else if(status == 6) {
          msgText = '兑付完成'
        }
        // console.log('跳转地址： ' + url)
        updProductType(this.productId, params).then(res => {
          this.$notify({
            title: '成功',
            message: '产品进入' + msgText + '成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: url})
        })
      },
      updateProductPause() { // 暂停预约
        let pause = this.form.isPause === '0' ? '1' : '0'
        let params = {
          pause: pause
        }
        // console.log('跳转地址： ' + this.url)
        updProductPause(this.productId, params).then(res => {
          console.log(res)
          this.form.isPause = pause
          // this.getOperations()
        })
      },
      updateProductDisplay() { // 显示/隐藏
        let display = this.form.isDisplay === '0' ? '1' : '0'
        let params = {
          display: display
        }
        updProductDisplay(this.productId, params).then(res => {
          console.log(res)
          this.form.isDisplay = display
          // this.getOperations()
        })
      },
      getAllFiles(productId) {
        if(!productId) return null
        this.getFiles1(productId)
        this.getFiles2(productId)
        // this.getFiles3(productId)
        this.getFiles4(productId)
      },
      getFiles1(productId) {
        let uploadData = { // 交易所需材料
          productId: productId,
          fileType: 'transaction'
        }
        getFiles(uploadData).then(response => {
          this.fileList1 = response.data || []
        })
      },
      getFiles2(productId) {
        let uploadData = {
          productId: productId,
          fileType: 'product'
        }
        getFiles(uploadData).then(response => {
          this.fileList2 = response.data || []
        })
      },
      // getFiles3(productId) {
      //   let uploadData = {
      //     productId: productId,
      //     fileType: 'announcement'
      //   }
      //   getFiles(uploadData).then(response => {
      //     this.fileList3 = response.data || []
      //   })
      // },
      getFiles4(productId) { // 客户所需材料
        getCustFile(productId).then(response => {
          this.clientFiles = response.data || []
        })
      },
      beforeUpload(file) { // 限制上传文档类型
        console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      delfiles(item, type) { // 删除材料
        let productFileType = type
        let id = this.productId
        delFiles({fileType: type, productFileId: item.productFileId}).then(response => {
          if(response.status === 200) {
            this.$notify({
              title: '成功',
              message: '材料删除成功',
              type: 'success',
              duration: 2000
            })
            if(productFileType === 'transaction') {
              this.getFiles1(id)
            } else if(productFileType === 'product') {
              this.getFiles2(id)
            // } else if(productFileType === 'announcement') {
            //   this.getFiles3(id)
            }
          }
        })
      },
      delCustFile(item) { // 删除上传客户材料
        delCustFile(item.productClientFileId).then(res => {
          if(res.status === 200) {
            this.getFiles4(this.productId)
          }
        })
      },
      updateClientFileName(item) { // 编辑上传客户材料名称
        let params = {
          name: item.fileName
        }
        updCustFile(item.productClientFileId, params).then(res => {
          this.$notify({
            title: '成功',
            message: '材料名称修改成功',
            type: 'success',
            duration: 2000
          })
          this.productFileId = ''
        })
      },
      handleChange2(file, fileList) { // 上传材料，列表展示
        // this.fileList2 = fileList.slice(-3)
        this.uploadData.fileType = 'product'
        getFiles(this.uploadData).then(response => {
          this.fileList2 = response.data
        })
      },
      importFile(fileType) {
        return uploadFiles(this.productId, fileType)
      },
      changeStep(val) { // 切换tab
        this.step = val - 0
        if(this.step === 2) {
          // this.getOperations()

        } else if (this.step === 3) {
          getBriefReport(this.productId).then(res => {
            this.statistic = res.data
          })
          let params = {
            page: this.listQuery.page,
            limit: this.listQuery.limit
          }
          let id = this.listQuery.productId
          getAppointList(id, '0', params).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            Bus.$emit('appointsList', response.data)
          })
        }
      },
      chooseClientFile() {
        this.dialogComVisible = false
        if (this.fileType === 'client') {
          let params = {
            fileName: this.selectFile.fileName,
            productClientFileManageId: this.selectFile.productClientFileManageId,
            productId: this.productId
          }
          addCustFile(params).then(res => {
            // this.clientFile = res.data
            // this.clientFiles.push(this.clientFile)
            this.getFiles4(params.productId)
          })
        } else {
          let params = {
            name: this.selectFile.name,
            filePath: this.selectFile.filePath,
            fileSize: this.selectFile.fileSize,
            transactionFileManageId: this.selectFile.transactionFileManageId,
            productId: this.productId - 0
          }
          console.log('transaction吗')
          postTranscFile(params).then(res => {
            console.log(res)
            this.getFiles1(params.productId)
          })
        }
      },
      handleAppoint(type) {
        this.listQuery.type = type
        type === '0' ? this.showFlag = true : this.showFlag = false
        Bus.$emit('queryAppoints', this.listQuery)
      },
      batchExport() {
        let type = this.listQuery.type
        let id = this.productId
        batchExportProduct(id, type).then(res => {
          const objectUrl = URL.createObjectURL(new Blob([res.data]))
          // let fileName = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0]
          const fileName = res.headers['content-disposition'].split('=')[1]
          const a = document.createElement('a')
          a.download = fileName
          a.href = objectUrl
          a.click()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/mixin.scss";
  @import "src/styles/variables.scss";

  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .upfile-group {
    .btn-padding {
      @include padding;
      margin-top: 10px;
    }
  }
  .tabs {
    display: flex;
    text-align: center;
    // border: 1px solid #C0CCDA;
    height: 30px;
    line-height: 30px;
    margin-bottom: 50px;
    .tab-item {
      width: 50%;
      position: relative;
      color: #99A9BF;
      border-top: 1px solid #C0CCDA;
      border-bottom: 1px solid #C0CCDA;
      /*右箭头*/
      .right{
        position: absolute;
        right: 2px;
        top: -1px;
      }
      .right-arrow1,.right-arrow2{
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        border-top: 15px transparent dashed;
        border-right: 15px transparent dashed;
        border-bottom: 15px transparent dashed;
        border-left: 15px white solid;
        overflow: hidden;
      }
      .right-arrow1{
        left: 1px;/*重要*/
        border-left: 15px #C0CCDA solid;
      }
      .right-arrow2{
        border-left: 15px white solid;
      }
    }
    .tab-item:first-child {
      border-left: 1px solid #C0CCDA;
    }
    .tab-active {
      color: $mainColor;
      border-color: $mainColor;
      border-left: 1px solid $mainColor!important;
      .right-arrow1 {
        // border-color: $mianColor;
        border-left: 15px $mainColor solid;
      }
    }
    .tab-done {
      background-color: $mainColor;
      color: #fff;
      // border-left: 1px solid $mainColor!important;
      // .right-arrow1 {
        // border-left: 15px $mainColor solid;
      // }
    }
  }
  .pageTitle {
    position: relative;
    .add_btn {
      position: absolute;
      top: -10px;
      right: 0;
    }
  }
  // .group-item {
  //   .el-form-item__label {
  //     padding-left: 71px!important;
  //   }
  // }
  .stage_btn {
    float: left;
    color: $mainColor;
    line-height: 40px;
    margin-right: 10px;
    cursor: pointer;
  }
  .def-el {
    margin-bottom: 24px;
    .el-card__body {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .card-box {
        padding: 10px 0;
        .left-box,
        .right-box {
          display: inline-block;
          height: 50px;
          vertical-align: middle;
          position: relative;
          .circle {
            display: inline-block;
            width: 42px;
            height: 42px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 100%;
            border: 3px solid #fff;
          }
        }
        .left-box {
          width: 50px;
          box-shadow: 0 6px 6px 2px rgba(43,125,131,0.05);
          border-radius: 4px;
          .svg-icon {
            position: absolute;
            fill: #fff;
            width: 32px;
            height: 32px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
          }
        }
        .right-box {
          margin-left: 3px;
          .title {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #475669;
            letter-spacing: 0;
            line-height: 20px;
          }
          .btm-box {
            position: absolute;
            bottom: 0;
            font-family: PingFangSC-Semibold;
            font-size: 22px;
            color: #FDCE82;
            letter-spacing: 0;
            line-height: 20px;
            white-space: nowrap;
            span {
              font-size: 30px;
              // vertical-align: text-top;
            }
            i {
              font-style: normal;
            }
          }
        }
        .orange-box {
          background: #FDCE82;
          .circle {
            background-color: #fdce82;
          }
        }
        .green-box {
          background: #30CDAA;
          .circle {
            background-color: #30cdaa;
          }
        }
        .green-right {
          .btm-box {
            color: #30cdaa;
          }
        }
        .red-box {
          background: #FF4949;
          .circle {
            background-color: #FF4949;
          }
        }
        .red-right {
          .btm-box {
            color: #FF4949;
          }
        }
      }
    }
  }
  .transc-tab {
    .first_btn {
      border-radius: 5px 0 0 5px;
      margin-right: -5px;
    }
    .sec_btn {
      border-radius: 0 5px 5px 0;
      margin-left: 0;
    }
  }
</style>

