<!--
 * @Author: LJX
 * @Date: 2022-03-01 10:45:53
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-01 13:21:11
 * @FilePath: \admin-service\src\views\basicconfig\onemapmenu\onemapmenuauth.vue
 * @Description: 菜单权限
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
        </div>

        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="AUTHNAME" label="权限名称" width="300" align="center"></el-table-column>
            <el-table-column prop="AUTHCODE" label="权限编号"></el-table-column>
            <el-table-column label="操作" width="280" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

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
                <el-form-item label="权限名称" prop="AUTHNAME">
                    <el-input v-model="setForm.AUTHNAME"></el-input>
                </el-form-item>
                <el-form-item label="权限编号" prop="AUTHCODE">
                    <el-input v-model="setForm.AUTHCODE"></el-input>
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
import { GetModuleAuthList, SaveModuleAuth, DeleteModuleAuth } from '@/api/moduleonemap-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            tableData: [],
            setVisible: false,
            setTitle: '',
            setForm: {
                AUTHNAME: '',
                AUTHCODE: ''
            },
            setFormRules: {
                AUTHNAME: [{ required: true, message: '权限名称', trigger: 'blur' }],
                AUTHCODE: [{ required: true, message: '权限编码', trigger: 'blur' }]
            },
            moduleid: 0,
            level: 1
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.moduleid = this.$route.query.moduleid;
        this.level = this.$route.query.level;
        console.log(this.moduleid);
        this.getData();
    },
    methods: {
        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 获取列表数据
        async getData() {
            const res = await GetModuleAuthList({
                moduleid: this.moduleid,
                level: this.level
            });
            if(res.code==1){
                this.tableData = res.data;
            }
            
        },

        // 弹窗确定
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                let params = {
                    MODULEID: this.moduleid,
                    AUTHNAME: this.setForm.AUTHNAME,
                    AUTHCODE: this.setForm.AUTHCODE,
                    MLEVEL: this.level
                };
                const res = await SaveModuleAuth(params);
                console.log(data);
                if (res.code== 1) {
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

        // 删除
        async handleDelete(row) {
            const res = await DeleteModuleAuth(row);
            if(res.code==1){
                 this.$message.success('删除成功！');
            this.getData();
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
