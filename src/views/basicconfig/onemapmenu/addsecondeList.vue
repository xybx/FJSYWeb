<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" v-if="isAdmin == 'true'" @click="add(null)">新增</el-button>
        </div>
        <el-table
            :data="treeData"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            row-key="ID"
            :tree-props="{ children: 'CHILDREN' }"
            stripe
        >
            <el-table-column prop="TITLE" label="名称" width="230" align="center"> </el-table-column>
            <el-table-column prop="PATH" label="路径" align="center"></el-table-column>
            <el-table-column prop="ICON" label="背景图标" align="center"></el-table-column>
            <el-table-column prop="ORDERNUM" label="排序" width="80" align="center" type="number" min='0'></el-table-column>
            <el-table-column label="操作" align="center" width="300" v-if="isAdmin=='true'">
                <template slot-scope="item">
                    <div>
                        <el-button type="text" icon="el-icon-circle-plus-outline" @click="add(item.row)" class="green" v-if=" item.row.MLEVEL==2 &&isAdmin=='true'"
                            >添加子菜单</el-button
                        >
                        <!-- <el-button type="text" icon="el-icon-tickets" @click="MenuAuth(item.row)" class="orange">菜单权限</el-button> -->
                        <el-button type="text" icon="el-icon-edit" @click="handelSaveModule(item.row)" class="blue" >{{isAdmin== 'true'?'编辑':'查看'}}</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(item.row.ID)" v-if="isAdmin=='true'">删除</el-button>
                    </div>
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
                <el-form-item label="标题" prop="TITLE">
                    <el-input v-model="setForm.TITLE" />
                </el-form-item>
                <!-- <el-form-item label="路径" prop="PATH">
                    <el-input v-model="setForm.PATH" />
                </el-form-item> -->
                <!-- <el-form-item label="图标" prop="ICON">
                       <el-upload
                        action="#"
                        list-type="picture-card"
                        :on-preview="onPreview"
                        :on-remove="onRemove"
                        :on-change="onChange"
                        :auto-upload="false"
                        :file-list="uploadfilelist"
                        
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="" />
                    </el-dialog>
                </el-form-item> -->
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
import { GetModuleList, DeleteModule, SaveModule } from '@/api/moduleonemap-api';
import { uploadfile } from '@/api/upload-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin:false,
            dialogVisible:false,
            dialogImageUrl:'',
            uploadfilelist: [],
            fileNameList: '',
            treeData: [
            ],
            setVisible: false,
            setTitle: '',
            setForm: {
                ID: 0,
                TITLE: '',
                PATH: '',
                ICON: '',
                MLEVEL: 2,
                BGIMG: '',
                ORDERNUM:0,
                PARENTID:0, //一级菜单id
                MODULEPID:0,//二级菜单id
            },
            setFormRules: {
                TITLE: [{ required: true, message: '标题不能为空哦' }],
                PATH: [{required: true, message: '你输入的地址格式不正确' }]
            },
            childIdList: [],
            fieldList: [],            
        };
    },
    computed: {},
    watch: {
        // setVisible(boo) {
        //     if (boo) {
        //         this.getChildList();
        //         this.changeChildID();
        //     }
        // }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.setForm.PARENTID = this.$route.query.module_parent_id;
        this.getData();

    },
    methods: {
        // 文件上传
        async uploadFile(file) {
            this.fileNameList = file.name;
            this.setForm.ICON = file.name;
            console.log(file.name, '文件名称');
            let form = new FormData();
            form.append('file', file);
            form.append('filepath', 'XTCD');
            // form.append('typeid', this.$route.query.pid);
            const data = await uploadfile(form);
            this.$message.success('上传成功');
            this.setForm.ICON=data;
            // this.getData();
        },

        // 新增
        add(row) {
            console.log(row,"row");
            this.setTitle = '新增';
            this.setVisible = true;
            if (row !=null) {
                this.setForm.MODULEPID=row.ID;
                this.setForm.LEVEL=3;
            }
        },

        // 获取列表数据
        async getData() {
            let params = {
                module_parent_id:this.setForm.PARENTID ,
                keyword: ''
            };
            const res = await GetModuleList(params);
            console.log(res);
            if(res.code==1){
                this.treeData = res.data.datas;
            }
          
            console.log(this.treeData);
        },

        // 弹窗确定
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await SaveModule({
                    ...this.setForm,
                });
                // console.log(data);
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
            this.uploadfilelist=[];
        },

        // 编辑
        handelSaveModule(row) {
            console.log(row);
            row.CHILDID = String(row.CHILDID);
            this.setForm.ICON=row.ICON;
            console.log(this.setForm)
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
            // this.setForm.ICON = this.fileNameList;
        },

        // 删除
        async handleDelete(ID) {
            let params = {
                pid: ID
            };
            const res = await DeleteModule(params);
            if(res.code==1){
                this.$message.success('删除成功！');
                this.getData();
            }
            
        },
        //菜单权限
        MenuAuth(row) {
            this.$router.push({
                path: '/onemapmenuauth',
                query: {
                    moduleid: row.ID,
                    level:2
                }
            });
        },
         // 图标文件上传的方法
            // 文件上传方法
        onRemove(file){},
        // 图片下载方法
        handleDownload(file){
                 this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        },
        // 当图片改变是的事件
        onChange(file,filelist){
            console.log(file.raw);
            this.uploadFile(file.raw);
            
        },
        // 图片展示
        onPreview(file){
            //  this.uploadFile(file);
            // this.dialogImageUrl=file.url;
            // this.dialogVisible=true;
            // console.log(file);
         
        },

    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
.el-select {
    width: 100%;
}
</style>
