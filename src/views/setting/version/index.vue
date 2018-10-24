<template>
  <div class="app-container">
    <div class="detail-title" style="text-align: right">
      <!-- <span class="list-tit">版本列表</span> -->
      <el-button v-if="version_add" class="add_btn" @click="handleCreate">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>发布新版本
      </el-button>
    </div>
    <el-table :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="平台">
        <template slot-scope="scope">
          <span>{{scope.row.platform}}</span>
        </template>platform
      </el-table-column>
      <el-table-column align="center" label="标识号">
        <template slot-scope="scope">
          <span>{{scope.row.appPackage}}</span>
        </template>platform
      </el-table-column>
      <el-table-column align="center" label="版本名称">
        <template slot-scope="scope">
          <span>{{scope.row.versionName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号">
        <template slot-scope="scope">
          <span>{{scope.row.versionCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime|parseTime()}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="升级方式">
        <template slot-scope="scope">
          <span>{{scope.row.promptType === 'Silence'?'静默':scope.row.promptType === 'Force'?'强制':'推荐'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="version_upd" align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10,20,30, 50]"
                     background
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getVersionPage } from '@/api/version'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        currentPage: 1,
        list: null,
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      this.getList()
      this.version_add = this.permissions['version_add']
      this.version_upd = this.permissions['version_upd']
    },
    methods: {
      getList() {
        getVersionPage(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          // this.list.forEach(item => {
          //   item.createTime = this.Utils.formatDateTime(item.createTime)
          // })
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val - 1
        this.getList()
      },
      handleCreate() {
        this.$router.push({path: 'version/detail'})
      },
      handleUpdate (obj) {
        this.$router.push({path: 'version/detail/' + obj.appVersionId})
      },
    }
  }
</script>

