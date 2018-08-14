<template>
	<div class="app-container calendar-list-container">
    <div class="filter-container">
			<el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="部门">
							<el-cascader
								style="width: 100%"
								:options="treeDeptData"
								:props="defaultProps"
								:show-all-levels="false"
								change-on-select
								v-model="deptname"
								@focus="blur"
							></el-cascader>
						</el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select style="width: 100%" class="filter-item" v-model="listQuery.positionname" placeholder="请选择" @focus="handlePosition()">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :value="item.positionName" :label="item.positionName">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="姓名">
              <el-input class="filter-item" v-model="listQuery.username" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="工号">
              <el-input class="filter-item" v-model="listQuery.usercode" placeholder="请输入工号"></el-input>
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
      <el-button v-if="balanced_score_card_import" class="add_btn" @click="handleImport">
        <svg-icon icon-class="import" style="margin-right: 5px;"></svg-icon>批量导入
      </el-button>
      <el-button v-if="balanced_score_card_export" class="add_btn" @click="handleExport">
        <svg-icon icon-class="export" style="margin-right: 5px;"></svg-icon>批量导出
      </el-button>
    </div>
		<el-table :key='tableKey'
							:data="list"
							v-loading="listLoading"
							element-loading-text="给我一点时间"
							border fit
              highlight-current-row
							style="width: 100%">
      <el-table-column align="center" label="时间"  width="190">
				<template slot-scope="scope">
        <span>{{scope.row.start}}—{{scope.row.end}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column>

			<el-table-column align="center" label="职级" class-name="toggle">
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

			<el-table-column align="center" label="平衡计分卡系数" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.coefficient}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a v-if="balanced_score_card_edit" size="small" class="common_btn"
             @click="handleUpdate(scope.row)">编辑
          </a>
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
		<el-dialog title="编辑平衡积分卡系数" :visible.sync="dialogEditVisible">
      <el-form :model="form" ref="form" label-width="170px" :rules="rules">
        <el-form-item label="平衡计分卡系数（%）" prop="coefficient">
          <el-input v-model="form.coefficient"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAllPositon, getAllDeparts, getBalancedList, getBalancedId, editBalanced, balancedExport } from '@/api/achievement/index'
import { parseTime, transformText } from '@/utils'
export default {
	data () {
		const validatePass = (rule, value, callback) => {
			console.log(!new RegExp("^[0-9]*$").test(value))
			if (!value) {
				callback('请输入平衡计分卡系数')
			} else if (!new RegExp("^[0-9]*$").test(value)) {
				callback('只能填写数字哦')
			} else {
				callback()
			}
			// if (Number(value) > 1) {
			// 	callback(new Error('平衡计分卡系数不能大于1'))
			// } else {
			// 	callback()
			// }
		}
		return	{
			list: null,
			total: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20
			},
			positionsOptions: [],
      deptname: [],
			treeDeptData: [],
			defaultProps: {
        children: 'children',
        label: 'name',
        value: 'name'
			},
			tableKey: 0,
			dialogEditVisible: false,
			form: {
        coefficient: undefined,
			},
			rules: {
				coefficient: [
					{ required: true, trigger: 'blur', validator: validatePass }
				]
			}
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
		this.balanced_score_card_edit = this.permissions['balanced_score_card_edit']
		this.balanced_score_card_import = this.permissions['balanced_score_card_import']
		this.balanced_score_card_export = this.permissions['balanced_score_card_export']
  },
	methods: {
		blur() {
			console.log('1111')
		},
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
			getBalancedList(this.listQuery).then(response => {
				this.list = response.data.records
				this.list.map((item, index) => {
					item.start = parseTime(item.start, '{y}-{m}-{d}')
					item.end = parseTime(item.end, '{y}-{m}-{d}')
				})
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
			if(this.deptname.length) {
				this.listQuery.deptname = this.deptname[this.deptname.length - 1]
      }
			this.getList()
		},
		resetFilter() { // 重置搜索条件
			this.listQuery = {
				page: 1,
				limit: 20,
				username: undefined,
				positionname: undefined,
				// status: '',
				deptname: undefined,
				usercode: undefined
			},
			this.deptname = []
			this.handleFilter()
		},
		handleImport() {
			this.$router.push({ path: '/achievement/importBalancedExcel' })
		},
		handleExport() {
			balancedExport(this.listQuery).then(res => {
        const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]) // 导出时要decodeURI
        console.log(res)
        console.log(fileName)
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
		handleUpdate (item) {
			this.dialogEditVisible = true
			getBalancedId(item.balancedScoreCardId).then(response => {
				this.form = response.data
			})
		},
		cancel(formName) {
			this.dialogEditVisible = false
			this.$refs[formName].resetFields()
		},
		update(formName) {
				const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
						this.form.coefficient -= 0
						let obj = {
							"coefficient": this.form.coefficient,
							"balancedScoreCardId": this.form.balancedScoreCardId
							}
						editBalanced(obj).then(response => {
							this.dialogEditVisible = false
							this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
						})
          } else {
            return false
          }
        })
      },
	}
}
</script>
<style lang="scss" scoped>

</style>
