<template>
  <div id="app-container" style="padding: 0 15px;">
    
    <!--query-->
    <div class="query">
      <div class="input">
        <span>标签名</span>
        <el-input clearable v-model="query_input" placeholder="标签"></el-input>
      </div>
      <div class="query-tool">
        <div class="m-button m-button-primary" @click="submitQueryForm">查询</div>
        <div class="m-button m-button-danger"  @click="clearQueryForm" style="margin-left: 10px;">重置</div>
      </div>
    </div>

    <!--tool-->
    <div class="tool">
      <el-button @click="showSaveForm" type="primary" size="mini" icon="el-icon-plus">新增</el-button>
      <el-button @click="showEditForm(selectList[0])" :disabled="selectList.length != 1" type="success" size="mini" icon="el-icon-edit" style="margin-left: 5px;">编辑</el-button>
      <el-popconfirm @confirm="deleteTagByIds" title="确定要删除选定内容吗？" style="margin-left: 5px;">
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
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="title" label="标签名"/>
      <el-table-column prop="count" label="博客关联数"/>
      <el-table-column label="操作">
        <template slot="header" slot-scope="scope">
          <span>操作</span> 
          <el-tooltip effect="dark" content="删除标签将同时删除博客关联, 请谨慎操作" placement="right">
            <el-icon style="margin-left: 5px; cursor: pointer;" class="el-icon-info"></el-icon>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="showEditForm(scope.row)" >编辑</el-button >
          <el-popconfirm @confirm="deleteTagById(scope.row.id)" title="确定要删除选定内容吗？" style="margin-left: 5px;">
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

    <el-dialog class="dialog" :title="dialogFormTitle" :visible.sync="dialogFormVisible">
      <el-form :model="saveOrEdit" :rules="rules" ref="saveOrEditForm" label-position="left">
        <el-form-item label="标签名" prop="title">
          <el-input v-model="saveOrEdit.title" placeholder="标签名"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="m-button m-button-primary" @click="submitSaveOrEditForm('saveOrEditForm')"><i class="el-icon-check"></i>确认</div>
        <div class="m-button m-button-danger" @click="clearSaveOrEditForm('saveOrEditForm')"><i class="el-icon-close"></i>取消</div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { download, types } from "@/utils/download";
import {saveOrUpdateTag, getTagList, getTagListByQuery, deleteTagById, deleteTagByIds, getExcel} from "@/api/tag";
import { Message } from 'element-ui'
export default {
  name: 'tag',
  components: {
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 10,
      loading: true,
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogFormTitle: '', 
      mode: false,
      query: '',
      query_input: '',
      saveOrEdit: {
        id: '',
        title: '',
      },
      records: [],
      selectList: [],
      //表单校验规则
      rules: {
        title: [
          { required: true, message: "请填写标签名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
        ],
      },
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
      this.getTagListByQuery(this.query, 1, this.size)
    },
    clearQueryForm() {
      this.query = ''
      this.query_input = ''
      if(this.mode) { //如果已查询
        this.mode = false
        this.getTagList(1, this.size)
      }
    },

    // save or edit form
    showSaveForm() {
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增标签'
    },
    showEditForm(tag) {
      this.dialogFormVisible = true
      this.dialogFormTitle = '编辑标签'
      this.saveOrEdit.id = tag.id
      this.saveOrEdit.title = tag.title
    },
    submitSaveOrEditForm(form) {
      this.$refs[form].validate(valid => {
        if(valid) {
          saveOrUpdateTag(this.saveOrEdit).then(res => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.clearSaveOrEditForm('saveOrEditForm')
            if(this.mode) {
              this.getTagListByQuery(this.query, 1, this.size)
            } else {
              this.getTagList(1, this.size)
            }
          })
        } else {
          return false
        }
      })
    },
    clearSaveOrEditForm(form) {
      this.saveOrEdit = {
        id: '',
        title: '',
      }
      this.dialogFormVisible = false
      this.dialogFormTitle = ''
      this.$refs[form].resetFields();
    },
    selectChange(selectList) {
      this.selectList = selectList
    },

    // pagination
    currnetChange(page) {
      if(this.mode) {
        this.getTagListByQuery(this.query, page, this.size)
      } else {
        this.getTagList(page, this.size)
      }
    },
    sizeChange(size) {
      if(this.mode) {
        this.getTagListByQuery(this.query, 1, size)
      } else {
        this.getTagList(1, size)
      }
    },
    getTagList(pageNum, pageSize) {
      this.loading = true
      getTagList(pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    getTagListByQuery(query, pageNum, pageSize) {
      this.loading = true
      getTagListByQuery(query, pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    deleteTagById(id) {
      deleteTagById(id).then(res => {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getTagListByQuery(this.query, 1, this.size)
        } else {
          this.getTagList(1, this.size)
        }
      })
    },
    deleteTagByIds() {
      let ids = this.selectList.map(tag => tag.id)
      deleteTagByIds(ids).then(res => {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getTagListByQuery(this.query, 1, this.size)
        } else {
          this.getTagList(1, this.size)
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
          download(res.data, types.xlsx, "标签列表")
        })
      })
    }
  },
  created() {
    this.getTagList(1, this.size)
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
/* dialog */
.dialog .el-form-item {
  padding: 0 5px;
}
.dialog .el-input{
  width: 200px;
}
.dialog .dialog-footer .m-button{
  margin: 0 5px;
}
/* pagination */
.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
::v-deep .el-input__inner{
  cursor: pointer;
}
::v-deep .el-range-input{
  cursor: pointer;
}
</style>