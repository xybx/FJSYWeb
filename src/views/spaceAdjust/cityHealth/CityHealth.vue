<template>
    <div class='container'>
        <el-row :gutter='20'>
            <el-col :span='3.5'>
                <el-select v-model='queryParam.year' clearable placeholder='请选择数据年份'>
                    <el-option
                        v-for='(item, index) in yearList'
                        :key='item'
                        :label="item + '年数据'"
                        :value='item'
                    ></el-option>
                </el-select>
            </el-col>
            <el-col :span='4'>
                <div class='grid-content bg-purple'>
                    <div>
                        <el-input v-model='queryParam.keyWord'
                                  placeholder='根据指标名称或维度名称进行关键词搜索'></el-input>
                    </div>
                </div>
            </el-col>
            <el-col :span='12'>
                <div class='grid-content bg-purple'>
                    <div>
                        <el-button type='primary' icon='el-icon-search' class='handle-del mr10'
                                   @click='buttonQueryList'>
                            查询
                        </el-button>
                        <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>新增
                        </el-button>
                        <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>
                            下载导入数据模板
                        </el-button>
                        <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>
                            导入数据
                        </el-button>
                        <el-button type='danger' icon='el-icon-delete' class='handle-del mr10' @click='clearData'>
                            清空{{ queryParam.year }}数据
                        </el-button>
                        <!--              点击弹出指标维度列表-->
                        <el-button type='primary' icon='el-icon-search' class='handle-del mr10'
                                   @click='dimensionFlag = true'>
                            指标维度管理
                        </el-button>
                    </div>
                </div>
            </el-col>
            <el-col style='margin-left: 5%' :span='3'>
                <el-button type='primary' icon='el-icon-refresh-left' class='handle-del mr10' @click='syncLayerId'>
                    同步指标对应的图层id
                </el-button>
            </el-col>
        </el-row>

        <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
                  header-cell-class-name='table-header'>
            <el-table-column prop='pid' label='id' align='center' width='120'></el-table-column>
            <el-table-column prop='firstTypeName' label='维度名称' align='center'></el-table-column>
            <el-table-column prop='secondTypeName' label='指标名称' align='center'></el-table-column>
            <el-table-column prop='indexType' label='指标类型' align='center'></el-table-column>
            <el-table-column prop='city' label='城市' align='center' width='200'></el-table-column>
            <el-table-column prop='year' label='数据年份' align='center' width='100'></el-table-column>
            <el-table-column prop='value' label='指标值' align='center' width='100'></el-table-column>
            <el-table-column prop='referenceValue' label='参考值' width='80' align='center'></el-table-column>
            <el-table-column prop='avgValue' label='平均值' width='80' align='center'></el-table-column>
            <el-table-column label='操作' align='center'>
                <template slot-scope='scope'>
                    <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
                    <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)'
                               style='color:red'>删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pagination'>
            <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                           :current-page='queryParam.page'
                           :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                           :total='total'>
            </el-pagination>
        </div>

        <el-dialog
            title='新增城市体检指标数据'
            :visible.sync='addFlag'
            width='35%'
            :destroy-on-close='true'
            :close-on-click-modal='false'
            :before-close='handleClose'>
            <el-form ref='addform' :model='addDataForm' :rules='addRules' label-width='100px'>
                <el-form-item label='维度名称：' prop='firstTypeName'>
                    <el-select v-model='addDataForm.firstTypeName' placeholder='请选择维度名称'>
                        <el-option
                            v-for='(item, index) in firstTypeList'
                            :key='index.name'
                            :label='item.name'
                            :value='item.name'
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='指标名称：' prop='secondTypeName'>
                    <el-input v-model='addDataForm.secondTypeName' show-word-limit
                              placeholder='请输入指标名称'></el-input>
                </el-form-item>
                <el-form-item label='城市名称：' prop='city'>
                    <el-select v-model='addDataForm.city' placeholder='请选择城市名称'>
                        <el-option
                            v-for='(item, index) in cityList'
                            :key='index.name'
                            :label='item.name'
                            :value='item.name'
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='数据年份：' prop='year'>
                    <el-input-number :min='1949' :max='2100' size='medium' v-model='addDataForm.year'
                                     placeholder='请输入数据年份'></el-input-number>
                </el-form-item>
                <el-form-item label='指标值：' prop='value'>
                    <el-input-number :min='0' size='medium' v-model='addDataForm.value'
                                     placeholder='请输入指标值'></el-input-number>
                </el-form-item>
                <el-form-item label='指标类型：' prop='indexType'>
                    <el-input v-model='addDataForm.indexType' show-word-limit placeholder='请输入指标类型'></el-input>
                </el-form-item>
                <el-form-item label='参考值：' prop='referenceValue'>
                    <el-input-number :min='0' size='medium' v-model='addDataForm.referenceValue'
                                     placeholder='请输入参考值'></el-input-number>
                </el-form-item>
                <el-form-item label='平均值：' prop='avgValue'>
                    <el-input-number :min='0' size='medium' v-model='addDataForm.avgValue'
                                     placeholder='请输入平均值'></el-input-number>
                </el-form-item>
            </el-form>
            <span slot='footer' class='dialog-footer'>
                <el-button @click='addFlag = false'>取 消</el-button>
                <el-button :loading='addLoding' type='primary' @click="add()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title='编辑城市体检指标数据' :visible.sync='editEntityFlag' width='35%' :close-on-click-modal='false'
                   :before-close='handleEditClose'>
            <el-form ref='editform' :model='editDataForm' :rules='editRules' label-width='100px'>
                <el-form-item label='维度名称：' prop='firstTypeName'>
                    <el-select v-model='editDataForm.firstTypeName' placeholder='请选择维度名称'>
                        <el-option
                            v-for='(item, index) in firstTypeList'
                            :key='index.name'
                            :label='item.name'
                            :value='item.name'
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='指标名称：' prop='secondTypeName'>
                    <el-input v-model='editDataForm.secondTypeName' show-word-limit
                              placeholder='请输入指标名称'></el-input>
                </el-form-item>
                <el-form-item label='城市名称：' prop='city'>
                    <el-select v-model='editDataForm.city' placeholder='请选择城市名称'>
                        <el-option
                            v-for='(item, index) in cityList'
                            :key='index.name'
                            :label='item.name'
                            :value='item.name'
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='数据年份：' prop='year'>
                    <el-input-number :min='1949' :max='2100' size='medium' v-model='editDataForm.year'
                                     placeholder='请输入数据年份'></el-input-number>
                </el-form-item>
                <el-form-item label='指标值：' prop='value'>
                    <el-input-number :min='0' size='medium' v-model='editDataForm.value'
                                     placeholder='请输入指标值'></el-input-number>
                </el-form-item>
                <el-form-item label='指标类型：' prop='indexType'>
                    <el-input v-model='editDataForm.indexType' show-word-limit placeholder='请输入指标类型'></el-input>
                </el-form-item>
                <el-form-item label='参考值：' prop='referenceValue'>
                    <el-input-number :min='0' size='medium' v-model='editDataForm.referenceValue'
                                     placeholder='请输入参考值'></el-input-number>
                </el-form-item>
                <el-form-item label='平均值：' prop='avgValue'>
                    <el-input-number :min='0' size='medium' v-model='editDataForm.avgValue'
                                     placeholder='请输入平均值'></el-input-number>
                </el-form-item>
            </el-form>
            <span slot='footer' class='dialog-footer'>
                <el-button @click='editEntityFlag = false'>取 消</el-button>
                <el-button :loading='editLoding' type='primary' @click="edit()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title='导入模板数据'
            :visible.sync='importData'
            width='30%'
            :close-on-click-modal='false'
            :before-close='handleImportDataClose'>
            <el-upload class='upload-demo' :timeout='0' :action='importURL' :on-preview='handlePreview'
                       :on-remove='handleRemove' :headers='headers' accept='.xlsx' :before-upload='beforeUpload'
                       :before-remove='beforeRemove' multiple
                       :limit='1' :on-exceed='handleExceed'
                       :on-success='onSuccess'
                       :file-list='fileList'>
                <el-button size='small' type='primary'>点击导入</el-button>
                <div slot='tip' class='el-upload__tip'>请导入下载的模板！<br><span style='color: red'>如果不先清空数据就是增量导入！如需覆盖导入请先清空数据！</span><br>导入后展示端地图数据可能第一时间不同步，等待5分钟左右即可。
                </div>
            </el-upload>
            <span slot='footer' class='dialog-footer'>
          <el-button @click='importData = false'>取 消</el-button>
        </span>
        </el-dialog>

        <!--        指标维度管理-->
        <el-dialog title='指标维度管理' :visible.sync='dimensionFlag' width='35%' :close-on-click-modal='false'>
            <!--            添加指标维度按钮-->
            <div class='add-dimension'>
                <el-button type='primary' @click='addDimension'>添加指标维度</el-button>
            </div>
            <!--            展示维度列表-->
            <el-table :data='dimensionList' border style='width: 100% ;margin-top: 20px'>
                <el-table-column prop='dimensionName' label='维度名称' align='center'></el-table-column>
                <el-table-column prop='sort' label='排序' align='center'></el-table-column>
                <el-table-column label='操作' width='150' align='center'>
                    <template slot-scope='scope'>
                        <el-button type='text' size='mini' @click='editDimension(scope.row)'>编辑</el-button>
                        <el-button type='text' size='mini' @click='deleteDimension(scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class='pagination'>
                <el-pagination @size-change='handleDimensionSizeChange'
                               @current-change='handleDimensionCurrentChange'
                               :current-page='queryDimensionParam.page'
                               :page-sizes='[10, 15]' :page-size='100'
                               layout='total, sizes, prev, pager, next, jumper'
                               :total='dimensionTotal'>
                </el-pagination>
            </div>
        </el-dialog>
        <!--            添加或者编辑指标维度弹窗-->
        <el-dialog title='添加或者编辑指标维度' :visible.sync='addOrUpdateDimensionFlag' width='30%'
                   :close-on-click-modal='false'>
            <el-form :model='dimensionForm' :rules='dimensionRules' ref='dimensionForm'>
                <el-form-item label='维度名称：' prop='dimensionName' label-width='100px'>
                    <el-input v-model='dimensionForm.dimensionName' placeholder='请输入指标维度名称'></el-input>
                </el-form-item>
                <el-form-item label='维度排序：' prop='sort' label-width='100px'>
                    <el-input-number :min='0' v-model='dimensionForm.sort'
                                     placeholder='请输入指标维度排序'></el-input-number>
                </el-form-item>
                <el-form-item label='主键id' prop='pid' hidden="hidden">
                    <el-input v-model='dimensionForm.pid' placeholder='请输入主键id'></el-input>
                </el-form-item>
            </el-form>
            <!--                    提交保存或修改-->
            <span slot='footer' class='dialog-footer'>
                    <el-button @click='addOrUpdateDimensionFlag = false'>取 消</el-button>
                    <el-button type='primary' @click="addOrUpdateDimension()">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    addDimension,
    clearData,
    clearDataByYear,
    del,
    deleteDimension,
    editDimension,
    editEntity,
    exportExcel,
    getDimensionList,
    getDimensionSelect,
    getList,
    getYearList,
    save,
    syncLayerId
} from '@/api/cityHealth-api';
import { Loading } from 'element-ui';

export default {
    name: 'CityHealth',
    data() {
        return {
            tableData: [],
            // 查询数据
            queryParam: {
                keyWord: '',
                page: 1,
                pageSize: 10,
                year: ''
            },
            //指标维度查询数据
            queryDimensionParam: {
                pageNum: 1,
                pageSize: 10
            },
            yearList: [],
            total: 0,
            addFlag: false,
            addLoding: false,
            // 添加数据表单
            addDataForm: {
                firstTypeName: '',
                secondTypeName: '',
                city: '',
                value: '',
                indexType: '',
                referenceValue: '',
                avgValue: '',
                year: ''
            },
            addDataFormCopy: {
                firstTypeName: '',
                secondTypeName: '',
                city: '',
                value: '',
                indexType: '',
                referenceValue: '',
                avgValue: '',
                year: ''

            },
            editArea: [],
            editEntityFlag: false,
            editLoding: false,
            editDataForm: {
                pid: '',
                firstTypeName: '',
                secondTypeName: '',
                city: '',
                value: '',
                indexType: '',
                referenceValue: undefined,
                avgValue: undefined,
                year: ''
            },
            loading: null,
            importData: false,
            importURL: '',
            fileList: [],
            options: [],
            addRules: {
                firstTypeName: [
                    { required: true, message: '请选择维度名称', trigger: 'change' }
                ],
                secondTypeName: [
                    { required: true, message: '请输入指标名称', trigger: 'blur' }
                ],
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                year: [
                    { required: true, message: '请输入数据年份', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '请输入指标值', trigger: 'blur' }
                ]
            },
            editRules: {
                firstTypeName: [
                    { required: true, message: '请选择维度名称', trigger: 'change' }
                ],
                secondTypeName: [
                    { required: true, message: '请输入指标名称', trigger: 'blur' }
                ],
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                year: [
                    { required: true, message: '请输入数据年份', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '请输入指标值', trigger: 'blur' }
                ]
            },
            firstTypeList: [
                // {
                //     name: '生态宜居'
                // },
                // {
                //     name: '健康舒适'
                // },
                // {
                //     name: '安全任性'
                // },
                // {
                //     name: '交通便捷'
                // },
                // {
                //     name: '风貌特色'
                // }
                // ,
                // {
                //     name: '整洁有序'
                // }
                // ,
                // {
                //     name: '多元包容'
                // }
                // ,
                // {
                //     name: '创新活力'
                // }
            ],
            cityList: [
                {
                    name: '福州市'
                },
                {
                    name: '平潭综合实验区'
                },
                {
                    name: '宁德市'
                },
                {
                    name: '龙岩市'
                },
                {
                    name: '南平市'
                },
                {
                    name: '漳州市'
                },
                {
                    name: '泉州市'
                },
                {
                    name: '三明市'
                },
                {
                    name: '莆田市'
                },
                {
                    name: '厦门市'
                }
            ],
            dimensionFlag: false,
            dimensionList: [],
            dimensionTotal: 0,
            addOrUpdateDimensionFlag: false,
            dimensionForm: {
                pid: null,
                dimensionName: '',
                sort: 0
            },
            dimensionRules: {
                dimensionName: [
                    { required: true, message: '请输入维度名称', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ]
            }

        };
    },
    computed: {
        // 上传时需要的请求头
        headers() {
            const token = sessionStorage.getItem('token');
            return {
                Authorization: token,
                loginType: 'system'
            };
        }
    },
    mounted() {
        this.queryList();
        this.initImportUrl();
        this.queryYearList();
        this.queryDimensionList();
        this.getDimensionSelect();
    },
    created() {
    },
    methods: {
        getDimensionSelect() {
            getDimensionSelect().then(res => {
                if (res.code == 200) {
                    this.firstTypeList = res.data;
                }
            });
        },
        addDimension() {
            // 先初始化
            Object.assign(this.dimensionForm, {
                pid: null,
                dimensionName: '',
                sort: 0
            });
            this.addOrUpdateDimensionFlag = true;
        },
        addOrUpdateDimension() {
            this.$refs.dimensionForm.validate(valid => {
                if (!valid) return;
                //     如果pid存在调用更新，不存在调用新增
                if (this.dimensionForm.pid) {
                    editDimension(this.dimensionForm).then(res => {
                        if (res.code == 200) {
                            this.$message.success('编辑成功！');
                            this.addOrUpdateDimensionFlag = false;
                            this.queryDimensionList();
                        }
                    });
                } else {
                    addDimension(this.dimensionForm).then(res => {
                        if (res.code == 200) {
                            this.$message.success('添加成功！');
                            this.addOrUpdateDimensionFlag = false;
                            this.queryDimensionList();
                        }
                    });
                }
            });

        },
        deleteDimension(row) {
            //     询问是否删除
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteDimension(row).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除成功！');
                        this.queryDimensionList();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        editDimension(row) {
            // 先初始化
            Object.assign(this.dimensionForm, {
                pid: null,
                dimensionName: '',
                sort: 0
            });
            this.addOrUpdateDimensionFlag = true;
            Object.assign(this.dimensionForm, row);
        },
        //获取指标维度分页列表
        queryDimensionList() {
            getDimensionList(this.queryDimensionParam).then(res => {
                if (res.code == 200) {
                    this.dimensionList = res.data.list;
                    this.dimensionTotal = res.data.total;
                }
            });
        },
        // 同步图层id
        syncLayerId() {
            this.$confirm('同步指标对应的图层id时请确认对应的服务与指标图层都已发布！如有疑问请联系图层管理人员！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(_ => {
                    syncLayerId().then(res => {
                        if (res.code == 200) {
                            this.$message.success('同步成功！');
                            this.queryList();
                            this.queryYearList();
                        }
                    });
                })
                .catch(_ => {
                });
        },
        // 查询数据年份
        queryYearList() {
            getYearList().then(res => {
                if (res.code == 200) {
                    this.yearList = res.data;
                }
            });
        },
        // 查询列表数据
        queryList() {
            getList(this.queryParam).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                }
            });
        },
        buttonQueryList() {
            this.queryParam.page = 1;
            getList(this.queryParam).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                }
            });
        },
        // 分页参数回调
        handleSizeChange(val) {
            this.queryParam.pageSize = val;
            this.queryList();
        },
        //指标维度分页参数回调
        handleDimensionSizeChange(val) {
            this.queryDimensionParam.pageSize = val;
            this.queryDimensionList();
        },
        handleCurrentChange(val) {
            this.queryParam.page = val;
            this.queryList();
        },
        handleDimensionCurrentChange(val) {
            this.queryDimensionParam.pageNum = val;
            this.queryDimensionList();
        },
        clearData() {
            this.$confirm('确认清空全部数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(_ => {
                    if (this.queryParam.year != '') {
                        clearDataByYear(this.queryParam.year).then(res => {
                            if (res.code == 200) {
                                this.$message.success('清空成功！');
                                this.queryParam.year = '';
                                this.queryList();
                                this.queryYearList();
                            }
                        });
                    } else {
                        clearData().then(res => {
                            if (res.code == 200) {
                                this.$message.success('清空成功！');
                                this.queryList();
                                this.queryYearList();
                            }
                        });
                    }
                })
                .catch(_ => {
                });
        },
        // 修改数据
        handleEdit(row) {

            this.getDimensionSelect();
            this.editEntityFlag = true;
            Object.assign(this.editDataForm, row);
            if (row.avgValue == null || row.avgValue == '') {
                this.editDataForm.avgValue = undefined;
            }
            if (row.referenceValue == null || row.referenceValue == '') {
                this.editDataForm.referenceValue = undefined;
            }
        },
        // 添加数据
        addData() {
            this.getDimensionSelect();
            this.addDataForm = JSON.parse(JSON.stringify(this.addDataFormCopy));
            this.addDataForm.referenceValue = undefined;
            this.addDataForm.avgValue = undefined;
            this.addDataForm.value = undefined;
            this.addDataForm.year = undefined;
            this.addFlag = true;
        },
        handleEditClose(done) {
            done();
        },
        // 关闭回调
        handleClose(done) {
            done();
        },
        handleImportDataClose(done) {
            done();
        },
        // 新增历史项目数据
        add() {
            this.$refs.addform.validate((valid) => {
                if (valid) {
                    if (this.addLoding) {
                        this.$message.warning('请勿重复点击提交！');
                        return;
                    }
                    this.addLoding = true;
                    // 防止重复提交，进行按钮禁用
                    save(this.addDataForm).then(res => {
                        if (res.code == 200) {
                            this.$message.success('保存成功！');
                        } else {
                        }
                        this.addFlag = false;
                        this.addLoding = false;
                        this.queryList();
                        this.queryYearList();
                    });
                } else {
                    return false;
                }
            });
        },
        // 编辑历史项目数据
        edit() {
            this.$refs.editform.validate((valid) => {
                if (valid) {
                    if (this.editLoding) {
                        this.$message.warning('请勿重复点击提交！');
                        return;
                    }
                    this.editLoding = true;
                    editEntity(this.editDataForm).then(res => {
                        if (res.code == 200) {
                            this.$message.success('修改成功！');
                        }
                        this.editEntityFlag = false;
                        this.editLoding = false;
                        this.queryList();
                        this.queryYearList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 下载模板数据
        downTemplate() {
            exportExcel(window.apiURL + '/cityHealth/manage/download/template', sessionStorage.getItem('token'));
        },
        // 删除数据
        handleDelete(row) {
            this.$confirm('确认删除id为 ' + row.pid + ' 的数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                del(row.pid).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除成功！');
                        this.queryList();
                        this.queryYearList();
                    }
                });
            }).catch(_ => {
            });
        },
        importExcel() {
            this.importData = true;
            this.fileList = [];
        },
        // 文件上传
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制单次上传 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}?`);
        },
        beforeUpload(file) {
            this.loading = Loading.service({
                // 动画中的文字
                text: '数据同步sde库中，请勿刷新当前页面！请耐心等待！',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.1)'
            });
        },
        onSuccess(response, file, fileList) {
            this.loading.close();
            if (response.code == 200) {
                this.$message.success(response.msg);
                // 关闭对话框，刷新列表
                this.importData = false;
                this.queryList();
                this.queryYearList();
            } else {
                this.$message.warning(response.msg);
                // 删除当前数据
                let index = -1;
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].name == file.name) {
                        index = i;
                    }
                }
                fileList.splice(index, 1);
            }

        },
        initImportUrl() {
            this.importURL = window.apiURL + '/cityHealth/manage/import';
        },
        handleAddChange(value) {
            this.addDataForm.province = value[0];
            this.addDataForm.city = value[1];
            this.addDataForm.districtorcounty = value[2];
            this.addDataForm.street = value[3];

        },
        handleEditChange(value) {
            this.editDataForm.province = value[0];
            this.editDataForm.city = value[1];
            this.editDataForm.districtorcounty = value[2];
            this.editDataForm.street = value[3];
        }
    }
};
</script>
<style>
.el-row {
    margin-bottom: 20px;

    &
    :last-child {
        margin-bottom: 0;
    }

}

.el-col {
    border-radius: 4px;
}

.background {
    background-color: white;
}

.el-cascader {
    width: 350px;
}

.uploading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>