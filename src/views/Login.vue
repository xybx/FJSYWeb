<!--
 * @Author: WCL
 * @Date: 2021-12-09 14:08:12
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 09:45:36
 * @FilePath: \fjsy-web\src\views\Login.vue
 * @Description: 请填写描述
-->
<template>
  <div id='login-container'>
    <el-container>
      <el-main>
        <div class='loginbox'>
          <el-row>
            <el-col :span='12'>
              <div class='title'><img src='../assets/login/titlex1.png' alt=''></div>
              <div class='leftimg'><img src='../assets/login/mapx1.png' alt=''></div>
            </el-col>
            <el-col :span='12'>
              <el-card class='box-card'>
                <div class='text item'>
                  <h3>登录账号</h3>
                  <h4>LOGIN ACCOUNT</h4>
                  <el-form ref='loginForm' :model='loginForm' label-width='auto' class='ms-content'
                           :rules='departRules'>
                    <el-form-item label=''>
                      <el-select v-model='loginForm.depart' placeholder='请选择部门类型'
                                 @change='changeDepart'>
                        <template #prefix><i
                            class='icon el-icon-office-building'></i></template>
                        <el-option v-for='item in departOptions' :key='item.pid'
                                   :label='item.name' :value='item.pid'></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label='' prop='user'>
                      <el-select v-model='loginForm.user' placeholder='请选择用户名称'
                                 no-data-text='请先选择部门' @change='changePerson'>
                        <!-- <template #prefix><i class="icon el-icon-user"></i></template> -->
                        <i slot='prefix' class='el-icon-user'></i>
                        <el-option v-for='item in userOptions' :key='item.pid'
                                   :label='item.name' :value='item.pid'></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop='password' class='inputpsd'>
                      <el-input type='password' placeholder='请输入登录密码'
                                v-model.trim='loginForm.password' @keyup.enter.native='submitForm()'
                                prefix-icon='el-icon-unlock'>
                      </el-input>
                    </el-form-item>
                    <el-button class='el-buttonCopy' type='primary' @click='submitForm()' round>登录
                    </el-button>
                  </el-form>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
  <!-- 之前版本的登录 22-10-08 -->
  <!-- <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="loginForm" :rules="departRules" ref="loginForm" label-width="auto" class="ms-content">
        <el-form-item prop="depart">
          <el-select v-model="loginForm.depart" placeholder="请选择部门" @change="changeDepart">
            <i slot="prefix" class="el-icon-office-building"></i>
            <el-option v-for="item in departOptions" :key="item.pid" :label="item.name" :value="item.pid"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="user">
          <el-select v-model="loginForm.user" placeholder="请选择人员" no-data-text="请先选择部门" @change="changePerson">
            <i slot="prefix" class="el-icon-user"></i>
            <el-option v-for="item in userOptions" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model.trim="loginForm.password"
            @keyup.enter.native="submitForm()"
            prefix-icon="el-icon-unlock"
          >
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div> -->
</template>

<script>
import { getAllDepts, getAllPersons, login, getVcCode } from '@/api/login-api';
import { getUserInfo } from '@/api/safeadmin/user-api';
import { mapMutations } from 'vuex';
import JSEncrypt from 'jsencrypt'

export default {
  data() {
    return {
      // 登录表单
      loginForm: {
        depart: '',
        user: '',
        password: ''
      },
      key: "-----BEGIN PUBLIC KEY-----" +
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlkvKOe+o21kdr4OvhPDN" +
          "dDT+UqRlWLE6xBSwaOxXWV1vYf6JTJsoYYifn43DcbBtaeQxPMWANqmZ3rot4Xkm" +
          "aj/8X8HT2QVXw8MITFiJ396c4CgLh5u4S5KBONQBcQ4XyX5Oe9S9G71da/QUeove" +
          "BllDHI8H10AbUFBPpKFsMI4tHwWXLEMFVWnqU9zizWzdnWzZXzZEqyLju8Qlhyf2" +
          "yz8GxiRFtkqPfK/oGsYDvm0M92y2LaZqZz+QtPvYajFo/QN0HFf+ixM62SGI93Pm" +
          "8Yn6X4TwG8EOfEKoOEqyrxBptoZYBE2tdWuVLgmfqC/4dlFrPKQycgyQ3wbSicXA" +
          "CQIDAQAB" +
          "-----END PUBLIC KEY-----",
      // 登录表单验证
      departRules: {
        depart: [{ required: true, message: '请选择部门', trigger: 'change' }],
        user: [{ required: true, message: '请选择用户', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }]
      },
      departOptions: [],
      userOptions: []
    };
  },
  mounted() {
    this.getDepart();
    if (localStorage.getItem('loginDepartPid')) {
      this.getPerson(Number(localStorage.getItem('loginDepartPid')));
      this.loginForm.depart = Number(localStorage.getItem('loginDepartPid'));
    }
    if (localStorage.getItem('loginUserPid')) {
      this.loginForm.user = Number(localStorage.getItem('loginUserPid'));
    }
  },
  created() {
    // debugger;

  },
  methods: {
    ...mapMutations(['setToken', 'setIsAdmin']),

    // 登录
    async submitForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入必填项');

        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(this.key);
        const uidStr = encryptor.encrypt(this.loginForm.user + "");
        const passwordStr = encryptor.encrypt(this.loginForm.password);

        let form = {
          uidStr: uidStr,
          password: passwordStr,
          isencrypt: 1
        };

        const res = await login(form);
        if (res.code === 200) {
          this.$message.success('登录成功');
          sessionStorage.setItem('user', JSON.stringify(res.data));
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('isadmin', 'true');

          localStorage.setItem('loginUserPid', res.data.pid);
          localStorage.setItem('loginDepartPid', res.data.officeid);

          this.setToken(res.data);
          this.get_UserInfo();
          // this.$router.push('/mapservice');
          this.$router.push('/home');
        }
      });
    },

    //获取用户信息
    async get_UserInfo() {
      // const res = await getUserInfo();
      // if (res.code === 200) {
      // 	sessionStorage.setItem('isadmin', res.data.ISADMIN);
      // 	this.setIsAdmin(res.data.ISADMIN);
      // }
    },

    // 获取部门列表
    async getDepart() {
      const res = await getAllDepts();
      if (res.code === 200) {
        this.departOptions = res.data;
      }
    },
    // 部门列表选择
    changeDepart(val) {
      this.getPerson(val);
    },

    // 获取人员列表
    async getPerson(deptid) {
      let params = {
        deptid
      };
      const res = await getAllPersons(params);
      if (res.code === 200) {
        this.userOptions = res.data;
      }
    },

    // 人员选择
    changePerson(val) {
      console.log(val);
      let arr = this.userOptions.filter((item) => {
        return item.pid == val;
      });
      sessionStorage.setItem('ms_username', arr[0].name);
    }
  }
};
</script>

<style lang='scss' scoped>
#login-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.el-container {
  width: 100%;
  height: 100%;
  background: url(../assets/login/bgx1.png) no-repeat center;
  background-size: cover;
  padding: 0 !important;
  height: 100%;
}

.el-main {
  height: 98vh;
  margin: 0px !important;
}

.title {
  height: 40%;
  padding: 3vw 5vw 5vw 2vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.loginbox {
  position: relative;
}

.box-card {
  width: 20%;
  // height: 40%;
  margin: 15% 10%;
  position: absolute;
  padding: 3rem 2rem;
  box-sizing: border-box;
  box-shadow: 0px 22px 24px 0px rgba(62, 131, 233, 0) !important;
  border-radius: 8px !important;
}

h3 {
  color: #3E83E9;
  margin: 0 0 0.25rem 0 !important;
  font-weight: bold;
  letter-spacing: .5rem;
}

h4 {
  margin: 0.25rem 0 2rem 0 !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
  opacity: 0.67;
}

.el-select {
  width: 100%;
  height: 30%;
}

.el-buttonCopy {
  width: 80%;
  box-shadow: 0px 10px 24px 0px rgba(97, 127, 230, 0.54);
  border-radius: 30px;
  background: #3E83E9;
  letter-spacing: 4px;
}

input {
  border: 1px solid rgba(32, 152, 253, 0.51) !important;
  padding: 0.5rem 1.2rem !important;
  box-sizing: border-box;
}

.el-input--suffix .el-input__inner {
  padding: 0.5rem 1.2rem !important;
  box-sizing: border-box;
}

.ms-content {
  ::v-deep .el-input__icon {
    height: 100%;
    width: auto;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
  }
}
</style>
