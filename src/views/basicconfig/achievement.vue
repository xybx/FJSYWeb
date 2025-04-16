<!--
 * @Author: WCL
 * @Date: 2022-02-09 10:15:49
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-22 16:12:44
 * @FilePath: \fjsy-web\src\views\basicconfig\BasemapConfig.vue
 * @Description: 底图配置
-->
<template>
    <div class='container'>
        <!-- 顶部表单 -->
        <div class='handle-box'>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addType'>新增</el-button>
            <el-button type='primary' icon='el-icon-search' @click='handleSearch' class='fr'>搜索</el-button>
            <el-input v-model='queryname' placeholder='标题关键字' class='handle-input fr'></el-input>
        </div>

        <el-table style='font-size:15px' :data='tableData' border class='table' ref='multipleTable'
                  header-cell-class-name='table-header'>
            <el-table-column prop='pid' label='ID' width='55' align='center'></el-table-column>
            <el-table-column prop='title' label='标题' align='center'></el-table-column>
            <el-table-column prop='sortNum' label='排序' align='center'></el-table-column>
            <el-table-column prop='fullTitle' label='完整标题' align='center'></el-table-column>
            <el-table-column prop='contentTitle' label='内容标题' align='center'></el-table-column>
            <el-table-column prop='createTime' label='创建时间' align='center'></el-table-column>
            <el-table-column prop='updateTime' label='修改时间' align='center'></el-table-column>

            <el-table-column prop='type' label='类型' align='center'>

                <template v-slot='scope'>
                    <div v-if='scope.row.type==1'>字少图多</div>
                    <div v-if='scope.row.type==2'>字多图少</div>
                    <div v-if='scope.row.type==3'>字多图多</div>
                </template>
            </el-table-column>
            <el-table-column prop='isview' label='是否显示' align='center'>
                <template v-slot='scope'>
                    <div v-if='scope.row.isview==0'>不显示</div>
                    <div v-if='scope.row.isview==1'>显示</div>
                </template>
            </el-table-column>

            <el-table-column label='操作' width='180' align='center'>
                <template slot-scope='scope'>
                    <el-button type='text' icon='el-icon-edit' @click='editType(scope.row.pid)'>编辑</el-button>
                    <el-button type='text' icon='el-icon-delete' class='red' @click='handleDelete(scope.row.pid)'>删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pagination'>
            <el-pagination
                background
                layout='total, prev, pager, next, jumper'
                :current-page='currentPage'
                :page-size='pageSize'
                :total='pageTotal'
                @current-change='handlePageChange'
            ></el-pagination>
        </div>
        <!-- 主表新增/编辑弹窗 -->
        <el-dialog
            :title='setTitle'
            :visible.sync='setVisible'
            width='60%'
            custom-class='set-dialog'
            :close-on-click-modal='false'
            @close='dialogClose'
        >
            <el-form ref='setForm' :model='setForm' :rules="rules" label-width='auto' class='set-form'>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='标题' prop='title'>
                            <el-input v-model.trim='setForm.title' placeholder='请输入标题'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11' style='margin-left: 1vw'>
                        <el-form-item label='类型' prop='type'>
                            <el-select v-model='setForm.type' placeholder='请选择类型'>
                                <el-option label='字少图多' :value='1'></el-option>
                                <el-option label='字多图少' :value='2'></el-option>
                                <el-option label='字多图多' :value='3'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='完整标题' prop='fullTitle'>
                            <el-input v-model.trim='setForm.fullTitle' placeholder='请输入完整标题'></el-input>
                            <!--                            提示信息-->
                            <div class="el-form-item__error" v-if="setForm.fullTitle.length>8">
                                为保证显示效果，完整标题建议最多输入8个中文字符
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11' style='margin-left: 1vw'>
                        <el-form-item label='内容标题' prop='contentTitle'>
                            <el-input v-model.trim='setForm.contentTitle' placeholder='请输入内容标题'></el-input>
                            <div class="el-form-item__error" v-if="setForm.contentTitle.length>30">
                                为保证显示效果，内容标题建议最多输入30个中文字符
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='排序' prop='sortNum'>
                            <el-input v-model.trim='setForm.sortNum' type='number' placeholder='请输入排序'
                                      :min='1'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11' style='margin-left: 1vw'>
                        <el-form-item label='是否可见' prop='isview'>
                            <el-switch :active-value='1' :inactive-value='0' v-model='setForm.isview'></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-form-item label='图片' prop='isview' v-if="this.apid!==0">
                    <el-upload
                        action=''
                        list-type='picture-card'
                        accept='.jpg,.jpeg,.png'
                        :before-upload='beforeUploadImg'
                        :http-request='uploadFile'
                        :on-preview='handlePictureCardPreview'
                        :file-list='imgList'
                        :before-remove='handleRemove'>
                        <i class='el-icon-plus'></i>
                    </el-upload>

                </el-form-item>
                <el-form-item label='' v-if="this.apid!==0">
                    <span
                        style="color: #ff0000">注意事项：上传图片仅支持jpg/jpeg/png格式，为了保证显示效果，图片比例建议16:9（如：1920*1080、1280*720）</span>
                </el-form-item>
            </el-form>
            <!--            <el-button type='primary' @click='saveAdd' style='margin-left: 1.5vw'>保存基本信息</el-button>-->
            <div style='margin-top: 1vh;margin-bottom: 1vh' v-if="this.apid!==0">
                <el-button type='primary' @click='logContent' style='margin-left: 1.5vw'>新增文本内容</el-button>
            </div>

            <el-table v-if="this.apid!==0" style='font-size:15px' :data='contentData' border class='table'
                      ref='multipleTable'
                      header-cell-class-name='table-header'>
                <el-table-column prop='pid' label='ID' width='55' align='center'></el-table-column>
                <el-table-column prop='title' label='标题' align='center'></el-table-column>
                <el-table-column prop='sortNum' label='排序' align='center'></el-table-column>

                <el-table-column label='操作' width='180' align='center'>
                    <template slot-scope='scope'>
                        <el-button type='text' icon='el-icon-edit' @click='editContent(scope.row.pid)'>编辑</el-button>
                        <el-button type='text' icon='el-icon-delete' class='red' @click='delContent(scope.row.pid)'>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="this.apid!==0" class='pagination'>
                <el-pagination
                    background
                    layout='total, prev, pager, next, jumper'
                    :current-page='currentContentPage'
                    :page-size='pageContentSize'
                    :total='pageContentTotal'
                    @current-change='handlePageContentChange'
                ></el-pagination>
            </div>
            <span slot='footer' class='dialog-footer'>
				<el-button type='primary' @click="saveAdd('setForm')">确定</el-button>
			</span>
        </el-dialog>

        <!-- 内容新增/编辑弹窗 -->
        <el-dialog
            :title='setContentTitle'
            :visible.sync='setContentVisible'
            width='30%'
            custom-class='set-dialog'
            :close-on-click-modal='false'
            @close='dialogCloseContent'
        >
            <el-form ref='contentForm' :model='contentForm' :rules="contentRules" label-width='auto' class='set-form'>
                <el-form-item label='标题' prop='title'>
                    <el-input v-model.trim='contentForm.title' placeholder='请输入标题'></el-input>
                </el-form-item>
                <el-form-item label='排序' prop='sortNum'>
                    <el-input v-model.trim='contentForm.sortNum' type='number' placeholder='请输入排序'></el-input>
                </el-form-item>
                <el-form-item label='内容' prop='content'>
                    <el-input
                        type='textarea'
                        :rows='2'
                        placeholder='请输入内容'
                        autosize='true'
                        v-model='contentForm.content'>
                    </el-input>
                </el-form-item>
                <el-form-item label='图片' prop='isview' v-if="this.tpid!==0">
                    <el-upload
                        action=''
                        list-type='picture-card'
                        accept='.jpg,.jpeg,.png'
                        :before-upload='beforeUploadImg'
                        :http-request='uploadFileContent'
                        :on-preview='handlePictureCardPreview'
                        :file-list='imgListContent'
                        :before-remove='handleRemove'>
                        <i class='el-icon-plus'></i>
                    </el-upload>
                </el-form-item>
                <!--                提示信息-->
                <el-form-item label='' v-if="this.tpid!==0">
                    <span
                        style="color: #ff0000">注意事项：上传图片仅支持jpg/jpeg/png格式，为了保证显示效果，图片比例建议16:9（如：1920*1080、1280*720）</span>
                </el-form-item>

            </el-form>
            <el-button type='primary' @click="saveContent('contentForm')" style='margin-left: 44%'>保存内容</el-button>
        </el-dialog>


        <el-dialog :visible.sync='dialogVisible' custom-class='set-dialog'
                   :close-on-click-modal='false' title='图片查看'>
            <img width='100%' :src='dialogImageUrl' alt=''>
        </el-dialog>
    </div>
</template>

<script>
import {
    getList,
    saveFjsyAchievement,
    getContentList,
    getById,
    addFjsyText,
    addFjsyImgFile,
    getFjsyImgFile,
    delFile,
    getFjsyTextByid,
    delFjsyTextByid,
    delach
} from '@/api/achievement-api';

export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            queryname: '',
            tableData: [],
            currentPage: 1,
            currentContentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            pageContentSize: 3,
            pageContentTotal: 0,
            setTitle: '',
            setVisible: false,
            setContentTitle: '',
            setContentVisible: false,
            setForm: {
                title: '',
                type: null,
                sortNum: null,
                fullTitle: '',
                contentTitle: '',
                isview: 0
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                fullTitle: [
                    { required: true, message: '请输入完整标题', trigger: 'blur' }
                ],
                contentTitle: [
                    { required: true, message: '请输入内容标题', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                sortNum: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            },
            apid: 0,
            contentData: [],
            contentForm: {
                title: '',
                sortNum: null,
                content: ''
            },
            tpid: 0,
            dialogImageUrl: '',
            dialogVisible: false,
            imgList: [],
            imgListContent: [],

            contentRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                sortNum: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {},
    created() {
    },
    mounted() {
        this.getData();
        // this.initModuleTypeList();
    },
    methods: {
        //图片上传格式校验
        beforeUploadImg(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJPG) {
                this.$message.error('只能上传 JPG / PNG 格式的图片');
                return false;
            }
            // 其他自定义的校验逻辑...
            return true;
        },
        //文件上传
        async uploadFile(option) {
            var data = new FormData();//自定义 参数类型必须为 FormData格式 此为强制要求
            data.append('file', option.file);
            data.append('apid', this.apid);
            const res = await addFjsyImgFile(data);
            if (res.code === 200) {
                //上传成功
                this.$message.success('上传成功！');
                this.getAImgList();
            }
        },
        //文件上传
        async uploadFileContent(option) {
            var data = new FormData();//自定义 参数类型必须为 FormData格式 此为强制要求
            data.append('file', option.file);
            data.append('tpid', this.tpid);
            const res = await addFjsyImgFile(data);
            if (res.code === 200) {
                //上传成功
                this.$message.success('上传成功！');
                this.getAImgListContent();
            }
        },
        //查询主表图片列表
        async getAImgList() {
            const res = await getFjsyImgFile({ apid: this.apid });
            if (res.code === 200) {
                this.imgList = [];
                for (var i = 0; i < res.data.length; i++) {
                    var fileJson = {
                        name: res.data[i].fileName,
                        pid: res.data[i].pid,
                        url: apiURL_file + res.data[i].npath
                    };
                    this.imgList.push(fileJson);
                }
            }
        },
        //查询主表图片列表
        async getAImgListContent() {
            const res = await getFjsyImgFile({ tpid: this.tpid });
            if (res.code === 200) {
                this.imgListContent = [];
                for (var i = 0; i < res.data.length; i++) {
                    var fileJson = {
                        name: res.data[i].fileName,
                        pid: res.data[i].pid,
                        url: apiURL_file + res.data[i].npath
                        // url: res.data[i].path
                    };
                    this.imgListContent.push(fileJson);
                }
            }
        },
        //图片查看
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        dialogClose() {
            this.setForm = {
                title: '',
                type: null,
                sortNum: null,
                fullTitle: '',
                contentTitle: '',
                isview: 0
            };
            this.contentForm = {};
            this.imgList = [];
            this.handleSearch();
            this.currentContentPage = 1;
        },
        dialogCloseContent() {
            this.contentForm = {};
            this.imgListContent = [];
            this.getContentList();
        },
        // 搜索
        handleSearch() {
            let form = {
                search: this.queryname
            };
            this.getData(form);
        },
        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
            this.apid = 0;
        },
        async editType(pid) {
            this.setTitle = '编辑';
            this.setVisible = true;
            this.apid = pid;
            const res = await getById({ pid: pid });
            if (res.code === 200) {
                this.setForm = res.data;
                this.getContentList();
                this.getAImgList();
            }
        },
        logContent() {
            if (this.apid === 0) {
                this.$message.error('请先保存基本信息');
            } else {
                this.tpid = 0;
                this.setContentTitle = '新增';
                this.setContentVisible = true;
            }
        },
        async editContent(pid) {
            this.tpid = pid;
            const res = await getFjsyTextByid({ pid: pid });
            if (res.code === 200) {
                this.setContentTitle = '编辑';
                this.setContentVisible = true;
                this.contentForm = res.data;
                this.getAImgListContent();
            }
        },
        // 当前页点击
        handlePageChange(val) {
            this.currentPage = val;
            let form = {
                search: this.queryname
            };
            this.getData(form);
        },
        handlePageContentChange(val) {
            this.currentContentPage = val;
            this.getContentList();
        },
        // 获取列表数据
        async getData(form) {
            let params = {
                search: '',
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            if (form?.search) {
                Object.assign(params, form);
            }

            const res = await getList(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },
        //保存
        async saveAdd(setForm) {
            this.$refs[setForm].validate(async valid => {
                if (valid) {
                    this.setForm.fjsyTextList = null;
                    this.setForm.imgList = null;
                    const res = await saveFjsyAchievement(this.setForm);
                    if (res.code === 200) {
                        if (this.apid !== 0) {
                            this.setVisible = false;
                            this.setForm = {
                                title: '',
                                type: null,
                                sortNum: null,
                                fullTitle: '',
                                contentTitle: '',
                                isview: 0
                            };
                        }
                        this.apid = res.data;
                        this.setForm.pid = res.data;
                        this.$message.success('保存成功！');
                        await this.getContentList();
                    }
                }
            });

        },
        async saveContent(contentForm) {
            this.$refs[contentForm].validate(async valid => {
                if (valid) {
                    this.contentForm.apid = this.apid;
                    this.contentForm.imgList = null;
                    const res = await addFjsyText(this.contentForm);
                    if (res.code === 200) {
                        if (this.tpid !== 0) {
                            this.setContentVisible = false;
                            this.contentForm = {};
                        }
                        this.tpid = res.data;
                        this.contentForm.pid = res.data;
                        this.$message.success('保存成功！');
                        await this.getContentList();
                        // this.setContentVisible = false;
                    }
                }
            });
        },
        //查询文本内容列表
        async getContentList() {
            const res = await getContentList({
                pid: this.apid, pageNum: this.currentContentPage,
                pageSize: this.pageContentSize
            });
            if (res.code === 200) {
                this.contentData = res.data.list;
                this.pageContentTotal = res.data.total;
            }
        },
        // 删除
        async handleDelete(pid) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        pid: pid
                    };
                    const res = await delach(params);
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });


        },
        async delContent(pid) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        pid: pid
                    };
                    const res = await delFjsyTextByid(params);
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getContentList();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });


        },
        //图片删除
        handleRemove(file, fileList) {
            return new Promise((response, reject) => {
                this.$confirm('此操作将永久删除此图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delFile({ pid: file.pid }).then((res) => {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            return response();
                        }
                    });
                }).catch(() => {
                    return reject();
                });
            });
        }
    }
};
</script>

<style scoped lang='scss'>
@import '@/assets/scss/common.scss';

.el-select {
    width: 100%;
}
</style>