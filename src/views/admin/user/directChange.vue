<template>
  <div>
    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="所在城市变更时间" prop="cityChangeDate"></el-table-column>
      <el-table-column align="center" label="所在城市" prop="city"></el-table-column>
      <el-table-column align="center" label="物理职场变更时间" prop="workplaceChangeDate"></el-table-column>
      <el-table-column align="center" label="物理职场" prop="workplace"></el-table-column>
      <el-table-column align="center" label="直属上级变更时间" prop="supervisorChangeDate"> </el-table-column>
      <el-table-column align="center" label="直属上级" prop="directSupervisorName"> </el-table-column>
      <el-table-column align="center" label="合伙人变更时间" prop="partnerChangeDate"> </el-table-column>
      <el-table-column align="center" label="合伙人" prop="partnerName"> </el-table-column>
      <el-table-column align="center" label="区域总变更时间" prop="regionalManagerChangeDate"> </el-table-column>
      <el-table-column align="center" label="区域总" prop="regionalManagerName"> </el-table-column>
      <el-table-column align="center" label="区域副总变更时间" prop="regionalViceManagerChangeDate"> </el-table-column>
      <el-table-column align="center" label="区域副总" prop="regionalViceManagerName"> </el-table-column>
      <el-table-column align="center" label="城市总变更时间" prop="cityManagerChangeDate"> </el-table-column>
      <el-table-column align="center" label="城市总" prop="cityManagerName"> </el-table-column>
      <el-table-column align="center" label="城市副总变更时间" prop="cityViceManagerChangeDate"> </el-table-column>
      <el-table-column align="center" label="城市副总" prop="cityViceManagerName"> </el-table-column>
      <el-table-column align="center" label="团队经理变更时间" prop="teamManagerChangeDate"> </el-table-column>
      <el-table-column align="center" label="团队经理" prop="teamManagerName"> </el-table-column>
      <el-table-column align="center" label="公司变更时间" prop="companyChangeDate"> </el-table-column>
      <el-table-column align="center" label="公司" prop="deptName"> </el-table-column>
      <el-table-column align="center" label="区域变更时间" prop="regionalChangeDate"> </el-table-column>
      <el-table-column align="center" label="区域" prop="regional"> </el-table-column>
      <el-table-column align="center" label="部门变更时间" prop="deptChangeDate"> </el-table-column>
      <el-table-column align="center" label="部门" prop="deptName"> </el-table-column>
      <el-table-column align="center" label="职位变更时间" prop="positionChangeDate"> </el-table-column>
      <el-table-column align="center" label="职位" prop="positionName"> </el-table-column>
      <el-table-column align="center" label="职级变更时间" prop="rankChangeDate"> </el-table-column>
      <el-table-column align="center" label="职级" prop="rankName"> </el-table-column>

    </el-table>

    <div v-show="!listLoading&list" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 直属变更编辑/新增 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="所在城市"  placeholder="请选择职位" >
            <el-col :span="11">
              <el-form-item  prop="city">
                <el-cascader
                  size="large"
                  :options="options"
                  :props="defaultProps2"
                  v-model="form.city">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="cityChangeDate">
                <el-date-picker
                  v-model="form.cityChangeDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
              <!-- <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in provinceAndCityData" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="物理职场">
            <el-col :span="11">
            <el-form-item prop="workplace">
              <el-input v-model="form.workplace" placeholder="请输入物理职场"></el-input>
               </el-form-item>
             </el-col>
            <el-col class="line" :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="workplaceChangeDate">
              <el-date-picker
                v-model="form.workplaceChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="直属上级">
             <el-col :span="11">
              <el-form-item prop="directSupervisorName">
              <el-select class="filter-item" v-model="form.directSupervisorName" placeholder="请选择直属上级">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                  <el-form-item prop="supervisorChangeDate">
              <el-date-picker
                v-model="form.supervisorChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="合伙人">
             <el-col :span="11">
             <el-form-item prop="partnerName">
              <el-select class="filter-item" v-model="form.partnerName" placeholder="请选择合伙人">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
               </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="partnerChangeDate">
              <el-date-picker
                v-model="form.partnerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域总">
             <el-col :span="11">
              <el-form-item prop="regionalManagerName">
              <el-select class="filter-item" v-model="form.regionalManagerName" placeholder="请选择区域总">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
               </el-form-item>
               </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="regionalManagerChangeDate">
              <el-date-picker
                v-model="form.regionalManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域副总">
             <el-col :span="11">
             <el-form-item prop="regionalViceManagerName">
              <el-select class="filter-item" v-model="form.regionalViceManagerName" placeholder="请选择区域副总">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
               </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="regionalViceManagerChangeDate">
              <el-date-picker
                v-model="form.regionalViceManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="城市总">
             <el-col :span="11">
             <el-form-item prop="cityManagerName">
              <el-select class="filter-item" v-model="form.cityManagerName" placeholder="请选择城市总">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
               </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="cityManagerChangeDate">
              <el-date-picker
                v-model="form.cityManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="城市副总">
             <el-col :span="11">
            <el-form-item prop="cityViceManagerName">
              <el-select class="filter-item" v-model="form.cityViceManagerName" placeholder="请选择城市副总">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
              </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="cityViceManagerId">
              <el-date-picker
                v-model="form.cityViceManagerId"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="团队经理">
             <el-col :span="11">
            <el-form-item prop="teamManagerName">
              <el-select class="filter-item" v-model="form.teamManagerName" placeholder="请选择团队经理">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="teamManagerChangeDate">
              <el-date-picker
                v-model="form.teamManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司">
             <el-col :span="11">
             <el-form-item prop="companyName">
              <el-select class="filter-item" v-model="form.companyName" placeholder="请选择公司">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
                 </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="companyChangeDate">
              <el-date-picker
                v-model="form.companyChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域">
             <el-col :span="11">
             <el-form-item prop="regional">
              <el-input v-model="form.name" placeholder="请选择区域"></el-input>
              </el-form-item>
              </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="regionalChangeDate">
              <el-date-picker
                v-model="form.regionalChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="部门">
             <el-col :span="11">
             <el-form-item prop="deptName">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择部门">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
               </el-form-item>
              </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="deptChangeDate">
              <el-date-picker
                v-model="form.deptChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职位">
             <el-col :span="11">
             <el-form-item prop="positionName">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择职位">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
               </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="positionChangeDate">
              <el-date-picker
                v-model="form.positionChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职级">
             <el-col :span="11">
             <el-form-item prop="rankName">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择职级">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
              </el-form-item>
                  </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="rankChangeDate">
              <el-date-picker
                v-model="form.rankChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-if="dialogStatus=='create'" @click="create('form')">确 定</el-button>
        <el-button class="add_btn" v-else @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj, getDirectSupervisorList } from '@/api/user'
  import { deptRoleList, fetchDeptTree ,getDirectChangeList} from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

  export default {
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    data() {
      return {
        listLoading: false,
        tableKey: 0,
        list: [],
        listQuery: {
          page: 1,
          limit: 20
        },
        total: null,
        textMap: {
          update: '编辑直属变更',
          create: '新增直属变更'
        },
        rolesOptions: [],
        dialogStatus: '',
        dialogFormVisible: true,
        form: {},
        rules: {
          city: [
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          city:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          cityChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          cityManagerChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          cityManagerName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          cityViceManagerChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          cityViceManagerName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          companyChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          companyName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          deptChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          deptName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          directSupervisorName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          partnerChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          partnerName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          positionChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          positionName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          rankChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          rankName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          regional:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          regionalChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          regionalManagerChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          regionalManagerName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          regionalViceManagerChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          regionalViceManagerName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          supervisorChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          teamManagerChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          teamManagerName:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          workplace:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          workplaceChangeDate:[
            {required: true, trigger: 'blur', message: '请选择'}
          ],
        },
        defaultProps2: {
          value: 'label'
        },
        options: provinceAndCityData
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
     this.handlePosition()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    mounted() {
      this.id = this.$route.params.id
      this.state = this.$route.params.state
    },
    methods: {
    	handlePosition(){
    		 getDirectChangeList(1,20).then(res => {
    		 	if(res.status == 200){
    		 	this.list =	res.data.records; 
  			console.log(this.list)
    		 	}
        })
    	},
      handleUpdate() {
        console.log(val)
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            // addObj(this.form)
            //   .then((res) => {
            //     if (res.status === 200) {
            //       this.dialogFormVisible = false
            //       // this.getList()
            //       this.$notify({
            //         title: '成功',
            //         message: '创建成功',
            //         type: 'success',
            //         duration: 2000
            //       })
            //     }
            //   })
          } else {
            return false
          }
        })
      },
      update(formName) {
        console.log(this.form)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancel(formName) {
        console.log(this.$refs[formName])
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      resetTemp() {
        this.form = {
          city:"",
          cityChangeDate:"",
          cityManagerChangeDate:"",
          cityManagerName:"",
          cityViceManagerChangeDate:"",
          cityViceManagerName:"",
          companyChangeDate:"",
          companyName:"",
          deptChangeDate:"",
          deptName:"",
          directSupervisorName:"",
          partnerChangeDate:"",
          partnerName:"",
          positionChangeDate:"",
          positionName:"",
          rankChangeDate:"",
          rankName:"",
          regional:"",
          regionalChangeDate:"",
          regionalManagerChangeDate:"",
          regionalManagerName:"",
          regionalViceManagerChangeDate:"",
          regionalViceManagerName:"",
          supervisorChangeDate:"",
          teamManagerChangeDate:"",
          teamManagerName:"",
          workplace:"",
          workplaceChangeDate:""
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
</style>

