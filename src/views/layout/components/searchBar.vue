<template>
  <div class="filter-container">
    <el-form label-position="right" label-width="100px">
      <el-row :gutter="20">
        <el-col :sm="12" :lg="8" v-if="searchKeyword">
          <el-form-item label="搜索">
            <el-input
              placeholder="搜索客户姓名、编号"
              prefix-icon="el-icon-search"
              v-model="listQuery.keyword">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchMobile">
          <el-form-item label="手机号">
            <el-input
              placeholder="搜索客户手机号"
              prefix-icon="el-icon-search"
              v-model="listQuery.mobile">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="searchClientType">
          <el-form-item label="投资者类型">
            <el-select v-model="listQuery.clientType" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in clientType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="searchRealNameStatus">
          <el-form-item label="实名认证状态">
            <el-select v-model="listQuery.realNameStatus" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in realnameStatus" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchDeptId">
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
        <el-col :sm="12" :lg="8" v-if="searchIdNo">
          <el-form-item label="客户证件号码">
            <el-input
              placeholder="搜索客户证件号码"
              prefix-icon="el-icon-search"
              v-model="listQuery.idNo">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchClientClass">
          <el-form-item label="客户类型">
            <el-select v-model="listQuery.type" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in clientClass" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="searchAmount">
          <el-form-item label="资产规模区间">
            <el-input
              style="width: 48%; margin-right: 2%"
              placeholder="请输入开始数字"
              prefix-icon="el-icon-search"
              v-model="listQuery.amountStart">
            </el-input>-
            <el-input
              style="width: 48%"
              placeholder="请输入结束数字"
              prefix-icon="el-icon-search"
              v-model="listQuery.amountEnd">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchEmail">
          <el-form-item label="理财师">
            <el-input
              placeholder="搜索理财师邮箱前缀"
              prefix-icon="el-icon-search"
              v-model="listQuery.email">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchNationality">
          <el-form-item label="国籍" style="margin-bottom: 10px;">
            <el-select v-model="listQuery.nationality" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in nationality" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="listQuery.nationality == 0 & searchCity">
          <el-form-item label="地区">
            <el-cascader
              size="large"
              :options="options"
              :props="defaultProps2"
              v-model="listQuery.city">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-button type="info" style="padding: 10px 60px;" @click="handleFilter">查询</el-button>
        <el-button type="info" style="padding: 10px 60px" @click="resetFilter">重置</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { fetchDeptTree } from '@/api/role'
import { mapGetters } from 'vuex'
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

export default {
  props: {
    searchKeyword: {
      default: true
    },
    searchMobile: {
      default: true
    },
    searchClientType: {
      default: true
    },
    searchRealNameStatus: {
      default: true
    },
    searchDeptId: {
      default: true
    },
    searchIdNo: {
      default: true
    },
    searchClientClass: {
      default: true
    },
    searchAmount: {
      default: true
    },
    searchEmail: {
      default: true
    },
    searchNationality: {
      default: true
    },
    searchCity: {
      default: true
    },
  },
  data() {
    return {
      listQuery: {},
      deptId: [],
      treeDeptData: [],
      options: provinceAndCityData,
      listQuery: {
        page: 1,
        limit: 20
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      defaultProps2: {
        value: 'label'
      },
    }
  },
  computed: {
    ...mapGetters([
      'realnameStatus',
      'idTypeOptions',
      'nationality',
      'clientClass',
      'clientType'
    ])
  },
  created() {
    this.handleDept()
  },
  methods: {
    handleFilter() { // 搜索
      this.listQuery.page = 1

      let amountStart = this.listQuery.amountStart || -1
      let amountEnd = this.listQuery.amountEnd || -1
      this.listQuery.amount = [amountStart, amountEnd]

      if(this.deptId.length) {
        this.listQuery.deptId = this.deptId[this.deptId.length - 1]
      }

      if(this.listQuery.city) {
        this.listQuery.city = this.listQuery.city[1] == '市辖区' ? this.listQuery.city[0] : this.listQuery.city[1]
      }

      this.listQuery.orderByField = 'create_time'
      this.listQuery.isAsc = false

      console.log('this.listQuery')
      console.log(this.listQuery)
      this.$emit('search-list', this.listQuery)
    },
    resetFilter() { // 重置搜索条件
      this.listQuery = {
        page: 1,
        limit: 20,
        username: '',
        positionId: '',
        // delFlag: '',
        deptId: ''
      },
      this.deptId = []
      this.entryDate = []
      this.handleFilter()
    },
    handleDept() { // 获取部门
      fetchDeptTree()
        .then(response => {
          this.treeDeptData = response.data
          this.dialogDeptVisible = true
        })
    }
  }
}
</script>

