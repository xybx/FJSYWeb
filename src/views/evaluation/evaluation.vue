<template>
    <div class="container">
        <div class="service-aside">
            <div class="add-service">
                <el-button @click="addTab" icon="el-icon-plus" class="handle-del mr10" type="success">新增类型</el-button>
            </div>
            <!-- 左侧列表 -->
            <el-tree
                :data="treeData"
                :expand-on-click-node="false"
                :current-node-key="currentKey"
                highlight-current
                ref="treeData"
                node-key="PID"
                @node-click="handleNodeClick"
            >
                <span slot-scope="scope">
                    {{ scope.data.TYPENAME }}
                    <el-popover
                        placement="bottom-start"
                        popper-class="tree-popover"
                        trigger="click"
                        v-if="scope.node.isCurrent == true && isAdmin == 'true'"
                    >
                        <i class="el-icon-set-up" slot="reference"></i>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                            <i class="el-icon-edit" @click="editTree(scope.data)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" v-if="isAdmin == 'true'" content="删除" placement="bottom">
                            <i class="el-icon-delete" @click="delTree(scope.data)"></i>
                        </el-tooltip>
                    </el-popover>
                </span>
            </el-tree>
        </div>
        <div class="service-main">
            <el-tabs v-model="tabValue" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
            </el-tabs>
            <div v-if="!tjTable">
                <div>
                    <el-button size="mini" type="primary" icon="el-icon-plus" @click="addItem" class="tcadd" v-if="isAdmin == 'true'"
                        >新增</el-button
                    >
                </div>
                <!-- 数据表格 -->
                <el-table :data="tableData" border stripe>
                    <el-table-column
                        v-for="(item, index) in tableCols"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop"
                        :min-width="item.width"
                    >
                        <template v-slot="scope">
                            <span v-if="scope.row.ISFXLAYER == '1' && item.prop == 'ISFXLAYER'">是</span>
                            <span v-else-if="scope.row.ISFXLAYER == '0' && item.prop == 'ISFXLAYER'">否</span>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center" width="170" v-if="isAdmin == 'true'">
                        <template v-slot="scope">
                            <el-button size="mini" type="text" plain class="blue" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button size="mini" type="text" plain style="color: red" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="tjTable">
                <el-upload
                    class="upload"
                    ref="upload"
                    action="action"
                    :show-file-list="false"
                    :http-request="handleUpload"
                    accept=".xls,.xlsx"
                >
                    <el-button slot="trigger" size="mini" type="success">导入文件</el-button>
                </el-upload>
                <div style="margin-top: -25px; font-size: 14px; color: red; margin-left: 200px">
                    注意事项：支持导入 .xls,.xlsx（<span class="link-template" style="color: green; cursor: pointer" @click="downTemplate"
                        >图表统计数据模板下载</span
                    >）文件
                </div>
                <br />
                <el-table :data="tableTJData1" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column prop="TITLE" label="标题"></el-table-column>
                    <el-table-column prop="TJNAME" label="统计项(等级,重要性)" v-if="treeForm.CATEGROYTYPE != 2"></el-table-column>
                    <el-table-column prop="TJNAME" label="统计项(行政区)" v-if="treeForm.CATEGROYTYPE == 2"></el-table-column>
                    <el-table-column prop="TJVALUE" label="统计项值"></el-table-column>
                    <el-table-column prop="TJVALUE2" label="统计项值2" v-if="treeForm.CATEGROYTYPE == 2"></el-table-column>
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
                <el-table
                    :data="tableTJData2"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    v-if="treeForm.CATEGROYTYPE != 2"
                >
                    <el-table-column prop="TITLE" label="标题"></el-table-column>
                    <el-table-column prop="TJNAME" label="统计项(行政区)"></el-table-column>
                    <el-table-column prop="TJVALUE" label="统计项值"></el-table-column>
                </el-table>
                <div class="pagination" v-if="treeForm.CATEGROYTYPE != 2">
                    <el-pagination
                        background
                        layout="total, prev, pager, next, jumper"
                        :current-page="currentPage2"
                        :page-size="pageSize2"
                        :total="pageTotal2"
                        @current-change="handlePageChange2"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <!-- 左列表弹窗 -->
        <el-dialog
            :title="treeTitle"
            :visible.sync="treeVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedTree"
            :close-on-click-modal="false"
        >
            <el-form ref="treeForm" :model="treeForm" label-width="auto" class="group-form" :rules="treeFormRules">
                <el-form-item label="类型名称" prop="TYPENAME">
                    <el-input v-model="treeForm.TYPENAME"></el-input>
                </el-form-item>
                <el-form-item label="上传报告" prop="REPORTURL">
                    <el-upload
                        ref="upload"
                        multiple
                        action="#"
                        :show-file-list="true"
                        :on-change="handleChange"
                        :before-upload="beforeUpload"
                        :http-request="uploadFile"
                        :file-list="uploadfilelist"
                        accept=".pdf"
                    >
                        <el-button size="mini" class="upload" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="分类选择" prop="CATEGROYTYPE">
                    <el-select v-model="treeForm.CATEGROYTYPE">
                        <el-option
                            v-for="(item, index) in fxpjcatetypelist"
                            :key="index"
                            :label="item.DICTNAME"
                            :value="item.DICTVALUE"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="ORDERNUM">
                    <el-input v-model.number="treeForm.ORDERNUM" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="treeVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTreeDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分析评价图层配置弹窗 -->
        <el-dialog
            :title="layerTitle"
            :visible.sync="layerVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedLayer"
            :close-on-click-modal="false"
        >
            <el-form ref="layerForm" :model="layerForm" label-width="auto" class="group-form" :rules="layerFormRules">
                <el-form-item label="类型选择" prop="TYPEID">
                    <el-select v-model="layerForm.TYPEID">
                        <el-option v-for="item in fieldTypeList" :key="item.PID" :label="item.TYPENAME" :value="item.PID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图层名称" prop="LAYERNAME">
                    <el-input v-model="layerForm.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="服务地址" prop="LAYERURL">
                    <el-input v-model="layerForm.LAYERURL" @blur="getChildLayerList"></el-input>
                </el-form-item>
                <el-form-item label="子图层选择" prop="LAYERID">
                    <el-select v-model="layerForm.LAYERID" no-data-text="请选择子图层">
                        <el-option v-for="(item, index) in sonlayerlist" :key="index" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否分析图层">
                    <el-radio-group v-model="layerForm.ISFXLAYER">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="layerForm.ORDERNUM" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="layerVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveLayerDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 评价内容弹窗 -->
        <el-dialog
            :title="searchTitle"
            :visible.sync="searchVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedSearch"
            :close-on-click-modal="false"
        >
            <el-form ref="searchForm" :model="searchForm" label-width="auto" class="group-form" :rules="searchFormRules">
                <el-form-item label="类型选择" prop="TYPELISTPID">
                    <el-select v-model="searchForm.TYPELISTPID">
                        <el-option v-for="item in fieldTypeList" :key="item.PID" :label="item.TYPENAME" :value="item.PID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明名称" prop="SMNAME">
                    <el-input v-model.trim="searchForm.SMNAME"></el-input>
                </el-form-item>
                <el-form-item label="说明内容" prop="SMCONTENT">
                    <el-input v-model.trim="searchForm.SMCONTENT"></el-input>
                </el-form-item>
                <!-- <el-form-item label="标题" prop="TITLE">
                    <el-input v-model.trim="searchForm.TITLE"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="searchVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSearchDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getFXPJTypeList,
    saveFXPJType,
    deleteFXPJType,
    getFXPJLayerList,
    saveFXPJLayer,
    deleteFXPJLayer,
    getFXPJSMList,
    saveFXPJSM,
    deleteFXPJSM,
    getFXPJCategoryType,
    uploadfile,
    getSPGTJList,
    getSPJSYXTJList,
    getSPJXZQTJList,
    importData
} from '@/api/evaluation-api';
import { getServerLayers } from '@/api/csjy-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            fxpjcatetypelist:[],
            sonlayerlist: [], //子图层列表
            tjTable: false,
            tableTJData1: [],
            tableTJData2: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            currentPage2: 1,
            pageSize2: 10,
            pageTotal2: 0,
            isAdmin: false,
            treeData: [],
            uploadfilelist: [],
            treeVisible: false,
            treeTitle: '',
            fileNameList: '',
            treeForm: {
                TYPENAME: '',
                REPORTURL: '',
                CATEGROYTYPE: null,
                ORDERNUM: ''
            },
            treeFormRules: {
                TYPENAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
            },
            tabList: [
                // { label: '分析评价图层', name: '1' },
                // { label: '分析评价说明', name: '2' },
                // { label: '分析评价统计数据导入', name: '3' }
            ],
            tabValue: '1',
            tableData: [],
            tableCols: [],
            tableColsTotal: {
                // 分析评价图层配置
                one: [
                    { prop: 'PID', label: 'PID', width: '80' },
                    { prop: 'LAYERNAME', label: '名称', width: '130' },
                    { prop: 'LAYERURL', label: '图层服务地址', width: '300' },
                    { prop: 'ISFXLAYER', label: '是否分析图层', width: '100' },
                    { prop: 'LAYERID', label: '子图层ID', width: '100' },
                    { prop: 'ORDERNUM', label: '排序', width: '100' }
                ],
                // 分析评价说明配置
                two: [
                    { prop: 'PID', label: 'PID', width: '80' },
                    { prop: 'SMNAME', label: '评价名称', width: '130' },
                    { prop: 'SMCONTENT', label: '分析评价内容', width: '200' }
                ],
                // 结果字段
                three: [
                    { prop: 'PID', label: 'PID', width: '80' },
                    { prop: 'FIELDNAME', label: '字段名称', width: '130' },
                    { prop: 'FIELDDESC', label: '字段描述', width: '200' },
                    { prop: 'FIELDTYPE', label: '字段类型', width: '100' }
                ]
            },
            treePID: null,
            currentKey: null,
            layerTitle: '',
            layerVisible: false,
            layerForm: {
                TYPEID: '',
                LAYERNAME: '',
                LAYERURL: '',
                ISFXLAYER: '',
                ORDERNUM: '',
                LAYERID: ''
            },
            layerFormRules: {
                LAYERNAME: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
                LAYERURL: [{ required: true, message: '图层地址不能为空', trigger: 'blur' }],
                LAYERID: [{ required: true, message: '请选择子图层', trigger: 'change' }]
            },

            resTitle: '',
            resVisible: false,
            resForm: {
                FIELDNAME: '',
                FIELDTYPE: '',
                FIELDDESC: ''
            },
            resFormRules: {
                FIELDNAME: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
                FIELDTYPE: [{ required: true, message: '字段类型不能为空', trigger: 'change' }],
                FIELDDESC: [{ required: true, message: '字段描述不能为空', trigger: 'blur' }]
            },
            fieldTypeList: [], // 字段类型列表
            ctrlTypeList: [], // 控件类型列表

            searchTitle: '',
            searchVisible: false,
            searchForm: {
                SMNAME: '',
                SMCONTENT: '',
                TYPELISTPID: '',
                TITLE: '',
                TYPEID: ''
            },
            searchFormRules: {
                SMNAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
            },

            listTitle: '编辑列表项',
            listVisible: false,
            listForm: {
                CONTROLNAME: '',
                CONTROLVALUE: ''
            },
            listFormRules: {
                CONTROLNAME: [{ required: true, message: '控件名称不能为空', trigger: 'blur' }],
                CONTROLVALUE: [{ required: true, message: '控件值不能为空', trigger: 'blur' }]
            },
            listFieldData: [],
            listFileID: ''
        };
    },
    computed: {},
    watch: {
        tabValue: {
            handler(val) {
                if (val == 1) {
                    this.tableCols = this.tableColsTotal.one;
                } else if (val == 2) {
                    this.tableCols = this.tableColsTotal.two;
                } else if (val == 3) {
                    this.tableCols = this.tableColsTotal.three;
                }
            },
            immediate: true
        },
        treePID: {
            handler(val) {
                console.log(val, 'val');
                if (val == null) {
                    return;
                }
                let params = {
                    typeid: val
                };
                if (this.tabValue == 1) {
                    this.getLayers(params);
                } else if (this.tabValue == 2) {
                    this.getSearchs(params);
                }
                // else if (this.tabValue == 3) {
                //     this.getRes(params);
                // }
            },
            immediate: true
        },
        resVisible(boo) {
            if (boo) {
                this.getFieldTypeList();
            }
        },
        // 评价内容列表
        searchVisible(boo) {
            if (boo) {
                this.getFieldTypeList();
            }
        },
        // 分析评价内容
        layerVisible(boo) {
            if (boo) {
                this.getFieldTypeList();
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getFXPJList();
        this.getTreeData();
    },
    methods: {
        // 模板下载
        downTemplate() {
            if (this.treeForm.CATEGROYTYPE == 2) {
                window.location.href = apiURL_file + '/FileResources/FXPJ/Template/双评估统计模板.xlsx';
                // window.open(`${apiURL_file}/FileResources/FXPJ/Template/双评估统计模板.xlsx`);
            } else {
                //window.open(`${apiURL_file}/FileResources/FXPJ/Template/双评价统计模板.xlsx`);
                window.location.href = apiURL_file + '/FileResources/FXPJ/Template/双评价统计模板.xlsx';
            }
        },
        // 获取子图层列表
        getChildLayerList(){
            this.getChildList(this.layerForm.LAYERURL);
        },
        async getChildList(serverurl) {
            debugger;
            console.log(this.layerForm.LAYERURL, 'LAYERURL');
            if (serverurl != '') {
                let params = {
                    serverurl
                };
                const res = await getServerLayers(params);
                if (res.code === 1) {
                    this.sonlayerlist = res.data;
                }
            }
        },
        // 自定义上传事件
        async handleUpload(params) {
            let upLoading = this.$message({
                iconClass: 'el-icon-loading',
                message: '上传中...',
                duration: 0,
                customClass: 'prop-search'
            });
            let form = new FormData();
            form.append('file', params.file);
            form.append('type', this.treePID);
            const res = await importData(form);
            console.log(res);
            if (res.code === 1) {
                debugger;
                upLoading.close();
                this.$message.success(res.msg);
                this.getTJData(this.currentModuleId);
            } else {
                debugger;
                upLoading.close();
                this.$message.error(res.msg);
            }
        },
        // 页面切换
        handlePageChange(val) {
            this.currentPage = val;
            // this.getData();
        },
        // 页面切换
        handlePageChange2(val) {
            this.currentPage2 = val;
            // this.getData();
        },
        async getFXPJList() {
            this.fieldTypeList = [];
            let res = await getFXPJCategoryType();
            if (res.code == 1) {
                this.fxpjcatetypelist = res.data;
            }
        },
        // 新增类型
        addTab() {
            this.treeVisible = true;
            this.treeTitle = '新增类型';
            // Object.assign(this.treeForm, { PID: 0 });
            Object.assign(this.treeForm, { PID: 0 });
            this.treeForm.CATEGROYTYPE = '';
        },

        // 保存树
        saveTreeDialog() {
            this.$refs.treeForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请输入必填项');
                const res = await saveFXPJType(this.treeForm);
                if (res.code === 1) {
                    this.$message.success('成功');
                    this.treeVisible = false;
                    this.getTreeData();
                }
            });
        },

        // 树弹窗关闭
        closedTree() {
            this.$refs.treeForm.resetFields();
        },

        // 树节点点击
        handleNodeClick(obj) {
            debugger;
            this.tabValue = '1';
            this.tjTable = false;
            this.treePID = obj.PID;
            this.tabList = [];
            this.treeForm.CATEGROYTYPE = String(obj.CATEGROYTYPE);
            if (obj.CATEGROYTYPE == 4 || obj.CATEGROYTYPE == 5) {
                this.tabList.push({ label: '分析评价图层', name: '1' });
            } else {
                this.tabList.push(
                    { label: '分析评价图层', name: '1' },
                    { label: '分析评价说明', name: '2' },
                    { label: '分析评价统计数据导入', name: '3' }
                );
            }
        },

        // 评价图层配置列表
        async getLayers(params) {
            const res = await getFXPJLayerList(params);
            if (res.code == 1) {
                this.tableData = res.data;
            }
        },

        // 分析查询评价内容列表
        async getSearchs(params) {
            const res = await getFXPJSMList(params);
            if (res.code == 1) {
                this.tableData = res.data;
            }
        },

        // 获取左侧树
        async getTreeData() {
            this.tabList = [];
            const res = await getFXPJTypeList();
            if (res.code == 1) {
                this.treeData = res.data;

                this.currentKey = this.treeData[0].PID;
                this.treePID = this.treeData[0].PID;
                this.treeForm.CATEGROYTYPE = String(this.treeData[0].CATEGROYTYPE);
                console.log(this.treeForm.CATEGROYTYPE, 'CATEGROYTYPE1');
                debugger;
                if (this.treeData[0].CATEGROYTYPE == 4 || this.treeData[0].CATEGROYTYPE == 5) {
                    this.tabList.push({ label: '分析评价图层', name: '1' });
                } else {
                    this.tabList.push(
                        { label: '分析评价图层', name: '1' },
                        { label: '分析评价说明', name: '2' },
                        { label: '分析评价统计数据导入', name: '3' }
                    );
                }
            }

            this.$nextTick(() => {
                this.$refs.treeData.setCurrentKey(this.currentKey);
            });
        },

        // 编辑树分组
        editTree(row) {
            debugger;
            this.treeVisible = true;
            this.treeTitle = '编辑类型';
            this.$nextTick(() => {
                if (row.REPORTURL != '' && row.REPORTURL != null) {
                    var _filename = row.REPORTURL.substring(row.REPORTURL.lastIndexOf('/') + 1, row.REPORTURL.length);
                    var filename = { name: _filename, uid: row.PID, url: row.REPORTURL };
                    this.uploadfilelist = [filename];
                } else {
                    this.uploadfilelist = [];
                }
                Object.assign(this.treeForm, row);
                this.treeForm.CATEGROYTYPE = String(row.CATEGROYTYPE);
            });
        },

        // 删除树分组
        async delTree(row) {
            let params = {
                pid: row.PID
            };
            const res = await deleteFXPJType(params);
            if (res.code == 1) {
                this.$message.success('删除成功！');
                this.getTreeData();
            }
        },

        // 标签页切换
        handleTabClick(val) {
            this.tjTable = false;
            let params = {
                typeid: this.treePID
            };
            if (this.tabValue == 1) {
                this.getLayers(params);
            } else if (this.tabValue == 2) {
                this.getSearchs(params);
            } else if (this.tabValue == 3) {
                this.tjTable = true;
                this.getTJData();
            }
        },
        //获取统计数据列表
        async getTJData() {
            debugger;
            console.log(this.treeForm.CATEGROYTYPE, 'CATEGROYTYPE');
            let params1 = {
                typeid: this.treePID,
                currentpage: this.currentPage,
                pagesize: this.pageSize
            };
            let params2 = {
                typeid: this.treePID,
                currentpage: this.currentPage2,
                pagesize: this.pageSize2
            };
            if (this.treeForm.CATEGROYTYPE == 1 || this.treeForm.CATEGROYTYPE == 3) {
                const res = await getSPJSYXTJList(params1);
                if (res.code == 1) {
                    this.tableTJData1 = res.data.datalist;
                    this.pageTotal = res.data.total;
                }
                const res2 = await getSPJXZQTJList(params2);
                if (res2.code == 1) {
                    this.tableTJData2 = res2.data.datalist;
                    this.pageTotal2 = res2.data.total;
                }
            }
            if (this.treeForm.CATEGROYTYPE == 2) {
                debugger;
                const res = await getSPGTJList(params1);
                if (res.code == 1) {
                    this.tableTJData1 = res.data.datalist;
                    this.pageTotal = res.data.total;
                }
            }
        },
        // 编辑
        handleEdit(row) {
            console.log(row, '这市编辑数据');
            if (this.tabValue == 1) {
                this.resVisible = false;
                this.searchVisible = false;
                this.layerVisible = true;
                this.layerTitle = '编辑分析评价图层';
                console.log(this.layerForm, '编辑图层');

                this.$nextTick(async () => {
                    await this.getChildList(row.LAYERURL);
                    Object.assign(this.layerForm, row);
                    this.layerForm.LAYERID = String(row.LAYERID);
                });
            } else if (this.tabValue == 2) {
                this.layerVisible = false;
                this.resVisible = false;
                this.searchVisible = true;
                this.searchTitle = '编辑分析评价说明';
                Object.assign(this.searchForm, row);
            } else if (this.tabValue == 3) {
                this.layerVisible = false;
                this.resVisible = true;
                this.resTitle = '编辑结果显示';
                Object.assign(this.resForm, row);
            }
        },

        // 删除
        async handleDelete(row) {
            let form = {
                pid: row.PID
            };
            if (this.tabValue == 1) {
                const res = await deleteFXPJLayer(form);
                if (res.code == 1) {
                    this.$message.success('删除成功！');
                    let params = {
                        typeid: this.treePID
                        // pid:row.PID
                    };
                    this.getLayers(params);
                }
            } else if (this.tabValue == 2) {
                const res = await deleteFXPJSM(form);
                if (res.code == 1) {
                    this.$message.success('删除成功！');
                    let params = {
                        typeid: this.treePID
                    };
                    this.getSearchs(params);
                }
            }
        },

        // 图层配置弹窗关闭
        closedLayer() {
            this.$refs.layerForm.resetFields();
        },

        // 新增表格项
        addItem() {
            if (this.tabValue == 1) {
                this.sonlayerlist=[];
                this.layerForm = {};
                console.log(this.treePID);
                this.layerForm.TYPEID = this.treePID;
                console.log(this.tabValue, '1');
                this.resVisible = false;
                this.searchVisible = false;
                this.layerVisible = true;
                this.layerTitle = '新增分析评价图层';
                Object.assign(this.layerForm, { PID: 0 });
            } else if (this.tabValue == 2) {
                this.searchForm.TYPEID = this.treePID;
                console.log(this.tabValue, '2');
                this.searchForm = {};
                this.layerVisible = false;
                this.resVisible = false;
                this.searchVisible = true;
                this.searchTitle = '新增分析评价说明';
                Object.assign(this.searchForm, { PID: 0 });
            } else if (this.tabValue == 3) {
                console.log(this.tabValue, '3');
                this.layerVisible = false;
                this.searchVisible = false;
                this.resVisible = true;
                this.resTitle = '新增结果显示';
                Object.assign(this.resForm, { PID: 0, TYPEID: this.treePID });
            }
        },

        // 分析评价图层新增
        saveLayerDialog() {
            this.$refs.layerForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveFXPJLayer(this.layerForm);
                if (res.code == 1) {
                    this.$message.success(`${this.layerTitle}成功`);
                    this.layerVisible = false;
                    let params = {
                        typeid: this.treePID
                    };
                    this.getLayers(params);
                }
            });
        },

        // 结果显示弹窗关闭
        closedRes() {
            this.$refs.resForm.resetFields();
        },
        // 获取分析评价类型列表
        async getFieldTypeList() {
            let res = await getFXPJTypeList();
            if (res.code == 1) {
                this.fieldTypeList = res.data;
            }
        },
        // 查询字段弹窗关闭
        closedSearch() {
            this.$refs.searchForm.resetFields();
        },

        // 保存查询字段
        saveSearchDialog() {
            this.$refs.searchForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveFXPJSM(this.searchForm);
                if (res.code == 1) {
                    this.$message.success(`${this.searchTitle}成功`);
                    this.searchVisible = false;
                    let params = {
                        typeid: this.treePID
                    };
                    this.getSearchs(params);
                }
            });
        },

        // 编辑列表项
        handleList(row) {
            console.log(row, '这回事查询结果');
            this.listVisible = true;
            this.listFileID = row.PID;
            Object.assign(this.listForm, { PID: 0, FIELDID: row.PID });
            this.getListFieldData();
        },

        // 关闭列表项弹窗
        closedList() {
            this.$refs.listForm.resetFields();
        },
        // 文件上传
        async uploadFile(params) {
            debugger;
            this.fileNameList = params.file.name;
            console.log(params.file, '文件名称');
            let form = new FormData();
            form.append('file', params.file);
            form.append('filepath', 'FXPJ');
            // form.append('typeid', this.$route.query.pid);
            const res = await uploadfile(form);
            if (res.code == 1) {
                this.treeForm.REPORTURL = res.data;
                this.$message.success('上传成功');
            }
        },
        handleChange(file, fileList) {
            debugger;
            this.uploadfilelist = [fileList[fileList.length - 1]];
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
.container {
    display: flex;
    min-height: 81vh;
    .service-aside {
        width: 300px;
        border: 1px solid #dcdfe6;
        margin-right: 10px;
        padding: 0 4px;
    }
    .service-main {
        flex: 1;
        overflow-x: auto;
    }
    .search-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .el-input {
            width: 200px;
        }
    }
    .mr {
        margin-right: 10px;
    }
    ::v-deep .el-tree-node__content {
        font-size: 16px;
        padding: 2px 0;
    }
    .add-service {
        text-align: center;
        margin: 5px 0;
    }
}
.el-select {
    width: 100%;
}
.upload {
    width: 100%;
}
.tcadd {
    margin-bottom: 20px;
}
</style>
