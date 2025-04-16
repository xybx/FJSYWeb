<!--
 * @Author: LJX
 * @Date: 2022-03-18 11:46:09
 * @LastEditors: LJX
 * @LastEditTime: 2022-05-11 13:47:38
 * @FilePath: \admin-service\src\views\planreview\planresultsdatas.vue
 * @Description: 规划审查-成果数据管理
-->

<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="add">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="searchForm.keyword" placeholder="请输入搜索关键字(服务名称)" class="handle-input fr"></el-input>
        </div>

        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="PID" label="PID" width="80" align="center"></el-table-column>
            <el-table-column prop="PRJNAME" label="项目名称" min-width="150"></el-table-column>
            <el-table-column prop="JDNAME" label="阶段名称" min-width="120"></el-table-column>
            <el-table-column prop="LAYERNAME" label="服务名称" min-width="150"></el-table-column>
            <el-table-column prop="URL" label="服务地址" min-width="300"></el-table-column>
            <el-table-column prop="DATATYPENAME" label="数据类型" width="150"> </el-table-column>
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
            width="35%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="选择规划项目类型" prop="TYPEID">
                    <el-select v-model="setForm.TYPEID" placeholder="选择规划项目类型" @change="changeGhtype">
                        <el-option v-for="item in typeList" :key="item.ID" :label="item.TYPENAME" :value="item.ID"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择项目" prop="PROJECTID">
                    <el-select v-model="setForm.PROJECTID" placeholder="请选择项目" @change="changeProject">
                        <el-option v-for="item in projectList" :key="item.PID" :label="item.PRJNAME" :value="item.PID"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择阶段" prop="JDBH">
                    <el-select v-model="setForm.JDBH" placeholder="请选择阶段">
                        <el-option v-for="item in jdList" :key="item.JDBH" :label="item.JDNAME" :value="item.JDBH"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="阶段审查结论报告" prop="REPORTURL">
                    <el-upload
                        ref="upload"
                        multiple
                        action="#"
                        :show-file-list="true"
                        :on-change="handleChange"
                        :before-upload="beforeUpload"
                        :http-request="uploadFile"
                        :file-list="uploadfilelist"
                        :on-remove="removefile"
                        accept=".pdf"
                    >
                        <el-button size="mini" class="upload" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" style="color: red">
                            只能上传pdf文件，相同项目的相同的阶段上传一次报告即可，不同数据类型分别上传将被覆盖
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="选择数据类型" prop="DATATYPE">
                    <el-select v-model="setForm.DATATYPE" placeholder="请选择数据类型">
                        <el-option
                            v-for="item in datatypeList"
                            :key="item.DICTVALUE"
                            :label="item.DICTNAME"
                            :value="item.DICTVALUE"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图层名称" prop="LAYERNAME">
                    <el-input v-model.trim="setForm.LAYERNAME" placeholder="请输入图层名称"></el-input>
                </el-form-item>
                <el-form-item label="图层地址" prop="URL">
                    <el-input v-model.trim="setForm.URL" placeholder="请输入图层地址"></el-input>
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
import { getList, getGHTypeList, getPRJList, getJDList, getDataTypeList, setSave, Delete } from '@/api/ghsc-api';
import { uploadfile } from '@/api/upload-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        function IsURL(str_url) {
            var strRegex =
                '^((https|http|ftp|rtsp|mms)?://)' +
                "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
                '(([0-9]{1,3}.){3}[0-9]{1,3}' +
                '|' +
                "([0-9a-z_!~*'()-]+.)*" +
                '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' +
                '[a-z]{2,6})' +
                '(:[0-9]{1,4})?' +
                '((/?)|' +
                "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            if (re.test(str_url)) {
                return true;
            } else {
                return false;
            }
        }
        var validatePass = (rule, value, callback) => {
            debugger;
            console.log(value);
            if (value === '') {
                callback(new Error('服务地址不能为空'));
            } else {
                if (!IsURL(value)) {
                    console.log('验证成功');
                    callback();
                } else {
                    callback(new Error('请输入正确的url'));
                    console.log('验证失败');
                }
            }
        };
        return {
            uploadfilelist: [],
            fileNameList: '',
            keywords: '',
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            searchForm: {
                projectid: 0,
                jdbh: '',
                keyword: ''
            },
            setForm: {
                PID: 0,
                PROJECTID: '',
                JDBH: '',
                DATATYPE: '',
                LAYERNAME: '',
                URL: '',
                TYPEID: '',
                REPORTURL: '',
                REPORTNAME: ''
            },
            setFormRules: {
                LAYERNAME: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
                URL: [{ required: true, trigger: 'blur', validator: validatePass }],
                PROJECTID: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
                JDBH: [{ required: true, message: '请选择阶段', trigger: 'change' }],
                DATATYPE: [{ required: true, message: '请选择数据类型', trigger: 'change' }]
            },
            typeList: [],
            projectList: [],
            jdList: [],
            datatypeList: [],
            officeList: [],
            setVisible: false,
            setTitle: '新增',
            setUserRuleVisible: false, //设置用户角色的弹窗是否显示
            ruleList: [], //角色下拉列表
            officeId: 0
        };
    },
    computed: {},
    watch: {
        setVisible(boo) {
            if (boo) {
                this.getGHTYPEList();
                this.getDataTypeList();
            }
        }
    },
    created() {},
    mounted() {
        this.getList();
    },
    methods: {
        // 获取数据列表
        async getList() {
            let params = {
                projectid: this.searchForm.projectid,
                jdbh: this.searchForm.jdbh,
                keyword: this.keywords,
                currentpage: this.currentPage,
                pagesize: this.pageSize
            };
            const res = await getList(params);
            if (res.code === 1) {
                this.tableData = res.data.datas;
                this.pageTotal = res.data.total;
            }
        },

        // 获取规划类型列表
        async getGHTYPEList() {
            const res = await getGHTypeList();
            if (res.code === 1) {
                this.typeList = res.data;
            }
        },
        changeGhtype(item) {
            this.setForm.PROJECTID = '';
            this.getProjectList(item);
        },

        // 项目列表
        async getProjectList(typeid) {
            const res = await getPRJList({ typeid: typeid });
            if (res.code === 1) {
                this.projectList = res.data;
            }
        },
        changeProject(item) {
            this.setForm.JDBH = '';
            this.getJDList(item);
        },
        // 阶段列表
        async getJDList(prjid) {
            const res = await getJDList({ projectid: prjid });
            if (res.code === 1) {
                this.jdList = res.data;
            }
        },
        //数据类型列表
        async getDataTypeList() {
            const res = await getDataTypeList();
            if (res.code === 1) {
                this.datatypeList = res.data;
            }
        },

        // 添加
        add() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 编辑赋值
        handleEdit(row) {
            console.log(row, '这是编辑内容');
            this.setTitle = '编辑';
            this.setVisible = true;

            this.getProjectList(row.TYPEID);
            this.getJDList(row.PROJECTID);
            Object.assign(this.setForm, row);
            this.setForm.DATATYPE = String(row.DATATYPE);
            if (row.REPORTURL != '' && row.REPORTURL != null) {
                var _filename = row.REPORTNAME;
                var filename = { name: _filename, uid: row.PID, url: row.REPORTURL };
                this.uploadfilelist = [filename];
            } else {
                this.uploadfilelist = [];
            }
        },

        // 保存
        save() {
            let loading = this.$message({
                iconClass: 'el-icon-loading',
                message: '正在保存数据...',
                duration: 0,
                customClass: 'prop-search'
            });
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await setSave(this.setForm);
                console.log(this.setForm);
                console.log(res);
                if (res.code === 1) {
                    loading.close();
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getList();
                }
            });
        },

        // 删除
        handleDelete(row) {
            this.$confirm('你确定要删除该数据吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let params = {
                    pid: row.PID
                };
                const res = await Delete(params);
                if (res.code === 1) {
                    this.$message.success('删除成功！');
                    this.getList();
                }
            });
        },

        // 搜索
        handleSearch() {
            this.getList();
        },
        // 页码切换
        handlePageChange(val) {
            this.currentPage = val;
            this.getList();
        },

        // 关闭新增，编辑的弹窗
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },

        // 文件上传
        async uploadFile(params) {
            debugger;
            this.fileNameList = params.file.name;
            //console.log(params.file, '文件名称');
            let form = new FormData();
            form.append('file', params.file);
            form.append('filepath', 'GHBZ');
            this.setForm.REPORTNAME = params.file.name;
            // form.append('typeid', this.$route.query.pid);
            const res = await uploadfile(form);
            if (res.code == 1) {
                this.setForm.REPORTURL = res.data;
                this.$message.success('上传成功');
            }
        },
        handleChange(file, fileList) {
            debugger;
            this.uploadfilelist = [fileList[fileList.length - 1]];
        },
        removefile(file, fileList) {
            this.uploadfilelist = [];
            this.setForm.REPORTURL = '';
            this.setForm.REPORTNAME = '';
        },
        // 设置上传类型
        beforeUpload(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            // const extension = testmsg === 'txt';
            // const extension2 = testmsg === 'xls';
            // const extension3 = testmsg === 'xlsx';
            const extension4 = testmsg === 'pdf';
            // const extension5 = testmsg === 'docx';

            // if (!extension && !extension2 && !extension3 && !extension4 && !extension5) {
            if (!extension4) {
                this.$message({
                    message: '上传文件只能是pdf格式!',
                    type: 'warning'
                });
            }
            return extension4;
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
