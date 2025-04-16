<!--
 * @Author: WCL
 * @Date: 2022-02-11 16:35:30
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 09:44:31
 * @FilePath: \fjsy-web\src\views\safemanage\PeopleAdmin.vue
 * @Description: 安全管理-角色管理
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addUser">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="keywords" placeholder="请输入搜索关键字(用户名称/手机号)" class="handle-input fr"></el-input>
            <!-- <el-button type="primary" @click="ownUpdataUser">同步用户</el-button> -->
        </div>

        <el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="pid" label="PID" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="用户名" min-width="200" align="center"></el-table-column>
            <el-table-column prop="officeName" label="所属部门" min-width="250" align="center"></el-table-column>
            <el-table-column prop="ruleName" label="用户角色" min-width="250" align="center"></el-table-column>
            <el-table-column prop="phonenum" label="手机号" min-width="120" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
                <template slot-scope="scope">
                    {{ scope.row.status == 1 ? '正常' : '禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    <!-- <el-button type="text" icon="el-icon-setting" @click="setUserRule(scope.row)">设置角色</el-button> -->
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :current-page="pageNum"
                :page-size="pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="setTitle"
            :visible.sync="setVisible"
            width="35%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model.trim="setForm.name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phonenum">
                    <el-input v-model.trim="setForm.phonenum" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">

                    <el-input v-model.trim="setForm.password" placeholder="输入用户登录密码" show-password></el-input>
                    <span class="gray">默认: 888888</span>
                </el-form-item>
                <el-form-item label="设置用户角色：" prop="ruleid">
                    <el-select v-model="setForm.ruleid" placeholder="请选择">
                        <el-option v-for="item in ruleList" :key="item.pid" :label="item.name" :value="item.pid"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户所属部门：" prop="officeid">
                    <el-select v-model="setForm.officeid" placeholder="请选择部门">
                        <el-option v-for="item in officeList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="入职时间" prop="JOBTIME">
					<el-date-picker v-model.trim="setForm.JOBTIME" type="date" placeholder="请选择入职时间"> </el-date-picker>
				</el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>

        <!--设置用户角色弹窗 -->
        <el-dialog
            title="设置用户角色"
            :visible.sync="setUserRuleVisible"
            width="25%"
            custom-class="set-dialog"
            @close="closedSetRuleDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setRuleForm" :model="setRuleForm" label-width="auto" class="set-form">
                <el-form-item label="当前用户：" prop="username">
                    <span>{{ setRuleForm.username }}</span>
                </el-form-item>
                <el-form-item label="用户角色：" prop="ruleids">
                    <el-select v-model="setRuleForm.ruleids" placeholder="请选择">
                        <el-option v-for="item in ruleList" :key="item.pid" :label="item.name" :value="item.pid"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setUserRuleVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUserRule">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getList, saveUser, DeleteUser, setUserRole, getUserRoles, UpdataUser } from '@/api/safeadmin/user-api';
import { getAllOfficeList } from '@/api/safeadmin/depart-api';
import { getRuleList } from '@/api/safeadmin/role-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            keywords: '',
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            pageTotal: 0,
            setForm: {
                pid: 0,
                name: '',
                // DESCRIBE: '',
                officeid: '',
                password: '888888',
                serial: '',
                phonenum: '',
                jobtime: null,
                ruleid: ''
            },
            setFormRules: {
              name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
                officeid: [{ required: true, message: '请选择部门', trigger: 'change' }],
                phonenum: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
                ruleid: [{ required: true, message: '角色ID不能为空', trigger: 'change' }]
            },
            officeList: [],
            setVisible: false,
            setTitle: '新增',
            setUserRuleVisible: false, //设置用户角色的弹窗是否显示
            setRuleForm: {
                userid: 0,
                username: '',
                // RULEIDS: []
                ruleids: ''
            },
            ruleList: [], //角色下拉列表
            officeId: 0
        };
    },
    computed: {},
    watch: {
        setVisible(boo) {
            if (boo) {
                this.getOfficeList();
                this.getRuleList();
            }
        },
        setUserRuleVisible(boo) {
            if (boo) {
                this.getRuleList();
            }
        },
        '$route.query.officeid': {
            handler(val) {
                if (!!val == false) {
                    this.officeId = 0;
                } else {
                    this.officeId = val;
                }
                this.getList();
            },
            immediate: true
        }
    },
    created() {},
    mounted() {
        this.officeId = this.$route.query.officeid;
        this.getList();
    },
    methods: {
        // 获取用户列表
        async getList(form) {
            let params = {
                keywords: this.keywords,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                officeid: this.officeId
            };
            if (form?.keywords) {
                Object.assign(params, form);
            }
            const res = await getList(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },

        // 部门列表
        async getOfficeList() {
            const res = await getAllOfficeList();
            if (res.code === 200) {
                this.officeList = res.data;
            }
        },

        // 角色列表
        async getRuleList() {
            const res = await getRuleList();
            if (res.code === 200) {
                this.ruleList = res.data;
            }
        },

        // 设置用户角色
        setUserRule(row) {
            this.setRuleForm.username = row.name;
            this.setRuleForm.userid = row.pid;
            this.setUserRuleVisible = true;

            //获取用户已设置的角色列表
            this.getUserRoleList(row.pid);
        },

        async getUserRoleList(uid) {
            let params = {
                userid: uid
            };
            const res = await getUserRoles(params);
            if (res.code === 200) {
                this.setRuleForm.ruleids = res.data;
            }
        },

        // 保存用户角色
        async saveUserRule() {
            let params = {
                uid: this.setRuleForm.userid,
                ruleids: this.setRuleForm.ruleids.join(',')
            };
            const res = await setUserRole(params);
            if (res.code === 200) {
                this.$message.success('操作成功！');
                this.setUserRuleVisible = false;
            }
        },

        // 添加用户
        addUser() {
            this.setTitle = '新增';
            this.setVisible = true;
            if (this.officeId) {
                this.setForm.officeid = Number(this.officeId);
            }
            this.setFormRules.password = [{ required: true, message: '用户密码不能为空', trigger: 'blur' }];
        },

        // 编辑赋值
        handleEdit(row) {
            console.log(row, '这是编辑内容');

            this.setTitle = '编辑';
            this.setVisible = true;
            this.setRuleForm.ruleids = row.ruleid;
            this.setForm.ruleid = row.ruleid;
            Object.assign(this.setForm, row);
            this.setForm.password = null;
            this.setFormRules.password = ''
        },

        // 保存
        save() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                console.log("setform", this.setForm)
                const res = await saveUser(this.setForm);
                console.log(this.setForm);
                console.log(res);
                if (res.code === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getList();
                }
            });
        },

        // 删除
        handleDelete(row) {
            this.$confirm('你确定要删除该用户吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let params = {
                    pid: row.pid
                };
                const res = await DeleteUser(params.pid);
                if (res.code === 200) {
                    this.$message.success('删除成功！');
                    this.getList();
                }
            });
        },

        // 搜索
        handleSearch() {
            let form = {
                keyword: this.keywords
            };
            this.getList(form);
        },
        // 页码切换
        handlePageChange(val) {
            this.pageNum = val;
            let form = {
                keyword: this.keywords
            };
            this.getList(form);
        },

        // 关闭新增，编辑的弹窗
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },

        // 关闭设置用户角色的弹窗
        closedSetRuleDialog() {
            this.$refs.setRuleForm.resetFields();
            this.setRuleForm = this.$options.data().setRuleForm;
        },
        ///同步用户
        async ownUpdataUser() {
            let params = {
                token:'hydp888'
            }
            const res = await UpdataUser(params);
            console.log(params);
            console.log(res);
            if (res.code === 200) {
                this.$message.success(`${this.setTitle}成功`);
                this.getList();
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
.el-select {
    width: 100%;
}
</style>
