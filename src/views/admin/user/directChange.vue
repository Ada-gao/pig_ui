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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="66%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="所在城市"  placeholder="请选择职位" required>
            <el-col :span="11">
              <el-form-item  prop="city"  >
                <el-cascader
                  @change="changeWatch('cityChangeDate')"
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
                  :disabled = "disabledChange.cityChangeDate"
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
          <el-col :span="11" :offset="1">
            <el-form-item label="物理职场" required>
            <el-col :span="11">
            <el-form-item prop="workplace">
              <el-input v-model="form.workplace" placeholder="请输入物理职场" @change="changeWatch('workplaceChangeDate')"></el-input>
               </el-form-item>
             </el-col>
            <el-col class="line" :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="workplaceChangeDate">
              <el-date-picker
              :disabled = "disabledChange.workplaceChangeDate"
                v-model="form.workplaceChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="直属上级" required>
             <el-col :span="11">
              <el-form-item prop="directSupervisorName">
              <el-select class="filter-item" v-model="form.directSupervisorName" placeholder="请选择直属上级" @change="changeWatch('supervisorChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
              </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                  <el-form-item prop="supervisorChangeDate">
              <el-date-picker
              :disabled = "disabledChange.supervisorChangeDate"
                v-model="form.supervisorChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="合伙人" required>
             <el-col :span="11">
             <el-form-item prop="partnerName">
              <el-select class="filter-item" v-model="form.partnerName" placeholder="请选择合伙人" @change="changeWatch('partnerChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
               </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="partnerChangeDate">
              <el-date-picker
              :disabled = "disabledChange.partnerChangeDate"
                v-model="form.partnerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域总" required>
             <el-col :span="11">
              <el-form-item prop="regionalManagerName">
              <el-select class="filter-item" v-model="form.regionalManagerName" placeholder="请选择区域总" @change="changeWatch('regionalManagerChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
               </el-form-item>
               </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="regionalManagerChangeDate">
              <el-date-picker
              :disabled = "disabledChange.regionalManagerChangeDate"
                v-model="form.regionalManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="区域副总" required>
             <el-col :span="11">
             <el-form-item prop="regionalViceManagerName">
              <el-select class="filter-item" v-model="form.regionalViceManagerName" placeholder="请选择区域副总" @change="changeWatch('regionalViceManagerChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
              </el-form-item>
               </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="regionalViceManagerChangeDate">
              <el-date-picker
              :disabled = "disabledChange.regionalViceManagerChangeDate"
                v-model="form.regionalViceManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="城市总" required>
             <el-col :span="11">
             <el-form-item prop="cityManagerName">
              <el-select class="filter-item" v-model="form.cityManagerName" placeholder="请选择城市总" @change="changeWatch('cityManagerChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
               </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="cityManagerChangeDate">
              <el-date-picker
              :disabled = "disabledChange.cityManagerChangeDate"
                v-model="form.cityManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="城市副总" required>
             <el-col :span="11">
            <el-form-item prop="cityViceManagerName">
              <el-select class="filter-item" v-model="form.cityViceManagerName" placeholder="请选择城市副总" @change="changeWatch('cityViceManagerChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
              </el-form-item>
              </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="cityViceManagerChangeDate">
              <el-date-picker
              :disabled = "disabledChange.cityViceManagerChangeDate"
                v-model="form.cityViceManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="团队经理" required>
             <el-col :span="11">
            <el-form-item prop="teamManagerName">
              <el-select class="filter-item" v-model="form.teamManagerName" placeholder="请选择团队经理" @change="changeWatch('teamManagerChangeDate')">
                <el-option v-for="item in listBox.employeeList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
              </el-form-item>
                </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="teamManagerChangeDate">
              <el-date-picker
              :disabled = "disabledChange.teamManagerChangeDate"
                v-model="form.teamManagerChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门" required>
             <el-col :span="18">
             <el-form-item prop="deptName">
              <el-select class="filter-item" v-model="form.deptName" placeholder="请选择部门" @change="changeWatch('deptChangeDate')">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
               </el-form-item>
              </el-col>
              <el-col class="line" :span="0.8" style="width:3%">&nbsp;</el-col>
               <el-col :span="0.4" style="width:17.4%">
                 <el-form-item prop="deptChangeDate">
              <el-date-picker
              :disabled = "disabledChange.deptChangeDate"
                v-model="form.deptChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11" >
            <el-form-item label="职位" required>
             <el-col :span="11">
             <el-form-item prop="positionName">
              <el-select class="filter-item" v-model="form.positionName" placeholder="请选择职位" @change="changeWatch('positionChangeDate',$event)">
                <el-option v-for="item in listBox.jobList" :key="item.positionId" :label="item.positionName" :value="item.positionId">
                </el-option>
              </el-select>
              </el-form-item>
               </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="positionChangeDate">
              <el-date-picker
              :disabled = "disabledChange.positionChangeDate"
                v-model="form.positionChangeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="职级" required>
             <el-col :span="11">
             <el-form-item prop="rankName">
              <el-select class="filter-item" v-model="form.rankName" placeholder="请选择职级" @change="changeWatch('rankChangeDate')">
                <el-option v-for="item in listBox.rankList" :key="item.rankId" :label="item.positionName" :value="item.rankId">
                </el-option>
              </el-select>
              </el-form-item>
                  </el-col>
              <el-col class="line" :span="2">&nbsp;</el-col>
               <el-col :span="11">
                 <el-form-item prop="rankChangeDate">
              <el-date-picker
              :disabled = "disabledChange.rankChangeDate"
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
  import { deptRoleList, fetchDeptTree ,getDirectChangeList,seeDirectChangeList,addDirectChangeList} from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllRank } from '@/api/achievement/index'
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
        oldForm:{},
        newForm:{},
        listBox:{},
        disabledChange:{},
        rules: {
          city:[
            {required: true, trigger: 'change', message: '请选择所在城市'}
          ],
          cityChangeDate:[
            {required: true, trigger: 'change', message: '请选择所在城市变更时间'}
          ],
          cityManagerChangeDate:[
            {required: true, trigger: 'change', message: '请选择城市总变更时间'}
          ],
          cityManagerName:[
            {required: true, trigger: 'change', message: '请选择城市总姓名'}
          ],
          cityViceManagerChangeDate:[
            {required: true, trigger: 'change', message: '请选择城市副总变更时间'}
          ],
          cityViceManagerName:[
            {required: true, trigger: 'change', message: '请选择城市副总姓名'}
          ],
          companyChangeDate:[
            {required: true, trigger: 'change', message: '请选择公司变更时间'}
          ],
          companyName:[
            {required: true, trigger: 'change', message: '请选择公司名称'}
          ],
          deptChangeDate:[
            {required: true, trigger: 'change', message: '请选择部门变更时间'}
          ],
          deptName:[
            {required: true, trigger: 'change', message: '请选择部门名称'}
          ],
          directSupervisorName:[
            {required: true, trigger: 'change', message: '请选择直属上级名称'}
          ],
          partnerChangeDate:[
            {required: true, trigger: 'change', message: '请选择合伙人变更时间'}
          ],
          partnerName:[
            {required: true, trigger: 'change', message: '请选择合伙人名称'}
          ],
          positionChangeDate:[
            {required: true, trigger: 'change', message: '请选择职位变更时间'}
          ],
          positionName:[
            {required: true, trigger: 'change', message: '请选择职位名称'}
          ],
          rankChangeDate:[
            {required: true, trigger: 'change', message: '请选择职级变更时间'}
          ],
          rankName:[
            {required: true, trigger: 'change', message: '请选择职级名称'}
          ],
          regional:[
            {required: true, trigger: 'blur', message: '请输入区域'}
          ],
          regionalChangeDate:[
            {required: true, trigger: 'change', message: '请选择区域变更时间'}
          ],
          regionalManagerChangeDate:[
            {required: true, trigger: 'change', message: '请选择区域总变更时间'}
          ],
          regionalManagerName:[
            {required: true, trigger: 'change', message: '请选择区域总名称'}
          ],
          regionalViceManagerChangeDate:[
            {required: true, trigger: 'change', message: '请选择区域副总变更时间'}
          ],
          regionalViceManagerName:[
            {required: true, trigger: 'change', message: '请选择区域副总姓名'}
          ],
          supervisorChangeDate:[
            {required: true, trigger: 'change', message: '请选择直属上级变更时间'}
          ],
          teamManagerChangeDate:[
            {required: true, trigger: 'change', message: '请选择团队经理变更时间'}
          ],
          teamManagerName:[
            {required: true, trigger: 'change', message: '请选择团队经理'}
          ],
          workplace:[
            {required: true, trigger: 'blur', message: '请物理职场'}
          ],
          workplaceChangeDate:[
            {required: true, trigger: 'change', message: '请选择物理职场变更时间'}
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
      this.getAllPositon()
      this.getDirectSupervisorList()
      this.resetTemp()
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
      //监听数据变化改变
      changeWatch(disabled,event){
        this.disabledChange[disabled] = false; 
        if(disabled == 'positionChangeDate'){
           this.getAllRank({positionId:event});
        }
      },
      initializationForm(){
          this.form = {
            city:'',
            cityChangeDate:'',
            cityManagerChangeDate:'',
            cityManagerName:'',
            cityViceManagerChangeDate:'',
            cityViceManagerName:'',
            companyChangeDate:'',
            companyName:'',
            deptChangeDate:'',
            deptName:'',
            directSupervisorName:'',
            partnerChangeDate:'',
            partnerName:'',
            positionChangeDate:'',
            positionName:'',
            rankChangeDate:'',
            rankName:'',
            regional:'',
            regionalChangeDate:'',
            regionalManagerChangeDate:'',
            regionalManagerName:'',
            regionalViceManagerChangeDate:'',
            regionalViceManagerName:'',
            supervisorChangeDate:'',
            teamManagerChangeDate:'',
            teamManagerName:'',
            workplace:'',
            workplaceChangeDate:''
          }
      },
      // 时间转不可编辑
      disabledTrue(){
        this.disabledChange = {
            cityChangeDate:true,
            cityManagerChangeDate:true,
            cityViceManagerChangeDate:true,
            companyChangeDate:true,
            deptChangeDate:true,
            partnerChangeDate:true,
            positionChangeDate:true,
            rankChangeDate:true,
            regionalChangeDate:true,
            regionalManagerChangeDate:true,
            regionalViceManagerChangeDate:true,
            supervisorChangeDate:true,
            teamManagerChangeDate:true,
            workplaceChangeDate:true
        }
      },
      // 时间可编辑
      disabledFalse(){
        this.disabledChange = {
            cityChangeDate:false,
            cityManagerChangeDate:false,
            cityViceManagerChangeDate:false,
            companyChangeDate:false,
            deptChangeDate:false,
            partnerChangeDate:false,
            positionChangeDate:false,
            rankChangeDate:false,
            regionalChangeDate:false,
            regionalManagerChangeDate:false,
            regionalViceManagerChangeDate:false,
            supervisorChangeDate:false,
            teamManagerChangeDate:false,
            workplaceChangeDate:false
        }
      },
      // 查询直属上级
      getDirectSupervisorList(){
        getDirectSupervisorList().then(res => {
          if(res.status == 200){
          this.listBox.employeeList = res.data;
          }
        })
      },
      // 查询全部职位
      getAllPositon(){
        getAllPositon().then(res => {
          if(res.status == 200){
            this.listBox.jobList = res.data;
          }
        })
      },
        // 根据职位id查询职级
      getAllRank(id){
        getAllRank(id).then(res => {
          if(res.status == 200){
            this.listBox.rankList = res.data; 
            this.disabledChange.rankChangeDate = false; 
            this.form.rankName = this.listBox.rankList[0] && this.listBox.rankList[0].positionName;
          }
        })
      },
    	handlePosition(){
    		 getDirectChangeList(this.listQuery).then(res => {
    		 	if(res.status == 200){
    		 	this.list =	res.data.records; 
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
        let label;
         if(this.form.city[1]){
             label = this.form.city[1] == '市辖区'?this.form.city[0]:this.form.city[1]
         }else{
            label = '台湾省';
         } 
         this.newForm.city = label;
         if(JSON.stringify(this.oldForm) == JSON.stringify(this.newForm)) return false;
         
        delete this.newForm.changeId;
        this.$refs[formName].validate((valid) => {
          console.log(this.form)
          if (valid) {
            addDirectChangeList(this.newForm).then(res => {
              if(res.status == 200){
                this.dialogFormVisible = false;
                 this.handlePosition();
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
              }
            })
          }else{
            return false;  
          }
        });
 
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      resetTemp(id) {
        if(this.list){
          this.disabledTrue();
          seeDirectChangeList(2).then(res => {
            if(res.status == 200){
            this.newForm =JSON.parse(JSON.stringify(res.data));
            this.oldForm =JSON.parse(JSON.stringify(res.data));
            this.form = res.data;
            let label = this.form.city;
            let newArr = [];
            if(label == '台湾省'){
              newArr = [label];
            } else{
              if(label == '北京市' || label == '天津市' || label == '上海市' || label == '重庆市'){
                 newArr = [label,"市辖区"];
              }else{
                this.options.forEach(item=>{
                  let provinceLabel = item.label;
                 
                  if(item.children){
                    item.children.forEach(item=>{
                      if(label == item.label) {
                        newArr = [provinceLabel,item.label];
                         return false;
                      } 
                    })
                  }
                })
              }
            }
            this.form.city = newArr;
            }
          })
        }else{
          this.initializationForm();
          this.disabledFalse();
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

