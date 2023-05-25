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
        //设置x轴的最大值和最小值
        min:0,
        max:100
      },
      yAxis: {
        show: false, //隐藏y轴
        type: "category", //均分
      },
      //系列
      series: [
        {
          type: "bar",
          data: [78],
          color:'yellowgreen',
          //柱状图的宽度设置
          barWidth:10,
          //柱状图的背景颜色
          backgroundStyle:{
            color:'#eee'
          },
          showBackground: true,
          //图形上的文本标签，可以说明图形的相关信息
          label:{
            show:true,
            formatter:'|',   //将文本用一个竖线来显示
            position:'right' //文本的位置
          }
        },
      ],
      //调整布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
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