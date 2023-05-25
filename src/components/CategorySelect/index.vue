<template>
  <div>
    <!-- inline 代表行内表单，一行可以放置多个表单元素 
         :model 这里代表收集表单数据到cForm上 -->
    <el-form :inline="true"  class="demo-form-inline" :model="cForm"> 
      <el-form-item label="一级分类" >
        <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data() {
    return {
        list1:[],  //一级分类数据
        list2:[],  //二级分类数据
        list3:[],  //三级分类数据
        cForm:{    //收集相应的一、二、三级分类的id
            category1Id:'',
            category2Id:'',
            category3Id:'',
        }   
    }
  },
  mounted() {
    //获取一级分类的数据
    this.getCategory1List() 
  },
  methods: {
    //获取一级分类数据的方法
    async getCategory1List(){
        let result = await this.$API.attr.reqCategory1List()
        //console.log(result);
       if(result.code == 200){
        this.list1 = result.data
       }
    },
    //当一级分类的option发生变化时，获取相应二级分类的数据
    async handler1(){
        //清除上一次的二、三级分类的数据和id
        this.list2 = []
        this.list3 = []
        this.cForm.category2Id = ''
        this.cForm.category3Id = ''
        //解构出一级分类id
        const {category1Id} = this.cForm
        //获取二级分类数据
        let result = await this.$API.attr.reqCategory2List(category1Id)
        //console.log(result);
       if(result.code == 200){
        this.list2 = result.data
       }
       //传递数据给父组件
       this.$emit('getCategoryId',{categoryId:category1Id,level:1})
    },
    //当二级分类的option发生变化时，获取相应三级分类的数据
    async handler2(){
        //清除上一次的三级分类的数据和id
        this.list3 = []
        this.cForm.category3Id = ''
        //解构出二级分类id
        const {category2Id} = this.cForm
        //获取二级分类数据
        let result = await this.$API.attr.reqCategory3List(category2Id)
        //console.log(result);
       if(result.code == 200){
        this.list3 = result.data
       }
       //传递数据给父组件
       this.$emit('getCategoryId',{categoryId:category2Id,level:2})
    },
    //三级分类的事件回调
    handler3(){
        //解构出三级分类id
        const {category3Id} = this.cForm
        //传递数据给父组件
       this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
  },
};
</script>

<style>
</style>