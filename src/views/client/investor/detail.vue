<template>
  <div class="app-container calendar-list-container">

    <h3 v-if="type_is_update==1">修改产品</h3>
    <h3 v-else>审核信息</h3>
    <el-form v-if="!nextToUpdate" :model="form" ref="form" label-width="100px">
      <div style="border-bottom: 1px solid #ccc"></div>

      <div class="general-investor" v-if="investorType == 0">
        <h5>风险测评问卷审核</h5>
        <el-table :data="certInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">
          <el-table-column align="center" label="风险评级">
            <template slot-scope="scope">
              <el-select v-model="scope.row.riskLevel" @change="handleChange">
                <el-option label="c1" value="c1"></el-option>
                <el-option label="c2" value="c2"></el-option>
                <el-option label="c3" value="c3"></el-option>
                <el-option label="c4" value="c4"></el-option>
                <el-option label="c5" value="c5"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="风险测评问卷（图片）">
            <template slot-scope="scope">
              <div v-for="item in scope.row.urls" :data="scope.row.urls" style="display: inline-block; margin-right: 10px">
                <img :src="item" alt="" style="width: 50px">
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="professional-investor" v-else>
        <h5>上传资料审核</h5>
        <el-table :data="certInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">
          <el-table-column label="（图片）">
            <template slot-scope="scope">
              <div v-for="item in scope.row.urls" :data="scope.row.urls" style="display: inline-block; margin-right: 10px">
                <img :src="item" alt="" style="width: 50px">
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="border-bottom: 1px solid #ccc; margin-top: 20px"></div>
      
      <h5>过往客户审核日志</h5>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">

        <el-table-column align="center" label="提交时间">
          <template slot-scope="scope">
            <span>{{scope.row.commitDate}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="认证客户">
          <template slot-scope="scope">
            <span>{{scope.row.clientName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="投资者类型">
          <template slot-scope="scope">
            <span>{{scope.row.certificationType}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="审核人">
          <template slot-scope="scope">
            <span>{{scope.row.auditName}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="审核时间">
          <template slot-scope="scope">
            <span>{{scope.row.auditDate}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="审核结果">
          <template slot-scope="scope">
            <span>{{scope.row.auditFailReason}}</span>
          </template>
        </el-table-column>

      </el-table>

      <div v-if="isView == 1">
        <div style="border-bottom: 1px solid #ccc; margin-top: 20px"></div>
        <!-- <h5>备注：</h5> -->
        <el-row style="margin-top: 20px">
          <el-col :span="22">
            <el-form-item label="备注" prop="bankName">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="failReason">
            </el-input>
            </el-form-item>
            <span v-show="tip">请输入备注</span>
          </el-col>
        </el-row>
      </div>
      
    </el-form>

    <div v-if="isView == 1" slot="footer" class="dialog-footer" style="text-align: center; margin-top: 20px">
      <el-button @click="submitResult('2')">通 过</el-button>
      <el-button type="primary" @click="submitResult('3')">不通过</el-button>
    </div>

  </div>
</template>

<script>
  import { getCertHistory, getCertInfo, putObj } from '@/api/client/investor'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { transformText } from '@/utils'
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
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {},
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
        IDsType: '',
        entryDate: '',
        maritalStatus: '',
        indexList: [],
        type_is_update: '',
        productStus: '',
        realnameStatus: '',
        idType: '',
        isCertificationType: '',
        list: [],
        certInfo: [],
        failReason: '',
        riskLevel: '',
        clientId: '',
        investorType: '',
        isView: '',
        tip: false
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'genderType',
        'certificationStatus',
        'certificationType',
        'idTypeOptions',
        'nationality'
      ])
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '正常',
          1: '离职',
          9: '异常'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)
    },
    methods: {
      getList() {
        this.clientId = this.$route.params.id
        let type = this.$route.params.type
        this.isView = this.$route.params.isView
        this.investorType = this.$route.params.type
        // let params = {
        //   type: '0' // 0: 普通投资者, 1:专业投资者
        // }
        // isView  0:查看， 1:审核
      
        getCertHistory(this.clientId, type).then(response => {
          this.list = response.data
          this.listLoading = false
        })
        getCertInfo(this.clientId, type).then(response => {
          this.listLoading = false
          this.certInfo = response.data
          console.log(this.certInfo)
        })
       
      },
      submitResult(result) { // 
        if(result == 3 & !this.failReason) {
          this.tip = true
          return false
        }
        let params = {
          // failId: this.form.clientId,
          failReason: this.failReason,
          result: result,
          riskLevel: this.riskLevel
        }
        
        putObj(this.clientId, params).then(response => {
          // this.$notify({
            //   title: '成功',
            //   message: response.msg,
            //   type: 'success',
            //   duration: 2000
            // })
          
          // console.log(response.code)
          if(response.status == 200) {
            this.$notify({
              title: '成功',
              message: '审核完成',
              type: 'success',
              duration: 2000
            })
            if(this.$route.params.type == 0) {
              this.$router.push({path: '/client/investor'})
            } else {
              this.$router.push({path: '/client/professionalInvestor'})
            }
            
          }
        })
      },
      handleChange(val) {
        this.riskLevel = val
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
.upfile-group {
  .btn-padding {
    @include padding;
  }
}
</style>

