<template>
  <!-- 容器 -->
  <div class="charts" ref="charts">

  </div>
</template>

<script>
//引入echarts
import echarts from 'echarts'
export default {
    name:'lineCharts',
    mounted() {
        //初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        //配置数据
        lineCharts.setOption({
            xAxis:{
                show:false, //隐藏x轴
                type:'category' //均分
            },
            yAxis:{
                show:false //隐藏y轴
            },
            //系列
            series:[
                {
                    type:'line',
                    data:[10,7,33,12,88,9,29,3],
                    //将折线走势设置为光滑的
                    smooth:true,
                    //拐点的样式设置
                    itemStyle:{
                        opacity:0,
                    },
                    //折线的样式设置
                    lineStyle:{
                        color:'purple'
                    },
                    //区域填充的样式设置
                    areaStyle:{
                        //设置渐变色
                        color:{
                            type:'linear',
                            x:0,
                            x:0,
                            x:0,
                            x:0,
                            colorStops:[
                                {
                                    offset:0,
                                    color:'#fff'  //0%处的颜色
                                },
                                {
                                    offset:1,
                                    color:'purple'  //100%处的颜色
                                },
                            ],
                            global:false 
                        }
                    }
                }
            ],
            //调整布局
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0,
            }
        })
    },
}
</script>

<style>
.charts{
    width: 100%;
    height: 100%;
}
</style>