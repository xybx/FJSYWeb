<!--
 * @Author: LJX
 * @Date: 2022-02-27 17:48:49
 * @LastEditors: ssq
 * @LastEditTime: 2022-10-27 14:30:43
 * @FilePath: \fjsy-web\src\views\systemconfig\SystemMenuMange\SonMenu.vue
 * @Description: 请填写描述
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if='isAdmin'>新增</el-button>
        </div>

        <el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="PID" label="PID" align="center"> </el-table-column>
            <el-table-column prop="TITLE" label="名称" align="center"> </el-table-column>
            <el-table-column prop="CODE" label="菜单编号" align="center"> </el-table-column>
            <el-table-column prop="PATH" label="路径" align="center"></el-table-column>
              <el-form-item label="图标" prop="ICON">
                    <!-- <el-input  disabled type="button" @click="upload"></el-input> -->
                   <el-upload
                        ref="upload"
                        multiple
                        action="#"
                        :show-file-list="false"
                        :http-request="uploadFile"
                        :file-list="uploadfilelist"
                        accept=".jpg,.png,"
                    >
                        <el-button size="samll" class="upload">{{fileNameList}}</el-button>
                    </el-upload>
                </el-form-item>
            <el-table-column prop="ORDERNUM" label="排序" width="80" align="center"></el-table-column>
            <el-table-column label="操作" width="280" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" v-if='isAdmin'>编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)" v-if='isAdmin'>删除</el-button>
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
                <!-- <el-form-item label="服务地址" prop="URL">
                    <el-input v-model="setForm.URL"></el-input>
                </el-form-item>
            </el-form> -->
             <el-form-item label="模块标题" prop="TITLE">
                    <el-input v-model="setForm.TITLE"></el-input>
                </el-form-item>
                <el-form-item label="模块路径" prop="PATH">
                    <el-input v-model="setForm.PATH"></el-input>
                </el-form-item>
                <!-- <el-form-item label="图标" prop="ICON">
                    <el-input v-model="setForm.ICON"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="菜单跳转类型" prop="LINKTYPE">
                    <el-select v-model="setForm.LINKTYPE">
                        <el-option label="没有动作" :value="0"></el-option>
                        <el-option label="路由" :value="1"></el-option>
                        <el-option label="弹窗" :value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="模块唯一编码" prop="CODE" >
                    <el-input v-model="setForm.CODE"></el-input>
                </el-form-item>
                <!-- <el-form-item label="菜单等级" prop="MODULELEVEL">
                    <el-input v-model="setForm.MODULELEVEL"></el-input>
                </el-form-item> -->
                <el-form-item label="上级菜单" prop="PARENTCODE" >
                    <el-input v-model="setForm.PARENTCODE"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="ORDERNUM" >
                    <el-input v-model="setForm.ORDERNUM" type="number" min="0" ></el-input>
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
import { getModuleList } from '@/api/systemmenu-api';
import {saveModule,deleteModule}from'@/api/systemmenu-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            fileNameList:[],
            uploadfilelist:[],
            isAdmin: false,
            parentcode: '',
            tableData: [],
            setVisible: false,
            setTitle: '',
            setForm: {
                 PID: 0,
                TITLE: '',
                PATH: '',
                ICON: '',
                LINKTYPE: 0,
                CODE: '',
                MODULELEVEL:2,
                PARENTCODE: this.$route.query.CODE,
                ORDERNUM: 0
            },
            setFormRules: {
                URL: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }]
            }
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.parentcode = this.$route.query.CODE;
        console.log(this.parentcode);
        this.getData();
    },
    methods: {
         // 文件上传
        async uploadFile(params) {
            this.fileNameList = params.file.name;
            this.menuInfo.ICON =params.file.name;
            console.log(params.file.name, '文件名称');
            let form = new FormData();
            form.append('file', params.file);
            form.append('filepath', 'FXPJ');
            // form.append('typeid', this.$route.query.pid);
            const data = await uploadfile(form);
            this.$message.success('上传成功');
            this.getData();
        },
        // 新增
        addType() {
            this.setForm.PID=0;
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 获取列表数据
        async getData() {
            console.log(this.parentcode);
            let params = {
                title: '',
                parentcode: this.parentcode
            };
            const res = await getModuleList(params);
            if(res.code==1){
                this.tableData = res.data;
            }
            
        },

        // 弹窗确定
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveModule(this.setForm);
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
                pid: row.PID
            };
            // const data = await delLocateLayer(params);
            const res = await deleteModule(params);
            if(res.code ==1){
                 this.$message.success('删除成功！');
            this.getData();
            }
           
        },

        // 子图层
        handleChild(row) {
            console.log(row);
            this.$router.push({
                path: '/locatechild',
                query: {
                    id: row.ID
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
