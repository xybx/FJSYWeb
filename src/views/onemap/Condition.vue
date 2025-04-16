<!--
 * @Author: WCL
 * @Date: 2022-02-10 10:04:55
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-03 15:32:03
 * @FilePath: \fjsy-web\src\views\onemap\Condition.vue
 * @Description: 统一平台 - 条件查询
-->
<template>
    <div class="container">
        <div class="service-aside">
            <div class="add-service">
                <el-button @click="addTab" type="success" v-if="isAdmin == 'true'">新增类型</el-button>
            </div>
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
                    {{ scope.data.TABNAME }}
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
                        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
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
            <!-- 表格 -->
            <el-table style="font-size: 15px" :data="tableData" border stripe>
                <el-table-column
                    v-for="(item, index) in tableCols"
                    :key="index"
                    :label="item.label"
                    :prop="item.prop"
                    :min-width="item.width"
                    align="center"
                ></el-table-column>

                <el-table-column label="操作" align="center" min-width="170">
                    <template slot="header">
                        <!-- slot-scope="scope" -->
                        <el-button size="mini" type="primary" @click="addItem" v-if="isAdmin == 'true'">新增</el-button>
                    </template>
                    <template v-slot="scope">
                        <el-button
                            size="mini"
                            type="warning"
                            plain
                            v-if="scope.row.CONTROLTYPE && scope.row.CONTROLTYPE == 'list'"
                            @click="handleList(scope.row)"
                            >{{ isAdmin=='true'?'编辑列表项':'查看列表项'}}
                        </el-button>
                        <el-button size="mini" type="text" plain class="blue" icon="el-icon-edit" @click="handleEdit(scope.row)">{{
                            isAdmin == 'true' ? '编辑' : '查看'
                        }}</el-button>
                        <el-button
                            v-if="isAdmin == 'true'"
                            size="small"
                            type="text"
                            plain
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 左侧树弹窗 -->
        <el-dialog
            :title="treeTitle"
            :visible.sync="treeVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedTree"
            :close-on-click-modal="false"
        >
            <el-form ref="treeForm" :model="treeForm" label-width="auto" class="group-form" :rules="treeFormRules">
                <el-form-item label="名称" prop="TABNAME">
                    <el-input v-model="treeForm.TABNAME"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="treeVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTreeDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 图层配置弹窗 -->
        <el-dialog
            :title="layerTitle"
            :visible.sync="layerVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedLayer"
            :close-on-click-modal="false"
        >
            <el-form ref="layerForm" :model="layerForm" label-width="auto" class="group-form" :rules="layerFormRules">
                <el-form-item label="选择地图服务">
                    <el-select v-model="webgisLayerId" @change="changeWebGis" placeholder="请选择地图服务">
                        <el-option v-for="item in webgisLayers" :key="item.NAME" :label="item.NAME" :value="item.NAME"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择子图层" prop="LAYERID">
                    <el-select v-model="layerForm.LAYERID" @change="changeSonLayer" placeholder="请选择地图服务">
                        <el-option v-for="item in sonlayers" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图层名称" prop="LAYERNAME">
                    <el-input v-model="layerForm.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="图层地址" prop="LAYERURL">
                    <el-input v-model="layerForm.LAYERURL"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="layerVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveLayerDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 结果显示弹窗 -->
        <el-dialog
            :title="resTitle"
            :visible.sync="resVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedRes"
            :close-on-click-modal="false"
        >
            <el-form ref="resForm" :model="resForm" label-width="auto" class="group-form" :rules="resFormRules">
                <el-form-item label="结果字段名称" prop="FIELDNAME">
                    <el-select v-model="resForm.FIELDNAME" @change="changeResField" placeholder="请选择查询字段">
                        <el-option v-for="(item, index) in fieldList" :key="index" :label="`${item.name}:${item.alias}`" :value="item.name">
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model.trim="resForm.FIELDNAME"></el-input> -->
                </el-form-item>
                <el-form-item label="字段类型" prop="FIELDTYPE">
                    <el-select v-model="resForm.FIELDTYPE">
                        <el-option
                            v-for="(item, index) in fieldTypeList"
                            :key="index"
                            :label="item.DICTNAME"
                            :value="item.DICTVALUE"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段描述" prop="FIELDDESC">
                    <el-input v-model.trim="resForm.FIELDDESC" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveResDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查询字段弹窗 -->
        <el-dialog
            :title="searchTitle"
            :visible.sync="searchVisible"
            width="25%"
            custom-class="set-dialog"
            @closed="closedSearch"
            :close-on-click-modal="false"
        >
            <el-form ref="searchForm" :model="searchForm" label-width="auto" class="group-form" :rules="searchFormRules">
                <el-form-item label="查询字段" prop="FIELDNAME">
                    <el-select v-model="searchForm.FIELDNAME" @change="changeField" placeholder="请选择查询字段">
                        <el-option v-for="(item, index) in fieldList" :key="index" :label="`${item.name}:${item.alias}`" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询字段描述" prop="DISPLAYNAME">
                    <el-input v-model.trim="searchForm.DISPLAYNAME"></el-input>
                </el-form-item>
                <el-form-item label="字段类型" prop="FIELDTYPE">
                    <el-select v-model="searchForm.FIELDTYPE">
                        <el-option
                            v-for="(item, index) in fieldTypeList"
                            :key="index"
                            :label="item.DICTNAME"
                            :value="item.DICTVALUE"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="控件类型" prop="CONTROLTYPE">
                    <el-select v-model="searchForm.CONTROLTYPE">
                        <el-option
                            v-for="(item, index) in ctrlTypeList"
                            :key="index"
                            :label="item.DICTNAME"
                            :value="item.DICTVALUE"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="searchVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSearchDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑列表项弹窗 -->
        <el-dialog
            :title="listTitle"
            :visible.sync="listVisible"
            width="50%"
            custom-class="set-dialog"
            @closed="closedList"
            :close-on-click-modal="false"
        >
            <el-form ref="listForm" :inline="true" :model="listForm" label-width="auto" class="group-form" :rules="listFormRules"  v-if="isAdmin == 'true'">
                <el-form-item label="控件名称" prop="CONTROLNAME">
                    <el-input v-model.trim="listForm.CONTROLNAME"></el-input>
                </el-form-item>
                <el-form-item label="控件值" prop="CONTROLVALUE">
                    <el-input v-model.trim="listForm.CONTROLVALUE"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="saveListDialog">添加</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="listFieldData" border stripe max-height="400">
                <el-table-column label="PID" prop="PID" align="center"></el-table-column>
                <el-table-column label="控件名称" prop="CONTROLNAME" align="center"></el-table-column>
                <el-table-column label="控件值" prop="CONTROLVALUE" align="center"></el-table-column>

                <el-table-column label="操作" align="center" min-width="100" v-if="isAdmin == 'true'">
                    <template v-slot="scope">
                        <el-button size="mini" type="danger" plain @click="listDelete(scope.row)"  >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="listVisible = false">取 消</el-button>
                <el-button type="primary" @click="listVisible = false" v-if="isAdmin == 'true'">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getTabList,
    saveTab,
    delTab,
    getLayerList,
    saveLayer,
    delLayer,
    getResField,
    saveResField,
    delResField,
    getField,
    saveField,
    delField,
    getFieldType,
    getCtrlType,
    saveListField,
    getListField,
    delListField,
    getServerFields
} from '@/api/onemap/condition-api';
import { getWebGis, getServerLayers } from '@/api/onemap/hxdownload-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            webgisLayers: [],
            webgisLayerId: '',
            sonlayers: [],
            fieldList: [],
            treeData: [],
            treeVisible: false,
            treeTitle: '',
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            treeForm: {
                TABNAME: ''
            },
            treeFormRules: {
                TABNAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
            },
            tabList: [
                { label: '图层配置', name: '1' },
                { label: '查询字段', name: '2' },
                { label: '结果显示', name: '3' }
            ],
            tabValue: '1',
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            tableData: [],
            layerlist: [],
            tableCols: [],
            tableColsTotal: {
                // 图层配置
                one: [
                    { prop: 'PID', label: 'PID', width: '80' },
                    { prop: 'LAYERNAME', label: '名称', width: '130' },
                    { prop: 'LAYERURL', label: 'URL', width: '200' }
                    // { prop: 'STATUS', label: '状态', width: '100' }
                ],
                // 查询字段
                two: [
                    { prop: 'PID', label: 'PID', width: '80' },
                    { prop: 'FIELDNAME', label: '查询字段名', width: '200' },
                    { prop: 'DISPLAYNAME', label: '查询字段(描述)', width: '130' },
                    { prop: 'FIELDTYPE', label: '字段类型', width: '100' },
                    { prop: 'CONTROLTYPE', label: '控件类型', width: '100' }
                    // { prop: 'STATUS', label: '状态', width: '100' }
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
                LAYERID: '',
                LAYERNAME: '',
                LAYERURL: ''
            },
            layerFormRules: {
                LAYERNAME: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
                LAYERURL: [{ required: true, message: '图层地址不能为空', trigger: 'blur' }]
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
                DISPLAYNAME: '',
                FIELDNAME: '',
                FIELDTYPE: '',
                CONTROLTYPE: ''
            },
            searchFormRules: {
                DISPLAYNAME: [{ required: true, message: '显示名称不能为空', trigger: 'blur' }],
                FIELDNAME: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
                FIELDTYPE: [{ required: true, message: '字段类型不能为空', trigger: 'change' }],
                CONTROLTYPE: [{ required: true, message: '控件类型不能为空', trigger: 'change' }]
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
                // debugger;
                let params = {
                    tabid: val == null ? this.tabValue : val
                };
                if (this.tabValue == 1) {
                    this.getLayers(params);
                } else if (this.tabValue == 2) {
                    this.getSearchs(params);
                } else if (this.tabValue == 3) {
                    this.getRes(params);
                }
            },
            immediate: true
        },
        resVisible(boo) {
            if (boo) {
                var url = this.layerlist[0].LAYERURL;
                this.getChildFields(url);
                this.getFieldTypeList();
            }
        },
        searchVisible(boo) {
            if (boo) {
                var url = this.layerlist[0].LAYERURL;
                this.getChildFields(url);
                this.getCtrlTypeList();
                this.getFieldTypeList();
            }
        },
        layerVisible(boo) {
            if (boo) {
                this.getWebGisData();
                this.sonlayers = [];
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getTreeData();
    },
    methods: {
        // 获取地图服务列表
        async getWebGisData() {
            const res = await getWebGis();
            if (res.code === 200) {
                this.webgisLayers = res.data;
            }
        },

        // 选择地图服务
        async changeWebGis(val) {
            let arr = this.webgisLayers.filter((item) => {
                return item.NAME === val;
            });
            var webgispid = arr[0].ID;
            const res = await getServerLayers({ webgispid });
            if (res.code === 200) {
                this.sonlayers = res.data;
            }
        },

        //选择子图层
        changeSonLayer(val) {
            let arr = this.sonlayers.filter((item) => {
                return item.Id === val;
            });
            this.layerForm.LAYERNAME = arr[0].Name;
            this.layerForm.LAYERURL = arr[0].Url;
        },

        // 图层字段列表
        async getChildFields(url) {
            let params = {
                url
            };
            const res = await getServerFields(params);
            if (res.code === 200) {
                this.fieldList = res.data;
            }
        },

        //选择字段
        changeField(val) {
            let arr = this.fieldList.filter((item) => {
                return item.name === val;
            });
            this.searchForm.DISPLAYNAME = arr[0].alias;
            this.searchForm.FIELDNAME = arr[0].name;
        },

        changeResField(val) {
            let arr = this.fieldList.filter((item) => {
                return item.name === val;
            });
            this.resForm.FIELDDESC = arr[0].alias;
            this.resForm.FIELDNAME = arr[0].name;
        },

        // 新增类型
        addTab() {
            this.treeVisible = true;
            this.treeTitle = '新增类型';
            Object.assign(this.treeForm, { PID: 0 });
        },

        // 保存树
        saveTreeDialog() {
            this.$refs.treeForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请输入必填项');
                const res = await saveTab(this.treeForm);
                if (res.code === 200) {
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
            this.treePID = obj.PID;
        },

        // 图层配置列表
        async getLayers(params) {
            // debugger;
            const res = await getLayerList(params);
            if (res.code === 200) {
                this.tableData = res.data;
                this.layerlist = res.data;
            }
        },

        // 查询字段列表
        async getSearchs(params) {
            const res = await getField(params);
            if (res.code === 200) {
                this.tableData = res.data;
            }
        },

        // 结果字段列表
        async getRes(params) {
            const res = await getResField(params);
            if (res.code === 200) {
                this.tableData = res.data;
            }
        },

        // 获取左侧树
        async getTreeData() {
            const res = await getTabList();
            if (res.code === 200) {
                this.treeData = res.data;
                if (this.treeData != null && this.treeData.length > 0) {
                    this.currentKey = this.treeData[0].PID;
                    this.treePID = this.treeData[0].PID;
                    this.$nextTick(() => {
                        this.$refs.treeData.setCurrentKey(this.currentKey);
                    });
                }
            }
        },

        // 编辑树分组
        editTree(row) {
            this.treeVisible = true;
            this.treeTitle = '编辑类型';
            Object.assign(this.treeForm, row);
        },

        // 删除树分组
        async delTree(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        pid: row.PID
                    };
                    const res = await delTab(params);
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getTreeData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });

           
        },

        // 标签页切换
        handleTabClick(val) {
            // debugger;
            let params = {
                tabid: this.treePID
            };
            if (this.tabValue == 1) {
                this.getLayers(params);
            } else if (this.tabValue == 2) {
                this.getSearchs(params);
            } else if (this.tabValue == 3) {
                this.getRes(params);
            }
        },

        // 编辑
        handleEdit(row) {
            console.log(row);
            if (this.tabValue == 1) {
                this.resVisible = false;
                this.searchVisible = false;
                this.layerVisible = true;
                this.layerTitle = '编辑图层配置';
                Object.assign(this.layerForm, row);
            } else if (this.tabValue == 2) {
                this.layerVisible = false;
                this.resVisible = false;
                this.searchVisible = true;
                this.searchTitle = '编辑查询字段';
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

            //询问是否删除
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let form = {
                        pid: row.PID
                    };
                    if (this.tabValue == 1) {
                        const res = await delLayer(form);
                        if (res.code === 200) {
                            this.$message.success('删除成功！');
                            let params = {
                                tabid: this.treePID
                            };
                            this.getLayers(params);
                        }
                    } else if (this.tabValue == 2) {
                        const res = await delField(form);
                        if (res.code === 200) {
                            this.$message.success('删除成功！');
                            let params = {
                                tabid: this.treePID
                            };
                            this.getSearchs(params);
                        }
                    } else if (this.tabValue == 3) {
                        const res = await delResField(form);
                        if (res.code === 200) {
                            this.$message.success('删除成功！');
                            let params = {
                                tabid: this.treePID
                            };
                            this.getRes(params);
                        }
                    }
                })
                .catch(() => {
                    
                });

            
        },

        // 图层配置弹窗关闭
        closedLayer() {
            this.$refs.layerForm.resetFields();
            this.webgisLayerId = '';
            this.sonlayers = [];
        },

        // 新增表格项
        addItem() {
            if (this.tabValue == 1) {
                this.resVisible = false;
                this.searchVisible = false;
                this.layerVisible = true;
                this.layerTitle = '新增图层配置';
                Object.assign(this.layerForm, { PID: 0, TABID: this.treePID });
            } else if (this.tabValue == 2) {
                this.layerVisible = false;
                this.resVisible = false;
                this.searchVisible = true;
                this.searchTitle = '新增查询字段';
                Object.assign(this.searchForm, { PID: 0, TABID: this.treePID });
            } else if (this.tabValue == 3) {
                this.layerVisible = false;
                this.searchVisible = false;
                this.resVisible = true;
                this.resTitle = '新增结果显示';
                Object.assign(this.resForm, { PID: 0, TABID: this.treePID });
            }
        },

        // 保存图层配置
        saveLayerDialog() {
            this.$refs.layerForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                console.log("请求信息,", this.layerForm)
                const res = await saveLayer(this.layerForm);
                if (res.code === 200) {
                    this.$message.success(`${this.layerTitle}成功`);
                    this.layerVisible = false;
                    let params = {
                        tabid: this.treePID
                    };
                    this.getLayers(params);
                }
            });
        },

        // 结果显示弹窗关闭
        closedRes() {
            this.$refs.resForm.resetFields();
        },

        // 保存结果显示
        saveResDialog() {
            this.$refs.resForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveResField(this.resForm);
                if (res.code == 200) {
                    this.$message.success(`${this.resTitle}成功`);
                    this.resVisible = false;
                    let params = {
                        tabid: this.treePID
                    };
                    this.getRes(params);
                }
            });
        },

        // 获取字段类型列表
        async getFieldTypeList() {
            const res = await getFieldType();
            if (res.code === 200) {
                this.fieldTypeList = res.data;
            }
        },

        // 获取控件类型列表
        async getCtrlTypeList() {
            const res = await getCtrlType();
            if (res.code === 200) {
                this.ctrlTypeList = res.data;
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
                const res = await saveField(this.searchForm);
                if (res.code === 200) {
                    this.$message.success(`${this.searchTitle}成功`);
                    this.searchVisible = false;
                    let params = {
                        tabid: this.treePID
                    };
                    this.getSearchs(params);
                }
            });
        },

        // 编辑列表项
        handleList(row) {
            console.log(row);
            this.listVisible = true;
            this.listFileID = row.PID;
            Object.assign(this.listForm, { PID: 0, FIELDID: row.PID });
            this.getListFieldData();
        },

        async getListFieldData() {
            let params = {
                fieldid: this.listFileID
            };
            const res = await getListField(params);
            if (res.code === 200) {
                this.listFieldData = res.data;
            }
        },

        // 关闭列表项弹窗
        closedList() {
            this.$refs.listForm.resetFields();
        },

        // 保存列表项
        saveListDialog() {
            this.$refs.listForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveListField(this.listForm);
                if (res.code === 200) {
                    this.$message.success(`添加成功`);
                    this.$refs.listForm.resetFields();
                    this.getListFieldData();
                }
            });
        },

        // 列表项删除
        async listDelete(row) {

            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    console.log(row);
                    let params = {
                        pid: row.PID
                    };
                    const res = await delListField(params);
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getListFieldData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
            
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
    }
    .service-main {
        flex: 1;
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
        font-size: 14px;
    }
    .add-service {
        text-align: center;
        margin: 5px 0;
    }
}
.el-select {
    width: 100%;
}
</style>
