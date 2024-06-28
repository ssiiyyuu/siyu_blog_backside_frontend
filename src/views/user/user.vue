<template>
  <div id="app-container" style="padding: 0 15px;">
    
    <!--query-->
    <el-form class="query" :inline="true" :model="query_input">
      <el-form-item label="用户名">
        <el-input clearable v-model="query_input.name" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-select clearable v-model="query_input.role" placeholder="权限">
          <el-option label="admin" value="admin"></el-option>
          <el-option label="visitor" value="visitor"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="query_input.status" placeholder="状态">
          <el-option label="禁用" :value=false></el-option>
          <el-option label="正常" :value=true></el-option>
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
      <el-button @click="showSaveForm" type="primary" size="mini" icon="el-icon-plus">新增</el-button>
      <el-button @click="showEditForm(selectList[0])" :disabled="selectList.length != 1" type="success" size="mini" icon="el-icon-edit" style="margin-left: 5px;">编辑</el-button>
      <el-popconfirm @confirm="deleteUserByIds" title="确定要删除选定内容吗？" style="margin-left: 5px;">
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
      <el-table-column prop="name" label="用户名"/>
      <el-table-column width="100" prop="avatar" label="头像"> 
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.avatar">
        </template>
      </el-table-column>
      <el-table-column prop="role" label="权限">
        <template slot-scope="scope">
          <el-tag effect="light">
            {{ scope.row.role}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.status ? 'primary' : 'danger'">
            {{ scope.row.status ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间"/>
      <el-table-column prop="gmtUpdate" label="更新时间"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="showEditForm(scope.row)" >编辑</el-button >
          <el-popconfirm @confirm="deleteUserById(scope.row.id)" title="确定要删除选定内容吗？" style="margin-left: 5px;">
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
        <el-form-item label="用户名" prop="name">
          <el-input v-model="saveOrEdit.name" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogFormTitle === '新增用户'">
          <el-input v-model="saveOrEdit.password" placeholder="密码"/>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-select clearable v-model="saveOrEdit.role" placeholder="权限">
            <el-option label="admin" value="admin"></el-option>
            <el-option label="visitor" value="visitor"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select :disabled="dialogFormTitle != '编辑用户'" clearable v-model="saveOrEdit.status" placeholder="状态">
            <el-option label="禁用" :value=false></el-option>
            <el-option label="正常" :value=true></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="avatar" class="avatar-wrapper">
          <img class="avatar" :src="saveOrEdit.avatar" @click="avatarUploadVisible = true">
          <div class="m-button m-button-primary m-button-mini" @click="avatarUploadVisible = true"><i class="el-icon-upload"></i>上传</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="m-button m-button-primary" @click="submitSaveOrEditForm('saveOrEditForm')"><i class="el-icon-check"></i>确认</div>
        <div class="m-button m-button-danger" @click="clearSaveOrEditForm('saveOrEditForm')"><i class="el-icon-close"></i>取消</div>
      </div>
    </el-dialog>

    <image-cropper
      class="upload-cropper"
      v-show="avatarUploadVisible"
      :key="uploadAvatarKey"
      :url="this.BASE_URL + '/service_oss/avatar'"
      field="file"
      @close="avatarUploadVisible = false"
      @crop-upload-success="uploadAvatarSuccess"
    />
  </div>
</template>
<script>
import { download, types } from "@/utils/download";
import ImageCropper from "@/components/ImageCropper";
import {saveOrUpdateUser, getUserList, getUserListByQuery, deleteUserById, deleteUserByIds, getExcel} from "@/api/user";
import { Message } from 'element-ui'
export default {
  name: 'user',
  components: {
    ImageCropper,
  },
  data() {
    return {
      page: 1,
      size: 5,
      total: 10,
      loading: true,
      dialogFormTitle: '',
      dialogFormVisible: false,
      avatarUploadVisible: false,
      uploadAvatarKey: 0,
      BASE_URL: process.env.VUE_APP_BASE_API,
      mode: false,
      query_input: {
        name: '',
        role: '',
        status: '',
        date: [],
      },
      query: {
        name: '',
        role: '',
        status: '',
        begin: '',
        end: '',
      },
      saveOrEdit: {
        id: '',
        name: '',
        password: '',
        role: '',
        status: '',
        avatar: 'http://img.siyu.site/avatar/default.jpg'
      },
      records: [],
      selectList: [],
      //表单校验规则
      rules: {
        name: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          { min: 1, max: 12, message: "长度在 1 到 12 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择用户权限", trigger: "blur" }],
        status: [{ required: true, message: "请选择用户状态", trigger: "blur" }],
        avatar: [{ required: true, message: "请上传用户头像", trigger: "blur" }],
      },
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
      if((this.query_input.name == undefined || this.query_input.name == '') &&
          (this.query_input.role == undefined || this.query_input.role == '') &&
          (this.query_input.status === undefined || this.query_input.status === '') &&
          (this.query_input.date == undefined || this.query_input.date == '')) {
        return
      }
      this.query.name = this.query_input.name
      this.query.role = this.query_input.role
      this.query.status = this.query_input.status
      this.query.begin = this.query_input.date[0]
      this.query.end = this.query_input.date[1]
      this.mode = true
      this.getUserListByQuery(this.query, 1, this.size)
    },
    clearQueryForm() {
      this.query = {
        name: '',
        role: '',
        status: '',
        begin: '',
        end: '',
      }
      this.query_input = {
        name: '',
        role: '',
        status: '',
        date: [],
      }
      if(this.mode) { //如果已查询
        this.mode = false
        this.getUserList(1, this.size)
      }
    },

    // save or edit form
    showSaveForm() {
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增用户'
      this.saveOrEdit.status = true
    },
    showEditForm(user) {
      this.dialogFormVisible = true
      this.dialogFormTitle = '编辑用户'
      this.saveOrEdit.id = user.id
      this.saveOrEdit.name = user.name
      this.saveOrEdit.role = user.role
      this.saveOrEdit.status = user.status
      this.saveOrEdit.avatar = user.avatar

    },
    submitSaveOrEditForm(form) {
      this.$refs[form].validate(valid => {
        if(valid) {
          saveOrUpdateUser(this.saveOrEdit).then(res => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.clearSaveOrEditForm('saveOrEditForm')
            if(this.mode) {
              this.getUserListByQuery(this.query, 1, this.size)
            } else {
              this.getUserList(1, this.size)
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
        name: '',
        password: '',
        role: '',
        status: '',
        avatar: ''
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
        this.getUserListByQuery(this.query, page, this.size)
      } else {
        this.getUserList(page, this.size)
      }
    },
    sizeChange(size) {
      if(this.mode) {
        this.getUserListByQuery(this.query, 1, size)
      } else {
        this.getUserList(1, size)
      }
    },
    uploadAvatarSuccess(data) {
      let avatar = data.key
      this.saveOrEdit.avatar = avatar
    },
    getUserList(pageNum, pageSize) {
      this.loading = true
      getUserList(pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    getUserListByQuery(query, pageNum, pageSize) {
      this.loading = true
      getUserListByQuery(query, pageNum, pageSize).then(res => {
        this.loading = false
        let data = res.data
        this.records = data.records
        this.page = data.curPage
        this.total = data.total
        this.size = data.size
      })
    },
    deleteUserById(id) {
      deleteUserById(id).then(res => {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getUserListByQuery(this.query, 1, this.size)
        } else {
          this.getUserList(1, this.size)
        }
      })
    },
    deleteUserByIds() {
      let ids = this.selectList.map(user => user.id)
      deleteUserByIds(ids).then(res => {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        if(this.mode) {
          this.getUserListByQuery(this.query, 1, this.size)
        } else {
          this.getUserList(1, this.size)
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
          download(res.data, types.xlsx, "用户列表")
        })
      })
    }
  },
  created() {
    this.getUserList(1, this.size)
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
/* dialog */
.dialog .el-form-item {
  padding: 0 5px;
}
.dialog .el-input{
  width: 200px;
}
.dialog .el-select{
  width: 200px;
}
.dialog .avatar-wrapper .avatar{
  height: 100px;
  width: 100px;
  border: 1px solid #999;
  border-radius: 50%;
  cursor: pointer;
}
.dialog .dialog-footer .m-button{
  margin: 0 5px;
}
/* pagination */
.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
.vue-image-crop-upload >>> .vicp-wrap {
  width: 520px;
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