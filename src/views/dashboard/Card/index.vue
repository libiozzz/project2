<template>
  <div>
    <!-- el-col一共24份  这里:span代表占6份  这里:gutter代表每个的间距 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67%</span>
              <svg
                t="1684221739847"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4257"
                width="16"
                height="16"
              >
                <path
                  d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
                  fill="#d81e06"
                  p-id="4258"
                ></path>
              </svg>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96%</span>
              <svg
                t="1684221826178"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5511"
                width="16"
                height="16"
              >
                <path
                  d="M512 597.333333l-170.666667-170.666666h341.333334l-170.666667 170.666666z"
                  p-id="5512"
                  fill="#1afa29"
                ></path>
              </svg>
            </template>
            <template slot="footer">
              <span> 日销售额￥ 12432 </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="￥ 88460">
            <template slot="charts">
              <!-- 折线图 -->
              <lineCharts></lineCharts>
            </template>
            <template slot="footer">
              <span> 日访问量 1234 </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="￥ 88460">
            <template slot="charts">
              <!-- 柱状图 -->
              <barCharts></barCharts>
            </template>
            <template slot="footer">
              <span> 转化率 64% </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <!-- 进度条图 -->
              <progressCharts></progressCharts>
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;56.67%</span>
              <svg
                t="1684221739847"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4257"
                width="16"
                height="16"
              >
                <path
                  d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
                  fill="#d81e06"
                  p-id="4258"
                ></path>
              </svg>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96%</span>
              <svg
                t="1684221826178"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5511"
                width="16"
                height="16"
              >
                <path
                  d="M512 597.333333l-170.666667-170.666666h341.333334l-170.666667 170.666666z"
                  p-id="5512"
                  fill="#1afa29"
                ></path>
              </svg>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "@/views/dashboard/Card/Detail";
import lineCharts from "@/views/dashboard/Card/lineCharts";
import barCharts from "@/views/dashboard/Card/barCharts";
import progressCharts from "@/views/dashboard/Card/progressCharts";
export default {
  name: "Card",
  components: {
    Detail,lineCharts,barCharts,progressCharts
  },
};
</script>

<style>
</style>