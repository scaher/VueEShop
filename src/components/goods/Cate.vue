<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 添加分类按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <!-- <el-table :data="cateList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_id"></el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template v-slot="scope">
            <el-tag type="success" effect="dark" v-if="scope.row.cat_level === 0"
              >一级</el-tag
            >
            <el-tag type="" effect="dark" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag
              type="warning"
              effect="dark"
               v-else-if="scope.row.cat_level === 2"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
            <template> -->
      <!-- 编辑按钮 -->
      <!--             
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                
              >编辑</el-button> -->
      <!-- 删除按钮 -->

      <!-- <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                
              >删除</el-button>
            
          </template>
        </el-table-column>
      </el-table> -->

      <!-- 分类表格
:data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
:expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treetable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleCateSizeChange"
        @current-change="handleCateCurrentChange"
        :current-page="cateQueryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="cateQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        <!-- 添加分类对话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="40%"
          @close="addCateDialogClosed"
        >
          <!-- 添加分类的表单 -->
          <el-form
            :model="addCateForm"
            :rules="addCateFormRules"
            ref="addCateFormRef"
            label-width="100px"
          >
            <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
              <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable
                change-on-select
              ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 查询商品分类参数
      cateQueryInfo: {
        // 获取商品分类的参数对象
        type: [1],
        // 当前商品页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5,
      },
      //   总数据条数
      total: 0,
      // 商品分类信息
      cateList: [],

      // 在数据中添加columns:
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认添加的是一级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制修改分类名称对话框的显示与隐藏
      editDialogVisible: false,
      editCateForm: {}
    };
  },
  created() {
    this.getCategoryLists();
  },
  methods: {
    // 获取商品分类列表
    async getCategoryLists() {
      const { data: res } = await this.$http.get("categories", {
        params: this.cateQueryInfo,
      });
      console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //   监听pagesize改变的事件
    handleCateSizeChange(newSize) {
      this.cateQueryInfo.pagesize = newSize;
      //   重新获取加载表格数据
      this.getCategoryLists();
    },
    //   监听页码值改变的事件
    handleCateCurrentChange(newPage) {
      this.cateQueryInfo.pagenum = newPage;
      //   重新获取加载表格数据
      this.getCategoryLists();
    },
    // 点击按钮，显示对话框
    showAddCatDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList();
      // 再展示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: result } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (result.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      this.parentCateList = result.data;
    },
    // 选择项发生变化触发
    parentCateChanged() {
      // console.log(this.selectedKeys)

      // 如果selectedKeys数组中的length大于0，证明选中的父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 反之，就说明没有选中任何父级分类
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击确定按钮添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("表单预校验失败！");
        const { data: result } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (result.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功");
        // 刷新列表
        this.getCateList();
        // 隐藏对话框
        this.addCateDialogVisible = false;
      });
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
  },
};
</script>

<style >
</style>