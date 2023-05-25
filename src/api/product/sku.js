//该模块用于书写Sku页面的请求文件
import request from '@/utils/request'

//获取Sku列表数据的接口
export const reqSkuList = (page,limit) => request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get',
})
//sku上架的接口
export const reqSale = (skuId) => request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get',
})
//sku下架的接口
export const reqCancel = (skuId) => request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get',
})
//获取sku详情的接口
export const reqSkuById = (skuId) => request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get',
})