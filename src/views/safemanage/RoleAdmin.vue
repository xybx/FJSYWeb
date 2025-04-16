<!--
 * @Author: WCL
 * @Date: 2022-02-11 16:35:30
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-04 10:45:38
 * @FilePath: \fjsy-web\src\views\safemanage\RoleAdmin.vue
 * @Description: 安全管理-角色管理
-->
<template>
    <div class="container">
        <!-- <div class="container">部门管理</div> -->
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="add">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="keywords" placeholder="请输入搜索关键字(角色名称/描述)" class="handle-input fr"></el-input>
        </div>

        <el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="pid" label="PID" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="tag" label="描述" align="center"></el-table-column>
            <!-- <el-table-column prop="ISADMIN" label="是否管理员">
                <template slot-scope="scope">
                    {{ scope.row.ISADMIN == 0 ? '否' : '是' }}
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="SERIAL" label="排序" width="80"></el-table-column> -->
            <el-table-column label="操作" width="250" align="left">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" class="red">删除</el-button>
                    <!-- <el-button
                        type="text"
                        icon="el-icon-setting"
                        @click="setRoleAuths(scope.row)"
                        class="green"
                        v-if="scope.row.ISADMIN == 0"
                        >设置角色权限</el-button
                    > -->
                    <el-button type="text" icon="el-icon-setting" @click="setRoleAuths(scope.row)" class="green">设置角色权限</el-button>
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
            @closed="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model.trim="setForm.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="tag">
                    <el-input v-model.trim="setForm.tag" placeholder="请输入角色描述信息"></el-input>
                </el-form-item>
                <!-- <el-form-item label="是否管理员" prop="ISADMIN">
                    <el-switch
                        v-model="setForm.ISADMIN"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-form-item> -->
                <!-- <el-form-item label="排序" prop="SERIAL">
                    <el-input v-model.number="setForm.SERIAL" placeholder="请输入排序" type="number" min="0"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getListByPage, saveRule, deleteRule } from '@/api/safeadmin/role-api';
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
                pid: '',
                name: '',
                tag: '',
                // SERIAL: '',
                // ISADMIN: 0
            },
            setFormRules: {
                name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
            },
            setVisible: false,
            setTitle: '新增'
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getList();
    },
    methods: {
        // 获取图层
        async getList(form) {
            let params = {
                keywords: this.keywords,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            if (form?.keywords) {
                Object.assign(params, form);
            }
            const res = await getListByPage(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },
        //添加部门
        add() {
            this.setTitle = '新增';
            this.setVisible = true;
			// this.$router.push({
            //     path: `/setroleedit`,
            //     query: {
            //         id: 0,
            //         name: ''
            //     }
            // });
        },
        //编辑赋值
        handleEdit(row) {
            console.log(row);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
			//跳转页面
			// console.log(row);
            // this.$router.push({
            //     path: `/setroleedit`,
            //     query: {
            //         id: row.PID,
            //         name: row.NAME
            //     }
            // });
        },

        //新增编辑保存
        //保存
        save() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveRule(this.setForm);
                if (res.code === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getList();
                }
            });
        },

        //删除
        async handleDelete(row) {

            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        pid: row.pid
                    };
                    const res = await deleteRule(params.pid);
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getList();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });

            
        },
        //搜索
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

        // 设置角色权限
        setRoleAuths(row) {
            console.log(row);
            this.$router.push({
                path: `/setroleauth`,
                query: {
                    id: row.pid,
                    name: row.name
                }
            });
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
