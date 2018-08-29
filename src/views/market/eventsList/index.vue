<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="活动名称">
              <el-input
                placeholder="请输入活动名称"
                v-model="listQuery.searchParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="活动开始时间">
              <el-date-picker
                v-model="entryDate"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="活动结束时间">
              <el-date-picker
                v-model="entryDate"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="活动状态">
               <el-button :class="{add_btn:releaseSelection == 1}" @click="changeReleaseSelection(1)">未发布</el-button>
               <el-button :class="{add_btn:releaseSelection == 2}" @click="changeReleaseSelection(2)">已发布</el-button>
               <el-button :class="{add_btn:releaseSelection == 3}" @click="changeReleaseSelection(3)">已结束</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
        </el-row>
      </el-form>
    </div>

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleUpdate('add')">
        <svg-icon icon-class="add"></svg-icon> 新增活动</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="活动名称">
      </el-table-column>

      <el-table-column align="center" label="活动编号" class-name="left">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'">
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动开始时间" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动结束时间" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动负责人">
        <template slot-scope="scope">
          <span>{{scope.row.roleDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动部门">
        <template slot-scope="scope">
          <span>{{scope.row.employeeDate|parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="活动状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statusNum == 0" class="normal">{{scope.row.status|turnText(workStatus)}}</el-tag>
          <el-tag v-if="scope.row.statusNum == 1" class="leave">{{scope.row.status|turnText(workStatus)}}</el-tag>
          <el-tag v-if="scope.row.statusNum == 2" class="unusual">{{scope.row.status|turnText(workStatus)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="官方活动二维码" show-overflow-tooltip>
        <template slot-scope="scope">
        <span @click="modelCode">{{scope.row.lock|turnText(lockStatus)}}</span>
        </template>
      </el-table-column>



      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleUpdate('view',scope.row)">查看
          </a>
          <span class="space_line"> | </span>
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleUpdate('edit',scope.row)">编辑
          </a>
          <el-button  size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="20%">
      <article>
        <div class="title-code">解码未来“2018年独角兽企业投资经济论坛</div>
        <time>时间：2018-4-1 14:00-16:00</time>
        <p>地点：陆家嘴软件园</p>
      </article>
      <section>
        <p>报名请扫描二维码</p>

      </section>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText, transformText1 } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      ElRadioGroup
    },
    filters: {
      turnText (val, list) {
        return transformText1(val, list)
      },
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        releaseSelection:1,
        dialogVisible:false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          status: undefined,
          deptId: undefined
        },
        // statusOptions: ['0', '1', '2'],
        positionsOptions: [],
        // dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        // dialogStatus: '',
        tableKey: 0,
        // value13: '',
        eduOptions: [],
        // IDType: '',
        // employeeDate: '',
        // maritalStatus: '',
        positionId: '',
        status: '',
        // tableData: [],
        // tableHeader: [],
        entryDate: [],
        // positionName: '',
        // isReadonly: false
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'workStatus',
        'lockStatus'
      ])
    },
    created() {
      // this.handlePosition()
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      //二维码预览
      modelCode(){
        this.dialogVisible = true;
      },
      // 选择发布状态
      changeReleaseSelection(index){
        this.releaseSelection = index;
      },
      getList() {
        this.listLoading = true
        this.listQuery.orderByField = '`user`.create_time'
        this.listQuery.isAsc = false
        if(this.entryDate.length > 0) {
          this.listQuery.startTime = parseTime(this.entryDate[0], '{y}-{m}-{d}')
          this.listQuery.endTime = parseTime(this.entryDate[1], '{y}-{m}-{d}')
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        // this.handlePosition()
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          // console.log(this.list)
          this.list.map(item => {
            item.roleDesc = item.roleList.length > 0 ? item.roleList[0].roleDesc : ''
          })
          this.total = response.data.total
          this.listLoading = false
          getAllPositon().then(res => {
            this.positionsOptions = res.data
            this.list.forEach(item => {
              item.positionId = transformText(this.positionsOptions, item.positionId)
              item.statusNum = item.status
              // item.status = transformText(this.workStatus, item.status)
            })
          })
        })
      },

      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      // 编辑查询（查看）新增 页面跳转
      handleUpdate(state,row) {
        this.$router.push(`/market/eventsList/${state}`)
      },
      deletes(row) {
        this.$confirm('此操作将永久删除该活动，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.userId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).cache(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
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
      resetFilter() { // 重置搜索条件
        this.listQuery = {
          page: 1,
          limit: 20,
          username: '',
          positionId: '',
          status: ''
        },
        this.entryDate = []
        this.handleFilter()
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
.title-code{
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #000000;
  letter-spacing: 0;
}
</style>
