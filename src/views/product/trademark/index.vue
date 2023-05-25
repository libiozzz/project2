<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <el-table style="width: 100%" border :data="list">
      <!-- border是给表单添加边框 -->
      <!-- column代表一列 -->
      <!-- lable 设置标题（字符串形式）
           prop 对应列内容的字段名 要验证的内容
           width 设置列的宽度 
           align 设置标题的对齐方式
            -->
      <el-table-column
        type="index"
        label="序号"
        prop="prop"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        prop="tmName"
        width="width"
      ></el-table-column>
      <el-table-column label="品牌LOGO" prop="prop" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="prop" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
         当前第几页 数据总条数 每一页展示几条 连续页码数
         layout 实现分页器的布局 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="5"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      style="margin-top: 20px; text-align: center"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 
           :model 把表单数据收集到某个对象的身上，将来表单验证需要使用该属性 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100" prop="logoURL">
          <!-- 这里不能使用v-model收集数据，因为这里不是表单元素
               action 设置图片上传的地址 
               :on-success 检测到图片上传成功（图片上传成功时，执行一次）
               :before-upload 图片上传之前执行一次 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, //分页器在第几页
      limit: 3, //当前页所展示的数据条数
      total: 0, //展示数据的总条数
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框的显示与隐藏
      tmForm: {
        //收集品牌信息
        tmName: "",
        logoUrl: "",
      },
      rules: {
        //表单验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    //console.log(this.$API);
    this.getPageList();
  },
  methods: {
    //获取品牌列表数据
    async getPageList(pager = 1) {  //pager 用户点击的页码
      this.page = pager
      //解构参数
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
     // console.log(result);
      if (result.code == 200) 
      this.total = result.data.total;
      this.list = result.data.records;
    },
    //页码发生改变时触发
    // handleCurrentChange(pager) {
    //   //修改参数
    //   this.page = pager;
    //   this.getPageList();
    // },
    //某页的展示数据条数发生变化时触发
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //清除之前的数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //点击修改品牌
    updateTradeMark(row) {
      //row 当前选中的品牌的信息
      this.dialogFormVisible = true;
      //将当前选中的品牌信息在对话框中展示出来
      this.tmForm = { ...row }; //这里应该使用浅拷贝
    },
    //上传图片相关的回调
    //图片上传成功
    //res file 是上传成功后返回给前端的数据
    handleAvatarSuccess(res, file) {
      //收集表单图片数据，将来带给服务器
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加/修改品牌
    async addOrUpdateTradeMark() {
      //当所有验证通过，再去写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          //隐藏对话框
          this.dialogFormVisible = false;
          //发请求
          let result = await this.$API.trademark.reqAddUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //再次获取品牌列表进行展示
            this.getPageList(this.tmForm.id?this.page:1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌
    deleteTradeMark(row) {
      //row 删除的品牌的信息
      this.$confirm(`你确定要删除${row.tmName}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定按钮时触发
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          console.log(result);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌列表数据
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          //点击取消按钮时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>