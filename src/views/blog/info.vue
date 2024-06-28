<template>
  <div class="app-container">
    <div class="title">
      <h3>{{ this.$route.meta.title }}</h3>
      <span class="tips">
        <el-icon class="el-icon-info"></el-icon>Tips:
        进行页面切换时应先保存修改, 页面切换仅单纯切换页面而不进行数据存储
      </span>
    </div>

    <el-steps :active="1" align-center style="margin-top: 10px;">
      <el-step title="博客信息" />
      <el-step title="博客内容" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form class="form" :rules="rules" :model="blog" ref="blogForm">

      <el-form-item label="标题" prop="title">
        <el-input clearable placeholder="标题" v-model="blog.title"></el-input>
      </el-form-item>

      <!--分类与标签-->
      <el-row>
        <el-col :sm="12" :xs="24">
          <el-form-item label="分类" prop="typeId">
            <el-select clearable placeholder="分类" v-model="blog.typeId">
              <el-option v-for="item in types" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="标签" prop="tagIds">
            <el-select multiple placeholder="标签" v-model="blog.tagIds">
              <el-option v-for="item in tags" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!--评论与排序-->
      <el-row>
        <el-col :sm="12" :xs="24">
          <el-form-item label="评论" prop="commentable">
            <el-select clearable v-model="blog.commentable" placeholder="评论区状态">
              <el-option label="禁用" :value=false></el-option>
              <el-option label="正常" :value=true></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="排序" prop="sort">
            <el-rate style="margin-top: 10px;" v-model="blog.sort">
            </el-rate>
          </el-form-item>
        </el-col>
      </el-row>

      <!--封面与简介-->
      <el-row>
        <el-col :sm="12" :xs="24">
          <el-form-item label="封面" prop="cover">
            <el-upload
              class="cover-upload"
              :headers="headers"
              :action="this.BASE_API + '/service_oss/cover'"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload">
              <img v-if="blog.cover" :src="blog.cover" class="cover">
              <i v-else class="el-icon-plus cover-upload-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" resize="none" placeholder="请输入内容"  v-model="blog.description"  maxlength="100"  show-word-limit/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-button class="page_button" type="primary" @click="submitBlogInfoForm('blogForm', $event)">保存修改</el-button>
      <el-button class="page_button" type="primary" @click="toContent" :disabled="!blog.id">下一步</el-button>
    </el-form>
  </div>
</template>

<script>
import { getBlogInfoById, saveOrUpdateBlog } from '@/api/blog';
import { getTagListAll } from '@/api/tag';
import { getTypeListAll } from '@/api/type';
import { getToken } from '@/utils/auth';
import { Message } from 'element-ui'

export default {
  name: 'info',
  data() {
    return {
      blog: {
        id: '',
        title: '',
        sort: 1,
        cover: '',
        commentable: true,
        description: '',
        typeId: '',
        tagIds: [],
      },
      types: [],
      tags: [],
      BASE_API: process.env.VUE_APP_BASE_API,
      headers: {
        "X-token": this.$store.getters.token
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
        ],
        typeId: [
          { required: true, message: "请选择分类", trigger: "blur" },
        ],
        tagIds: [
          { required: true, message: "请选择标签", trigger: "blur" },
        ],
        commentable: [
          { required: true, message: "请设置评论区权限", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请设置排序", trigger: "blur" },
        ],
        cover: [
          { required: true, message: "请上传封面", trigger: "blur" },
        ],
        description: [
          { required: true, message: "简介不能为空", trigger: "blur" },
          { min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
        ],
      }
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.getBlogInfoById(this.$route.params.id)
    }
    this.getTagListAll()
    this.getTypeListAll()
  },
  methods: {
    toContent() {
      this.$router.push({
          path: "/blog/content/" + this.blog.id,
      })
    },
    submitBlogInfoForm(form, evt) {
      //button 强制取消focus
      let target = evt.target;
      if(target.nodeName == "SPAN"){
          target = evt.target.parentNode;
      }
      target.blur();

      this.$refs[form].validate(valid => {
        if(valid) {
          if(this.$route.params && this.$route.params.id) {
            saveOrUpdateBlog(this.blog).then(res => {
              let id = res.data.id
              Message({
                message: '博客 [ ' + id + ' ] 已保存至草稿',
                type: 'success',
                duration: 5 * 1000
              })
              this.blog.id = id
            })
          } else {
            saveOrUpdateBlog(this.blog, getToken()).then(res => {
              let id = res.data.id
              Message({
                message: '博客 [ ' + id + ' ] 已保存至草稿',
                type: 'success',
                duration: 5 * 1000
              })
              this.blog.id = id
            })
          }
        } else {
          return false
        }
      })
    },
    handleCoverSuccess(res, file) {
      let data = res.data
      if(res.code !== 2000) {
        this.$message.error('文件上传失败' + '[ ' + res.message + ' ]');
      } else {
        this.$message.success('文件上传成功');
      }
      this.blog.cover = data.key
    },
    beforeCoverUpload(file) {
      const isLt2M = file.size / 1024 / 1024 <= 1;
      if (!isLt2M) {
        this.$message.error('上传封面大小不能超过 1MB!');
      }
      return isLt2M;
    },
    getBlogInfoById(id) {
      getBlogInfoById(id).then(res => {
        let data = res.data
        this.blog = data.blog
      })
    },
    getTagListAll() {
      getTagListAll().then(res => {
        let data = res.data
        this.tags = data.records
      })
    },
    getTypeListAll() {
      getTypeListAll().then(res => {
        let data = res.data
        this.types = data.records
      })
    }
  },
};
</script>
<style scoped>
.title {
  text-align: center;
}
.title .tips {
  background-color: #FFD700;
  color: #333;
  font-size: 14px;
}
.form {
  max-width: 950px;
  margin: 20px auto;
}
.form .el-input {
  width: 300px;
}
.form .el-select {
  width: 300px;
}
.form .el-textarea {
  width: 300px;
  height: 178px;
}
::v-deep.form .el-textarea__inner {
  height: 178px;
}
.next_button {
  float: right;
  letter-spacing: 1px;
  font-weight: bold;
}
/* cover-upload */
::v-deep .cover-upload .el-upload {
  border: 1px dashed #999;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .cover-upload .el-upload:hover {
  border-color: #409EFF;
}
::v-deep .cover-upload-icon {
  font-size: 28px;
  color: #999;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cover {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.page_button {
  float: right;
  letter-spacing: 1px;
  font-weight: bold;
  margin: 20px 5px;
}
</style>
