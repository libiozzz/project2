<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input
        placeholder="价格（元素）"
        type="number"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量（千克）">
      <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr, index) in attrInfoList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="saleAttr.id"
        >
          <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        style="width: 100%"
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" prop="prop" width="80px">
        </el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              v-if="row.isDefault == 0"
              @click="changeDefault(row)"
              >设置默认</el-button
            >
            <el-button v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [], //图片数据
      spuSaleAttrList: [], //销售属性数据
      attrInfoList: [], //平台属性数据
      skuInfo: {
        //sku数据
        category3Id: 0,
        price: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        weight: "0",
        skuDesc: "", //规格描述数据
        skuDefaultImg: "", //默认图片的地址
        skuAttrValueList: [
          //平台属性
        //   {
        //     attrId: 0, //平台属性id
        //     valueId: 0, //平台属性值id
        //   },
        ],
        skuImageList: [
          //图片数据
        //   {
        //     id: 0,
        //     imgName: "string",
        //     imgUrl: "string",
        //     isDefault: "string",
        //     skuId: 0,
        //     spuImgId: 0,
        //   },
        ],
        skuSaleAttrValueList: [
          //销售属性
        //   {
        //     id: 0,
        //     saleAttrId: 0,
        //     saleAttrName: "string",
        //     saleAttrValueId: 0,
        //     saleAttrValueName: "string",
        //     skuId: 0,
        //     spuId: 0,
        //   },
        ],
      },
      spu: {}, //spu数据
      imageList: [], //暂时将勾选的图片数据收集在这 （目前缺少isDefault字段）
    };
  },
  methods: {
    //获取SkuForm数据
    async getData(category1Id, category2Id, spu) {
      //收集父组件的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //获取图片数据的接口
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性数据的接口
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      //console.log(result1.data);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
        //console.log(this.spuSaleAttrList);
      }
      //获取平台属性数据的接口
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      //console.log(result2.data);
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
        //console.log(this.attrInfoList);
      }
    },
    //table中复选框变化时触发的事件 --- 能够收集到勾选的数据
    handleSelectionChange(params) {
      this.imageList = params;
    },
    //设置默认图片（排他思想）
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清除数据
      //Object.assign 是es6新增方法 作用是合并对象
      //this._data 可以操作data中的响应式数据
      //this.$options 可以获取配置对象，在这里获取data函数，并执行data函数，返回一个空对象
      Object.assign(this._data, this.$options.data());
    },
    //点击保存按钮
    async save(){
        //整理参数
        const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this
        //整理平台属性参数（方法一） ----方法二可以通过reduce方法实现
        attrInfoList.forEach(item=>{
            if(item.attrIdAndValueId){
                let [attrId,valueId] = item.attrIdAndValueId.split(':')
                //携带给服务器的参数应该是对象
                let obj = {attrId,valueId}
                skuInfo.skuAttrValueList.push(obj)
            }
        })
        //整理销售属性参数
        skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
            if(item.attrIdAndValueId){
                let [saleAttrId,saleValueId] = item.attrIdAndValueId.split(':')
                //携带给服务器的参数应该是对象
                prev.push({saleAttrId,saleValueId})
            }
            return prev
        },[])
        //整理图片数据
        skuInfo.skuImageList = imageList.map(item=>{
            return{
                imgName:item.imgName,
                imgUrl:item.imgUrl,
                isDefault:item.isDefault,
                spuImgId:item.id
            }
        })
        //发请求
        let result = await this.$API.spu.reqAddSku(skuInfo) 
        if(result.code == 200){
            this.$message({type:'success',message:'添加Sku成功！'})
            this.cancel()
        }
    }
  },
};
</script>

<style>
</style>