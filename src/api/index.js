//将四个模块的请求接口的函数统一暴露
import * as trademark from '@/api/product/tradeMark'
import * as attr from '@/api/product/attr'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'
//引入权限相关的接口
import * as permission from '@/api/acl/permission'
import * as role from '@/api/acl/role'
import * as user from '@/api/acl/user'

export default {
    trademark,
    attr,
    sku,
    spu,
    permission,
    role,
    user
}