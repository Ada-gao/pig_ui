<template>
  <div class="product-detail">
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
                      @keyup.enter.native="$event.target.blur"
                      @blur="updateFileName(scope.row, 'transaction')"></el-input>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileSize"
          label="文件大小/k"
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
          align="center"
          v-if="!operationDisabled">
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
      </el-row>
    </div>
    <div class="trade-item">
      <h3>客户所需提交材料</h3>
      <div class="second-tab">
        <span class="second-item" @click="changeSecStep('1')" :class="{'query-color': secStep==='1'}">专业投资者</span>
        <span class="second-item" @click="changeSecStep('0')" :class="{'query-color': secStep==='0'}">普通投资者</span>
      </div>
      <product-material-component
        v-show="secStep==='1'"
        :productList="data1"
        :operationEdit="!operationDisabled"
        @del-client-file="deleteClient"
        @upd-client-file="updateClientFile">
      </product-material-component>
      <product-material-component
        v-show="secStep==='0'"
        :productList="data2"
        :operationEdit="!operationDisabled"
        @del-client-file="deleteClient"
        @upd-client-file="updateClientFile">
      </product-material-component>

      <el-row style="text-align: right;">
        <el-button size="small"
          class="btn-padding add_btn"
          v-if="!operationDisabled"
          @click="addClientFile('client', secStep)">追加材料</el-button>
      </el-row>
    </div>
    <div class="trade-item">
      <h3>产品说明材料</h3>
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
                      @keyup.enter.native="$event.target.blur"
                      @blur="updateFileName(scope.row, 'product')"></el-input>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileSize"
          label="文件大小/k"
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
          align="center"
          v-if="!operationDisabled">
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
          :on-success="handleChange2"
          :show-file-list="false"
          accept=".pdf">
          <el-button size="small"
                     v-if="!operationDisabled"
                     class="btn-padding add_btn">追加材料</el-button>
        </el-upload>
      </el-row>
    </div>
    <div class="trade-item">
      <!-- 产品公告 -->
      <h3>投后报告</h3>
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
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileSize"
          label="文件大小/k"
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
          align="center"
          v-if="!operationDisabled">
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
          <el-col :span="5">
            <el-form-item prop="keyProduct" label="是否标注重点产品" style="white-space: nowrap;" :rules="keyProRules">
              <el-radio-group v-model="radio2" :disabled="operationDisabled" @change="test">
                <el-radio :label="1">否</el-radio>
                <el-radio :label="2">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="radio2===2">
            <el-form-item label="重点产品时间段">
              <!--<el-date-picker-->
                <!--style="width: 80%"-->
                <!--v-model="importantDate"-->
                <!--:disabled="operationDisabled"-->
                <!--type="daterange"-->
                <!--start-placeholder="开始日期"-->
                <!--end-placeholder="结束日期"-->
                <!--:default-time="['00:00:00', '23:59:59']">-->
              <!--</el-date-picker>-->
              <el-date-picker
                      style="width: 40%"
                      v-model="importantStart"
                      :disabled="operationDisabled"
                      type="datetime"
                      placeholder="开始日期"
                      :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-date-picker
                style="width: 40%"
                v-model="importantEnd"
                :disabled="operationDisabled"
                type="datetime"
                placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 佣金业绩统计 -->
      <div class="split-line" style="margin: 20px 0;"></div>
      <div class="group-item">
        <h3>佣金业绩统计</h3>
        <el-row style="position: relative">
          <el-col :span="11">
          <el-form :model="normalDTO" ref="normalDTO" :rules="rules2" class="demo-ruleForm">
            <el-form-item label="折标业绩系数" prop="performanceCoefficient" label-width="120px" >
              <span class="el-input" v-if="operationDisabled">{{normalDTO.performanceCoefficient}}</span>
              <el-input  v-model="normalDTO.performanceCoefficient" type="number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )' v-else></el-input>
            </el-form-item>
             </el-form>
          </el-col>
         
        </el-row>
        <el-row>
          <el-col :span="11"  v-for="(item,index) in normalDTO.normalBrokerageCoefficients" :key="item.age" style="white-space: nowrap; margin-right:3%; min-height:114px;" >
            <el-row  type="flex" justify="space-between" class="row-bg product-commission">
              <span style="line-height:41px;">产品佣金系数第{{item.age}}年</span>
             <!--  <span @click="addProductCommission" class="color-0299CC border-0299CC" v-if="index == 0"><i class="el-icon-plus mr5"></i >新增</span> -->
              <el-button class="search_btn" @click="addProductCommission" v-if="index == 0 && !operationDisabled">
                <svg-icon icon-class="add"></svg-icon>新增</el-button>
              <span @click="deleteProductCommission(index)" class="color-0299CC " v-if="index != 0 && index == normalDTO.normalBrokerageCoefficients.length-1&& !operationDisabled"><i class="el-icon-delete mr5"></i >删除</span>
            </el-row>
            
             <el-form :model="Citem" ref="Citem" :rules="rules2" class="demo-ruleForm"  v-for="(Citem,i) in item.brokerageCoefficientDTOList" :key="i" label-width="120px">
              <el-form-item :label="`第${Citem.hierarchy}层级(%)`" prop="coefficient">
                <span class="el-input" v-if="operationDisabled">{{Citem.coefficient}}</span>
                <el-input  v-else v-model="Citem.coefficient" type="number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )'></el-input>
                    <svg-icon icon-class="add" @click="addProductLevel(i)" v-if="i+1 == item.brokerageCoefficientDTOList.length && index == 0 && !operationDisabled" class="color-0299CC"></svg-icon>
                  <i  @click="deleteProductLevel(i)" v-if="i+1 == item.brokerageCoefficientDTOList.length && index == 0 && !operationDisabled" class="el-icon-delete color-0299CC"></i >
              </el-form-item>
               </el-form>
               
              
          </el-col>
        </el-row>
      </div>
       <div class="split-line" style="margin: 20px 0;"></div>
     <!-- 活动时间段业绩统计 -->
     <div class="group-item">
        <h3 class="activity-title">活动时间段业绩统计 <el-button class="search_btn add-statistics" v-if="!operationDisabled" @click="addStatistics">
                <svg-icon icon-class="add"></svg-icon>新增统计</el-button></h3>
  
        <el-row v-for="(item,index) in activityData" :key="index" :class="{dashed:index!=0}">
          <span @click="deleteStatistics(index)" class="color-0299CC delete-fr" v-if="activityData.length == index+1 && index != 0&& !operationDisabled"><i class="el-icon-delete mr5"></i >删除</span>
         <el-row style="clear: both;">
          <el-col :span="11" style="margin-right: 3%;">
            <el-form-item label="活动时间段">
              <el-date-picker
              style="width:100%"
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
          <el-form :model="item" ref="item" :rules="rules2" class="demo-ruleForm" label-width="120px">
            <el-form-item label="折标业绩系数" prop="performanceCoefficient">
              <span class="el-input" v-if="operationDisabled">{{item.performanceCoefficient}}</span>
              <el-input v-model="item.performanceCoefficient" v-else type="number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )'></el-input>
            </el-form-item>
            </el-form>
          </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"  v-for="(Citem,Cindex) in item.activityBrokerageCoefficients" :key="Citem.age" style="white-space: nowrap;
            margin-right:3%;" >
              <el-row  type="flex" justify="space-between" class="row-bg product-commission">
                <span style="line-height:41px;">活动时间产品佣金系数第{{Citem.age}}年</span>
                 <el-button class="search_btn" @click="addactivityTime(index)" v-if="Cindex == 0 && !operationDisabled">
                <svg-icon icon-class="add"></svg-icon>新增</el-button>
                <span @click="deleteActivityTime(index,Citem)" class="color-0299CC " v-if="Cindex != 0 && Cindex == item.activityBrokerageCoefficients.length-1 && !operationDisabled"><i class="el-icon-delete mr5"></i >删除</span>
              </el-row>
                <el-form :model="cvalue" ref="cvalue" :rules="rules2" class="demo-ruleForm" v-for="(cvalue,k) in Citem.brokerageCoefficientDTOList" :key="k" label-width="120px">
              <el-form-item :label="`第${cvalue.hierarchy}层级(%)`" prop="coefficient">
                <span class="el-input" v-if="operationDisabled">{{cvalue.coefficient}}</span>
                <el-input
                  v-model="cvalue.coefficient" v-else onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )'   type="number"></el-input>
                  <svg-icon icon-class="add"  @click="addActivityTimeLevel(index,k)" v-if="k+1 == Citem.brokerageCoefficientDTOList.length && Cindex == 0 && !operationDisabled" class="color-0299CC"></svg-icon>
                  <i  @click="deleteActivityTimeLevel(index,Cindex,k)" v-if="k+1 == Citem.brokerageCoefficientDTOList.length && Cindex == 0 && !operationDisabled" class="el-icon-delete color-0299CC"></i >
              </el-form-item>
              </el-form>

            </el-col>
        </el-row>
        </el-row>
        </el-row>
      </div>
<!-- 

      <div class="group-item" style="position: relative">
        <h3>活动时间段</h3>
        <el-row v-for="item in activityData" :key="item.idx">
          <el-col :span="11">
            <el-form-item label="活动时间段">
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
            <el-form-item label="折标业绩系数">
              <el-input style="width: 300px"
                :disabled="operationDisabled"
                v-model="item.performanceCoefficient"></el-input>
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
      </div> -->
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <span class="stage_btn" v-if="createStatus=='update'&productStatusNo===2" @click="handleCollect('0')">
        <svg-icon icon-class="stage"></svg-icon> 产品分期</span>
      <span class="stage_btn" v-if="createStatus=='update'&productStatusNo===2" @click="handleCollect('1')">
        <svg-icon icon-class="stage"></svg-icon> 募集分期</span>
      <!-- 创建 -->
      <el-button class="search_btn" v-if="createStatus=='create'" @click="cancel()">取 消</el-button>
      <el-button class="add_btn" v-if="createStatus=='create'" type="primary" @click="updateRouter">保 存</el-button>
      <!-- 编辑 -->
      <el-button class="search_btn" v-if="createStatus=='update'&!operationDisabled" @click="cancel()">取 消</el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&!operationDisabled" type="primary" @click="updateRouter">保 存</el-button>
      <!-- 在建 -->
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===0" type="primary" @click="updateProductType(1)">
        <svg-icon icon-class="preheating"></svg-icon> 进入产品预热</el-button>
      <!-- 预热 -->
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===1&!form2.collectDate" type="primary">
        <svg-icon icon-class="collecting"></svg-icon> <span @click="dialogCollectVisible=true">进入产品募集</span></el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===1&form2.collectDate!=null" type="primary">
        <span @click="changeCollect">修改定时</span> | <span @click="cancelCollect">取消定时</span></el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===1" type="primary" @click="backProductType(0)">
        <svg-icon icon-class="return"></svg-icon> 返回在建</el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===1" type="primary" @click="updateProductDisplay">
        <svg-icon v-if="form2.isDisplay==='1'" icon-class="eye"></svg-icon>
        <svg-icon v-else icon-class="product_eye"></svg-icon>
        {{form2.isDisplay==='1'?'设为隐藏':'设为显示'}}</el-button>
      <!-- 募集中 -->
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===2" type="primary" @click="updateProductType(3)">
        <svg-icon icon-class="close"></svg-icon> 进入已关账</el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===2" type="primary" @click="updateProductPause">
        <svg-icon v-if="form2.isPause==='1'" icon-class="play"></svg-icon>
        <svg-icon v-else icon-class="pause"></svg-icon>
        {{form2.isPause==='1'?'开始预约':'暂停预约'}}
      </el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===2" type="primary" @click="updateProductDisplay">
        <svg-icon v-if="form2.isDisplay==='1'" icon-class="eye"></svg-icon>
        <svg-icon v-else icon-class="eyeShow"></svg-icon>
        {{form2.isDisplay==='1'?'设为隐藏':'设为显示'}}
      </el-button>
      <!-- 已关账 -->
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===3" type="primary" @click="updateProductType(4)">
        <svg-icon icon-class="establish"></svg-icon> 进入已成立</el-button>
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===3" type="primary" @click="backProductType(2)">
        <svg-icon icon-class="return"></svg-icon> 返回募集中</el-button>
      <!-- 已成立 -->
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===4" type="primary" @click="updateProductType(5)">
        <svg-icon icon-class="shutDown"></svg-icon> 进入兑付中</el-button>
      <!-- 兑付中 -->
      <el-button class="add_btn" v-if="createStatus=='update'&productStatusNo===5" type="primary" @click="updateProductType(6)">
        <svg-icon icon-class="shutDown"></svg-icon> 进入兑付完成</el-button>
    </div>
    <!-- 新增材料下拉框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogComVisible"
      width="30%">
      <div style="margin-bottom: 30px;">请选择新增材料</div>
      <el-select v-model="clientFile"
        clearable
        placeholder="请选择"
        style="margin-bottom: 30px; width: 100%"
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
    <!-- 进入产品募集 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogCollectVisible"
      width="30%">
      <el-radio-group v-model="collectVal" @change="radioChange">
        <el-radio style="display: block" :label="1">立即进入产品募集</el-radio>
        <el-radio style="margin-left: 0; margin-right: 10px;" :label="2">定时进入产品募集</el-radio>
        <el-date-picker
          v-model="collectTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-radio-group>
      <div class="dialog-footer text-right">
        <el-button @click="dialogCollectVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleToCollect">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 转已关账... -->
    <el-dialog
      title="提示"
      :visible.sync="dialogStVisible"
      width="30%">
      <div style="margin-bottom: 30px;">此产品现在为{{productStatusText}}，确定进入{{msgText}}吗？</div>
      <el-form label-width="110px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="产品名称:" prop="minimalAmount" style="white-space: nowrap">
              <span>{{productInfo.productName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="已募集人数:" prop="minimalAmount" style="white-space: nowrap">
              <span>{{productInfo.collectLP}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="已募集额度:" prop="minimalAmount" style="white-space: nowrap">
              <span>{{productInfo.collectAmount}}万</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="productStatusNo===2">
          <el-col :span="11">
            <el-form-item label="关账时间:" prop="closeDate">
              <el-date-picker
                v-model="dto.closeDate"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="productStatusNo===3">
          <el-col :span="11">
            <el-form-item label="已成立时间" prop="establishmentDate">
              <el-date-picker
                v-model="dto.establishmentDate"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="productStatusNo===3">
          <el-col :span="11">
            <el-form-item label="起息日期" prop="valueDate">
              <el-date-picker
                v-model="dto.valueDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer text-right">
        <el-button @click="dialogStVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleProStatus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import productMaterialComponent from 'components/table/material'
  import { putFileObj, delCustFile, fetchOperation, addCustFile, postTranscFile, getCustFile,
    updCustFile, updProductDisplay, updProductPause, getProductStage, addOperationObj, updProductType,
    updToCollect, cancelToCollect } from '@/api/product/product'
  import { mapGetters } from 'vuex'
  import { transformText, sortKey } from '@/utils'
  // import { parseTime } from '@/utils'
  // import { decimals, isNumber } from '@/utils/validate'
  import Bus from '@/assets/js/bus'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import { getClientFile, getTranscFile } from '@/api/product/fileManage'
  import { getToken } from '@/utils/auth'


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
    components: {
      productMaterialComponent
    },
    data() {
      let checkAge = (rule, value, callback) => {
        if (value>100) {
          return callback(new Error('输入内容不能大于等于100'));
        }
     
      };
      return {
        fileList1: [],
        fileList2: [],
        fileList3: [],
        // clientFiles: [],
        form2: {
          activityDTO: [],
          normalDTO: {
            normalBrokerageCoefficients: []
          },
          keyProduct: 1
        },
        activityData: [
          {
            activeDate: ['', ''],
            performanceCoefficient:'',
            activityBrokerageCoefficients:[{
              age:1,
              brokerageCoefficientDTOList:[{
                hierarchy:1,
                coefficient: ''
              }]
            }]
          }
        ],
        activityList: [],
        addActivityList: [],
        addNormList: [],
        normalData: {},
        // importantDate: [],
        importantStart: '',
        importantEnd: '',
        normalList: [{
          age: 1,
          brokerageCoefficient: ''
        }],
        normalDTO:{
          performanceCoefficient:'',
          normalBrokerageCoefficients:[{
            age: 1,
            brokerageCoefficientDTOList: [{
              hierarchy:1,
              coefficient: ''
            }]
          }]
        },
        activityTime:1,
        cmsIndex: 1,
        radio2: 1,
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        operationDisabled: false,
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        rules2: {
          aging: [
            { required: true, trigger: 'bulr'}
          ],
          visiblePeople: [
            { required: true, trigger: 'change'}
          ],
          performanceCoefficient:[
            { validator: checkAge, trigger: 'blur' }
          ],
          coefficient:[
            { validator: checkAge, trigger: 'blur' }
          ]
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
        createStatus: 'create',
        dialogComVisible: false,
        dialogStVisible: false,
        dialogCollectVisible: false,
        selectFile: null,
        clientFileList: [],
        clientFile: '',
        productFileId: 0,
        productStatusNo: 100,
        form: {},
        productStatusText: '',
        msgText: '',
        dto: {},
        url: '',
        secStep: '1',
        data1: {},
        data2: {},
        collectVal: 1,
        collectTime: ''
        // form: {},
        // isDisabled: true,
        // stage: false,
        // stageTypeNo: '',
      }
     
    },
    // props: ['productId', 'proStatus', 'productInfo'],
    props: {
      productId: {
        default: ''
      },
      proStatus: {
        default: ''
      },
      productInfo: {
        default() {
          return {}
        }
      }
    },
    computed: {
      ...mapGetters([
      //   'permissions',
        'productStatus',
      //   'productRiskLevel',
      //   'investHorizonUnit'
      ]),
      normalList1() {
        return sortKey(this.normalList, 'age')
      }
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    created() {
      this.getOperations()
      if(this.productId) {
        this.createStatus = 'update'
      }
    },
    mounted() {
      this.productStatusNo = this.proStatus
      this.url = localStorage.getItem('activeUrl')
    },
    methods: {
      judgeEmpty(){
        this.$notify({
          title: '警告',
          message: '层级不能为空',
          type: 'warning'
        });
      },
      //筛选佣金业绩统计
      normalFilter(filter){
        let self = true;
        if(!this.normalDTO.performanceCoefficient && filter) return false;
        this.normalDTO.normalBrokerageCoefficients.forEach(item=>{
          item.brokerageCoefficientDTOList.forEach(item=>{
            if(!item.coefficient){
            this.judgeEmpty();
              self = false;
              return false;
            }
          })
        })
        return self;
      },
      //筛选活动时间段业绩统计 新增统计判断
      activityFilter(filter){
        let self = true;
        this.activityData.forEach(item=>{
          //折标业绩系数
          if(!item.performanceCoefficient && filter){
            this.judgeEmpty();
            self = false;
            return false;
          }
          console.log(item.activeDate)
          //活动时间段
          if(!item.activeDate){
            this.judgeEmpty();
              self = false;
              return false;
          }
          item.activeDate.forEach(item=>{
            if(!item && filter){
              this.judgeEmpty();
              self = false;
              return false;
            }
          })
          //活动时间产品佣金系数
          item.activityBrokerageCoefficients.forEach(item=>{
            item.brokerageCoefficientDTOList.forEach(item=>{
             if(!item.coefficient){
              this.judgeEmpty();
              self = false;
              return false;
              }
            })
          })
        })
        return self;

        //   activityData: [
        //   {
        //     activeDate: ['', ''],
        //     performanceCoefficient:'',
        //     activityBrokerageCoefficients:[{
        //       age:1,
        //       brokerageCoefficientDTOList:[{
        //         hierarchy:1,
        //         coefficient: ''
        //       }]
        //     }]
        //   }
        // ],
      },
      //新增产品佣金系数
      addProductCommission(){
        if(!this.normalFilter(false)) return false; 
        let objArr = this.normalDTO.normalBrokerageCoefficients;
        if(objArr.length >=5) return false;
        let levelDataArr = []
        objArr[0].brokerageCoefficientDTOList.forEach((item,index)=>{
            levelDataArr.push({
              hierarchy:index+1,
              coefficient: ''
            })
        })
        objArr.push({
          age:objArr.length+1,
          brokerageCoefficientDTOList:levelDataArr
        })
      },
      //删除产品佣金系数
      deleteProductCommission(index){
        let objArr = this.normalDTO.normalBrokerageCoefficients;
        if(objArr.length == 1) return false;
        objArr.splice(index,1)
      },
      //佣金业绩统计 - 产品佣金系数 删除
      deleteProductLevel(index){
        if(index <=0) return false;
        this.normalDTO.normalBrokerageCoefficients.forEach(item=>{
            item.brokerageCoefficientDTOList.splice(index,1)
        })
        //this.levelList--;
      },
      //佣金业绩统计 - 产品佣金系数 增加
      addProductLevel(i){
        if(!this.normalFilter(false)) return false; 
        this.normalDTO.normalBrokerageCoefficients.forEach((item,index)=>{
            item.brokerageCoefficientDTOList.push({
              hierarchy:i+2,
              coefficient: ''
            })
        })
        //       productCommission:[{
        //    age: 1,
        //   levelData: [{
        //     coefficient:'',
        //     hierarchy: ''
        //   }]
        // }],
      },
      //新增统计
      addStatistics(){
        if(!this.activityFilter(true)) return false;
        this.activityData.push( {
            activeDate: ['', ''],
            performanceCoefficient:'',
            activityBrokerageCoefficients:[{
                age:1,
                brokerageCoefficientDTOList:[{
                  hierarchy:1,
                  coefficient: ''
                }]
              }
            ]
          })
      },
      //删除统计
      deleteStatistics(index){
        this.activityData.splice(index,1)
      },
      //新增活动时间产品佣金系数
      addactivityTime(index){
        if(!this.activityFilter(false)) return false;
        let objLength = this.activityData[index].activityBrokerageCoefficients;
        if(objLength.length>=5) return false;
        let levelDataArr = [];
        objLength[0].brokerageCoefficientDTOList.forEach((item,index)=>{
          levelDataArr.push({
            hierarchy:index+1,
            coefficient: ''
          })
        })
        objLength.push({
          age:objLength.length+1,
          brokerageCoefficientDTOList: levelDataArr
        })
        console.log(objLength)
      },
      //删除活动时间产品佣金系数
      deleteActivityTime(index,cindex){
        let obj =  this.activityData[index].activityBrokerageCoefficients
        if(obj.length <= 1) return false;
        obj.splice(cindex,1)
      },
       //新增活动时间产品佣金系数 - 层级
      addActivityTimeLevel(index,k){
        if(!this.activityFilter(false)) return false;
        let levelDataArr =[];
          this.activityData[index].activityBrokerageCoefficients.forEach(item=>{
              item.brokerageCoefficientDTOList.push({
                hierarchy:k+2,
                coefficient: ''
              })
            })

        //  activityData: [
        //   {
        //     activeDate: ['', ''],
        //     performanceCoefficient:'',
        //     year:1,
        //     activityTime:[{
        //         age:1,
        //         levelData:[{
        //           coefficient:'',
        //           hierarchy: ''
        //         }]
        //       }
        //     ]
        //   }
        // ],
       
      },
       //删除活动时间产品佣金系数 - 层级
      deleteActivityTimeLevel(index,Cindex,k){
        if(k<= 0) return false;
        this.activityData[index].activityBrokerageCoefficients.forEach(item=>{
          item.brokerageCoefficientDTOList.splice(k,1);
        })
      },

      getOperations() { // 获取操作指南信息
        if(!this.productId) return false
        this.getAllFiles(this.productId)
        fetchOperation(this.productId).then(res => {

          this.form2 = res.data;
          this.normalDTO =this.form2.normalDTO = res.data.normalDTO || this.normalDTO;
          this.activityData = res.data.activityDTO || this.activityData;
         

          // console.log(this.form2.collectDate)
          // if(this.form2.collectDate) {
          //   this.collectVal = 2
          // }

          if(this.form2.importantStart || this.form2.importantEnd) {
            this.radio2 = 2
          } else {
            this.radio2 = 1
          }
          // this.importantDate = [this.form2.importantStart, this.form2.importantEnd]
          this.importantStart = this.form2.importantStart
          this.importantEnd = this.form2.importantEnd
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
              activeDate: ['',''],
              performanceCoefficient: '',
                 activityBrokerageCoefficients:[{
                  age:1,
                  brokerageCoefficientDTOList:[{
                    hierarchy:1,
                    coefficient: ''
                  }]
                }
              ]
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
      updateRouter() { // 操作指南新建或编辑提交
        this.activityList = this.activityList.concat(this.activityData)
        this.activityList.forEach(item => {
          item.activityEnd = item.activeDate[1]
          item.activityStart = item.activeDate[0]
        })
        // if (this.importantDate) {
        //   this.form2.importantStart = this.importantDate[0]
        //   this.form2.importantEnd = this.importantDate[1]
        // } else {
        //   this.form2.importantStart = ''
        //   this.form2.importantEnd = ''
        // }
        if (this.importantStart) {
          this.form2.importantStart = this.importantStart
          if (this.importantEnd) {
            this.form2.importantEnd = this.importantEnd
          } else {
            this.form2.importantEnd = new Date('9999-01-01')
          }
        } else {
          this.form2.importantStart = ''
          this.form2.importantEnd = ''
        }
        if(this.productStatusNo == 2){
         if(!this.activityFilter(true)) return false;
         if(!this.normalFilter(true)) return false; 
        }
        if(this.normalDTO.performanceCoefficient>=100){
          this.$notify({
            title: '失败',
            message: '输折标业绩系数应小于100',
            type: 'error',
            duration: 2000
          })
          return false;
        }
         this.normalDTO.normalBrokerageCoefficients.forEach(item=>{
          item.brokerageCoefficientDTOList.forEach(item=>{
            if(item.coefficient>=100){
                this.$notify({
                  title: '失败',
                  message: '层级应小于100',
                  type: 'error',
                  duration: 2000
                })
                return false;
            }
          })
         })
         this.activityData.forEach(item=>{
          if(item.performanceCoefficient>=100){
            this.$notify({
              title: '失败',
              message: '折标业绩系数应小于100',
              type: 'error',
              duration: 2000
            })
            return false;
          }
          item.activityBrokerageCoefficients.forEach(item=>{
            item.brokerageCoefficientDTOList.forEach(item=>{
              if(item.coefficient>=100){
                this.$notify({
                  title: '失败',
                  message: '输入层级应小于100',
                  type: 'error',
                  duration: 2000
                })
                return false;
              }
            })
          })
         })
        this.form2.normalDTO = this.normalDTO;
        // this.normalList = this.form2.normalDTO.normalBrokerageCoefficients
        this.form2.activityDTO = this.activityData;
        //this.form2.normalDTO.normalBrokerageCoefficients = this.normalList.concat(this.addNormList)
        // this.form2.normalDTO.normalBrokerageCoefficients = this.normalList1
        this.form2.productId = this.productId;
        // this.form2.keyProduct = this.radio2

        if (!this.operationDisabled && !this.form2.importantStart) {
          this.$notify({
            title: '失败',
            message: '开始时间不能为空',
            type: 'error',
            duration: 2000
          })
          return false
        }
        if (this.form2.importantStart && window.Number(this.form2.importantEnd) < Number(this.form2.importantStart)) {
          this.$notify({
            title: '失败',
            message: '重点产品结束时间须不小于开始时间',
            type: 'error',
            duration: 2000
          })
          return false
        }
        addOperationObj(this.form2).then(res => {
          this.$notify({
            title: '成功',
            message: '产品指南保存成功',
            type: 'success',
            duration: 2000
          })
          return false
          // if(this.createStatus = 'create') {}
          this.$router.push({path: '/product/productList'})
          Bus.$emit('activeIndex', '/product/productList')
        })
      },
      updateProductDisplay() { // 显示/隐藏
        let display = this.form2.isDisplay === '0' ? '1' : '0'
        let params = {
          display: display
        }
        let displayText = this.form2.isDisplay === '0' ? '隐藏' : '显示'
        let msgText = display === '0' ? '隐藏' : '显示'
        this.$confirm('此产品现在为' + displayText + ', 确定在APP上' + msgText + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updProductDisplay(this.productId, params).then(res => {
              this.form2.isDisplay = display
              this.getOperations()
            })
          }).catch(() => {

          })
      },
      updateProductPause() { // 暂停预约
        let pause = this.form2.isPause === '0' ? '1' : '0'
        let params = {
          pause: pause
        }
        let pauseText = this.form2.isPause === '0' ? '预约中' : '暂停预约'
        let msgText = pause === '0' ? '开始预约' : '暂停预约'
        this.$confirm('此产品现在为' + pauseText + ', 确定开始' + msgText + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updProductPause(this.productId, params).then(res => {
              this.form2.isPause = pause
              this.getOperations()
            })
          }).catch(() => {

          })
      },
      handleCollect(type) { // 募集分期/产品分期
        this.stageType = type // 0 产品分期； 1 募集分期
        // Bus.$emit('stageTypeNo', type)
        getProductStage(this.productId, type).then(res => {
          // this.stage = true
          this.formData = res.data
          // console.log(this.stage)
          this.formData.currencyIdNo = this.formData.currencyId
          this.formData.productTypeIdNo = this.formData.productTypeId
          this.formData.investmentHorizonUnitNo = this.formData.investmentHorizonUnit
          this.formData.productTypeId = transformText(this.productTypes, this.formData.productTypeId)
          this.formData.currencyId = transformText(this.currencyList, this.formData.currencyId)
          this.formData.investmentHorizonUnit = transformText(this.investHorizonUnit, this.formData.investmentHorizonUnit)
          let params = {
            data: this.formData,
            stageType: this.stageType
          }
          this.$emit('detailByOperation', params)
        })
      },
      backProductType(status) {
        this.dto.status = status
        this.productStatusText = transformText(this.productStatus, this.productStatusNo)
        this.msgText = transformText(this.productStatus, status)
        this.$confirm('此产品现在为' + this.productStatusText + ', 确定返回' + this.msgText + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updProductType(this.productId, this.dto).then(res => {
              this.$notify({
                title: '成功',
                message: '状态操作成功',
                type: 'success',
                duration: 2000
              })
              this.$router.push({path: this.url})
              Bus.$emit('activeUrl', this.url)
            })
          }).catch(() => {

          })
      },
      updateProductType(status) { // 产品状态转化
        //进入 预热或者进入募集中需要验证层级不能为空
        if(status == 1 || status == 2){
           if(!this.activityFilter(true)) return false;
          if(!this.normalFilter(true)) return false; 
        }
        this.dto.status = status
        this.productStatusText = transformText(this.productStatus, this.productStatusNo)
        this.msgText = transformText(this.productStatus, status)

        if(status == 3 || status == 4) {
          this.dialogStVisible = true

        } else {
          this.$confirm('此产品现在为' + this.productStatusText + ', 确定进入' + this.msgText + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updProductType(this.productId, this.dto).then(res => {
              this.$notify({
                title: '成功',
                message: '状态操作成功',
                type: 'success',
                duration: 2000
              })
              this.$router.push({path: this.url})
              Bus.$emit('activeUrl', this.url)
            })
          }).catch(() => {

          })
        }
      },
      radioChange(val) {
        if(val === 1) {
          this.collectTime = ''
        }
      },
      handleToCollect() { // 募集定时
        let params = {
          collect: this.collectVal === 1 ? true : false,
          collectDate: this.collectTime = this.collectVal === 1 ? '' : this.collectTime 
        }
        updToCollect(this.productId, params).then(res => {
          this.dialogCollectVisible = false
          this.$notify({
            title: '成功',
            message: '状态操作成功',
            type: 'success',
            duration: 2000
          })
          this.getOperations()
        })
      },
      changeCollect() {
        console.log('修改定时')
        this.dialogCollectVisible = true
        this.collectTime = this.form2.collectDate
        this.collectVal = 2
      },
      cancelCollect() { //  募集，取消定时
        this.$confirm('确定取消定时吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelToCollect(this.productId).then(res => {
            if(res.status !== 200) return false
            this.$notify({
              title: '成功',
              message: '状态操作成功',
              type: 'success',
              duration: 2000
            })
            this.getOperations()
          })
        }).catch(() => {

        })
      },
      handleProStatus() { // 弹框确定事件
        updProductType(this.productId, this.dto).then(res => {
          this.$notify({
            title: '成功',
            message: '状态操作成功',
            type: 'success',
            duration: 2000
          })
          this.dialogStVisible = false
          this.$router.push({path: this.url})
          Bus.$emit('activeUrl', this.url)
        })
      },
      cancel(formName) {
        // this.$refs[formName].resetFields()
        this.$router.push({path: this.url})
        Bus.$emit('activeUrl', this.url)
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
      test(val) {
        if(val === 1) {
        //  this.importantDate = []
          this.importantEnd = this.importantStart = ''
        }
        // this.form2.keyProduct = val
      },
      importFile(fileType) {
        return uploadFiles(this.productId, fileType)
      },
      getAllFiles(productId) {
        if(!productId) return null
        this.getFiles1(productId)
        this.getFiles2(productId)
        this.getFiles3(productId)
        this.getFiles4(productId)
      },
      addClientFile(type, clientType) { // 查询材料
        let params = {
          limit: 100,
          page: 1
        }
        this.fileType = type
        this.clientFile = ''
        if (type === 'client') {
          // params.clientType = clientType
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
      changeSecStep(val) {
        this.secStep = val
      },
      chooseClientFile() { // 下拉框选择材料提交
        this.dialogComVisible = false
        if (this.fileType === 'client') {
          let params = {
            fileName: this.selectFile.fileName,
            productClientFileManageId: this.selectFile.productClientFileManageId,
            productId: this.productId,
            clientType: this.secStep
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
          postTranscFile(params).then(res => {
            this.getFiles1(params.productId)
          })
        }
      },
      changeFileList(val) {
        let obj = {}
        obj = this.clientFileList.find(item => {
          let id = item.productClientFileManageId || item.transactionFileManageId
          return id === val
        })
        this.selectFile = obj
      },
      updateClientFile(item) { // 编辑上传客户材料名称
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
          // this.productFileId = ''
          this.getFiles4(this.productId)
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
            } else if(productFileType === 'announcement') {
              this.getFiles3(id)
            }
          }
        })
      },
      deleteClient(id) { // 删除上传客户材料
        delCustFile(id).then(res => {
          // if(res.status === 200) {
          this.getFiles4(this.productId)
          // }
        })
      },
      handleChange2(file, fileList) { // 上传材料完成状态，列表展示
        // this.fileList2 = fileList.slice(-3)
        // this.uploadData.fileType = 'product'
        this.getFiles2(this.productId)
      },
      handleChange3(file, fileList) { // 上传材料完成状态，列表展示
        // this.fileList2 = fileList.slice(-3)
        // this.uploadData.fileType = 'product'
        this.getFiles3(this.productId)
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
        getCustFile(productId, {clientType: '1'}).then(response => { // 专业投资者
          // this.clientFiles = response.data || []
          this.data1 = response.data
        })
        getCustFile(productId, {clientType: '0'}).then(response => { // 普通投资者
          // this.clientFiles = response.data || []
          this.data2 = response.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/variables.scss";

  .filter-item {
    display: block;
  }
  .stage_btn {
      float: left;
      color: $mainColor;
      line-height: 40px;
      margin-right: 10px;
      cursor: pointer;
  }
  .second-tab {
    color: #606266;
    .second-item {
      display: inline-block;
      padding: 0 16px;
      cursor: pointer;
    }
  }
  .query-color {
    color: $mainColor;
  }
  .color-0299CC{
    color: #0299CC;
  }
  .border-0299CC{
    border: 1px solid #0299CC;
    padding:5px 10px;
  }
  .product-commission{
    margin:0 0 22px 35px;
  }
  .ml35{
    margin-left:35px;
  }
  .mr5{
    margin-right:5px;
  }
  .add-statistics{
    margin-right: 88px;
  }
  .dashed{
  padding: 30px 0;
  border-top:2px dotted #C0C0C0;
  }
  .el-form-item__error{
    left: 85px;
  }
  .delete-fr{
    float:right;
    margin:10px 90px;
  }
  .activity-title{
    display: flex;
     justify-content:space-between;
      line-height: 40px;
  }
</style>

