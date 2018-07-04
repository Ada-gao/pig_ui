<template>
  <div class="app-container calendar-list-container pro-detail-radio">

    <div v-if="uploadData.productId">
      <el-radio-group v-model="step" @change="changeStep" style="margin-bottom: 30px;">
        <el-radio-button label="1">产品详情</el-radio-button>
        <el-radio-button label="2">产品操作指南</el-radio-button>
      </el-radio-group>
    </div>
    <div v-else class="tabs">
      <div class="tab-item tab-active" @click="step=1">产品详情
        <b class="right"><i class="right-arrow1"></i><i class="right-arrow2"></i></b>
      </div>
      <div class="tab-item" @click="step=2">产品操作指南
        <b class="right"><i class="right-arrow1"></i><i class="right-arrow2"></i></b>
      </div>
    </div>

    <div class="pageTitle">
      <h3 v-if="uploadData.productId">修改产品</h3>
      <h3 v-else>新增产品</h3>
      <!-- <el-button v-if="sys_user_add & step === 1" class="add_btn">新增字段属性</el-button> -->
    </div>
    
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 20px;"></div>

    <el-form :model="form" :rules="rules" ref="form" label-width="100px" v-if="step===1&productStatusNo===0">
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
          <el-form-item label="产品编号" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入产品编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品类型" prop="productTypeId">
            <el-select class="filter-item" v-model="form.productTypeId" placeholder="请选择">
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
            <el-select class="filter-item" v-model="form.productRiskLevel" placeholder="请选择">
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
            <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      
        <el-col :span="11">
          <el-form-item label="募集额度" prop="collectionAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.collectionAmount" :maxlength="10" placeholder="请输入"></el-input><span>万</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="净值" prop="netValue">
            <el-input type="number" v-model="form.netValue" :maxlength="5" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      
        <el-col :span="11">
          <el-form-item label="起投金额" prop="minimalAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAmount" :maxlength="10" placeholder="请输入起投金额"></el-input><span>万</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="追加金额" prop="minimalAddAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAddAmount" :maxlength="10"></el-input><span>万</span>
          </el-form-item>
        </el-col>
      
        <el-col :span="11">
          <el-form-item label="产品期限" prop="investmentHorizon">
            <el-input type="number" v-model.number="form.investmentHorizon" style="width: 75%;"></el-input>
            <el-select v-model="form.ym" style="width: 20%;">
              <el-option v-for="item in dateWay" :key="item.value" :value="item.value" :label="item.label">
                <!-- <span style="float: left">{{ item.label }}</span> -->
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品过往业绩" prop="historyPerformance">
            <el-input v-model="form.historyPerformance" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <!-- <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" > -->
          <el-form-item label="产品状态" v-if="dialogStatus == 'update' " prop="productStatus" >
            <el-select class="filter-item" v-model="form.productStatus" placeholder="请选择">
              <el-option v-for="item in productStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
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
          <el-form-item label="支行">
            <el-input v-model="form.subBranchName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资产团队">
            <el-input v-model="form.assetTeam" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="打款账号">
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
              v-model="form.incomeDistribution">
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
    </el-form>

    <el-form :model="form" label-width="100px" v-if="step===1&productStatusNo!==0">
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="产品全称" prop="productName">
            <el-input v-model="form.productName" placeholder="请输入产品名称" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品简称" prop="productShortName">
            <el-input v-model="form.productShortName" placeholder="请输入产品名称" readonly=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品编号" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入产品编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品类型" prop="productTypeId">
            <el-input v-model="form.productTypeId" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="募集人数" prop="productLp">
            <el-input v-model.number="form.productLp" placeholder="请输入" readonly=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" style="white-space: nowrap">
          <el-form-item label="产品风险级别" prop="productRiskLevel">
            <el-input v-model="form.productRiskLevel" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="基金管理人" prop="manager">
            <el-input v-model="form.manager" placeholder="请输入" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="交易币种" prop="currencyId">
            <el-input v-model="form.currencyId" placeholder="" readonly></el-input>
            <!-- <el-select class="filter-item" v-model="form.currencyId" placeholder="请选择" @change="changeCurrency">
              <el-option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId" :label="item.name">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      
        <el-col :span="11">
          <el-form-item label="募集额度" prop="collectionAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.collectionAmount" :maxlength="10" placeholder="请输入" readonly=""></el-input><span>万</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="净值" prop="netValue">
            <el-input type="number" v-model="form.netValue" :maxlength="5" placeholder="请输入" readonly></el-input>
          </el-form-item>
        </el-col>
      
        <el-col :span="11">
          <el-form-item label="起投金额" prop="minimalAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAmount" :maxlength="10" placeholder="请输入起投金额" readonly></el-input><span>万</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="追加金额" prop="minimalAddAmount" style="white-space: nowrap">
            <el-input type="number" v-model.number="form.minimalAddAmount" :maxlength="10" readonly></el-input><span>万</span>
          </el-form-item>
        </el-col>
      
        <el-col :span="11">
          <el-form-item label="产品期限" prop="investmentHorizon">
            <el-input type="number" v-model.number="form.investmentHorizon" style="width: 75%;" readonly></el-input>
            <el-select v-model="form.ym" style="width: 20%;">
              <el-option v-for="item in dateWay" :key="item.value" :value="item.value" :label="item.label">
                <!-- <span style="float: left">{{ item.label }}</span> -->
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品过往业绩" prop="historyPerformance">
            <el-input v-model="form.historyPerformance" placeholder="请输入" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <!-- <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" > -->
          <el-form-item label="产品状态" v-if="dialogStatus == 'update' " prop="productStatus" >
            <el-select class="filter-item" v-model="form.productStatus" placeholder="请选择">
              <el-option v-for="item in productStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col>
          <el-form-item label="收益" prop="isFloat">
            <el-radio-group v-model="form.isFloat" @change="radioChange">
              <el-radio :label="0" style="display: inline-block">浮动收益率</el-radio>
              <el-radio :label="1" style="display: inline-block">收益对标基准</el-radio>
              <el-input style="display: inline-block; width: 100px; margin-left: 20px;" v-show="!isDisabled" required="!isDisabled" v-model="form.annualizedReturn" readonly></el-input>
              <span style="display: inline-block" v-show="!isDisabled">%月</span>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
        </el-col>
      </el-row>
      <el-row :gutter="90">
        <el-col :span="11">
          <el-form-item label="开户银行" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入" readonly></el-input>
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
          <el-form-item label="支行">
            <el-input v-model="form.subBranchName" placeholder="请输入" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资产团队">
            <el-input v-model="form.assetTeam" placeholder="请输入" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="打款账号">
            <el-input v-model.number="form.cardNo" placeholder="请输入" readonly></el-input>
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
              v-model="form.incomeDistribution">
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
    </el-form>

    <div class="upfile-group" v-if="step === 2">
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
                @blur="updateFileName(scope.row, 'transaction')"></el-input>
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
            prop="uid"
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
          <el-upload
            class="upload-demo"
            style="display: inline-block;"
            :headers="headers"
            :action="importFile('transaction')"
            :on-change="handleChange1"
            :show-file-list="false"
            accept=".pdf, .doc">
            <el-button size="small" class="btn-padding add_btn">追加材料</el-button>
          </el-upload>
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
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fileName"
                v-if="productFileId===scope.row.productClientFileManageId"
                @blur="updateClientFileName(scope.row)"></el-input>
              <span v-else>{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileSize"
            label="大小/k"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="uid"
            label="附件"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <a class="common_btn" size="small" @click="productFileId=scope.row.productClientFileManageId">编辑</a>
              <a class="danger_btn" size="small" @click="delCustFile(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: right;">
          <el-button size="small"
            class="btn-padding add_btn"
            @click="addClientFile">追加材料</el-button>
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
                @blur="updateFileName(scope.row, 'product')"></el-input>
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
            prop="uid"
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
            :on-error="uploadError2"
            :on-change="handleChange2"
            :show-file-list="false"
            accept=".pdf, .doc">
            <el-button size="small" class="btn-padding add_btn">追加材料</el-button>
          </el-upload>
        </el-row>
      </div>

      <div class="trade-item">
        <h3>产品公告</h3>
        <el-table
          :data="fileList3"
          border
          style="width: 100%">
          <!-- <el-table-column
            type="selection"
            width="180">
          </el-table-column> -->
          <el-table-column
            prop="name"
            label="材料名称"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name"
                v-if="productFileId===scope.row.productFileId"
                @blur="updateFileName(scope.row, 'announcement')"></el-input>
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
            prop="uid"
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
            accept=".pdf, .doc">
            <el-button size="small" class="btn-padding add_btn">追加材料</el-button>
          </el-upload>
        </el-row>
      </div>
  
      <div style="border-bottom: 1px solid #ccc; margin: 20px 0;"></div>

      <el-form :rules="rules2" label-width="120px">
        <div class="group-item">
          <h3>产品预约审核条件（不选择，代表不需要审核，可多选）</h3>
          <el-row>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked1">
                <span style="width: 120px; display: inline-block">预约总额度</span>
                <el-input v-model="form2.appointAmountPercent" :disabled="checked1===0" style="width: 100px;"></el-input> %，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked2">
                <span style="width: 120px; display: inline-block">预约人数满</span>
                <el-input v-model="form2.appointNums" :disabled="checked2===0" style="width: 100px;"></el-input> 人，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked3">
                <span style="width: 120px; display: inline-block">单笔打款金额大于</span>
                <el-input v-model="form2.onceAppointGt" :disabled="checked3===0" style="width: 100px;"></el-input> 万，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked4">
                <span style="width: 120px; display: inline-block">单笔打款金额小于</span>
                <el-input v-model="form2.onceAppointLt" :disabled="checked4===0" style="width: 100px;"></el-input> 万，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <el-checkbox v-model="checked5">
                <span style="width: 120px; display: inline-block">打款金额满</span>
                <el-input v-model="form2.remitAmountsPercent" :disabled="checked5===0" style="width: 100px;"></el-input> %，进入人工审核
              </el-checkbox>
            </el-col>
            <el-col :md="12" :lg="8" style="margin-bottom: 10px">
              <!-- <el-form-item label="预约时效" prop="timeliness" style="padding-left: 71px"> -->
                <span style="width: 145px; display: inline-block; text-align: right">预约时效</span>
                <el-input style="width: 100px;" v-model="form2.timeliness"></el-input> 小时
              <!-- </el-form-item> -->
            </el-col>
          </el-row>
        </div>

        <div class="group-item">
          <h3>是否标注重点产品</h3>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="keyProduct" label="是否标注重点产品" style="white-space: nowrap;">
                <el-radio-group v-model="form.keyProduct">
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="2">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-show="form.keyProduct === 2">
              <el-form-item label="重点产品时间段">
                <el-date-picker
                  style="width: 80%"
                  v-model="importantDate"
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
          <el-row>
            <el-col :span="11">
              <el-form-item label="业绩系数" prop="performance">
                <el-input style="width: 300px" v-model="normalData.performanceCoefficient"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="white-space: nowrap">
              <el-form-item :label="`佣金系数（第${normalList[0].age}年）`">
                <el-input style="width: 300px" v-model="normalList[0].brokerageCoefficient"></el-input>
                <i class="el-icon-plus" @click="addCommission"></i>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="item in addNormList" :key="item.idx" v-if="addNormList">
            <el-col :span="11" :offset="11" style="white-space: nowrap">
              <el-form-item :label="`佣金系数（第${cmsIndex}年）`">
                <el-input style="width: 300px" v-model="item.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="group-item">
          <h3>活动时间段</h3>
          <el-row>
            <el-col :span="11">
              <el-form-item label="活动时间">
                <el-date-picker
                  style="width: 300px"
                  v-model="activityData.activeDate"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="业绩系数">
                <el-input style="width: 300px" v-model="activityData.performanceCoefficient"></el-input>
                <i class="el-icon-plus" @click="addActivity"></i>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="佣金系数">
                <el-input style="width: 300px" v-model="activityData.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="item in addActivityList" :key="item.idx" v-if="addActivityList">
            <el-col :span="11">
              <el-form-item label="活动时间">
                <el-date-picker
                  style="width: 300px"
                  v-model="item.activeDate"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="业绩系数">
                <el-input style="width: 300px" v-model="item.performanceCoefficient"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="佣金系数">
                <el-input style="width: 300px" v-model="item.brokerageCoefficient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button class="search_btn" @click="cancel()">取 消</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='create'&step===1" type="primary" @click="create('form')">保 存</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='create'&step===2" type="primary" @click="createRouter">保 存</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===1" type="primary" @click="update('form')">保 存</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='update'&step===2" type="primary" @click="updateRouter('form')">保 存</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogComVisible"
      width="30%">
      <div style="margin-bottom: 30px;">确认执行此操作吗？</div>
      <el-select v-model="clientFile"
        clearable
        @change="test"
        placeholder="请选择"
        style="margin-bottom: 30px;">
        <el-option
          v-for="item in clientFileList"
          :key="item.productClientFileManageId"
          :label="item.fileName"
          :value="item">
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
  import { fetchList, getObj, addObj, putObj, delObj, 
    addOperationObj, putFileObj, delCustFile, getCustFile, addCustFile, updCustFile } from '@/api/product/product'
  import { getClientFile } from '@/api/product/fileManage'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { decimals, isNumber } from '@/utils/validate'
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
          deptId: undefined,
          ym: 1
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
          productCode: [
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
        clientFiles: [],
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
        productStatusNo: '',
        dateWay: [
          {
            value: 0,
            label: '年'
          },{
            value: 1,
            label: '月'
          }
        ],
        elDate: {
          inputStyle: 'number',
          model: 'product_name',
          text: '产品名称'
        },
        step: 1,
        // checked: 0,
        importantDate: [],
        activeDate: [],
        checked1: 0,
        checked2: 0,
        checked3: 0,
        checked4: 0,
        checked5: 0,
        form2: {
          activityDTO: [],
          normalDTO: {
            normalBrokerageCoefficients: []
          }
        },
        normalList: [{
          age: 1,
          brokerageCoefficient: ''
        }],
        addNormList: [],
        cmsIndex: 1,
        normalData: {},
        activityData: {},
        addActivityList: [],
        activityList: [],
        brokerageCoefficient: '',
        productFileId: 0,
        clientFileList: [],
        dialogComVisible: false,
        clientFile: ''
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
      // this.cmsIndex = this.form2.cmsIndex
      let list = this.normalList
      this.cmsIndex = list[list.length - 1].age
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
          this.form.currencyId = 1
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
            this.productStatusNo = this.form.productStatus
            this.form.productStatus = transformText(this.productStatus, this.form.productStatus)
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
        this.step = 2
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
                this.step = 2
              })
          } else {
            return false
          }
        })
      },
      addCommission() {
        // if(this.addNormList.length & !this.addNormList[this.addNormList.length - 1].brokerageCoefficient) return ''
        this.cmsIndex++
        this.addNormList.push({
          age: this.cmsIndex,
          brokerageCoefficient: ''
        })
        console.log(this.addNormList)
        console.log(this.normalList)
        this.normalList = this.normalList.concat(this.addNormList)
        console.log(this.normalList)
      },
      addActivity() {
        // this.cmsIndex++
        // if(!this.addActivityList[this.addActivityList - 1].brokerageCoefficient) return ''
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
      update(formName) { // 修改提交
        const set = this.$refs
        this.step = 2
        // set[formName].validate(valid => {
        //   if (valid) {
        //     let productId = this.form.productId
        //     if(!this.form.isFloat) {
        //       this.form.annualizedReturn = null
        //       this.isDisabled = true
        //     }
        //     if(this.form.productStatus.length > 1) {
        //       this.form.productStatus = this.productStatusNo
        //     }
        //     putObj(this.form).then(response => {
        //       if(!response.data || response.status === 400) {
        //         return
        //         // this.getList()
        //       }
        //       // this.nextToUpdate = true
        //       this.$notify({
        //         title: '成功',
        //         message: '修改成功',
        //         type: 'success',
        //         duration: 2000
        //       })
        //       this.$router.push({path: '/product/productList'})

        //     })
        //   } else {
        //     return false
        //   }
        // })
      },
      updateRouter(formName) {
        this.activityList.push(this.activityData)
        this.activityList.forEach(item => {
          item.activityEnd = item.activeDate[1]
          item.activityStart = item.activeDate[0]
        })
        this.form2.activityDTO = this.activityList
        this.form2.normalDTO.normalBrokerageCoefficients = this.normalList
        this.form2.normalDTO.performanceCoefficient = this.normalData.performanceCoefficient
        this.form2.productId = this.form.productId
        addOperationObj(this.form2).then(res => {
          console.log(res)
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
        this.getFiles1(productId)
        this.getFiles2(productId)
        this.getFiles3(productId)
        this.getFiles4(productId)
      },
      getFiles1(productId) {
        let uploadData = {
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
          this.fileList1 = response.data || []
        })
      },
      getFiles3(productId) {
        let uploadData = {
          productId: productId,
          fileType: 'announcement'
        }
        getFiles(uploadData).then(response => {
          this.fileList1 = response.data || []
        })
      },
      getFiles4(productId) {
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
      handleChange1(file, fileList) { // 上传材料，列表展示
        // this.fileList1 = fileList.slice(-3)
        this.uploadData.fileType = 'transaction'
        // debugger
        getFiles(this.uploadData).then(response => {
          // console.log('上传1')
          // console.log(response.data)
          this.fileList1 = response.data
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
      addClientFile() {
        getClientFile().then(res => {
          this.clientFileList = res.data.records
          this.dialogComVisible = true
        })
      },
      changeCurrency(val) {
        this.currencyList = this.currencyList.slice(0)
      },
      changeStep(val) {
        this.step = val - 0
        // console.log(this.step)
      },
      test(val) {
        console.log(val)
        console.log(this.clientFile)
      },
      chooseClientFile() {
        this.dialogComVisible = false
        let params = {
          fileName: this.clientFile.fileName,
          productClientFileManageId: this.clientFile.productClientFileManageId,
          productId: this.uploadData.productId
        }
        addCustFile(params).then(res => {
          this.clientFile = res.data
          this.clientFiles.push(this.clientFile)
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
</style>

