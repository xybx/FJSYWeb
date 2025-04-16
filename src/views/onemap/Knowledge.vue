<!--
 * @Author: WCL
 * @Date: 2022-02-22 15:20:20
 * @LastEditors: LJX
 * @LastEditTime: 2022-05-24 16:10:09
 * @FilePath: \admin-service\src\views\onemap\Knowledge.vue
 * @Description: 知识库
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="queryname" placeholder="请输入关键字" class="handle-input fr"></el-input>
        </div>

        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="PID" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="TYPENAME" label="类型名称"></el-table-column>
            <el-table-column prop="ORDERNUM" label="排序"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-document" @click="handleFile(scope.row)">文件列表</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" v-if="isAdmin == 'true'">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)" v-if="isAdmin == 'true'"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="setTitle"
            :visible.sync="setVisible"
            width="30%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="类型名称" prop="TYPENAME">
                    <el-input v-model.trim="setForm.TYPENAME" placeholder="请输入类型名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="ORDERNUM">
                    <el-input v-model.number="setForm.ORDERNUM" placeholder="请输入排序" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getTypeList, saveType, delType, getFileList, saveFile, delFile } from '@/api/onemap/knowledge-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            queryname: '',
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            setVisible: false,
            setTitle: '',
            setForm: {
                PID: 0,
                TYPENAME: '',
                ORDERNUM: null,
                MODULETYPE: '1'
            },
            setFormRules: {
                TYPENAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                ORDERNUM: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
            }
        };
    },
    computed: {},
    watch: {
        $route: {
            handler(val) {
                this.setForm.MODULETYPE = this.$route.query.type;
                if (this.$route.query.type == undefined || this.$route.query.type == '') {
                    this.setForm.MODULETYPE = 1;
                }
                this.getData();
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.setForm.MODULETYPE = this.$route.query.type;
        if (this.$route.query.type == undefined || this.$route.query.type == '') {
            this.setForm.MODULETYPE = 1;
        }
        this.getData();
    },
    methods: {
        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 页码切换
        handlePageChange(val) {
            this.currentPage = val;
            let form = {
                keyword: this.queryname
            };
            this.getData(form);
        },

        // 搜索
        handleSearch() {
            let form = {
                keyword: this.queryname
            };
            this.currentPage = 1;
            this.getData(form);
        },

        // 获取列表数据
        async getData(form) {
            debugger;
            let params = {
                keyword: '',
                moduletype: this.setForm.MODULETYPE,
                currentpage: this.currentPage,
                pagesize: this.pageSize
            };
            if (form?.keyword) {
                Object.assign(params, form);
            }
            const res = await getTypeList(params);
            if (res.code === 1) {
                this.tableData = res.data.datas;
                this.pageTotal = res.data.total;
            }
        },

        // 弹窗确定
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveType(this.setForm);
                if (res.code == 1) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getData();
                }
            });
        },

        // 关闭窗口
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },

        // 编辑
        handleEdit(row) {
            console.log(row);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
        },

        // 删除
        async handleDelete(row) {
            let params = {
                id: row.PID
            };
            const res = await delType(params);
            if (res.code === 1) {
                this.$message.success('删除成功！');
                this.getData();
            }
        },

        // 文件列表
        handleFile(row) {
            this.$router.push({
                path: '/wikifile',
                query: {
                    pid: row.PID
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
</style>
