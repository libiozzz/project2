//该模块用于书写Spu页面的请求文件
import request from '@/utils/request'
//SpuForm页面需要的接口
//获取Spu列表数据的接口
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
})
//获取Spu信息
export const reqSpu = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get',
})
//获取品牌信息
export const reqTradeMarkList = () => request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get',
})
//获取图片信息
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get',
})
//获取销售属性(最多三个)
export const reqBaseSaleAttrList = () => request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get',
})
//添加/修改spu接口
export const reqAddOrUpdateSpu = (spuInfo) => {
    //携带的参数带有id-----修改spu
    if (spuInfo.id) {
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data: spuInfo
        })
    } else {
        //携带的参数不带有id-----添加spu
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data: spuInfo
        })
    }
}
//删除spu的接口
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete',
})

//SkuForm页面需要的接口
//获取图片数据的接口---上面已经写过了

//获取销售属性数据的接口
export const reqSpuSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get',
})
//获取平台属性数据的接口
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get',
})

//添加sku
export const reqAddSku = (skuInfo) => request({
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data:skuInfo
})
//获取sku列表数据的接口
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get',
})