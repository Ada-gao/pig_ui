<template>
  <div class="filter-container">
    <el-form label-position="right" label-width="100px" ref="searchForm">
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
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="searchCertificationStatus">
          <el-form-item label="认证状态">
            <el-select v-model="listQuery.certificationStatus" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in certificationStatus" :key="item.value" :value="item.value" :label="item.label">
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
              placeholder="请输入"
              prefix-icon="el-icon-search"
              v-model="listQuery.amountStart">
            </el-input>-
            <el-input
              style="width: 48%"
              placeholder="请输入"
              prefix-icon="el-icon-search"
              v-model="listQuery.amountEnd">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchEmail">
          <el-form-item label="理财师">
            <el-input
              placeholder="搜索理财师"
              prefix-icon="el-icon-search"
              v-model="listQuery.userName">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="searchValidate">
          <el-form-item label="手机号验证状态">
            <el-select v-model="listQuery.mobileValidated" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in mobileValidatedArr" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchNationality">
          <el-form-item label="国籍" style="margin-bottom: 10px;">
            <el-select v-model="listQuery.nationality" @change="changeNation" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in nationality" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="listQuery.nationality && searchCity">
          <el-form-item label="地区">
            <el-cascader
              size="large"
              :options="options"
              :props="defaultProps2"
              v-model="city">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchPreserveExpired">
          <el-form-item label="保护期过期">
            <el-select v-model="listQuery.preserveStatus" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in preserveExpired" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :lg="8" v-if="searchDisplayType">
          <el-form-item label="显示类型">
            <el-select v-model="listQuery.allDisplay" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in displayType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-button class="search_btn btn-padding" type="info" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
        <el-button class="search_btn btn-padding" type="info" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { fetchDeptTree } from '@/api/role'
import { mapGetters } from 'vuex'
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据
import { eachChildren } from '@/utils'

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
    searchCertificationStatus: {
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
    searchValidate: {
      default: false
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
    searchPreserveExpired: {
      default: false
    },
    searchDisplayType: {
      default: false
    }
  },
  data() {
    return {
      listQuery: {},
      mobileValidatedArr: [
        {
          label: '未验证',
          value: '1'
        },
        {
          label: '已验证',
          value: '0'
        }
      ],
      displayType: [
        {
          label: '不在标签内的客户',
          value: '1'
        },
        // {
        //   label: '在标签内的客户',
        //   value: '2'
        // },
        {
          label: '全部',
          value: '3'
        }
      ],
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
      city: []
    }
  },
  computed: {
    ...mapGetters([
      'certificationStatus',
      'realnameStatus',
      'idTypeOptions',
      'nationality',
      'clientClass',
      'clientType',
      'preserveExpired'
    ])
  },
  watch: {
    searchDisplayType(cur, old) {
      this.listQuery = {
        page: 1,
        limit: 20,
        username: '',
        positionId: '',
        // delFlag: '',
        deptId: '',
        mobileValidated: undefined,
        city: '',
        allDisplay: ''
      }
      this.deptId = []
      this.city = []
      this.entryDate = []
    }
  },
  created() {
    this.handleDept()
  },
  methods: {
    handleFilter() { // 搜索
      this.listQuery.page = 1
      this.listQuery.orderByField = 'create_time'
      this.listQuery.isAsc = false

      if(this.deptId.length) {
        this.listQuery.deptId = this.deptId[this.deptId.length - 1]
      }
      let amountStart = this.listQuery.amountStart || -1
      let amountEnd = this.listQuery.amountEnd || -1
      this.listQuery.amount = [amountStart, amountEnd]

      if(this.city.length) {
        this.listQuery.city = this.city[1] == '市辖区' ? this.city[0] : this.city[1]
      }
      if (this.searchDisplayType) {
        this.listQuery.orderByField = 'tab.create_time'
        delete this.listQuery.amount
      }
      this.$emit('search-list', this.listQuery)
    },
    resetFilter() { // 重置搜索条件
      this.listQuery = {
        page: 1,
        limit: 20,
        username: '',
        positionId: '',
        // delFlag: '',
        deptId: '',
        mobileValidated: undefined,
        city: '',
        allDisplay: ''
      },
      console.log(this.listQuery.nationality)
      this.deptId = []
      this.city = []
      this.entryDate = []
      this.handleFilter()
    },
    handleDept() { // 获取部门
      fetchDeptTree()
        .then(response => {
          this.treeDeptData = response.data
          eachChildren(this.treeDeptData)
          this.dialogDeptVisible = true
        })
    },
    changeNation() {
      this.city = []
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

.btn-padding {
  @include padding;
}
// .el-form-item__content:focus,
// .el-input__inner:focus,
// .el-input:focus,
// .el-input:active {
//   outline: 1px solid #00C1DF;
//   border-radius: 4px;
// }
.el-form-item__content:focus,
.el-input:focus {
  border: 1px solid #00C1DF;
  border-radius: 4px;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
    border-color: #00C1DF;
    outline: 0;
}
</style>

