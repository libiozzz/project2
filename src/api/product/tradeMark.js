//该模块用于获取品牌管理的数据
import request from '@/utils/request'
//获取品牌列表接口
export const reqTradeMarkList = (page,limit) => request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})
//添加品牌的接口 和 修改品牌的接口 需要携带参数
export const reqAddUpdateTradeMark = (tradeMark) => {
    if(tradeMark.id){  //如果带给服务器的数据携带id，则是修改品牌
        return request({
            url:'/admin/product/baseTrademark/update',
            data:tradeMark,
            method:'put'
        })
    }else{   //否则为添加品牌
        return request({
            url:'/admin/product/baseTrademark/save',
            data:tradeMark,
            method:'post'
        })
    }
}
//删除品牌接口
export const reqDeleteTradeMark = (id) => request({
    url:`/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})

