<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisiable = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  class="tag-first"
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环显示二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      class="tags"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      class="tags"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 数据列 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- v-slot="scope" -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleDialog(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisiable"
      width="40%"
      @close="addRolesDialogClose"
    >
      <!-- 对话框内容主体 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="14%">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="14%">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹出提示框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisiable"
      width="40%"
      @close="editRolesDialogClose"
    >
      <!-- 对话框内容主体 -->
      <el-form
        :model="editRoleForm"
        :rules="addRoleFormRules"
        ref="editRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="14%">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="14%">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹出提示框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClosed"
    >
    <!-- 树形结构，显示权限 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      //   添加角色表单数据
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      //   编辑角色表单数据
      editRoleForm: {
        roleId: 0,
        roleName: "",
        roleDesc: "",
      },
      //   控制角色添加对话框的显示与隐藏
      addRolesDialogVisiable: false,
      //   控制角色编辑对话框的显示与隐藏
      editRolesDialogVisiable: false,
      //  添加角色校验
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
      },
      // 控制显示权限的分配对话框
      setRightDialogVisible:false,
      // 所有权限的数据
      rightsList:[],
      // 树形结构属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 默认选中的节点值数组
      defKeys:[],
      // 当前想要设置权限的角色id
      roleId:'',
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },
    //   添加角色方法
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以添加网络请求
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加用户成功");
        this.addRolesDialogVisiable = false;
        this.getRoleList();
      });
    },
    // 监听添加用户表单关闭后重置表单
    addRolesDialogClose() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 获取编辑角色
    async editRoleDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("添加角色失败");
      this.editRolesDialogVisiable = true;
      this.editRoleForm = res.data;
    },
    // 编辑角色
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以添加网络请求
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("编辑角色失败");
        this.$message.success("编辑角色成功");
        this.editRolesDialogVisiable = false;
        this.getRoleList();
      });
    },
    // 监听编辑用户表单关闭后重置表单
    editRolesDialogClose() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 删除角色
    // 根据id删除对应的id
    async deleteRoleDialog(id) {
      // 弹框询问是否删除id
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status !== 200)
            return this.$message.error("删除角色失败");

          this.$message.success("删除角色成功");
          this.getRoleList();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 根据id删除对应的权限
    async removeRightsById(role, rightId) {
      // 弹框询问是否删除id
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200)
            return this.$message.error("删除角色失败");

          this.$message.success("删除角色成功");
          //   this.getRoleList();
          // 将删除后的权限列表重新赋给role渲染页面
          role.children = res.data;
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const {data:res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error("获取权限失败");
      this.$message.success('获取权限成功')
      this.rightsList = res.data
      // 递归获取三级节点id
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的方式获取角色的三级权限节点
    getLeafKeys(node,arr){
      // 如果该节点不包含children属性，就是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    // 监听设置权限对话框关闭后重置表单
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys);
      const idStr = keys.join(',')

      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) return this.$message.error("分配权限失败")
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  },
};
</script>

<style>
.tag-first {
  margin: 7px 7px 7px 45px;
}
.tags {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
