<template>
  <div class="product-detail">
    <el-form :model="form" ref="form1" label-width="100px">
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
            <el-select v-model="form.investmentHorizonUnit" style="width: 20%;" :disabled="detailDisabled||stageType=='0'">
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

      <el-row>
        <el-col :span="11">
          <el-form-item label="账户名称" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="账号">
            <el-input v-model.number="form.cardNo" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开户银行（支行）名称">
            <el-input v-model="form.subBranchName" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
            <span>{{form.establishmentDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关账日:">
            <span>{{form.closeDate|parseTime('{y}-{m}-{d}')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起息日:">
            <span>{{form.valueDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { getObj } from '@/api/product/product'
  import transcTableComponent from 'components/table/transcTable'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { mapGetters } from 'vuex'
  import { transformText, sortKey } from '@/utils'
  import { parseTime } from '@/utils'

  export default {
    data() {
      return {
        form: {},
        productTypes: [],
        currencyList: [],
        isDisabled: true,
        stage: false,
        stageType: '',
        collectDisabled: false,
        shortNameDisabled: false,
        detailDisabled: false
      }
    },
    props: {
      productId: {
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel',
        'investHorizonUnit'
      ]),
      normalList1() {
        return sortKey(this.normalList, 'age')
      }
    },
    created() {
      fetchProductTypeList().then(res => { // 获取产品类型
        this.productTypes = res.data
        getObjList().then(response => { // 获取币种
          this.currencyList = response.data
          this.form.currencyId = 1
          this.getList()
        })
      })
    },
    methods: {
      getList() {
        // this.listQuery.productId = this.$route.params.id
        // if(!this.productId) this.nextToUpdate = false
        if(this.productId) { // 查询产品详情
          getObj(this.productId)
          .then(response => {
            // this.stepStatus = 'update'
            this.form = response.data
            console.log(response.data)
            // this.dialogFormVisible = true
            this.dialogStatus = 'update' // 设置每个产品详情对应显示的提交按钮
            if(this.form.isFloat === 0) {
              this.form.annualizedReturn = null
              this.isDisabled = true
            } else {
              this.isDisabled = false
            }
            this.productStatusNo = this.form.productStatus //根据产品状态判断禁用字段
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

</style>

