<!--
 * @Author: WCL
 * @Date: 2022-02-11 16:34:48
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 09:38:20
 * @FilePath: \fjsy-web\src\views\safemanage\DepartAdmin.vue
 * @Description: 安全管理 - 部门管理
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addDepart">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="keywords" placeholder="请输入搜索关键字(部门名称/描述/行政区编号)" class="handle-input fr"></el-input>
            <!-- <el-button type="primary" @click="ownUpdataOffice">同步科室</el-button> -->
        </div>

        <el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="pid" label="PID" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="部门名称"></el-table-column>
            <!-- <el-table-column prop="code" label="所属行政区编号"></el-table-column> -->
            <el-table-column prop="describe" label="描述" width="300"></el-table-column>
            <el-table-column prop="isenable" label="是否禁用">
                <template slot-scope="scope">
                    {{ scope.row.isenable == 0 ? '禁用' : '启用' }}
                </template>
            </el-table-column>
            <el-table-column prop="serial" label="排序" width="80"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-user-solid" @click="addUserList(scope.row)">添加用户</el-button>
                    <el-button v-if="scope.row.isenable == 1" type="text" icon="el-icon-lock" class="red" @click="handleDelete(scope.row)"
                        >禁用</el-button
                    >
                    <el-button
                        v-if="scope.row.isenable == 0"
                        type="text"
                        icon="el-icon-unlock"
                        class="green"
                        @click="handleDelete(scope.row)"
                        >启用</el-button
                    >
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
                <!-- <el-form-item label="所属行政区" prop="code">
                    <el-cascader
                        v-model="setForm.code"
                        :options="xzqList"
                        :props="{ checkStrictly: true, value: 'XZQDM', label: 'XZQMC', children: 'CHILDREN' }"
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item> -->
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model.trim="setForm.name" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="部门描述" prop="describe">
                    <el-input v-model.trim="setForm.describe" placeholder="请输入部门描述"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="serial">
                    <el-input v-model.number="setForm.serial" placeholder="请输入排序" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getList, getXZQList, saveOffice, enableOffice, UpdataOffice } from '@/api/safeadmin/depart-api';
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
                describe: '',
                code: '',
                serial: ''
            },
            setFormRules: {
                name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
                code: [{ required: true, message: '请选择部门', trigger: 'change' }]
            },
            xzqList: [],
            setVisible: false,
            setTitle: '新增'
        };
    },
    computed: {},
    watch: {
        setVisible(boo) {
            if (boo) {
                this.getXZQ_List();
            }
        }
    },
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
            const res = await getList(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },
        // //获取行政区列表
        // async getXZQ_List() {
        //     const res = await getXZQList();
        //     if (res.code  === 200) {
        //         this.xzqList = res.data;
        //     }
        // },

        handleChange(value) {
            this.setForm.code = value[value.length - 1];
            console.log(this.setForm.code);
        },
        //添加部门
        addDepart() {
            this.setTitle = '新增';
            this.setVisible = true;
        },
        //编辑赋值
        handleEdit(row) {
            console.log(row);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
        },
        //保存
        save() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveOffice(this.setForm);
                debugger;
                if (res.code  === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getList();
                }
            });
        },
        //添加用户
        addUserList(row) {
            console.log(row);
            this.$router.push({
                path: '/peopleadmin',
                query: {
                    officeid: row.pid
                }
            });
        },
        //删除
        async handleDelete(row) {
            let params = {
                pid: row.pid,
                isenable: row.isenable == 0 ? 1 : 0
            };
            const res = await enableOffice(params);
            if (res.code  === 200) {
                this.$message.success('操作成功');
                this.getList();
            }
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
        ///同步科室
        async ownUpdataOffice() {
            let params = {
                token:'hydp888'
            }
            const res = await UpdataOffice(params);
            console.log(params);
            console.log(res);
            if (res.code  === 200) {
                this.$message.success(`${this.setTitle}成功`);
                this.getList();
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
::v-deep .set-dialog {
    .el-cascader {
        width: 100%;
    }
}
</style>
