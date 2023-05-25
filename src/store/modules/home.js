import mockRequest from '@/utils/mockRequest'
//准备state——用于存储数据
const state = {
    list:{}  //首页的mock数据
}
//准备actions——用于相应组件中的动作
const actions = {
    //发请求获取首页的mock数据
    async getData({commit}){
        let result = await mockRequest.get('/home/list')
        // console.log(result);
        if(result.code == 20000){
            commit('GETDATA',result.data)
        }
    }
    
}
//准备mutations——用于操作（加工）数据（state）
const mutations = {
   GETDATA(state,list){
    state.list = list
   }
}
//准备state——用于简化数据
const getters = {

}

//创建并暴露store
export default ({
    actions,//actions:actions,
    mutations,
    state,
    getters
})