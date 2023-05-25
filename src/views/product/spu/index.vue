<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 展示Spu列表 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加Spu</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <Hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></Hint-button>
              <Hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></Hint-button>
              <Hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="handler(row)"
                title="查看当前spu全部sku列表"
              ></Hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <Hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></Hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev,pager,next,jumper,->,sizes,total"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="150"
        ></el-table-column>
        <el-table-column label="默认图片" width="150">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true, //控制三级联动的可操作性
      page: 1, //当前页
      limit: 3, //每页展示几条数据
      records: [], //spu一页的列表数据
      total: 0, //分页器一共展示的数据条数
      scene: 0, //0代表展示Spu列表数据页面  1代表展示添加/修改Spu页面 2代表展示添加Sku页面
      dialogTableVisible: false, //控制对话框的显示与隐藏
      spu: {}, //点击查看spu按钮时 所点击的那个spu的信息
      skuList: [], //sku列表数据
      loading: true //table的加载效果
    };
  },
  methods: {
    //三级联动的自定义事件回调
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
        //发请求获取Spu数据进行展示
        this.getSpuList();
      }
    },
    //获取Spu列表数据进行展示
    async getSpuList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //分页器某一页展示数据条数发生变化时的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //点击添加Spu的回调
    addSpu() {
      this.scene = 1;
      //通知子组件SpuForm发请求----两个请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //点击修改Spu的回调
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    //SpuForm自定义事件的回调
    changeScene({ scene, flag }) {
      this.scene = scene;
      //flag 用于区分保存按钮是添加还是修改spu
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //查看sku列表
    async handler(spu) {
      this.dialogTableVisible = true;
      //保存spu的信息
      this.spu = spu;
      //发请求获取sku列表数据 进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false
      }
    },
    //关闭对话框时的回调
    close(done){
      this.loading = true
      //清除sku列表数据
      this.skuList = []
      //关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>