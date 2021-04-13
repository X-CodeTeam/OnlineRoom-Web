<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    class="ly-user__dialog"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="用户类型:" prop="userType">
        <el-radio v-model="form.userType" :label="1">超级管理员</el-radio>
        <el-radio v-model="form.userType" :label="2">普通管理员</el-radio>
      </el-form-item>
      <el-form-item label="昵称:" prop="nickname">
        <el-input v-model.trim="form.nickname"></el-input>
      </el-form-item>
      <el-form-item v-if="isAdd" label="登录名:" prop="loginUser">
        <el-input v-model.trim="form.loginUser"></el-input>
      </el-form-item>
      <el-form-item v-if="isAdd" label="登录密码:" prop="loginPassword">
        <el-input v-model.trim="form.loginPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item
        v-if="isAdd"
        label="再次确认密码:"
        prop="confirmLoginPassword"
      >
        <el-input
          v-model.trim="form.confirmLoginPassword"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model.trim="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model.trim="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio v-model="form.status" label="1">禁用</el-radio>
        <el-radio v-model="form.status" label="2">正常</el-radio>
        <el-radio v-model="form.status" label="3">锁定</el-radio>
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model.trim="form.description"></el-input>
      </el-form-item>

      <el-form-item label="授予角色">
        <el-select
          v-model="form.roleCodes"
          multiple
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="role in options.rolesData"
            :key="role.id + role.roleName"
            :label="role.roleName"
            :value="role.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  editSysUser,
  addSysUser,
  bindRolesToSysUser,
  querySysUserWithUserId,
} from "@/api/sysUser";
import { isPassword } from "@/utils/validate";
import { queryRolesPage } from "@/api/role";

const originSysUserForm = Object.freeze({
  avatar: null,
  description: null,
  email: null,
  loginPassword: null,
  loginUser: null,
  nickname: null,
  phone: null,
  status: "2",
  userType: 2,
  roleCodes: [],
});

export default {
  name: "UserManagementEdit",

  data() {
    return {
      form: { ...originSysUserForm },

      rules: {
        userType: [
          { required: true, trigger: "blur", message: "请输入用户类型" },
        ],
        loginUser: [
          { required: true, trigger: "blur", message: "请输入登录名" },
        ],
        nickname: [{ required: true, trigger: "blur", message: "请输入昵称" }],
        loginPassword: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            trigger: "blur",
            validator: (_, val, cb) => {
              return isPassword(val)
                ? cb()
                : cb(new Error("密码不能少于6位数"));
            },
          },
        ],
        confirmLoginPassword: [
          { required: true, trigger: "blur", message: "请输入确认密码" },
          {
            trigger: "blur",
            validator: (_, val, cb) => {
              return this.form.loginPassword !== val
                ? cb(new Error("两次密码不匹配，请重新输入"))
                : cb();
            },
          },
        ],
        phone: [{ required: true, trigger: "blur", message: "请输入手机号" }],
        status: [{ required: true, trigger: "blur", message: "请选择状态" }],
      },

      title: "",

      dialogFormVisible: false,

      isAdd: false,

      options: {
        rolesData: [],
      },
    };
  },

  watch: {
    dialogFormVisible: {
      async handler(res) {
        if (!res) return;

        await this._initMenus();
      },
    },
  },

  methods: {
    async _initMenus() {
      const { data: menusData } = await queryRolesPage();

      if (!menusData || !menusData.length) return;

      this.options.rolesData = menusData;
    },

    async showEdit(row) {
      if (!row) {
        this.isAdd = true;
        this.title = "添加";
      } else {
        this.isAdd = false;
        this.title = "编辑";
        const { data: sysUserData } = await querySysUserWithUserId(row?.userId);

        if (!sysUserData || !sysUserData.length) return;

        this.form = sysUserData[0];
      }
      this.dialogFormVisible = true;
    },

    close() {
      this.$refs["form"].resetFields();
      this.form = { ...originSysUserForm };
      this.dialogFormVisible = false;
    },

    save() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.isAdd) {
            const { ok } = await addSysUser(this.form);

            ok && this.$baseMessage("操作成功", "success");
          } else {
            const { ok } = await editSysUser(
              this.$lodash.omit(this.form, [
                "loginPassword",
                "password",
                "loginUser",
              ])
            );

            ok && this.$baseMessage("操作成功", "success");
          }

          this.$emit("fetch-data");
          this.close();
        }
      });
    },
  },
};
</script>
