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
        <el-radio-button v-if="productStatusNo!==0&productStatusNo!==1&stageType!='0'" label="3">交易信息</el-radio-button>
      </el-radio-group>
    </div>
    <div v-else class="tabs">
      <div class="tab-item" :class="{'tab-active':step===1,'tab-done':step===2}">产品详情
        <b class="right"><i class="right-arrow1"></i><i class="right-arrow2"></i></b>
      </div>
      <div class="tab-item" :class="{'tab-active':step===2}">产品操作指南
        <b class="right"><i class="right-arrow1"></i><i class="right-arrow2"></i></b>
      </div>
    </div>
    <div class="pageTitle" style="text-align: right" v-if="stage&step===1">
      <!-- <el-button v-if="sys_user_add & step === 1" class="add_btn">新增字段属性</el-button> -->
      关联产品
      <el-input v-model="form.productName" style="width: 180px" placeholder="请输入"></el-input>
    </div>

    <div class="split-line" style="margin-bottom: 20px;"></div>

    <product-detail
      :productId="productId"></product-detail>

    <!-- <div class="split-line" style="margin-bottom: 20px;"></div> -->

    <!-- <el-form :model="form" :rules="rules" ref="form" label-width="100px" v-if="step===1&(productStatusNo===0||stageType=='0')||!uploadData.productId">
      <el-row :gutter="90">
        <el-col :span="11" v-if="uploadData.productId&!stage">
          <el-form-item label="产品编号" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入产品编号" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="产品全称" prop="productName">
            <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品简称" prop="productShortName">
            <el-input v-model="form.productShortName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品类型" prop="productTypeId">
            <el-select class="filter-item" v-model="form.productTypeId" placeholder="请选择" :disabled="stageType=='0'">
              <el-option v-for="item in productTypes" :key="item.productTypeId" :value="item.productTypeId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="募集人数" prop="productLp">
            <el-input v-model="form.productLp" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" style="white-space: nowrap">
          <el-form-item label="产品风险级别" prop="productRiskLevel">
            <el-select class="filter-item" v-model="form.productRiskLevel" placeholder="请选择" :disabled="stageType=='0'">
              <el-option v-for="item in productRiskLevel" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="基金管理人" prop="manager">
            <el-input v-model="form.manager" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="交易币种" prop="currencyId">
            <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency" :disabled="stageType=='0'">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="募集额度（万）" prop="collectionAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.collectionAmount" :maxlength="10" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="净值（元）" prop="netValue">
            <el-input type="number" v-model="form.netValue" :maxlength="5" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="起投金额（万）" prop="minimalAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAmount" :maxlength="10" placeholder="请输入起投金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="追加金额（万）" prop="minimalAddAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAddAmount" :maxlength="10"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="产品期限" prop="investmentHorizon">
            <el-input type="number" v-model.number="form.investmentHorizon" style="width: 75%;" :disabled="stageType=='0'"></el-input>
            <el-select v-model="form.investmentHorizonUnit" style="width: 20%;" :disabled="stageType=='0'">
              <el-option v-for="item in investHorizonUnit" :key="item.value" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品过往业绩" prop="historyPerformance">
            <el-input v-model="form.historyPerformance" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col>
          <el-form-item label="收益" prop="isFloat">
            <el-radio-group v-model="form.isFloat" @change="radioChange" :disabled="stageType=='0'">
              <el-radio :label="0" style="display: inline-block">浮动收益率</el-radio>
              <el-radio :label="1" style="display: inline-block">收益对标基准（%）</el-radio>
              <el-input style="display: inline-block; width: 100px; margin-left: 20px;" v-show="!isDisabled" required="!isDisabled" v-model="form.annualizedReturn"></el-input>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="开户银行" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="关账日期" prop="closeDate">
            <el-date-picker
              v-model="form.closeDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="支行" prop="subBranchName">
            <el-input v-model="form.subBranchName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资产团队">
            <el-input v-model="form.assetTeam" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="打款账号" prop="cardNo">
            <el-input v-model.number="form.cardNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="起息日" prop="valueDate">
            <el-date-picker
              v-model="form.valueDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="成立日" prop="establishmentDate">
            <el-date-picker
              v-model="form.establishmentDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="22">
          <el-form-item label="收益分配方式" prop="incomeDistribution">
            <el-input
              type="textarea"
              :row="2"
              v-model="form.incomeDistribution"
              :disabled="stageType=='0'">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
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
    </el-form> -->
    <!-- <el-form :model="form" ref="form1" label-width="100px" v-if="step===1&productStatusNo!==0&stageType!='0'&createStatus==='update'">
      <el-row :gutter="90">
        <el-col :span="11" v-if="!stage">
          <el-form-item label="产品编号" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入产品编号" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="产品全称" prop="productName">
            <el-input v-model="form.productName" placeholder="请输入产品名称" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品结构类型" prop="productName">
            <el-input v-model="form.productName" placeholder="请输入产品名称" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品简称" prop="productShortName">
            <el-input v-model="form.productShortName" placeholder="请输入产品名称" :disabled="shortNameDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品收益类型" prop="productTypeId">
            <el-select class="filter-item" v-model="form.productTypeId" placeholder="请选择" :disabled="stageType=='0'">
              <el-option v-for="item in productTypes" :key="item.productTypeId" :value="item.productTypeId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" style="white-space: nowrap">
          <el-form-item label="产品风险级别" prop="productRiskLevel">
            <el-select class="filter-item" v-model="form.productRiskLevel" placeholder="请选择" :disabled="stageType=='0'">
              <el-option v-for="item in productRiskLevel" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="基金管理人" prop="manager">
            <el-input v-model="form.manager" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="交易币种" prop="currencyId">
            <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency" :disabled="stageType=='0'">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="汇率" prop="currencyId">
            <el-input v-model="form.currencyId" placeholder="" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="购买人群" prop="currencyId">
            <el-input v-model="form.currencyId" placeholder="" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品期限" prop="investmentHorizon">
            <el-input type="number" v-model.number="form.investmentHorizon" style="width: 75%;" :disabled="stageType=='0'"></el-input>
            <el-select v-model="form.investmentHorizonUnit" style="width: 20%;" :disabled="stageType=='0'">
              <el-option v-for="item in investHorizonUnit" :key="item.value" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col>
          <el-form-item label="收益" prop="isFloat">
            <el-radio-group v-model="form.isFloat" @change="radioChange" disabled>
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
            <el-input type="number" v-model.number="form.minimalAmount" :maxlength="10" placeholder="请输入起投金额" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="追加金额（万）" prop="minimalAddAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAddAmount" :maxlength="10" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收益分配方式" prop="incomeDistribution" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.incomeDistribution" :maxlength="10" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资产团队">
            <el-input v-model="form.assetTeam" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="托管银行">
            <el-input v-model="form.assetTeam" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="渠道打款金额">
            <el-input v-model="form.assetTeam" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="渠道人数">
            <el-input v-model="form.assetTeam" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="关联产品">
            <el-input v-model="form.assetTeam" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" style="white-space: nowrap">
          <el-form-item label="付息方式" prop="productRiskLevel">
            <el-input v-model="form.productRiskLevel" placeholder="" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="认购费">
            <el-input v-model="form.assetTeam" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品归属">
            <el-radio-group v-model="form.isFloat" @change="radioChange" disabled>
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
              v-model="form.incomeDistribution" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="split-line" style="margin-bottom: 20px;"></div>

      <el-row>
        <el-col :span="11">
          <el-form-item label="成立日" prop="establishmentDate">
            <el-input v-model="form.establishmentDate" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="起息日" prop="valueDate">
            <el-input v-model="form.valueDate" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="关账日" prop="closeDate">
            <el-input v-model="form.closeDate" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="split-line" style="margin-bottom: 20px;"></div>

      <el-row>
        <el-col :span="11">
          <el-form-item label="账户名称" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="账号">
            <el-input v-model.number="form.cardNo" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开户银行（支行）名称">
            <el-input v-model="form.subBranchName" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="大额支付行号">
            <el-input v-model="form.subBranchName" placeholder="请输入" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="90">
        <el-col :span="22">
          <el-form-item label="备注" prop="highlight">
            <el-input
              type="textarea"
              :row="2"
              v-model="form.highlight" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->

    <div class="upfile-group" v-if="step===2">
      <div class="trade-item">
        <h3>交易所需材料</h3>
        <el-table
          :data="fileList1"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="材料名称"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name"
                        v-if="productFileId===scope.row.productFileId"
                        @keyup.enter.native="updateFileName(scope.row, 'transaction')"></el-input>
                        <!-- @blur="updateFileName(scope.row, 'transaction')" -->
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileSize"
            label="大小/k"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="filePath"
            label="附件"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <a class="common_btn" size="small" @click="productFileId=scope.row.productFileId">编辑</a>
              <a class="danger_btn" size="small" @click="delfiles(scope.row, 'transaction')">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: right;">
          <el-button size="small"
                     class="btn-padding add_btn"
                     v-if="!operationDisabled"
                     @click="addClientFile('transc')">追加材料</el-button>
          <!-- <el-upload
            class="upload-demo"
            style="display: inline-block;"
            :headers="headers"
            :action="importFile('transc')"
            :on-change="handleChange"
            :show-file-list="false"
            accept=".pdf">
            <el-button size="small"
                       v-if="!operationDisabled"
                       class="btn-padding add_btn">追加材料</el-button>
          </el-upload> -->
        </el-row>
      </div>

      <div class="trade-item">
        <h3>上传客户材料</h3>
        <el-table
          :data="clientFiles"
          border
          style="width: 100%">
          <el-table-column
            prop="fileName"
            label="材料名称"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fileName"
                        v-if="productFileId===scope.row.productClientFileId"
                        @keyup.enter.native="updateClientFileName(scope.row)"></el-input>
                        <!-- @blur="updateClientFileName(scope.row)" -->
              <span v-else>{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <a class="common_btn" size="small" @click="productFileId=scope.row.productClientFileId">编辑</a>
              <a class="danger_btn" size="small" @click="delCustFile(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: right;">
          <el-button size="small"
            class="btn-padding add_btn"
            v-if="!operationDisabled"
            @click="addClientFile('client')">追加材料</el-button>
        </el-row>
      </div>

      <div class="trade-item">
        <h3>产品说明所需材料</h3>
        <el-table
          :data="fileList2"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="材料名称"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name"
                        v-if="productFileId===scope.row.productFileId"
                        @keyup.enter.native="updateFileName(scope.row, 'product')"></el-input>
                        <!-- @blur="updateFileName(scope.row, 'product')" -->
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileSize"
            label="大小/k"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="filePath"
            label="附件"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <a class="common_btn" size="small" @click="productFileId=scope.row.productFileId">编辑</a>
              <a class="danger_btn" size="small" @click="delfiles(scope.row, 'product')">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: right;">
          <el-upload
            class="upload-demo"
            style="display: inline-block;"
            :headers="headers"
            :action="importFile('product')"
            :on-change="handleChange2"
            :show-file-list="false"
            accept=".pdf">
            <el-button size="small"
                       v-if="!operationDisabled"
                       class="btn-padding add_btn">追加材料</el-button>
          </el-upload>
        </el-row>
      </div>

      <div class="trade-item">
        <h3>产品公告</h3>
        <el-table
          :data="fileList3"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="材料名称"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name"
                        v-if="productFileId===scope.row.productFileId"
                        @keyup.enter.native="updateFileName(scope.row, 'announcement')"></el-input>
                        <!-- @blur="updateFileName(scope.row, 'announcement')" -->
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileSize"
            label="大小/k"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="filePath"
            label="附件"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <a class="common_btn" size="small" @click="productFileId=scope.row.productFileId">编辑</a>
              <a class="danger_btn" size="small" @click="delfiles(scope.row, 'announcement')">删除</a>
            </template>
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
            accept=".pdf">
            <el-button size="small"
                       v-if="!operationDisabled"
                       class="btn-padding add_btn">追加材料</el-button>
          </el-upload>
        </el-row>
      </div>

      <div class="split-line" style="margin: 20px 0;"></div>

      <el-form :rules="rules2" ref="form2" label-width="120px">
        <div class="group-item">
          <h3>产品预约审核条件（不选择，代表不需要审核，可多选）</h3>
          <el-row>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked1" :disabled="operationDisabled">
                <span style="width: 110px; display: inline-block">预约总额度满</span>
                <el-input v-model="form2.appointAmountPercent" :disabled="!checked1" style="width: 100px;"></el-input> %，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked2" :disabled="operationDisabled">
                <span style="width: 110px; display: inline-block">预约人数满</span>
                <el-input v-model="form2.appointNums" :disabled="!checked2" style="width: 100px;"></el-input> 人，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked3" :disabled="operationDisabled">
                <span style="width: 110px; display: inline-block">单笔打款金额大于</span>
                <el-input v-model="form2.onceAppointGt" :disabled="!checked3" style="width: 100px;"></el-input> 万，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked4" :disabled="operationDisabled">
                <span style="width: 110px; display: inline-block">单笔打款金额小于</span>
                <el-input v-model="form2.onceAppointLt" :disabled="!checked4" style="width: 100px;"></el-input> 万，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked5" :disabled="operationDisabled">
                <span style="width: 110px; display: inline-block">打款金额满</span>
                <el-input v-model="form2.remitAmountsPercent" :disabled="!checked5" style="width: 100px;"></el-input> %，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <!-- <el-form-item label="预约时效" prop="timeliness" style="padding-left: 71px"> -->
              <span style="width: 135px; display: inline-block; text-align: right">预约时效</span>
              <el-input style="width: 100px;"
                        :disabled="operationDisabled"
                        v-model="form2.timeliness"></el-input> 小时
              <!-- </el-form-item> -->
            </el-col>
          </el-row>
        </div>

        <div class="group-item">
          <h3>是否标注重点产品</h3>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="keyProduct" label="是否标注重点产品" style="white-space: nowrap;" :rules="keyProRules">
                <el-radio-group v-model="radio2" @change="test">
                <!-- <el-radio-group v-model="form2.keyProduct" :disabled="operationDisabled" @change="test"> -->
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="2">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-show="radio2===2">
              <el-form-item label="重点产品时间段">
                <el-date-picker
                  style="width: 80%"
                  v-model="importantDate"
                  :disabled="operationDisabled"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="group-item">
          <h3>非活动时间段</h3>
          <el-row style="position: relative">
            <el-col :span="11">
              <el-form-item label="业绩系数" prop="performance">
                <el-input style="width: 300px"
                          :disabled="operationDisabled"
                          v-model="normalData.performanceCoefficient"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="white-space: nowrap"
                    v-for="item in normalList1" :key="item.age">
              <el-form-item :label="`佣金系数（第${item.age}年）`">
                <el-input style="width: 300px"
                  :disabled="operationDisabled"
                  v-model="item.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
            <i class="el-icon-plus"
              v-if="!operationDisabled"
              @click="addCommission"
              style="position: absolute; right: 180px; top: 10px;"></i>
          </el-row>
          <el-row v-if="addNormList">
            <el-col :span="11" v-for="item in addNormList" :key="item.idx" style="white-space: nowrap">
              <el-form-item :label="`佣金系数（第${item.age}年）`">
                <el-input style="width: 300px"
                  :disabled="operationDisabled"
                  v-model="item.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="group-item" style="position: relative">
          <h3>活动时间段</h3>
          <el-row v-for="item in activityData" :key="item.idx">
            <el-col :span="11">
              <el-form-item label="活动时间">
                <el-date-picker
                  style="width: 300px"
                  v-model="item.activeDate"
                  :disabled="operationDisabled"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="业绩系数">
                <el-input style="width: 300px"
                  :disabled="operationDisabled"
                  v-model="item.performanceCoefficient"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="佣金系数">
                <el-input style="width: 300px"
                          :disabled="operationDisabled"
                          v-model="item.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <i class="el-icon-plus"
            v-if="!operationDisabled"
            @click="addActivity"
            style="position: absolute; top: 50px; right: 180px"></i>
          <el-row v-for="item in addActivityList" :key="item.idx" v-if="addActivityList">
            <el-col :span="11">
              <el-form-item label="活动时间">
                <el-date-picker
                  style="width: 300px"
                  v-model="item.activeDate"
                  :disabled="operationDisabled"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="业绩系数">
                <el-input style="width: 300px"
                          :disabled="operationDisabled"
                          v-model="item.performanceCoefficient"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="佣金系数">
                <el-input style="width: 300px"
                          :disabled="operationDisabled"
                          v-model="item.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

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
                  <div class="title">预约金额</div>
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
        <el-button @click="handleAppoint('1')" class="sec_btn" label="2">打款成功人数</el-button>
        <a class="filter-item add_btn"
          style="margin-left: 10px; padding: 10px; border-radius: 5px; float: right;"
          :href="batchExport()" type="primary">
          <svg-icon icon-class="add"></svg-icon> 批量导出</a>
      </div>
      <!-- <div style="text-align: right">
        <a class="filter-item add_btn"
          style="margin-left: 10px; padding: 10px; border-radius: 5px;"
          :href="batchExport()" type="primary">
          <svg-icon icon-class="add"></svg-icon> 批量导出</a>
      </div> -->
      <transc-table-component
        :productCollect="true"
        :productNameCol="false"
        :clientNoCol="true"
        :clientGenderCol="true"
        :paymentCol="true"
        :clientMobileCol="true"
        :cityCol="true"
        :transcStatus="true">
      </transc-table-component>
    </div>

    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <span class="stage_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===2" @click="handleCollect('0')">
        <svg-icon icon-class="stage"></svg-icon> 产品分期</span>
      <span class="stage_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===2" @click="handleCollect('1')">
        <svg-icon icon-class="stage"></svg-icon> 募集分期</span>
      <!-- 创建 -->
      <el-button class="search_btn" v-if="dialogStatus=='create'&allDisabled" @click="cancel()">取 消</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='create'&step===1" type="primary" @click="create('form')">保 存</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='create'&step===2" type="primary" @click="updateRouter">保 存</el-button>
      <!-- 编辑 -->
      <el-button class="search_btn" v-if="dialogStatus=='update'&step===1&allDisabled" @click="cancel()">取 消</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===1&allDisabled" type="primary" @click="update('form1')">保 存</el-button>
      <el-button class="search_btn" v-if="dialogStatus=='update'&step===2&allDisabled&someDisabled" @click="cancel()">取 消</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&allDisabled&someDisabled" type="primary" @click="updateRouter">保 存</el-button>
      <!-- 在建 -->
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===0" type="primary" @click="updateProductType(1, '/product/building')">
        <svg-icon icon-class="preheating"></svg-icon> 进入产品预热</el-button>
      <!-- 预热 -->
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===1" type="primary" @click="updateProductType(2, '/product/preheating')">
        <svg-icon icon-class="collecting"></svg-icon> 进入产品募集</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===1" type="primary" @click="updateProductType(0, '/product/preheating')">
        <svg-icon icon-class="return"></svg-icon> 返回在建</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===1" type="primary" @click="updateProductDisplay">
        <svg-icon v-if="form.isDisplay==='1'" icon-class="eye"></svg-icon> 
        <svg-icon v-else icon-class="product_eye"></svg-icon> 
        {{form.isDisplay==='1'?'设为隐藏':'设为显示'}}</el-button>
      <!--{{form.isDisplay==='1'?'设为显示':'设为隐藏'}}</el-button>-->
      <!-- 募集中 -->
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===2" type="primary" @click="updateProductType(3, '/product/collecting')">
        <svg-icon icon-class="close"></svg-icon> 进入已关账</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===2" type="primary" @click="updateProductPause">
        <svg-icon v-if="form.isPause==='1'" icon-class="play"></svg-icon> 
        <svg-icon v-else icon-class="pause"></svg-icon> 
        {{form.isPause==='1'?'开始预约':'暂停预约'}}
      </el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===2" type="primary" @click="updateProductDisplay">
        <svg-icon v-if="form.isDisplay==='1'" icon-class="eye"></svg-icon> 
        <svg-icon v-else icon-class="eyeShow"></svg-icon> 
        {{form.isDisplay==='1'?'设为隐藏':'设为显示'}}
        <!--{{form.isDisplay==='1'?'设为显示':'设为隐藏'}}-->
      </el-button>
      <!-- 已关账 -->
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===3" type="primary" @click="updateProductType(4, '/product/shutDown')">
        <svg-icon icon-class="establish"></svg-icon> 进入已成立</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===3" type="primary" @click="updateProductType(2, '/product/shutDown')">
        <svg-icon icon-class="return"></svg-icon> 返回募集中</el-button>
      <!-- 已成立 -->
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===4" type="primary" @click="updateProductType(5, '/product/established')">
        <svg-icon icon-class="shutDown"></svg-icon> 进入兑付中</el-button>
      <!-- 兑付中 -->
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2&productStatusNo===5" type="primary" @click="updateProductType(6, '/product/cashing')">
        <svg-icon icon-class="shutDown"></svg-icon> 进入兑付完成</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogComVisible"
      width="30%">
      <div style="margin-bottom: 30px;">请选择新增材料</div>
      <el-select v-model="clientFile"
        clearable
        placeholder="请选择"
        style="margin-bottom: 30px;"
        @change="changeFileList">
        <el-option
          v-for="item in clientFileList"
          :key="item.productClientFileManageId||item.transactionFileManageId"
          :label="item.fileName||item.name"
          :value="item.productClientFileManageId||item.transactionFileManageId">
        </el-option>
      </el-select>
      <div class="dialog-footer text-right">
        <el-button @click="dialogComVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseClientFile">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import productDetail from './product/pdcDetail'
  import transcTableComponent from 'components/table/transcTable'
  import { fetchList, getObj, addObj, putObj, delObj, getAppointList,
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
  // const fileDownload = require('js-file-download')

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
      productDetail
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
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
            {
              required: true,
              trigger: 'blur, change',
              message: '请标注产品'
            }
          ]
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
          // productCode: [
          //   {
          //     required: true,
          //     message: '请输入产品编号',
          //     trigger: 'blur'
          //   }
          // ],
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
          // isFloat: [
          //   {
          //     required: true,
          //     message: '请选择收益',
          //     trigger: 'change'
          //   }
          // ],
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
        dialogStatus: 'create',
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
        productTypes: [],
        currencyList: [], //
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
        ada_url: {},
        url: '',
        fileType: '',
        createStatus: 'create',
        selectFile: null,
        radio2: 1,
        productId: ''
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
      this.uploadData.productId = this.$route.params.id
      this.productId = this.$route.params.id
      if(this.uploadData.productId) {
        // console.log('this.createStatus')
        this.createStatus = 'update'
      }
      fetchProductTypeList().then(res => { // 获取产品类型
        this.productTypes = res.data
        getObjList().then(response => { // 获取币种
          this.currencyList = response.data
          this.form.currencyId = 1
          this.getList()
        })
      })
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    mounted() {
      var vm = this
      Bus.$on('activeRouter', activeRouter => {
        vm.ada_url.z = activeRouter
        // this.newUrl(url)
        // vm.$set(vm.ada_url, 'z', activeRouter)
      })
    },
    // watch: {
    //   url(curVal, oldVal) {
    //     console.log('curVal: ' + curVal, 'oldVal: ' + oldVal)
    //   }
    // },
    methods: {
      // newUrl(url) {
      //   this.url = url
      //   console.log('this.url1: ' + this.url)
      // },
      getList() {
        this.listQuery.productId = this.$route.params.id
        // if(!this.uploadData.productId) this.nextToUpdate = false
        fetchProductTypeList().then(res => { // 获取产品类型
          this.productTypes = res.data
        })
        getObjList().then(response => { // 获取币种
          this.currencyList = response.data
          this.form.currencyId = 1
        })
        if(this.uploadData.productId) { // 查询产品详情
          getObj(this.uploadData.productId)
          .then(response => {
            this.stepStatus = 'update'
            this.form = response.data
            // this.nextToUpdate = true
            // this.dialogFormVisible = true
            this.dialogStatus = 'update'
            if(this.form.isFloat === 0) {
              this.form.annualizedReturn = null
              this.isDisabled = true
            } else {
              this.isDisabled = false
            }
            this.productStatusNo = this.form.productStatus
            // fetchProductTypeList().then(res => { // 获取产品类型
            //   this.productTypes = res.data
            // })
            // getObjList().then(response => { // 获取币种
            //   this.currencyList = response.data
            //   // this.form.currencyId = 1
            // })
            this.form.currencyIdNo = this.form.currencyId
            this.form.productTypeIdNo = this.form.productTypeId
            this.form.investmentHorizonUnitNo = this.form.investmentHorizonUnit
            this.form.productTypeId = transformText(this.productTypes, this.form.productTypeId)
            this.form.currencyId = transformText(this.currencyList, this.form.currencyId)
            this.form.investmentHorizonUnit = transformText(this.investHorizonUnit, this.form.investmentHorizonUnit)
            this.form.productStatus = transformText(this.productStatus, this.form.productStatus)
            if(this.productStatusNo === 6) {
              this.shortNameDisabled = true
            }
            if(this.productStatusNo === 4||this.productStatusNo === 5||this.productStatusNo === 6) {
              this.collectDisabled = true
            }
            if(this.productStatusNo === 4) {
              // this.closeDateDisabled = false
              this.someDisabled = false
            }
            if(this.productStatusNo === 2) {
              this.closeDateDisabled = false
            }
            if(this.productStatusNo === 5) {
              this.establishedDisabled = false
              this.someDisabled = false
            }
            if(this.productStatusNo === 5||this.productStatusNo === 6) {
              this.valueDateDisabled = true
            }
            if(this.productStatusNo === 6) {
              this.allDisabled = false
            }
          })
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
                // this.nextToUpdate = true
                // this.getList()
                if(response.status === 200) {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.uploadData.productId = response.data.productId
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
                this.uploadData.productId = this.form.productId
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
              putObj(this.uploadData.productId, this.form).then(res => {
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
        this.form2.productId = this.uploadData.productId
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
      updateProductType(status, url) {
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
        updProductType(this.uploadData.productId, params).then(res => {
          this.$notify({
            title: '成功',
            message: '产品进入' + msgText + '成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: url})
        })
      },
      updateProductPause() {
        let pause = this.form.isPause === '0' ? '1' : '0'
        let params = {
          pause: pause
        }
        // console.log('跳转地址： ' + this.url)
        updProductPause(this.uploadData.productId, params).then(res => {
          console.log(res)
          this.form.isPause = pause
          // this.getOperations()
        })
      },
      updateProductDisplay() {
        let display = this.form.isDisplay === '0' ? '1' : '0'
        let params = {
          display: display
        }
        updProductDisplay(this.uploadData.productId, params).then(res => {
          console.log(res)
          this.form.isDisplay = display
          // this.getOperations()
        })
      },
      resetTemp() {
        this.form = {
          id: undefined,
          username: '',
          password: ''
        }
      },
      getAllFiles(productId) {
        if(!productId) return null
        this.getFiles1(productId)
        this.getFiles2(productId)
        this.getFiles3(productId)
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
      getFiles3(productId) {
        let uploadData = {
          productId: productId,
          fileType: 'announcement'
        }
        getFiles(uploadData).then(response => {
          this.fileList3 = response.data || []
        })
      },
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
      handleChange(file, fileList) {
        this.uploadData.fileType = 'transc'
        getFiles(this.uploadData).then(response => {
          this.fileList1 = response.data
        })
      },
      handleChange1(file, fileList) { // 上传材料，列表展示
        // this.fileList1 = fileList.slice(-3)
        this.uploadData.fileType = 'client'
        // debugger
        getFiles(this.uploadData).then(response => {
          // console.log('上传1')
          // console.log(response.data)
          this.clientFiles = response.data
        })
      },
      delfiles(item, type) { // 删除材料
        let productFileType = type
        let id = this.uploadData.productId
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
            } else if(productFileType === 'announcement') {
              this.getFiles3(id)
            }
          }
        })
      },
      delCustFile(item) { // 删除上传客户材料
        delCustFile(item.productClientFileId).then(res => {
          if(res.status === 200) {
            this.getFiles4(this.uploadData.productId)
          }
        })
      },
      updateFileName(item, fileType) { // 编辑材料名称
        let params = {
          id: item.productFileId,
          name: item.name,
          fileType: fileType
        }
        putFileObj(params).then(res => {
          this.productFileId = 0
          this.$notify({
            title: '成功',
            message: '材料名称修改成功',
            type: 'success',
            duration: 2000
          })
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
      handleChange3(file, fileList) { // 上传材料，列表展示
        // this.fileList3 = fileList.slice(-3)
        this.uploadData.fileType = 'announcement'
        getFiles(this.uploadData).then(response => {
          this.fileList3 = response.data
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
      addClientFile(type) { // 上传客户材料
        let params = {
          limit: 100,
          page: 1
        }
        this.fileType = type
        this.clientFile = ''
        if (type === 'client') {
          getClientFile(params).then(res => {
            this.clientFileList = res.data.records
            this.dialogComVisible = true
          })
        } else {
          getTranscFile(params).then(res => {
            this.clientFileList = res.data.records
            this.dialogComVisible = true
          })
        }
      },
      changeCurrency(val) {
        this.currencyList = this.currencyList.slice(0)
      },
      changeStep(val) { // 切换tab
        this.step = val - 0
        if(this.step === 2) {
          this.getOperations()
        } else if (this.step === 3) {
          getBriefReport(this.uploadData.productId).then(res => {
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
            productId: this.uploadData.productId
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
            productId: this.uploadData.productId - 0
          }
          console.log('transaction吗')
          postTranscFile(params).then(res => {
            console.log(res)
            this.getFiles1(params.productId)
          })
        }
      },
      handleCollect(type) {
        this.stageType = type // 0 产品分期； 1 募集分期
        getProductStage(this.uploadData.productId, type).then(res => {
          console.log(res)
          this.step = 1
          this.stage = true
          this.form = res.data
          // console.log(this.stage)
          this.form.currencyIdNo = this.form.currencyId
          this.form.productTypeIdNo = this.form.productTypeId
          this.form.investmentHorizonUnitNo = this.form.investmentHorizonUnit
          this.form.productTypeId = transformText(this.productTypes, this.form.productTypeId)
          this.form.currencyId = transformText(this.currencyList, this.form.currencyId)
          this.form.investmentHorizonUnit = transformText(this.investHorizonUnit, this.form.investmentHorizonUnit)
          // this.form.productCode = this.form.productCode + '-01'
        })
      },
      handleAppoint(type) {
        this.listQuery.type = type
        Bus.$emit('queryAppoints', this.listQuery)
      },
      getOperations() { // 获取操作指南信息
        this.getAllFiles(this.uploadData.productId)
        fetchOperation(this.uploadData.productId).then(res => {
          this.form2 = res.data
          this.form2.normalDTO = res.data.normalDTO || {}
          this.activityData = res.data.activityDTO || []
          if(this.form2.importantStart || this.form2.importantEnd) {
            console.log('keyProduct: ' + this.radio2)
            this.radio2 = 2
          } else {
            this.radio2 = 1
          }
          this.importantDate = [this.form2.importantStart, this.form2.importantEnd]
          this.normalData = this.form2.normalDTO
          this.normalList = this.form2.normalDTO.normalBrokerageCoefficients
          if(!this.normalList) {
            this.normalList = [{
              age: '1'
            }]
          }
          let list = this.normalList1
          this.cmsIndex = list[list.length - 1].age
          if(!this.activityData.length) {
            this.activityData = [{
              activeDate: [],
              performanceCoefficient: ''
            }]
          } else {
            this.activityData.forEach(item => {
              item.activeDate = []
              item.activeDate[0] = item.activityStart
              item.activeDate[1] = item.activityEnd
            })
          }
          // console.log(res)
          // 判断产品预约审核条件是否禁用
          // if(!this.form2.importantEnd) {
          //   this.form2.keyProduct = 1
          // }
          if(this.form2.appointAmountPercent) {
            this.checked1 = true
          }
          if(this.form2.appointNums) {
            this.checked2 = true
          }
          if(this.form2.onceAppointGt) {
            this.checked3 = true
          }
          if(this.form2.onceAppointLt) {
            this.checked4 = true
          }
          if(this.form2.remitAmountsPercent) {
            this.checked5 = true
          }
          // 不同产品状态可编辑项
          if(this.productStatusNo === 4||this.productStatusNo === 5||this.productStatusNo === 6) {
            this.operationDisabled = true
          }
        })
      },
      batchExport() {
        let type = this.listQuery.type
        let id = this.uploadData.productId
        return 'http://10.9.70.62:9999/product/products/' + id + '/export/' + type
        // batchExportProduct(id, type, {responseType: 'arraybuffer'}).then(res => {
        // this.url =
        // console.log(res)
        // let blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
        // let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        // let fileName = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0]
        // fileDownload(res.data, 'test.xls')
        // console.log(fileDownload(res.data,'fileName'))
        // })
      },
      test(val) {
        console.log(val)
        if(val === 1) {
          this.importantDate = []
        }
        // this.form2.keyProduct = val
      },
      changeFileList(val) {
        // console.log(val)
        // this.clientFileList = this.clientFileList.slice(0)
        let obj = {}
        obj = this.clientFileList.find(item => {
          let id = item.productClientFileManageId || item.transactionFileManageId
          return id === val
        })
        this.selectFile = obj
        console.log(this.clientFile)
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
            span {
              font-size: 30px;
              vertical-align: text-top;
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

