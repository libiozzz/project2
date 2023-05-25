<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show='!isShowTable'></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                style="margin: 0 20px"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性/修改属性结构 -->
      <div v-show="!isShowTable">
        <el-form
          ref="form"
          :inline="true"
          label-width="80px"
          v-model="attrInfo"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里需要input和span来回切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button
                type="danger"
                icon="el-icon-delete"
                size="mVini"
                slot="reference"
              ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled='attrInfo.attrValueList.length<1'>保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], //平台属性数据
      isShowTable: true, //控制表单的显示隐藏
      attrInfo: {
        //添加/修改属性名和属性值所需要的数据
        attrName: "", //属性名
        attrValueList: [], //属性值
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //用于服务器区分是几级id
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        //当一级分类发生变化时，上一次的二三级id要清空
        (this.category2Id = ""),
          (this.category3Id = ""),
          (this.category1Id = categoryId);
      } else if (level == 2) {
        //当二级分类发生变化时，上一次的三级id要清空
        (this.category3Id = ""), (this.category2Id = categoryId);
      } else {
        this.category3Id = categoryId;
        //发请求获取平台属性进行展示
        this.getAttrList();
      }
    },
    //获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //点击添加属性
    addAttr() {
      (this.isShowTable = false),
        //清楚之前添加/修改属性中的数据
        (this.attrInfo = {
          attrName: "",
          attrValueList: [],
          categoryId: this.category3Id, //收集三级分类的id
          categoryLevel: 3,
        });
    },
    ///点击添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改属性时要添加属性，将其已有的id带上。对于直接添加属性，默认为undefined
        valueName: "", //属性值名
        flag: true, //控制input和span的切换
      });
      //注：点击span时，页面显示input编辑模式。但是对于浏览器而言，页面的重绘和重排是耗时间的，不能立即通过ref获取到input
      this.$nextTick(() => {
        //让input自动获取焦点
        this.$refs[this.attrInfo.attrValueList.length - 1].focus(); //index是变量，所以这里不能写成this.$refs.index
      });
    },
    //点击修改按钮
    updateAttr(row) {
      this.isShowTable = false;
      //由于数据结构当中存在对象套数组的情况，在这里需要使用深拷贝
      this.attrInfo = cloneDeep(row);
      //Vue.$set 向响应式对象添加一个属性，并确保这个属性同样也是响应式的
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false); //参数以此为 响应式对象 新增属性名 对应属性值
      });
    },
    //失去焦点的事件
    toLook(row) {
      //row 点击添加属性值后，新增的属性值数据
      //添加属性值时 输入的属性值不能为空
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正常的属性值");
        return;
      }
      //属性值不能重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        return;
      }
      row.flag = false;
    },
    //点击span 变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //注：点击span时，页面显示input编辑模式。但是对于浏览器而言，页面的重绘和重排是耗时间的，不能立即通过ref获取到input
      this.$nextTick(() => {
        //让input自动获取焦点
        //console.log(index);
        this.$refs[index].focus(); //index是变量，所以这里不能写成this.$refs.index
      });
    },
    //点击删除按钮
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
    },
    //点击保存按钮
    async addOrUpdateAttr(){
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
          //提交给服务器的数据不应该有空属性值
        if(item.valueName != ''){
          //提交给服务器的数据不应该有flag
          delete item.flag
          return true
        }
      })
      try{
        //发请求
      await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
      this.$message({type:'success',message:'保存成功'})
      //再次获取平台属性进行展示
      this.getAttrList()
      this.isShowTable = true
      }catch(error){
        this.$message('保存失败')
      }
    } 
 },
};
</script>

<style>
</style>