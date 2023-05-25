<template>
  <div>
    <div class="header">
        <span>搜索用户数</span>
        <svg t="1684220725314" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2894" width="25" height="25"><path d="M853.333333 512C853.333333 323.48672 700.513195 170.666667 512 170.666667 323.486805 170.666667 170.666667 323.48672 170.666667 512 170.666667 700.51328 323.486805 853.333333 512 853.333333 700.513195 853.333333 853.333333 700.51328 853.333333 512ZM213.333333 512C213.333333 347.051093 347.050965 213.333333 512 213.333333 676.949035 213.333333 810.666667 347.051093 810.666667 512 810.666667 676.948907 676.949035 810.666667 512 810.666667 347.050965 810.666667 213.333333 676.948907 213.333333 512ZM494.933333 362.0224C494.933333 373.8048 504.484608 383.355733 516.266667 383.355733 528.048725 383.355733 537.6 373.8048 537.6 362.0224L537.6 320.644267C537.6 308.861867 528.048725 299.310933 516.266667 299.310933 504.484608 299.310933 494.933333 308.861867 494.933333 320.644267L494.933333 362.0224ZM494.933333 704C494.933333 715.781973 504.484608 725.333333 516.266667 725.333333 528.048725 725.333333 537.6 715.781973 537.6 704L537.6 448C537.6 436.218027 528.048725 426.666667 516.266667 426.666667 504.484608 426.666667 494.933333 436.218027 494.933333 448L494.933333 704Z" fill="#A5A9AA" p-id="2895"></path></svg>
    </div>
    <div class="main">
        <span class="main-title">12321</span>
        <span class="main-content">17.1</span>
        <svg t="1684246945158" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2766" width="16" height="16"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="2767"></path></svg>
        <svg t="1684246899072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1515" width="16" height="16"><path d="M512 597.333333l-170.666667-170.666666h341.333334l-170.666667 170.666666z" p-id="1516" fill="#1afa29"></path></svg>
    </div>
    <div class="footer">
        <!-- 容器 -->
        <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
//引入echarts
import echarts from 'echarts'
export default {
  name: "lineCharts",
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
                    data:[40,22,5,12,88,9,29,3],
                    //将折线走势设置为光滑的
                    smooth:true,
                    //拐点的样式设置
                    itemStyle:{
                        opacity:0,
                    },
                    //折线的样式设置
                    lineStyle:{
                        color:'yellowgreen'
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
};
</script>

<style scoped>
.header{
    display: flex;
    align-items: center;
}
.header span{
    margin-right: 10px;
}
.main{
    margin:10px 0
}
.main-title{
    margin-right: 30px;
}
.main-content{
    margin-right: 10px;
}
.charts{
    width: 100%;
    height: 50px;
}
</style>