<template>
  <div id="app-container" style="padding: 0 15px;">
    
    <!--query-->
    <el-form class="query" :inline="true" :model="query_input">
      <el-form-item label="最后访问起止日期">
        <el-date-picker
        style="width: 380px;"
          v-model="query_input.date"
          type="datetimerange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="m-button m-button-primary" @click="submitQueryForm">查询</div>
        <div class="m-button m-button-danger"  @click="clearQueryForm" style="margin-left: 10px;">重置</div>
      </el-form-item>
    </el-form>

    <!--tool-->
    <div class="tool">
      <el-button @click="getExcel" type="warning" size="mini" icon="el-icon-download" style="margin-left: 5px;">导出</el-button>
    </div>

    <!--table-->
    <el-table
      class="table"
      :data="records"
      border
      v-loading="loading"
      style="margin-top: 30px;"
    >
      <el-table-column width="80" label="序号">
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="uuid" label="UUID"/>
      <el-table-column width="120" prop="ip" label="IP"/>
      <el-table-column width="160" prop="ipAddress" label="地址"/> 
      <el-table-column width="100" prop="os" label="os"/>
      <el-table-column width="100" prop="device" label="设备"/>
      <el-table-column width="100" prop="browser" label="浏览器"/>
      <el-table-column width="60" prop="view" label="访问次数"/>
      <el-table-column width="160" prop="gmtCreate" label="首次访问时间"/>
      <el-table-column width="160" prop="gmtUpdate" label="最后访问时间"/>
    </el-table>

    <!--pagination-->
    <el-pagination
      class="pagination"
      @current-change="currnetChange"
      @size-change="sizeChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import { download, types } from "@/utils/download";
import { getVisitorList, getVisitorListByQuery, getExcel} from "@/api/visitor";
export default {
  name: 'visitor',
  components: {
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 10,
      loading: true,
      mode: false,
      query_input: {
        date: [],
      },
      query: {
        begin: '',
        end: '',
      },
      records: [],
      //时间选择器配置
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  methods: {
    // query form 只有点击查找按钮后才会更新query
    submitQueryForm() {
      if(this.query_input == undefined || this.query_input == null) {
        return
      }
      if(this.query_input.date == undefined || this.query_input.date == '') {
        return
      }
      this.query.begin = this.query_input.date[0]
      this.query.end = this.query_input.date[1]
      this.mode = true
      this.getVisitorListByQuery(this.query, 1, this.size)
    },
    clearQueryForm() {
      this.query = {
        begin: '',
        end: ''
      }
      this.query_input = {
        date: []
      }
      if(this.mode) { //如果已查询
        this.mode = false
        this.getVisitorList(1, this.size)
      }
    },

    // pagination
    currnetChange(page) {
      if(this.mode) {
        this.getVisitorListByQuery(this.query, page, this.size)
      } else {
        this.getVisitorList(page, this.size)
      }
    },
    sizeChange(size) {
      if(this.mode) {
        this.getVisitorListByQuery(this.query, 1, size)
      } else {
        this.getVisitorList(1, size)
      }
    },
    
    getVisitorList(pageNum, pageSize) {
      this.loading = true
      getVisitorList(pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    getVisitorListByQuery(query, pageNum, pageSize) {
      this.loading = true
      getVisitorListByQuery(query, pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    getExcel() {
      this.$confirm("此请求可能消耗大量时间, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        getExcel().then(res => {
          download(res.data, types.xlsx, "访客列表")
        })
      })
    }
  },
  created() {
    this.getVisitorList(1, this.size)
  }
}
</script>
<style scoped>
@import "~@/styles/m.scss";
.query {
  margin-top: 25px;
}
.query.el-form .el-form-item {
  padding: 0 2.5px;
}
.query.el-form .el-input {
  width: 140px;
}
.query.el-form .el-select {
  width: 140px;
}
/* pagination */
.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
.vue-image-crop-upload >>> .vicp-wrap {
  width: 520px;
}
::v-deep .el-input__inner{
  cursor: pointer;
}
::v-deep .el-range-input{
  cursor: pointer;
}
</style>