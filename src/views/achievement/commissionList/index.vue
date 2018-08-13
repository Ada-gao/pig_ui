<template>
	<div class="app-container calendar-list-container">
    <div class="filter-container">
			<el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="月份">
              <el-date-picker
								style="width: 47.7%"
                v-model="entryDateS"
                type="month"
                start-placeholder="选择时间"
                end-placeholder="选择时间">
              </el-date-picker> -
							<el-date-picker
								style="width: 47.7%"
                v-model="entryDateE"
                type="month"
                start-placeholder="选择时间"
                end-placeholder="选择时间">
              </el-date-picker>
							<span class="error" v-if="errorTip">{{errorMes}}</span>
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
								v-model="deptName"
							></el-cascader>
						</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select style="width: 100%" class="filter-item" v-model="listQuery.positionName" placeholder="请选择" @focus="handlePosition()">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :value="item.positionName" :label="item.positionName">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="姓名">
              <el-input class="filter-item" v-model="listQuery.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="工号">
              <el-input class="filter-item" v-model="listQuery.userCode" placeholder="请输入工号"></el-input>
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
			<el-table-column align="center" label="月份">
				<template slot-scope="scope">
        <span>{{scope.row.occurrenceDate}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间段" width="170">
				<template slot-scope="scope">
        <span>{{scope.row.timeSlot}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="区域总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.regionalManager}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="区域副总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.regionalViceManager}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="城市总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.cityManager}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="城市副总" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.cityViceManager}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="团队经理" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.teamManager}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="公司" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.company}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="区域" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.regional}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位" class-name="toggle" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="职级" class-name="toggle" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.rankName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="工号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.userCode}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="本期应发佣金(元)" show-overflow-tooltip width="130">
        <template slot-scope="scope">
        <span>{{scope.row.commission}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="本期实发佣金(元)" show-overflow-tooltip width="130">
        <template slot-scope="scope">
        <span>{{scope.row.finalCommission}}</span>
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
import { mapGetters } from 'vuex'
import { getAllPositon, getAllDeparts, getCommissionList, commissionListExport } from '@/api/achievement/index'
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
      deptName: [],
			treeDeptData: [],
			defaultProps: {
        children: 'children',
        label: 'name',
        value: 'name'
			},
			tableKey: 0,
			entryDateS: '',
			entryDateE: '',
			errorTip: false,
			errorMes: ''
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
		cycleList(list) {
			list.forEach(item => {
				if (item.children && !item.children.length) {
					delete item.children
				}
				if (item.children && item.children.length) {
					this.cycleList(item.children)
				}
			})
		},
		getList() {
			this.listLoading = true
			getAllDeparts()
				.then(response => {
					this.treeDeptData = response.data
					this.cycleList(this.treeDeptData)
			}),
			getCommissionList(this.listQuery).then(response => {
				this.list = response.data.records
				this.total = response.data.total
				this.list.map((item, index) => {
					item.occurrenceDate = parseTime(item.occurrenceDate, '{y}-{m}')
				})
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
			if ( (this.entryDateS === '' && this.entryDateE === '') || (this.entryDateS === null && this.entryDateE === null) || (this.entryDateS === '' && this.entryDateE === null) || (this.entryDateS === null && this.entryDateE === '') ) {
				// return
			} else if ( this.entryDateS === '' || this.entryDateE === '' || this.entryDateS === null || this.entryDateE === null ) {
				this.errorTip = true
				this.errorMes = '时间不能为空'
				 setTimeout(() => {
					this.errorTip = false
				}, 3000)
				return
			} else if (new Date(this.entryDateS).getTime() > new Date(this.entryDateE).getTime()) {
				this.errorTip = true
				this.errorMes = '结束时间不能小于开始时间'
				 setTimeout(() => {
					this.errorTip = false
				}, 3000)
				return
			}  else if (this.entryDateS && this.entryDateE) {
				this.listQuery.date = [parseTime(this.entryDateS, '{y}-{m}'), parseTime(this.entryDateE, '{y}-{m}')]
			}
			this.listQuery.page = 1
			if(this.deptName.length) {
				this.listQuery.deptName = this.deptName[this.deptName.length - 1]
      }
			this.getList()
		},
		resetFilter() { // 重置搜索条件
			this.listQuery = {
				page: 1,
				limit: 20,
				username: undefined,
				positionName: undefined,
				deptName: undefined,
				date: undefined
			},
			this.entryDateE = '',
			this.entryDateS = ''
			this.deptName = []
			// this.handleFilter()
			this.getList()
		},
		handleImport() {
			this.$router.push({ path: '/achievement/importListExcel' })
		},
		handleExport() {
			commissionListExport(this.listQuery).then(response => {
        const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]) // 导出时要decodeURI
        const blob = new Blob([res.data], { type: 'blob' })
        const objectUrl = URL.createObjectURL(blob)
        this.forceDownload(objectUrl, fileName)
			})
		},
		forceDownload (url, name) {
			const link = document.createElement('a')
			link.href = url
			link.download = name
			link.click()
		},
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
	// width: 143px;
	// box-sizing: border-box
}
.error{
	position: absolute;
	left: 0;
	top: 50px;
	line-height: 0;
	color: #f56c6c;
  font-size: 12px;
}
</style>
