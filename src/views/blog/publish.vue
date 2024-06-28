<template>
  <div>
    <div class="title">
      <h3>最终发布</h3>
      <span class="tips">
        <el-icon class="el-icon-info"></el-icon>Tips:
        进行页面切换时应先保存修改, 页面切换仅单纯切换页面而不进行数据存储
      </span>
    </div>
    <el-steps :active="3" align-center style="margin-top: 10px;">
      <el-step title="博客信息" />
      <el-step title="博客内容"/>
      <el-step title="最终发布" />
    </el-steps>
    <div class="markdown-container">
      <el-card>
        <el-descriptions title="博客信息" direction="vertical" :column="4" border>
          <el-descriptions-item label="ID">{{ blog.id }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ blog.title }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ blog.author }}</el-descriptions-item>
          <el-descriptions-item label="评论区">
            <el-tag effect="dark" :type="blog.commentable ? 'primary' : 'danger'">
              {{ blog.commentable ? '正常' : '关闭' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag effect="dark" :type="blog.published ? 'primary' : 'danger'">
            {{ blog.published ? '发布' : '草稿'}}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            <el-rate :value="blog.sort" disabled/>
          </el-descriptions-item>
          <el-descriptions-item label="分类">{{ blog.type.title }}</el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-tag v-for="item in blog.tags" :key="item.id" size="mini" style="margin: 0 5px;">
              {{ item.title }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ blog.gmtCreate }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ blog.gmtUpdate }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-button class="page-button" type="primary" @click="savePublish">正式发布</el-button>
      <el-button class="page-button" type="primary" @click="saveDraft">保存草稿</el-button>
      <el-button class="page-button" type="primary" @click="toContent">上一步</el-button>
    </div>
  </div>
</template>
<script>
import { getBlogPublishById, updateBlogStatusById } from '@/api/blog';
import { Message } from 'element-ui'

export default {
  name: 'blogPublish',
  components: {
  },
  data() {
    return {
      blog: {
        id: '',
        title: '',
        author: '',
        type: {id: '', title: ''},
        tag: [{id: '', title: ''}],
        gmtCreate: '',
        gmtUpdate: '',
        sort: 2,
        commentable: false,
        published: false
      },
    }
  },
  methods: {
    saveDraft() {
      updateBlogStatusById(this.blog.id, false).then(res => {
        Message({
          message: '博客 [ ' + this.blog.id + ' ] 已存草稿',
          type: 'success',
          duration: 5 * 1000
        })
        this.$router.push({
          path: "/blog/table",
        })
      })
    },
    savePublish() {
      updateBlogStatusById(this.blog.id, true).then(res => {
        Message({
          message: '博客 [ ' + this.blog.id + ' ] 已发布',
          type: 'success',
          duration: 5 * 1000
        })
        this.$router.push({
          path: "/blog/table",
        })
      })
    },
    toContent() {
      this.$router.push({
          path: "/blog/content/" + this.$route.params.id,
      })
    },
    getBlogPublishById(id) {
      getBlogPublishById(id).then(res => {
        let data = res.data
        this.blog = data.blog
      })
    },
  },
  created() {
    this.getBlogPublishById(this.$route.params.id)
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
  width: 500px;
  margin-bottom: 10px;
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