<template>
  <div id="app-container" style="padding: 0 15px;">
    
    <!--query-->
    <el-form class="query" :inline="true" :model="query_input">
      <el-form-item label="标题">
        <el-input clearable v-model="query_input.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input clearable v-model="query_input.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="query_input.published" placeholder="状态">
          <el-option label="草稿" :value=false></el-option>
          <el-option label="发布" :value=true></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止日期">
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
      <el-button @click="toInfo" type="primary" size="mini" icon="el-icon-plus">新增</el-button>
      <el-button @click="editBlogById(selectList[0].id)" :disabled="selectList.length != 1" type="success" size="mini" icon="el-icon-edit" style="margin-left: 5px;">编辑</el-button>
      <el-popconfirm @confirm="deleteBlogByIds" title="确定要删除选定内容吗？" style="margin-left: 5px;">
        <el-button slot="reference" :disabled="selectList.length == 0" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </el-popconfirm>
      <el-button @click="getExcel" type="warning" size="mini" icon="el-icon-download" style="margin-left: 5px;">导出</el-button>

    </div>

    <!--table-->
    <el-table
      class="table"
      :data="records"
      border
      v-loading="loading"
      @selection-change="selectChange"
      style="margin-top: 30px;"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="author" label="作者"/>
      <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.sort" disabled>
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="commentable" label="评论区">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.commentable ? 'primary' : 'danger'">
            {{ scope.row.commentable ? '正常' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="published" label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.published ? 'primary' : 'danger'">
            {{ scope.row.published ? '发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间"/>
      <el-table-column prop="gmtUpdate" label="更新时间"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="editBlogById(scope.row.id)" >编辑</el-button >
          <el-popconfirm @confirm="deleteBlogById(scope.row.id)" title="确定要删除选定内容吗？" style="margin-left: 5px;">
            <el-button slot="reference" size="mini" type="text" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
            
        </template>
      </el-table-column>
    </el-table>

    <!--pagination-->
    <el-pagination
      class="pagination"
      @current-change="currnetChange"
      @size-change="sizeChange"
      :current-page="page"
      :page-sizes="[5, 10, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

  </div>
</template>
<script>
import { download, types } from "@/utils/download";
import { getBlogList, getBlogListByQuery, deleteBlogById, deleteBlogByIds, getExcel} from "@/api/blog";
import { Message } from 'element-ui'
export default {
  name: 'blog',
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
        title: '',
        author: '',
        published: '',
        date: [],
      },
      query: {
        title: '',
        author: '',
        published: '',
        begin: '',
        end: '',
      },
      BASE_URL: process.env.VUE_APP_BASE_API,
      records: [],
      selectList: [],
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
      if((this.query_input.title == undefined || this.query_input.title == '') &&
          (this.query_input.author == undefined || this.query_input.author == '') &&
          (this.query_input.published === undefined || this.query_input.published === '') &&
          (this.query_input.date == undefined || this.query_input.date == '')) {
        return
      }
      this.query.title = this.query_input.title
      this.query.author = this.query_input.author
      this.query.published = this.query_input.published
      this.query.begin = this.query_input.date[0]
      this.query.end = this.query_input.date[1]
      this.mode = true
      this.getBlogListByQuery(this.query, 1, this.size)
    },
    clearQueryForm() {
      this.query = {
        title: '',
        author: '',
        published: '',
        begin: '',
        end: '',
      }
      this.query_input = {
        title: '',
        author: '',
        published: '',
        date: [],
      }
      if(this.mode) { //如果已查询
        this.mode = false
        this.getBlogList(1, this.size)
      }
    },
    toInfo() {
      this.$router.push({
        path: '/blog/info'
      })
    },
    selectChange(selectList) {
      this.selectList = selectList
    },
    // pagination
    currnetChange(page) {
      if(this.mode) {
        this.getBlogListByQuery(this.query, page, this.size)
      } else {
        this.getBlogList(page, this.size)
      }
    },
    sizeChange(size) {
      if(this.mode) {
        this.getBlogListByQuery(this.query, 1, size)
      } else {
        this.getBlogList(1, size)
      }
    },
  
    getBlogList(pageNum, pageSize) {
      this.loading = true
      getBlogList(pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    getBlogListByQuery(query, pageNum, pageSize) {
      this.loading = true
      getBlogListByQuery(query, pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    editBlogById(id) {
      this.$router.push({
          path: "/blog/info/" + id,
      })
    },
    deleteBlogById(id) {
      deleteBlogById(id).then(res => {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getBlogListByQuery(this.query, 1, this.size)
        } else {
          this.getBlogList(1, this.size)
        }
      })
    },
    deleteBlogByIds() {
      let ids = this.selectList.map(blog => blog.id)
      deleteBlogByIds(ids).then(res => {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getBlogListByQuery(this.query, 1, this.size)
        } else {
          this.getBlogList(1, this.size)
        }
      })
    },
    getExcel() {
      this.$confirm("此请求可能消耗大量时间, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        getExcel().then(res => {
          download(res.data, types.xlsx, "博客列表")
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
            })
        })
      })
    }
  },
  created() {
    this.getBlogList(1, this.size)
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