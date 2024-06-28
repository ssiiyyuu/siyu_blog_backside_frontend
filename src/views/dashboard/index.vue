<template>
	<div id="app-container" style="padding: 0 15px;">
    <h4 style="text-align: center;">后台迭代于2023-9，数据起始于2023-9-24</h4>
		<el-row class="charts-wrapper" :gutter="50">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="chart-panel m-hover">
          <div class="chart-panel-icon-wrapper icon-pv">
            <SvgIcon icon-class="people-fill" class-name="chart-panel-icon" />
          </div>
          <div class="chart-panel-description">
            <div class="chart-panel-text">
              博客PV
            </div>
            <div class="chart-panel-value">
              {{ pv }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="chart-panel m-hover">
          <div class="chart-panel-icon-wrapper icon-uv">
            <SvgIcon icon-class="people" class-name="chart-panel-icon" />
          </div>
          <div class="chart-panel-description">
            <div class="chart-panel-text">
              博客UV
            </div>
            <div class="chart-panel-value">
              {{ uv }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="chart-panel m-hover">
          <div class="chart-panel-icon-wrapper icon-blog-count">
            <SvgIcon icon-class="link" class-name="chart-panel-icon" />
          </div>
          <div class="chart-panel-description">
            <div class="chart-panel-text">
              博客数
            </div>
            <div class="chart-panel-value">
              {{ blogCount }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card class="chart-panel m-hover">
          <div class="chart-panel-icon-wrapper icon-comment-count">
            <SvgIcon icon-class="nested" class-name="chart-panel-icon" />
          </div>
          <div class="chart-panel-description">
            <div class="chart-panel-text">
              评论数
            </div>
            <div class="chart-panel-value">
              {{ commentCount }}
            </div>
          </div>
        </el-card>
      </el-col>
		</el-row>
		<el-card class="charts-wrapper m-hover">
			<div ref="visitRecordEcharts" style="height:500px;"></div>
		</el-card>
	</div>
</template>

<script>
import { getDashboardData } from "@/api/dashboard";
import SvgIcon from "@/components/SvgIcon";
import echarts from 'echarts'

export default {
  name: "Dashboard",
  components: {SvgIcon},
  data() {
    return {
      pv: 0,
      uv: 0,
      blogCount: 0,
      commentCount: 0,
      visitRecordEcharts: null,
      visitRecordOption: {
        xAxis: {
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false
          },
        },
        grid: {
          left: 10,
          right: 20,
          top: 30,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['PV', 'UV']
        },
        series: [
          {
            name: 'PV',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#f4516c',
                lineStyle: {
                  color: '#f4516c',
                  width: 2
                }
              }
            },
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'UV',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#36a3f7',
                lineStyle: {
                  color: '#36a3f7',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: [],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      },
    }
  },
  mounted() {
    this.getDashboardData()
  },
  beforeDestroy() {
      window.removeEventListener("resize",this.listenResize);
  },
  methods: {
    getDashboardData() {
      getDashboardData().then(res => {
        
        let data = res.data
        this.pv = data.pv
        this.uv = data.uv
        this.blogCount = data.blogCount
        this.commentCount = data.commentCount
        let lineData = data.lineData

        this.visitRecordOption.xAxis.data = lineData.date.reverse()
        this.visitRecordOption.series[0].data = lineData.pv.reverse()
        this.visitRecordOption.series[1].data = lineData.uv.reverse()
        this.initVisitRecordEcharts()
      })
    },
    initVisitRecordEcharts() {
      this.visitRecordEcharts = echarts.init(this.$refs.visitRecordEcharts)
      this.visitRecordEcharts.setOption(this.visitRecordOption)
      window.addEventListener('resize',this.listenResize)
    },
    listenResize() {
      this.visitRecordEcharts.resize()
    },
  }
}
</script>

<style scoped>
::v-deep .el-card__body {
  padding: 0;
}
.charts-wrapper {
  margin: 20px auto;
}

.chart-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  margin-top: 10px;
}
.m-hover:hover{
  -webkit-box-shadow:0px 0px 15px #c8c8c8 !important;
  -moz-box-shadow:0px 0px 15px #c8c8c8 !important;
  box-shadow:  0px 0px 15px #707070 !important;
  transition: all .2s; 
}
.chart-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  border-radius: 6px;
}
.chart-panel-icon {
  font-size: 48px;
}
.icon-pv {
  color: #40c9c6;
}
.icon-uv {
  color: #36a3f7;
}
.icon-blog-count {
  color: #f4516c;
}
.icon-comment-count {
  color: #34bfa3
}
.chart-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
}
.chart-panel-text {
  line-height: 18px;
  color: #999;
  font-size: 16px;
  margin-bottom: 12px;
}
.chart-panel-value {
  font-size: 20px;
}
</style>