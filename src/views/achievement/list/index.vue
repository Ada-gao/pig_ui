<template>
	<div class="app-container calendar-list-container">
    <div class="filter-container">
			<el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="时间">
              <el-date-picker
                v-model="entryDateS"
                type="month"
                start-placeholder="选择时间"
                end-placeholder="选择时间">
              </el-date-picker> - 
							<el-date-picker
                v-model="entryDateE"
                type="month"
                start-placeholder="选择时间"
                end-placeholder="选择时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="部门">
							<el-cascader
								style="width: 100%"
								:options="treeDeptData"
								:props="defaultProps"
								:show-all-levels="false"
								change-on-select
								v-model="deptId"
							></el-cascader>
						</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select style="width: 100%" class="filter-item" v-model="listQuery.positionId" placeholder="请选择" @focus="handlePosition()">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :value="item.positionId" :label="item.positionName">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="姓名">
              <el-input class="filter-item" v-model="listQuery.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="工号">
              <el-input class="filter-item" v-model="listQuery.empNo" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
        </el-row>
      </el-form>
    </div>
		<div style="text-align: right;">
      <el-button class="add_btn" @click="handleImport">
        <svg-icon icon-class="upload"></svg-icon>批量导入
      </el-button>
      <el-button class="add_btn" @click="handleExport">
        <svg-icon icon-class="upload"></svg-icon>批量导出
      </el-button>
    </div>
		<el-table :key='tableKey' 
							:data="list" 
							v-loading="listLoading" 
							element-loading-text="给我一点时间" 
							border fit
              highlight-current-row 
							style="width: 100%">
      <el-table-column align="center" label="时间">
      </el-table-column>

			<el-table-column align="center" label="区域总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="区域副总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="城市总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="城市副总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="团队经理" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="区域" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="职级" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.empNo}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="工号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.empNo}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="本期应发佣金(元)" show-overflow-tooltip width="130">
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="本期实发佣金(元)" show-overflow-tooltip width="130">
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
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
  </div>
</template>
<script>
import { fetchDeptTree } from '@/api/role'
import { fetchList } from '@/api/user'
import { mapGetters } from 'vuex'
import { getAllPositon } from '@/api/queryConditions'
import { parseTime, transformText } from '@/utils'
export default {
	data () {
		return	{
			list: null,
			total: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20
			},
			positionsOptions: [],
      deptId: [],
			treeDeptData: [],
			defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
			},
			tableKey: 0,
			entryDateS: '',
			entryDateE: '',
		}
	},
	computed: {
		...mapGetters([
			'permissions',
			'educationType',
			'genderType',
			'idTypeOptions',
			'marriageStatusOptions',
			'workStatus'
		])
	},
	created() {
		this.getList()
  },
	methods: {
		getList() {
			this.listLoading = true
			this.listQuery.orderByField = '`user`.create_time'
			this.listQuery.isAsc = false
			// if(this.entryDate.length > 0) {
			// 	this.listQuery.startTime = parseTime(this.entryDate[0], '{y}-{m}-{d}')
			// 	this.listQuery.endTime = parseTime(this.entryDate[1], '{y}-{m}-{d}')
			// } else {
			// 	this.listQuery.startTime = ''
			// 	this.listQuery.endTime = ''
			// }
			fetchDeptTree()
				.then(response => {
					this.treeDeptData = response.data
			}),
			fetchList(this.listQuery).then(response => {
				this.list = response.data.records
				this.total = response.data.total
				this.listLoading = false
				getAllPositon().then(res => {
					this.positionsOptions = res.data
					this.list.forEach(item => {
						item.positionId = transformText(this.positionsOptions, item.positionId)
						item.statusNum = item.status
						item.status = transformText(this.workStatus, item.status)
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
			if(this.deptId.length) {
        this.listQuery.deptId = this.deptId[this.deptId.length - 1]
      }
		},
		resetFilter() { // 重置搜索条件
			this.listQuery = {
				page: 1,
				limit: 20,
				username: '',
				positionId: '',
				status: '',
        deptId: '',
			},
			this.deptId = []
			this.entryDateS = ''
			this.entryDateE = ''		
			this.handleFilter()
		},
		handleImport() {},
		handleExport() {},
		handleSizeChange(val) {
			this.listQuery.limit = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.listQuery.page = val
			this.getList()
		},
	}
}
</script>
<style lang="scss" scoped>
.el-date-editor.el-input{
	width: 143px;
}
</style>
