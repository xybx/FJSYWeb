<!--
 * @Author: ssq
 * @Date: 2022-10-11 18:08:22
 * @LastEditors: ssq
 * @LastEditTime: 2022-10-31 09:47:23
 * @FilePath: \fjsy-web\src\views\TokenLogin.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
-->
<template>
    <div class=""></div>
</template>

<script>
import { yzLogin } from '../api/safeadmin/user-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            loading: null
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        // this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            this.loading = this.$message({
                type: 'warning',
                message: '正在登录验证，请稍等...',
                duration: 0
            });

            // 传递参数
            let params = {
                token: this.$route.query.token
            };

            // 调取接口
            const res  = await yzLogin(params);
            if (res.code === 1) {
                this.loading.close();
                sessionStorage.setItem('user', JSON.stringify(form));
                sessionStorage.setItem('token', res.data);
                this.$router.push('/mapservice');
                this.$message.success('登录成功');
            } else {
                console.log(this.loading);
                this.loading.close();
                // this.$message.error('登录失败');
            }
        }
    }
};
</script>

<style scoped lang="scss"></style>
