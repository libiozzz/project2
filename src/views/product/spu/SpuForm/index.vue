<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <!-- v-model就是双向绑定value 而这里value又绑定为tm.id 则这里是将tm.id和spu.tmId双向绑定 -->
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="Spu描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <!-- list-type 文件列表类型
             on-preview 图片预览时触发
             on-remove 图片删除时触发
             on-success 图片上传成功时触发
             file-list 照片墙需要展示的数据（该数据为数组 且数组里的元素必须要有name、url属性 ）  -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" value="" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column
            prop="prop"
            label="序号"
            width="80px"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" 
                @click="showInput" -->
            <template slot-scope="{row,$index}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //存储spu信息
        category3Id: 0,
        description: "",
        tmId: '', //品牌id
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: [], //平台属性与属性值
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片
      saleAttrList: [], //存储销售属性
      attrIdAndAttrName:'',  //收集未选择的销售属性id
    };
  },
  methods: {
    //照片墙--删除图片
    //file 删除的那张图片
    //fileList 删除图片之后剩余的其他图片
    handleRemove(file, fileList) {
      //console.log(file, fileList);
      //收集照片墙图片数据
      this.spuImageList = fileList
    },
    //照片墙--预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //照片墙--上传图片成功
    //response 服务器返回的图片信息
    handleSuccess(response,file,fileList){
      this.spuImageList = fileList
    },
    //初始化Spu数据
    async initSpuData(spu) {
      //获取Spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取图片信息
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙要是用file-list 这里需要对服务器返回的图片信息进行修改 再赋值给spuImageList
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr(){
      //解构出销售属性的id和名字
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
      //向spuSaleAttrList里面添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSaleAttr)
      //清空数据
      this.attrIdAndAttrName = ''
    },
    //添加属性值的回调
    addSaleAttrValue(row){
      //添加响应式属性
      this.$set(row,'inputVisible',true)  
      this.$set(row,'inputValue','') 
    },
    //input失去焦点事件
    handleInputConfirm(row){
      //将input中输入的新属性值进行展示
      //属性值不能为空
      const {baseSaleAttrId,inputValue} = row
      if(inputValue.trim()==''){
        this.$message('属性值不能为空')
        return
      }
      //属性值不能重复
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName != inputValue)
      if(!result) return//如果属性值重复了
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue} 
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      //失去焦点显示按钮
      row.inputVisible = false
    },
    //修改/添加spu 点击保存按钮的回调
    async addOrUpdateSpu(){
      //整理照片墙参数----对于图片，需要携带imgName和imgUrl字段
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response && item.response.data) || item.url
        }
      })
      //发送请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code==200){
        this.$message({type:'success',message:'保存成功！'})
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
      }
      //清空数据
      Object.assign(this._data,this.$options.data()) 
    },
    //点击添加spu按钮的回调
    async addSpuData(category3Id){
      //收集category3Id
      this.spu.category3Id = category3Id
      console.log(this.category3Id);
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //点击取消按钮的回调
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''})
      //清理数据
      //Object.assign 是es6新增方法 作用是合并对象
      //this._data 可以操作data中的响应式数据
      //this.$options 可以获取配置对象，在这里获取data函数，并执行data函数，返回一个空对象 
      Object.assign(this._data,this.$options.data()) 
      
    }
  },
  computed:{
    //计算出还未显示的销售属性
    unSelectSaleAttr(){
      //整个平台的销售属性(saleAttrList)一共三个 颜色、尺寸、版本
      //当前已有的销售属性(spuSaleAttrList)
      let result = this.saleAttrList.filter((item)=>{
        return this.spu.spuSaleAttrList.every((item1)=>{  //返回一个数组
          return item.name != item1.saleAttrName   
        })
      })
      return result
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>