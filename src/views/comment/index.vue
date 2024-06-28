<template>
  <div id="app-container" style="padding: 0 15px;">
    
    <!--query-->
    <div class="query">
      <div class="input">
        <span>评论内容</span>
        <el-input clearable v-model="query_input" placeholder="评论内容"></el-input>
      </div>
      <div class="query-tool">
        <div class="m-button m-button-primary" @click="submitQueryForm">查询</div>
        <div class="m-button m-button-danger"  @click="clearQueryForm" style="margin-left: 10px;">重置</div>
      </div>
    </div>

    <!--tool-->
    <div class="tool">
      <el-popconfirm @confirm="deleteCommentByIds" title="确定要删除选定内容吗？" style="margin-left: 5px;">
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
      <el-table-column width="80" label="序号">
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="评论用户"/>
      <el-table-column width="100" prop="avatar" label="头像"> 
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.avatar">
        </template>
      </el-table-column>
      <el-table-column width="400" prop="content" label="内容"/>
      <el-table-column width="80" prop="isAdmin" label="用户权限">
        <template slot-scope="scope">
          <el-tag effect="plain" :type="scope.row.isAdmin ? 'primary' : 'danger'">
            {{ scope.row.isAdmin ? '管理员' : '访客' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120" prop="isAdmin" label="是否为根评论">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.parentId == '-1' ? 'primary' : 'danger'">
            {{ scope.row.parentId == '-1' ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="评论时间"/>
      <el-table-column width="80" label="操作">
        <template slot-scope="scope">
          <el-popconfirm @confirm="deleteCommentById(scope.row)" title="确定要删除选定内容吗？" style="margin-left: 5px;">
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
import {getCommentList, getCommentListByQuery, deleteCommentById, deleteCommentByIds, getExcel} from "@/api/comment";
import { Message } from 'element-ui';
export default {
  name: 'comment',
  components: {
  },
  data() {
    return {
      page: 1,
      size: 5,
      total: 10,
      loading: true,
      mode: false,
      query: '',
      query_input: '',
      records: [],
      selectList: [],
    }
  },
  methods: {
    // query form
    submitQueryForm() {
      if(this.query_input == undefined || this.query_input == null || this.query_input == '') {
        return
      }
      this.query = this.query_input
      this.mode = true
      this.getCommentListByQuery(this.query, 1, this.size)
    },
    clearQueryForm() {
      this.query = ''
      this.query_input = ''
      if(this.mode) { //如果已查询
        this.mode = false
        this.getCommentList(1, this.size)
      }
    },

    selectChange(selectList) {
      this.selectList = selectList
    },

    // pagination
    currnetChange(page) {
      if(this.mode) {
        this.getCommentListByQuery(this.query, page, this.size)
      } else {
        this.getCommentList(page, this.size)
      }
    },
    sizeChange(size) {
      if(this.mode) {
        this.getCommentListByQuery(this.query, 1, size)
      } else {
        this.getCommentList(1, size)
      }
    },
    getCommentList(pageNum, pageSize) {
      this.loading = true
      getCommentList(pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    getCommentListByQuery(query, pageNum, pageSize) {
      this.loading = true
      getCommentListByQuery(query, pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    deleteCommentById(comment) {
      deleteCommentById(comment.id).then(res => {
        Message({
          message: '成功删除' + res.data.count + '条评论',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getCommentListByQuery(this.query, 1, this.size)
        } else {
          this.getCommentList(1, this.size)
        }
      })
    },
    deleteCommentByIds() {
      let ids = this.selectList.map(tag => tag.id)
      deleteCommentByIds(ids).then(res => {
        Message({
          message: '成功删除' + res.data.count + '条评论',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getCommentListByQuery(this.query, 1, this.size)
        } else {
          this.getCommentList(1, this.size)
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
          download(res.data, types.xlsx, "评论信息")
        })
      })
    }
  },
  created() {
    this.getCommentList(1, this.size)
  }
}
</script>
<style scoped>
@import "~@/styles/m.scss";
.query {
  margin-top: 25px;
  display: flex;
}
.query span {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
  line-height: 40px;
  padding-right: 12px;
}
.query .input {
  float: left;
}
.query .query-tool {
  margin-left: 10px;
  float: left;
}
.query .input .el-input{
  width: 200px;
}
.tool {
  margin-top: 20px;
}
/* pagination */
.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
.table .avatar {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
::v-deep .el-input__inner{
  cursor: pointer;
}
::v-deep .el-range-input{
  cursor: pointer;
}
</style>