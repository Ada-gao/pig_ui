<template>
  <div class="product-detail">
    <el-form :model="form" :rules="rules" ref="form1" label-width="110px">
      <el-row :gutter="90">
        <el-col :span="11" v-if="!stage">
          <el-form-item label="产品编号" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入产品编号" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="产品全称" prop="productName">
            <el-input v-model="form.productName" placeholder="请输入产品名称" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品结构类型" prop="productName">
            <el-select class="filter-item" v-model="form.productTypeId" placeholder="请选择" :disabled="detailDisabled">
              <el-option v-for="item in productTypes" :key="item.productTypeId" :value="item.productTypeId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品简称" prop="productShortName">
            <el-input v-model="form.productShortName" placeholder="请输入产品名称" :disabled="shortNameDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品收益类型" prop="productTypeId">
            <el-select class="filter-item" v-model="form.productTypeId" placeholder="请选择" :disabled="detailDisabled||stageType=='0'">
              <el-option v-for="item in productTypes" :key="item.productTypeId" :value="item.productTypeId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" style="white-space: nowrap">
          <el-form-item label="产品风险级别" prop="productRiskLevel">
            <el-select class="filter-item" v-model="form.productRiskLevel" placeholder="请选择" :disabled="detailDisabled||stageType=='0'">
              <el-option v-for="item in productRiskLevel" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="基金管理人" prop="manager">
            <el-input v-model="form.manager" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="交易币种" prop="currencyId">
            <!-- <el-input v-model="form.currencyId" placeholder="" disabled></el-input> -->
            <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency" :disabled="detailDisabled||stageType=='0'">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="汇率" prop="currencyId">
            <el-input v-model="form.currencyId" placeholder="" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="购买人群" prop="currencyId">
            <el-input v-model="form.currencyId" placeholder="" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品期限" prop="investmentHorizon">
            <!-- <el-input type="number" v-model.number="form.investmentHorizon" style="width: 75%;" disabled></el-input>
            <el-input v-model="form.investmentHorizonUnit" style="width: 22%;" disabled></el-input> -->
            <el-input type="number" v-model.number="form.investmentHorizon" style="width: 75%;" :disabled="detailDisabled||stageType=='0'"></el-input>
            <el-select v-model="form.investmentHorizonUnit" style="width: 23%;" :disabled="detailDisabled||stageType=='0'">
              <el-option v-for="item in investHorizonUnit" :key="item.value" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col>
          <el-form-item label="收益" prop="isFloat">
            <el-radio-group v-model="form.isFloat" @change="radioChange" :disabled="detailDisabled||stageType=='0'">
              <el-radio :label="0" style="display: inline-block">浮动收益率</el-radio>
              <el-radio :label="1" style="display: inline-block">收益对标基准（%）</el-radio>
              <el-input style="display: inline-block; width: 100px; margin-left: 20px;" v-show="!isDisabled" required="!isDisabled" v-model="form.annualizedReturn" disabled></el-input>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="募集额度（万）" prop="collectionAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.collectionAmount" :maxlength="10" placeholder="请输入" :disabled="collectDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="募集人数" prop="productLp">
            <el-input v-model.number="form.productLp" placeholder="请输入" :disabled="collectDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="起投金额（万）" prop="minimalAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAmount" :maxlength="10" placeholder="请输入起投金额" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="追加金额（万）" prop="minimalAddAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAddAmount" :maxlength="10" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收益分配方式" prop="incomeDistribution" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.incomeDistribution" :maxlength="10" :disabled="detailDisabled||stageType=='0'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资产团队">
            <el-input v-model="form.assetTeam" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="托管银行">
            <el-input v-model="form.assetTeam" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="渠道打款金额">
            <el-input v-model="form.assetTeam" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="渠道人数">
            <el-input v-model="form.assetTeam" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="关联产品">
            <el-input v-model="form.assetTeam" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="付息方式" prop="productRiskLevel">
            <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency" :disabled="detailDisabled">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="认购费">
            <el-input v-model="form.assetTeam" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品归属">
            <el-radio-group v-model="form.isFloat" @change="radioChange" :disabled="detailDisabled">
              <el-radio :label="0" style="display: inline-block">自营</el-radio>
              <el-radio :label="1" style="display: inline-block">代购</el-radio>
              <el-input style="display: inline-block; width: 100px; margin-left: 20px;" v-show="!isDisabled" required="!isDisabled" v-model="form.annualizedReturn" disabled></el-input>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="22">
          <el-form-item label="产品公告" prop="incomeDistribution">
            <el-input
              type="textarea"
              :row="2"
              v-model="form.incomeDistribution" :disabled="detailDisabled">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="split-line" style="margin-bottom: 20px;"></div>

      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="账户名称" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="账号">
            <el-input v-model.number="form.cardNo" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="开户银行（支行）名称">
            <el-input v-model="form.subBranchName" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="大额支付行号">
            <el-input v-model="form.subBranchName" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="90">
        <el-col :span="22">
          <el-form-item label="备注" prop="highlight">
            <el-input
              type="textarea"
              :row="2"
              v-model="form.highlight" :disabled="detailDisabled">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="split-line" style="margin-bottom: 20px;"></div>

      <el-row>
        <el-col :span="6">
          <el-form-item label="成立日:">
            <span>{{form.establishmentDate|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关账日:">
            <span>{{form.closeDate|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起息日:">
            <span>{{form.valueDate|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { getObj, getProductStage } from '@/api/product/product'
  import transcTableComponent from 'components/table/transcTable'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { mapGetters } from 'vuex'
  import { transformText, sortKey } from '@/utils'
  import { parseTime } from '@/utils'
  import { decimals, isNumber } from '@/utils/validate'
  import Bus from '@/assets/js/bus'

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
    data() {
      return {
        form: {},
        productTypes: [],
        currencyList: [],
        isDisabled: true,
        stage: false,
        stageTypeNo: '',
        collectDisabled: false,
        shortNameDisabled: false,
        detailDisabled: false,
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
          isFloat: [
            {
              required: true,
              message: '请选择收益',
              trigger: 'blue'
            }
          ],
          bankName: [
            {
              required: true,
              message: '请输入开户银行名称',
              trigger: 'blur'
            }
          ],
          subBranchName: [
            {
              required: true,
              message: '请输入支行名称',
              trigger: 'blur'
            }
          ],
          cardNo: [
            {
              required: true,
              message: '请输入打款帐号',
              trigger: 'blur'
            }
          ],
          productCode: [
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
              trigger: 'change'
            },
            {
              // message: '金额必须为数字值',
              trigger: 'change',
              validator: certNumber
            }
          ],
          minimalAmount: [
            {
              required: true,
              message: '请输入起投金额',
              trigger: 'change'
            },
            {
              message: '金额必须为数字值',
              trigger: 'change',
              validator: certNumber
            }
          ],
          minimalAddAmount: [
            {
              required: true,
              message: '请输入追加金额',
              trigger: 'change'
            },
            {
              // type: 'number',
              message: '金额必须为数字值',
              validator: certNumber
            }
          ],
          netValue: [
            {
              // required: false,
              max: 5,
              message: '请输入小于100，且小数不能超过两位',
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
        }
      }
    },
    props: ['productId', 'stageType', 'formData'],
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel',
        'investHorizonUnit'
      ])
      // normalList1() {
      //   return sortKey(this.normalList, 'age')
      // }
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    created() {
      fetchProductTypeList().then(res => { // 获取产品类型
        this.productTypes = res.data
        getObjList().then(response => { // 获取币种
          this.currencyList = response.data
          this.form.currencyId = 1
          if(!this.stage) {
            this.getList()
          }
        })
      })
    },
    watch:{
      // watch 无效，直接在 mounted 里可获取到
      stageType(curVal, oldVal) {
        console.log(curVal + ';' + oldVal)
        if(curVal) {
          this.stageTypeNo = curVal
          this.stage = true
          if(this.stageTypeNo === '0') {
            this.detailDisabled = false
          }
          console.log('maybe something is wrong')
          this.getCollectList(this.productId, this.stageTypeNo)
        }
      }
    },
    mounted() {
      this.form = this.formData
      let list = Object.keys(this.formData)
      
      if(list.length > 1 & !list.productId) {
        if(this.stageType === '0') {
          // 产品分期
          this.detailDisabled = false
          this.stage = true
        }
      }
    },
    methods: {
      getList() {
        // console.log(this.stageType)
        if(this.productId) { // 查询产品详情
          getObj(this.productId)
          .then(response => {
            // this.stepStatus = 'update'
            this.form = response.data
            // this.dialogFormVisible = true
            this.dialogStatus = 'update' // 设置每个产品详情对应显示的提交按钮
            if(this.form.isFloat === 0) {
              this.form.annualizedReturn = null
              this.isDisabled = true
            } else {
              this.isDisabled = false
            }
            this.productStatusNo = this.form.productStatus //根据产品状态判断禁用字段
            this.$emit('listen', this.productStatusNo) // 传递产品状态到父组件
            // this.$store.dispatch('SetProductStatus', this.productStatusNo)
            this.form.currencyIdNo = this.form.currencyId
            this.form.productTypeIdNo = this.form.productTypeId
            this.form.investmentHorizonUnitNo = this.form.investmentHorizonUnit
            this.form.productTypeId = transformText(this.productTypes, this.form.productTypeId)
            this.form.currencyId = transformText(this.currencyList, this.form.currencyId)
            this.form.investmentHorizonUnit = transformText(this.investHorizonUnit, this.form.investmentHorizonUnit)
            this.form.productStatus = transformText(this.productStatus, this.form.productStatus)

            this.detailDisabled = true
            if(this.productStatusNo === 0) {
              this.detailDisabled = false
            }
            if(this.productStatusNo === 6) {
              this.shortNameDisabled = true
            }
            if(this.productStatusNo === 4||this.productStatusNo === 5||this.productStatusNo === 6) {
              // 募集人数和募集额度禁用
              this.collectDisabled = true
            }
            // if(this.productStatusNo === 4) {
            //   this.someDisabled = false
            // }
            // if(this.productStatusNo === 2) {
            //   this.closeDateDisabled = false
            // }
            // if(this.productStatusNo === 5) {
            //   this.establishedDisabled = false
            //   this.someDisabled = false
            // }
            // if(this.productStatusNo === 5||this.productStatusNo === 6) {
            //   this.valueDateDisabled = true
            // }
            // if(this.productStatusNo === 6) {
            //   this.allDisabled = false
            // }
          })
        } else {
          // 新建
          this.detailDisabled = false
        }
      },
      // getCollectList(id, stageType) {
      //   getProductStage(id, stageType).then(res => {
      //     console.log('这是自己获得额')
      //     this.step = 1
      //     this.stage = true
      //     this.formData = res.data
      //     // console.log(this.stage)
      //     this.formData.currencyIdNo = this.formData.currencyId
      //     this.formData.productTypeIdNo = this.formData.productTypeId
      //     this.formData.investmentHorizonUnitNo = this.formData.investmentHorizonUnit
      //     this.formData.productTypeId = transformText(this.productTypes, this.formData.productTypeId)
      //     this.formData.currencyId = transformText(this.currencyList, this.formData.currencyId)
      //     this.formData.investmentHorizonUnit = transformText(this.investHorizonUnit, this.formData.investmentHorizonUnit)
      //   })
      // },
      changeCurrency(val) {
        this.currencyList = this.currencyList.slice(0)
      },
      radioChange(value) {
        if(value === 0) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.filter-item {
  display: block;
}
</style>

