<template>
  <div class="app-container">
    <!-- <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
    </div> -->
    <h3>{{textMap[updateStatus]}}</h3>
    <!-- <div class="margin-line"></div> -->
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <div class="split-line" style="margin-bottom: 20px;"></div>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="识别号" prop="appPackage">
              <el-input v-model="form.appPackage" placeholder="请输入识别号" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="版本名称" prop="versionName">
              <el-input v-model="form.versionName" placeholder="请输入版本名称" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入版本号" :maxlength="10" :disabled="updateStatus==='update'?true:false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="升级平台" prop="platform">
              <el-radio-group v-model="form.platform" :disabled="updateStatus==='update'?true:false">
                <el-radio label="Android"/>
                <el-radio label="IOS"/>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="升级方式" prop="promptType" style="float: left">
              <el-radio-group v-model="form.promptType" @change="changeType">
                <el-radio label="Silence">静默</el-radio>
                <el-radio label="Force">强制</el-radio>
                <el-radio label="Recommend">推荐</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="updateDeadline" style="float: left;margin-left: -110px" v-if="form.promptType === 'Recommend'">
              <el-date-picker
                v-model="form.updateDeadline"
                type="date"
                placeholder="选择最后升级日期"
                :picker-options="pickerOptions0"/>
            </el-form-item>
            <el-form-item prop="updateDeadlineTime" style="float: left;margin-left: -110px" v-if="form.promptType === 'Recommend'">
              <el-time-select
                v-model="form.updateDeadlineTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:50'
                }"
                placeholder="选择时间"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="升级地址" prop="packageUrl">
              <el-input v-model="form.packageUrl" placeholder="请输入升级地址" :maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="升级说明" prop="promptText">
              <el-input type="textarea" v-model="form.promptText" :rows="5" placeholder="请输入升级说明"
                        :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="16" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" @click="create">提 交</el-button>
        <el-button class="search_btn" @click="cancel">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
  import { createVersion, getVersion, updateVersion } from '@/api/version'
  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        if (value) {
          if (value == 0){
            callback(new Error('输入数字必须大于0'))
          } else {
            if (!/^[0-9]+$/.test(value)) {
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          }
        }else{
          callback(new Error('请输入版本号'))
        }
      }
      const validateDate = (rule, value, callback) => {
        if (this.form.promptType === 'Recommend') {
          if (value) {
            callback()
          } else {
            callback(new Error('请选择最后升级日期'))
          }
        } else {
          callback()
        }
      }
      const validateTime = (rule, value, callback) => {
        if (this.form.promptType === 'Recommend') {
          if (value) {
            callback()
          } else {
            callback(new Error('请选择时间'))
          }
        } else {
          callback()
        }
      }
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        form: {
          promptType: 'Silence',
          platform: 'Android',
          updateDeadline: '',
          updateDeadlineTime: ''
        },
        updateStatus: '',
        textMap: {
          create: '发布新版本',
          update: '编辑新版本',
        },
        rules: {
          appPackage: [
            {required: true, trigger: 'blur', message: '请输入识别号'}
          ],
          versionName: [
            {required: true, trigger: 'blur', message: '请输入版本名称'}
          ],
          versionCode: [
            {required: true, trigger: 'blur', validator: checkNumber}
          ],
          platform: [
            {required: true, trigger: 'blur', message: '请选择升级平台'}
          ],
          promptType: [
            {required: true, trigger: 'blur', message: '请选择升级方式'}
          ],
          updateDeadline: [
            {required: false, trigger: 'blur', validator: validateDate}
          ],
          updateDeadlineTime: [
            {required: false, trigger: 'blur', validator: validateTime}
          ],
          packageUrl: [
            {required: true, trigger: 'blur', message: '请输入升级地址'}
          ],
          promptText: [
            {required: true, trigger: 'blur', message: '请输入升级说明'}
          ],
        },
      }
    },
    created() {
      let obj = this.$route.params
      if (obj && obj.id) {
        // this.form = obj
        this.updateStatus = 'update'
        this.getVersion(obj.id)
      } else {
        this.updateStatus = 'create'
      }
    },
    methods: {
      getVersion(id) {
        getVersion(id).then(res => {
          this.form = res.data
        })
      },
      changeType(){
        if (this.form.promptType !== 'Recommend') {
         this.form.updateDeadline = ''
         this.form.updateDeadlineTime = ''
        }
      },
      create() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.updateStatus === 'update'){
              delete this.form.createTime
              updateVersion(this.form.appVersionId,this.form)
                .then(res => {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/setting/version'})
                })
            } else{
              createVersion(this.form)
                .then(res => {
                  this.$message({
                    message: '新建成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/setting/version'})
                })
            }
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push({path: '/setting/version'})
      }
    }
  }
</script>
