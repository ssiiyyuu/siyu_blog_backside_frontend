<template>
  <div>
    <div class="title">
      <h3>完善内容</h3>
      <span class="tips">
        <el-icon class="el-icon-info"></el-icon>Tips:
        进行页面切换时应先保存修改, 页面切换仅单纯切换页面而不进行数据存储
      </span>
    </div>
    <el-steps :active="2" align-center style="margin-top: 10px;">
      <el-step title="博客信息" />
      <el-step title="博客内容"/>
      <el-step title="最终发布" />
    </el-steps>
    <div class="markdown-container">
      <div class="upload-wrapper">
        <el-upload
          class="upload"
          :show-file-list=false
          :headers="headers"
          :action="this.BASE_API + '/service_oss/img'"
          :on-success="uploadSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <div class="copy">
          <el-select v-model="copyImg" placeholder="选择图片以复制">
            <el-option
              v-for="img in imgList"
              :key="img.url"
              :label="img.name"
              :value="img.url">
            </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" icon="el-icon-document-copy" circle @click="copy"></el-button>
        </div>
      </div>
      <markdown-editor v-model="blog.content" height="400px" />
      <el-button class="page-button" type="primary" @click="saveOrUpdateBlog">保存修改</el-button>
      <el-button class="page-button" type="primary" @click="toPublish">下一步</el-button>
      <el-button class="page-button" type="primary" @click="toInfo">上一步</el-button>
    </div>
  </div>
</template>
<script>
import { getBlogContentById, saveOrUpdateBlog} from '@/api/blog';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Message } from 'element-ui'

export default {
  name: 'blogContent',
  components: {
    MarkdownEditor
  },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API,
      headers: {
        "X-token": this.$store.getters.token
      },
      blog: {
        id: this.$route.params.id,
        content: '',
      },
      imgList: [],
      copyImg: ''
    }
  },
  methods: {
    saveOrUpdateBlog(evt) {
      let target = evt.target;
      if(target.nodeName == "SPAN"){
          target = evt.target.parentNode;
      }
      target.blur();
      saveOrUpdateBlog(this.blog).then(res => {
        let id = res.data.id
        Message({
          message: '博客 [ ' + id + ' ] 修改成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    toInfo() {
      this.$router.push({
          path: "/blog/info/" + this.$route.params.id,
      })
    },
    toPublish() {
      this.$router.push({
          path: "/blog/publish/" + this.$route.params.id,
      })
    },
    uploadSuccess(res, file) {
      if(res.code !== 2000) {
        this.$message({
          message: res.message,
          type: 'error'
        })
      } else {
        this.$message({ 
          message: "图片已上传",
          type: 'success'
        });
        let data = res.data
        this.imgList.push(
          {
            'name': file.name,
            'url': data.key
          }
        )
      }
    },
    getBlogContentById(id) {
      getBlogContentById(id).then(res => {
        let data = res.data
        this.blog.content = data.content
      })
    },
    copy() {
        let input = document.createElement("input");
        input.value = this.copyImg
        document.body.appendChild(input);
        input.select(); 
        document.execCommand("Copy"); 
        document.body.removeChild(input); 
        this.$message({ 
          message: "链接已复制成功",
          type: 'success'
        });
    }
  },
  created() {
    this.getBlogContentById(this.$route.params.id)
  }
}
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
.upload-wrapper {
  width: 1000px;
  min-height: 50px;
  margin-bottom: 10px;
}
.upload-wrapper .upload {
  width: 500px;
  float: left;
}
.upload-wrapper .copy {
  width: 500px;
  float: left;
}
.copy .input-with-select {
  width: 100px;
}
.markdown-container {
  width: 1000px;
  margin: 10px auto;
}

.page-button {
  float: right;
  letter-spacing: 1px;
  font-weight: bold;
  margin: 20px 5px;
}
</style>