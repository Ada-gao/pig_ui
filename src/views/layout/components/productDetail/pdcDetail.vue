<template>
  <div class="product-detail">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-row :gutter="90">
        <el-col :span="11" v-if="!stage&&createStatus==='update'">
          <!-- 如果分期，不显示编号 -->
          <el-form-item label="产品编号" prop="productCode">
            <span>{{form.productCode}}</span>
            <!-- <el-input v-else v-model="form.productCode" placeholder="请输入产品编号"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="产品全称" prop="productName">
            <span v-if="detailDisabled">{{form.productName}}</span>
            <el-input v-else v-model="form.productName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品结构类型" prop="productMixTypeId">
            <span v-if="detailDisabled">{{form.productMixTypeId|turnText(productMixTypes)}}</span>
            <el-select v-else class="filter-item" v-model="form.productMixTypeId" placeholder="请选择">
              <el-option v-for="item in productMixTypes" :key="item.productMixTypeId" :value="item.productMixTypeId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品简称" prop="productShortName" style="margin-bottom: 21px;">
            <span v-if="shortNameDisabled">{{form.productShortName}}</span>
            <el-input v-else v-model="form.productShortName" placeholder="请输入产品名称" style="line-height: 39px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品收益类型" prop="productTypeId">
            <span v-if="detailDisabled||stageType=='0'">{{form.productTypeId|turnText(productTypes)}}</span>
            <el-select v-else class="filter-item" v-model="form.productTypeId" placeholder="请选择">
              <el-option v-for="item in productTypes" :key="item.productTypeId" :value="item.productTypeId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" style="white-space: nowrap">
          <el-form-item label="产品风险级别" prop="productRiskLevel">
            <span v-if="detailDisabled||stageType=='0'">{{form.productRiskLevel|turnText(productRiskLevel)}}</span>
            <el-select v-else class="filter-item" v-model="form.productRiskLevel" placeholder="请选择">
              <el-option v-for="item in productRiskLevel" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="基金管理人" prop="manager">
            <span v-if="detailDisabled">{{form.manager}}</span>
            <el-input v-else v-model="form.manager" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="交易币种" prop="currencyId">
            <span v-if="detailDisabled||stageType=='0'">{{form.currencyId|turnText(currencyList)}}</span>
            <el-select v-else class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="11">
          <el-form-item label="购买人群" prop="buyingCrowds">
            <span v-if="detailDisabled">{{form.buyingCrowds|turnText(buyingCrowds)}}</span>
            <el-select v-else class="filter-item" multiple v-model="form.buyingCrowds" placeholder="请选择">
              <el-option v-for="item in buyingCrowds" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="11">
          <el-form-item
            label="购买人群"
            prop="buyingCrowds"
            :rules="[
              { required: true, message: '请选择购买人群', trigger: 'blur'}
            ]">
            <span v-if="detailDisabled"><i v-for="item in form.buyingCrowds">{{item|turnText(buyingCrowds)}} </i></span>
            <el-select v-if="!detailDisabled" class="filter-item" multiple v-model="formBuyingCrowds" value-key="id" placeholder="请选择">
              <el-option v-for="item in buyingCrowds" :key="item.id" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品期限" prop="investmentHorizon" style="margin-bottom: 21px; white-space: nowrap;">
            <span v-if="detailDisabled||stageType=='0'">{{form.investmentHorizon}}</span>
            <el-input v-else v-model="form.investmentHorizon" style="width: 25%;"></el-input>
            <span v-if="detailDisabled||stageType=='0'">{{form.investmentHorizonUnit|turnText(investHorizonUnit)}}</span>
            <el-form-item v-else label=""
              prop="investmentHorizonUnit"
              style="display: inline-block; width: 90px;"
              :rules="[
                {required: true, message: '请选择产品期限单位', trigger: 'change'}
              ]">
              <el-select v-model="form.investmentHorizonUnit" placeholder="请选择">
                <el-option v-for="item in investHorizonUnit" :key="item.value" :value="item.value" :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>

            <span style="width: 40%">产品折后系数：{{investRatio||0|turnNum}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收益" prop="isFloat">
            <span v-if="detailDisabled||stageType=='0'">
              {{form.isFloat=='0'?'浮动收益':'收益对标基准 ' + form.annualizedReturn + '%'}}
            </span>
            <el-radio-group v-else v-model="form.isFloat" @change="radioChange">
              <el-radio :label="0" style="display: inline-block">浮动收益</el-radio>
              <el-radio :label="1" style="display: inline-block">收益对标基准(%)</el-radio>
              <el-form-item label=""
                prop="annualizedReturn"
                v-if="!isDisabled"
                style="display: inline-block"
                class="sec-form-item"
                >
                <el-input
                  style="display: inline-block; width: 100px; margin-left: 5px;"
                  :maxlength="5"
                  v-model="form.annualizedReturn"></el-input>
              </el-form-item>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="募集额度（万）" prop="collectionAmount" style="white-space: nowrap">
            <span v-if="collectDisabled">{{form.collectionAmount}}</span>
            <el-input v-else type="number" v-model.number="form.collectionAmount" :maxlength="10" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="募集人数" prop="productLp">
            <span v-if="collectDisabled">{{form.productLp}}</span>
            <el-input v-else type="number" v-model.number="form.productLp" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="起投金额（万）" prop="minimalAmount" style="white-space: nowrap">
            <span v-if="detailDisabled">{{form.minimalAmount}}</span>
            <el-input v-else type="number" v-model.number="form.minimalAmount" :maxlength="10" placeholder="请输入起投金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="追加金额（万）" prop="minimalAddAmount" style="white-space: nowrap">
            <span v-if="detailDisabled">{{form.minimalAddAmount}}</span>
            <el-input v-else type="number" v-model.number="form.minimalAddAmount" :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收益分配方式" prop="incomeDistribution" style="white-space: nowrap">
            <span v-if="detailDisabled||stageType=='0'">{{form.incomeDistribution}}</span>
            <el-input v-else v-model="form.incomeDistribution" :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资产团队">
            <span v-if="detailDisabled">{{form.assetTeam}}</span>
            <el-input v-else v-model="form.assetTeam" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="托管银行">
            <span v-if="detailDisabled">{{form.custodianBank}}</span>
            <el-input v-else v-model="form.custodianBank" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" class="define_col" style="padding-left: 25px;">
          <el-form-item label="渠道打款金额（万）"  prop="channelAmount" style="white-space: nowrap">
            <span v-if="detailDisabled">{{form.channelAmount}}</span>
            <el-input v-else v-model="form.channelAmount" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="渠道人数">
            <span v-if="detailDisabled">{{form.channelNumber}}</span>
            <el-input v-else type="number" v-model.number="form.channelNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <!-- 产品/募集分期才有 -->
        <el-col :span="11" v-if="form.relevanceName">
          <el-form-item label="关联产品">
            <span v-if="detailDisabled">{{form.relevanceName}}</span>
            <el-input v-else v-model="form.relevanceName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="付息方式" prop="interestPayment">
            <span v-if="detailDisabled">{{form.interestPayment|turnText(interestPayment)}}</span>
            <el-select v-else class="filter-item" v-model="form.interestPayment" placeholder="请选择">
              <el-option v-for="item in interestPayment" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="认购费">
            <span v-if="detailDisabled">{{form.subscribe==0?'无认购费':form.subscribe==1?'价内认购':'价外认购 ' + form.subscribeRate + '%'}}</span>
            <el-radio-group v-else v-model="form.subscribe" @change="subscribeChange" style="white-space: nowrap;">
              <el-radio :label="0" style="display: inline-block">无认购费</el-radio>
              <el-radio :label="1" style="display: inline-block">价内认购</el-radio>
              <el-radio :label="2" style="display: inline-block">价外认购(%)</el-radio>
              <el-input style="display: inline-block; width: 100px; margin-left: 20px;" v-show="subDisabled" required="subDisabled" v-model="form.subscribeRate"></el-input>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="22">
          <el-form-item label="产品公告" prop="announcement">
            <span v-if="detailDisabled">{{form.announcement}}</span>
            <el-input
              v-else
              type="textarea"
              :row="2"
              v-model="form.announcement">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <article style="margin-top:40px">
        <p class="title">产品可见范围</p>
        <el-form-item>
          <el-radio-group v-model="activityRangeType" v-if="!detailDisabled">
            <el-radio :label="0">全部可见</el-radio>
            <el-radio :label="1">部分可见</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" v-if="activityRangeType == 1 || detailDisabled">
          <el-row v-if="detailDisabled">
            <el-col v-if="activityRangeType == 0">全部可见</el-col>
            <el-col> 
              <span style="padding: 0 6px" class="c-select-list" v-for="(item,index) in checkedDeptLabelList" :key="index">{{item}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between" v-else>
            <el-col class="c-select">
              <span class="c-select-list" v-for="(item,index) in checkedDeptLabelList" :key="index">{{item}}</span>
            </el-col>
            <el-button class="search_btn" style="height:40px;" @click="selectDepartment">选择部门</el-button>
          </el-row>
        </el-form-item>
      </article>
      <div class="split-line" style="margin-bottom: 20px;"></div>

      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="账户名称" prop="accountName">
            <span v-if="detailDisabled">{{form.accountName}}</span>
            <el-input v-else v-model="form.accountName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="账号" prop="cardNo">
            <span v-if="detailDisabled">{{form.cardNo}}</span>
            <el-input v-else v-model="form.cardNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="开户银行名称" prop="bankName">
            <span v-if="detailDisabled">{{form.bankName}}</span>
            <el-input v-else v-model="form.bankName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="大额支付行号" prop="paymentNumber">
            <span v-if="detailDisabled">{{form.paymentNumber}}</span>
            <el-input v-else type="number" v-model.number="form.paymentNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="90">
        <el-col :span="22">
          <el-form-item label="备注" prop="remark">
            <span v-if="detailDisabled">{{form.remark}}</span>
            <el-input
              v-else
              type="textarea"
              :row="2"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="createStatus==='create'">
        <el-col :span="11" :offset="11" style="text-align: right; margin-bottom: 10px">
          <el-button class="search_btn" @click="dialogPropertyVisible=true">
            <svg-icon icon-class="add"></svg-icon> 新增属性</el-button>
        </el-col>
      </el-row>
      <div class="split-line" style="margin-bottom: 20px;"></div>
      <el-row v-show="userNewAttr">
        <el-col :span="11" v-for="(item, index) in userDefinedAttribute" :key="index">
          <el-form-item :label="item.label" prop="">
            <el-input v-model="item.value" placeholder="请输入" :disabled="detailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <!-- 创建 -->
      <el-button class="search_btn" v-if="createStatus=='create'" @click="createCancel('form')">取 消</el-button>
      <el-button class="add_btn" v-if="createStatus=='create'" type="primary" @click="create('form')">保 存</el-button>
      <!-- 编辑 -->
      <el-button class="search_btn" v-if="createStatus=='update'" @click="cancel('form')">取 消</el-button>
      <el-button class="add_btn" v-if="createStatus=='update'" type="primary" @click="update('form')">保 存</el-button>
    </div>
    <!-- 新增属性 -->
    <el-dialog :visible.sync="dialogPropertyVisible" title="新增属性">
      <el-form :model="newAttrForm" ref="newAttrForm" label-width="120px">
        <el-col>
          <el-form-item
            label="属性名称"
            prop="propertyName"
            :rules="[
              {required: true, message: '请输入属性名称', trigger: 'change'}
            ]">
            <el-input v-model="newAttrForm.propertyName"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="dialog-footer text-right">
        <el-button @click="cancelAddNewAttr('newAttrForm')">取 消</el-button>
        <el-button type="primary" @click="handleAddProperty('newAttrForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 部门 -->
    <el-dialog title="" :visible.sync="dialogDepartment" width="30%">
      <article class="table-event">
        <div class="thead">所有部门</div>
        <div class="tbody">
          <el-tree show-checkbox node-key="id" :data="treeDepartmentData" ref="deptTree" :props="defaultProps"></el-tree>
        </div>
      </article>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancelDept">取 消</el-button>
        <el-button class="add_btn" @click="handleAddDept">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getObj, getProductStage, addObj, updProductStage, putObj } from '@/api/product/product'
  import transcTableComponent from 'components/table/transcTable'
  import { fetchProductTypeList, fetchProductMixType } from '@/api/product/productType'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { fetchTree } from '@/api/dept'
  import { mapGetters } from 'vuex'
  import { transformText, sortKey, transformText1 } from '@/utils'
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

  const pdExpire = (rule, value, callback) => {
      // const Reg = /^\d{1,5}$/
      const Reg = /^[1-9][0-9]{0,5}\+{0,1}[0-9]{0,5}$/
      if (!value) {
        callback('请输入产品期限')
      } else if (!Reg.test(value)) {
        callback('请输入有效的产品期限')
      } else {
        callback()
      }
  }

  const acount = (rule, value, callback) => {
    const exp = /^\d{1,20}$/
    if (!value) {
    } else if (!exp.test(Number(value))) {
      callback('请输入正确的账号')
    } else {
      callback()
    }
  }

  const pdAcount = (rule, value, callback) => {
    const exp = /^\d{1,20}$/
    if (!value) {
      callback('请输入账号')
    } else if (!exp.test(Number(value))) {
      callback('请输入正确的账号')
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
  // 收益对标基准校验
  const pdAnnualizedReturn = (rule, value, callback) => {
      const exp = /^(\d+|\d+\.\d{1,2})$/
      if (!value) {
          callback('请输入收益对标基准')
      } else if (!exp.test(Number(value))) {
          callback('请输入正确的收益对标基准')
      } else {
          callback()
      }
  }
//募集人数校验
  const vaProLp = (rule, value, callback) => {
    const exp = /^\d{1,10}$/
    if (!value) {
      return null
    }  else if(!exp.test(Number(value))) {
      callback('请输入10位以内整数')
    } else{
        callback()
    }
  }

  export default {
    data() {
      return {
        form: {
          userDefinedAttribute: '',
          buyingCrowds: []
        },
        userDefinedAttribute: [],
        productTypes: [],
        productMixTypes: [],
        currencyList: [],
        isDisabled: true,
        stage: false,
        stageTypeNo: '',
        collectDisabled: false,
        shortNameDisabled: false,
        detailDisabled: false,
        rules: {
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          isFloat: [
            { required: true, message: '请选择收益', trigger: 'change' }
          ],
          accountName: [
            { required: true, message: '请输入账户名称', trigger: 'blur' }
          ],
          bankName: [
            { required: true, message: '请输入开户银行名称', trigger: 'blur' }
          ],
          subBranchName: [
            { required: true, message: '请输入支行名称', rigger: 'blur' }
          ],
          cardNo: [
            { required: true, validator: pdAcount, trigger: 'blur' }
          ],
          productCode: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          productTypeId: [
            { required: true, message: '请选择产品收益类型', trigger: 'change' }
          ],
          productMixTypeId: [
            { required: true, message: '请选择产品结构类型', trigger: 'blur' }
          ],
          productRiskLevel: [
            { required: true, message: '请选择产品风险级别', trigger: 'change' }
          ],
          manager: [
            { required: true, message: '请输入基金管理人', trigger: 'blur' }
          ],
          currencyId: [
            { required: true, message: '请选择交易币种', trigger: 'blur' }
          ],
          collectionAmount: [
            {  required: true, message: '请输入募集额度', trigger: 'change'}
            // {  message: '金额必须为数字值',  trigger: 'change',  validator: certNumber}
          ],
          minimalAmount: [
            { required: true, message: '请输入起投金额', trigger: 'change'},
            { message: '金额必须为数字值', trigger: 'change', validator: certNumber}
          ],
          minimalAddAmount: [
            { required: true, message: '请输入追加金额', trigger: 'change'}
            // { type: 'number', message: '金额必须为数字值', validator: certNumber }
          ],
          investmentHorizon: [
            { required: true, validator: pdExpire, trigger: 'blur' },
//            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          buyingCrowds: [
            { required: true, message: '请选择购买人群', trigger: 'change' }
          ],
          annualizedReturn: [
            { required: true, validator: pdAnnualizedReturn, trigger: 'blur'}
          ],
          productLp: [
            {required: false, validator: vaProLp, trigger: 'blur'}
          ]
        },
        createStatus: 'create',
        backUrl: '',
        dialogPropertyVisible: false,
        newAttrForm: {
          propertyName: ''
        },
        subDisabled: false,
        ratio: 0,
        userNewAttr: false,
        formBuyingCrowds: [],
        treeDepartmentData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogDepartment: false,
        checkedDeptLabelList: [],
        checkedDeptIds: [],
        activityRangeType: 0
      }
    },
    props: ['productId', 'stageType', 'formData'],
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel',
        'investHorizonUnit',
        'interestPayment',
        'buyingCrowds'
      ]),
      investRatio() {
        if(this.form.investmentHorizonUnit === '0') {
          this.ratio = this.form.investmentHorizon / 12 * 100
        } else if(this.form.investmentHorizonUnit === '1') {
          this.ratio = 1 * 100
        } else if(this.form.investmentHorizonUnit === '2') {
          this.ratio = this.form.investmentHorizon / 365 * 100
        }
        this.ratio = this.ratio > 100 ? 100 : this.ratio
        return this.ratio
      }
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      },
      turnNum (num) {
        return Math.round(parseFloat(num) * 100) / 100 + '%'
      },
      turnText (val, list) {
        return transformText1(val, list)
      }
    },
    created() {
      if(this.productId || this.stage) {
        this.createStatus = 'update'
      }
      fetchProductTypeList().then(res => { // 获取产品收益类型
        this.productTypes = res.data
        fetchProductMixType().then(res => { // 获取产品结构类型
          this.productMixTypes = res.data
        })
        getObjList().then(response => { // 获取币种
          this.currencyList = response.data
          this.form.currencyId = 1
          if(!this.stage) {
            // console.log('没有分期')
            this.getList()
          }
        })
      })
      document.documentElement.scrollTop = document.body.scrollTop = 0
    },
    mounted() {
      this.form = this.formData
      let list = Object.keys(this.formData)
      if(list.length > 1 && !list.productId) {
        this.formBuyingCrowds = this.form.buyingCrowds.split()
        if(this.stageType === '0') {
          // 产品分期
          this.detailDisabled = false
          // this.stage = true
        } else if (this.stageType === '1') {
          // 募集分期
          this.detailDisabled = true
        }
        this.stage = true
      }
      this.backUrl = localStorage.getItem('activeUrl')
    },
    methods: {
      getList() {
        if(this.productId) { // 查询产品详情
          getObj(this.productId)
          .then(response => {
            this.form = response.data
            this.userDefinedAttribute = JSON.parse(this.form.userDefinedAttribute)
            // console.log(JSON.parse(this.form.userDefinedAttribute))
            this.form.subscribe = this.form.subscribe - 0
            this.formBuyingCrowds = this.form.buyingCrowds.split()
            if(this.userDefinedAttribute == 'null') {
              this.userNewAttr = false
            } else if(this.userDefinedAttribute instanceof Array) {
              this.userNewAttr = true
            }
            this.ratio = this.form.discountCoefficient
            this.dialogStatus = 'update' // 设置每个产品详情对应显示的提交按钮
            if(this.form.isFloat === 0) {
              this.form.annualizedReturn = null
              this.isDisabled = true
            } else {
              this.isDisabled = false
            }
            if (this.form.deptIds) {
              this.activityRangeType = 1
              this.checkedDeptIds = this.form.deptIds.split()
              fetchTree().then(res => {
                this.treeDepartmentData = res.data
                
              })
            }
            this.productStatusNo = this.form.productStatus //根据产品状态判断禁用字段
            let params = {
              productStatusNo: this.productStatusNo,
              productName: this.form.productName,
              collectLP: this.form.productLp,
              collectAmount: this.form.collectionAmount
            }
            this.$emit('listen', params) // 传递产品状态到父组件
            // this.$store.dispatch('SetProductStatus', this.productStatusNo)
            // this.form.currencyIdNo = this.form.currencyId
            // this.form.productTypeIdNo = this.form.productTypeId
            this.form.investmentHorizonUnitNo = this.form.investmentHorizonUnit
            // this.form.productMixTypeIdNo = this.form.productMixTypeId
            // this.form.productTypeId = transformText(this.productTypes, this.form.productTypeId)
            // this.form.currencyId = transformText(this.currencyList, this.form.currencyId)
            // this.form.investmentHorizonUnit = transformText(this.investHorizonUnit, this.form.investmentHorizonUnit)
            this.form.productStatus = transformText(this.productStatus, this.form.productStatus)
            // this.form.productMixTypeId = transformText(this.productMixTypes, this.form.productMixTypeId)

            this.detailDisabled = true
            if(this.productStatusNo === 0) {
              // 所有项都可编辑
              this.detailDisabled = false
            }
            if(this.productStatusNo === 6) {
              this.shortNameDisabled = true
            }
            if(this.productStatusNo === 4||this.productStatusNo === 5||this.productStatusNo === 6) {
              // 募集人数和募集额度禁用
              this.collectDisabled = true
            }
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
      subscribeChange(value) {
        if(value === 2) {
          this.subDisabled = true
        } else {
          this.subDisabled = false
        }
      },
      create(formName) { // 创建提交
        // console.log('创建')
        // this.$emit('productIdByDetail', '')
        const set = this.$refs
        if(!this.form.isFloat) {
          this.form.annualizedReturn = null
          this.isDisabled = true
        }
        if(this.form.investmentHorizon && this.form.investmentHorizon.indexOf('+') !== -1 && this.form.investmentHorizonUnit!='1') {
          this.$notify({
            title: '提示',
            message: '产品期限填写有误，请重新输入',
            type: 'danger',
            duration: 2000
          })
          return false
        }
        this.form.buyingCrowds = this.formBuyingCrowds.toString()
        set[formName].validate(valid => {
          if (valid) {
            this.form.discountCoefficient = this.investRatio
            this.form.userDefinedAttribute = JSON.stringify(this.userDefinedAttribute)
            // console.log(this.form.userDefinedAttribute)
            this.form.deptIds = this.checkedDeptIds ? this.checkedDeptIds.toString() : null
            addObj(this.form)
              .then(response => {
                if(response.status === 200) {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                  // 滚动到头部
                  document.documentElement.scrollTop = document.body.scrollTop = 0
                  this.$emit('productIdByDetail', response.data.productId)
                }
              })
          } else {
            return false
          }
        })
      },
      update(formName) { // 产品详情修改提交
        // console.log(this.form)
        const set = this.$refs
        // if(this.stageType==='0' || this.productStatusNo == '0') formName = 'form'
        if(!this.form.isFloat) {
          this.form.annualizedReturn = null
          this.isDisabled = true
        }
        this.form.productStatus = this.productStatusNo
        // this.form.currencyId = this.form.currencyIdNo
        // this.form.productTypeId = this.form.productTypeIdNo
        // this.form.investmentHorizonUnit = this.form.investmentHorizonUnitNo
        // this.form.productMixTypeId = this.form.productMixTypeIdNo
        if(this.form.investmentHorizon.indexOf('+') !== -1 && this.form.investmentHorizonUnit!='1') {
          this.$notify({
            title: '提示',
            message: '产品期限填写有误，请重新输入',
            type: 'danger',
            duration: 2000
          })
          return false
        }
        this.form.buyingCrowds = this.formBuyingCrowds.toString()
        set[formName].validate(valid => {
          if (valid) {
            this.form.discountCoefficient = this.investRatio
            this.form.userDefinedAttribute = JSON.stringify(this.userDefinedAttribute)
            this.form.deptIds = this.checkedDeptIds ? this.checkedDeptIds.toString() : null
            if (this.stage) { //分期
              updProductStage(this.form).then(response => {
                if(!response.data || response.status !== 200) {
                  return
                }
                this.form = response.data
                // this.productId = this.form.productId
                this.$emit('productIdByDetail', response.data.productId)
                // 此处应该 $emit 发送数据到父组件
                // this.changeStep(this.step)
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
              putObj(this.productId, this.form).then((res) => {
                if(res.status !== 200) return
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                })
                this.$emit('productIdByDetail', this.form.productId)
              })
            }
            let params = {
              productStatusNo: this.productStatusNo,
              productName: this.form.productName,
              collectLP: this.form.productLp,
              collectAmount: this.form.collectionAmount
            }
            this.$emit('listen', params) // 传递产品状态到父组件
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.$refs[formName].resetFields()
        this.$router.push({path: this.backUrl})
        Bus.$emit('activeIndex', this.backUrl)
      },
      createCancel(formName){
        this.$refs[formName].resetFields()
        const backUrl = '/product/productList'
        Bus.$emit('activeIndex', backUrl)
        this.$router.push({path: backUrl})
      },
      handleAddProperty(formName) { // 新增属性
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.userDefinedAttribute.push({
            label: this.newAttrForm.propertyName,
            value: ''
          })
          this.form.userDefinedAttribute = this.userDefinedAttribute
          this.dialogPropertyVisible = false
          this.userNewAttr = true
          this.newAttrForm.propertyName = ''
          }
        })
      },
      cancelAddNewAttr(formName) {
        this.dialogPropertyVisible = false
        this.$refs[formName].resetFields()
      },
      selectDepartment() {
        this.dialogDepartment = true
        fetchTree().then(res => {
          this.treeDepartmentData = res.data
        })
        if (this.checkedDeptIds.length) {
          this.$refs.deptTree.setCheckedKeys(this.checkedDeptIds)
        }
      },
      handleAddDept() {
        this.checkedDeptLabelList = []
        this.checkedDeptIds = []
        let checkedNodes = this.$refs.deptTree.getCheckedNodes()
        checkedNodes.forEach(item => {
          this.checkedDeptLabelList.push(item.name)
          this.checkedDeptIds.push(item.id)
        })
        this.cancelDept()
      },
      cancelDept() {
        this.dialogDepartment = false
      }
    }
  }
</script>

<style lang="scss" scoped>
.filter-item {
  display: block;
}
.define_col .el-form-item__content span,
.define_col .el-form-item__content .el-input {
  margin-left: 20px;
}
.title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #2F2F2F;
  letter-spacing: 0;
  border-bottom: 1px solid #E9E9E9;
  padding-bottom: 10px;
}
.c-select {
    padding: 0 16px;
    background: #FFFFFF;
    border: 1px solid #C8C8C8;
    border-radius: 2px;
    margin-right: 10px;
    .c-select-list {
        padding: 2px 6px;
        margin: 0 6px;
        background: rgba(0,193,223,0.10);
        border: 1px solid rgba(32,160,255,0.20);
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        color: #0299CC;
        letter-spacing: 0;
        line-height: 14px;
        display: inline-block;
    }
}
</style>
