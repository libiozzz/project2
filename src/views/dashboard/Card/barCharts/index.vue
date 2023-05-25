<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        show: false, //隐藏x轴
        type: "category", //均分
      },
      yAxis: {
        show: false, //隐藏y轴
      },
      //系列
      series: [
        {
          type: "bar",
          data: [50, 7, 33, 12, 88, 9, 29, 33,78],
          color:'purple'
        },
      ],
      //调整布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      //提示组件
      tooltip:{}
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>