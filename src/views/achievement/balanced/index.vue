<template>
	<div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="所属部门">
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
              <el-input v-model="listQuery.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="工号">
              <el-input v-model="listQuery.empNo" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
        </el-row>
      </el-form> -->
			<el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="所属部门">
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
			this.handleFilter()
		},
	}
}
</script>
<style lang="scss" scoped>

</style>
