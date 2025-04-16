<!--
 * @Author: WCL
 * @Date: 2022-01-25 10:43:26
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-23 10:06:07
 * @FilePath: \fjsy-web\src\views\dataresource\MapService.vue
 * @Description: 地图服务
-->
<template>
    <div class="container">
        <div class="service-aside">
            <div class="add-service">
                <el-button @click="addService" type="success">新增图层组</el-button>
            </div>
            <el-tree ref='layerTreeRef' :data="treeData" :props="treeProps" :node-key="'PID'" :expand-on-click-node="false" highlight-current @node-click="handleNodeClick">
                <span class='layerSpan' slot-scope="scope">
                    {{ scope.data.SNAME }}
                    <el-popover placement="bottom-start" popper-class="tree-popover" trigger="click" v-if="scope.node.isCurrent == true">
                        <i class="el-icon-set-up" slot="reference"></i>

                        <el-tooltip class="item" effect="dark" content="新增" placement="bottom" >
                            <i class="el-icon-circle-plus-outline" @click="addLayer(scope.data)"></i>
                        </el-tooltip>
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
            <div class="search-box">
                <el-button type="primary" size="small" @click="handleAdd">新增服务</el-button>
                <div>
                    <el-input v-model="searchTXT" placeholder="请输入关键字" class="mr"></el-input>
                    <el-button type="primary" size="small" @click="handleSearch" class="">搜索</el-button>
                </div>
            </div>
            <el-table style="font-size:15px" :data="tableData" border stripe>
                <el-table-column prop="PID" label="PID" align="center" min-width="80"></el-table-column>
                <el-table-column prop="NAME" label="名称" align="center" min-width="130"></el-table-column>
                <el-table-column prop="URL" label="URL" min-width="200" align="center"></el-table-column>
                <el-table-column prop="ENABLE" label="是否启用" align="center" min-width="50">
                    <template v-slot="scope">
                        {{ scope.row.ENABLE === 0 ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="ORDERNUM" label="排序" align="center" min-width="80"></el-table-column>
                <el-table-column label="操作" align="center" min-width="100">
                    <template v-slot="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)"
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
        </div>

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" :visible.sync="setVisible" width="30%" custom-class="set-dialog" :close-on-click-modal="false">
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules"></el-form>
        </el-dialog>

        <!-- 图层组弹窗 -->
        <el-dialog
            :title="groupTitle"
            :visible.sync="groupVisible"
            width="30%"
            custom-class="set-dialog"
            @closed="closedGroup"
            :close-on-click-modal="false"
        >
            <el-form ref="groupForm" :model="groupForm" label-width="auto" class="group-form" :rules="groupFormRules">
                <el-form-item label="名称" prop="SNAME">
                    <el-input v-model="groupForm.SNAME"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="SERIAL">
                    <el-input v-model.number="groupForm.SERIAL" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGroupDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 服务弹窗 -->
        <el-dialog
            :title="setServerDialogName"
            :visible.sync="serveVisible"
            width="30%"
            @close="closeServeDialog"
            custom-class="set-dialog"
            :close-on-click-modal="false"
        >
            <el-form ref="serveForm" :model="serveForm" label-width="auto" :rules="serveFormRules">
                <el-form-item label="服务组" prop="GROUPID">
                    <el-cascader
                        v-model="serveForm.GROUPID"
                        :options="treeData"
                        :props="{
                            expandTrigger: 'hover',
                            value: 'PID',
                            label: 'SNAME',
                            children: 'CHILDREN',
                            checkStrictly: true,
                            emitPath: false
                        }"
                        :show-all-levels="false"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="数据来源" prop="DATASOURCE">
                    <el-select v-model="serveForm.DATASOURCE" placeholder="请选择">
                        <el-option
                            v-for="item in dataSourceList"
                            :key="item.intnum"
                            :label="item.name"
                            :value="item.stringnum"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务器" prop="IP">
                    <el-select v-model="serveForm.IP" placeholder="请选择" @input="changeIP">
                        <el-option v-for="item in dataServers" :key="item.PID" :label="item.IP" :value="item.IP"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务">
                    <el-select v-model="serveUrl" placeholder="请选择" @change="changeServe">
                        <el-option v-for="item in serverNameList" :key="item.Url" :label="item.Name" :value="item.Url"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务地址" prop="URL">
                    <el-input v-model="serveForm.URL" placeholder="请输入服务地址"></el-input>
                </el-form-item>
                <el-form-item label="服务名称" prop="NAME">
                    <el-input v-model="serveForm.NAME" placeholder="请输入服务名称"></el-input>
                </el-form-item>
                <el-form-item label="服务类型" prop="KIND">
                    <el-select v-model="serveForm.KIND" placeholder="请选择">
                        <el-option v-for="item in serveTypeList" :key="item.intnum" :label="item.name" :value="item.stringnum"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="透明度" prop="OPACITY">
                    <el-slider v-model="serveForm.OPACITY"></el-slider>
                </el-form-item>
                <el-form-item label="是否启用" prop="ENABLE">
                    <el-switch v-model="serveForm.ENABLE" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="排序" prop="ORDERNUM">
                    <el-input v-model.number="serveForm.ORDERNUM" placeholder="请输入排序" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveServeDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getTreeGroups,
    getWebGisLayers,
    saveGroup,
    delGroup,
    getServers,
    getServeName,
    getServeType,
    getDataResource,
    saveMapServe,
    delMapServer
} from '@/api/mapservice-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            setServerDialogName: '添加服务',
            treeData: [],
            treeProps: {
                children: 'CHILDREN',
                label: 'SNAME'
            },
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            groupID: 0,
            searchTXT: '',
            setVisible: false,
            setForm: {},
            setFormRules: {},
            groupVisible: false,
            groupTitle: '',
            groupForm: {
                SNAME: '',
                SERIAL: null,
                GROUPTYPE: 1
            },
            groupFormRules: {
                SNAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                SERIAL: [{ required: true, message: '序号不能为空', trigger: 'blur' }]
            },
            serveVisible: false,
            serveForm: {
                PID: 0,
                NAME: '',
                URL: '',
                OPACITY: 100,
                ENABLE: false,
                KIND: '',
                ORDERNUM: 0,
                DATASOURCE: '',
                IP: '',
                GROUPID: ''
            },
            dataServers: [],
            serverNameList: [],
            // 服务选择
            serveUrl: '',
            serveTypeList: [],
            dataSourceList: [],
            serveFormRules: {
                GROUPID: [{ required: true, message: '服务组不能为空', trigger: 'change' }],
                DATASOURCE: [{ required: true, message: '数据来源不能为空', trigger: 'change' }],
                IP: [{ required: true, message: 'IP不能为空', trigger: 'change' }],
                URL: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }],
                NAME: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
                KIND: [{ required: true, message: '服务类型不能为空', trigger: 'change' }],
                OPACITY: [{ required: true, message: '透明度不能为空', trigger: 'blur' }]
            }
        };
    },
    computed: {
        // ...mapState(['isAdmin'])
    },
    watch: {
        $route: {
            handler(val) {
                //debugger;
                this.groupForm.GROUPTYPE = this.$route.query.type;
                if (this.$route.query.type == undefined || this.$route.query.type == '') {
                    this.groupForm.GROUPTYPE = 1;
                }
                this.getTreeData(this.groupForm.GROUPTYPE);
            }
        },
        serveVisible(boo) {
            if (boo) {
                this.getDataServers();
                this.getServeTypeList();
                this.getSource();
            }
        },
        'serveForm.IP': {
            async handler(val) {
                console.log(val, 'serveForm.IP');
                if (Boolean(val)) {
                    await this.getDataServers();
                    await this.changeIP(val);
                }
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.groupForm.GROUPTYPE = this.$route.query.type;
        if (this.$route.query.type == undefined || this.$route.query.type == '') {
            this.groupForm.GROUPTYPE = 0;
        }
        this.getTreeData(this.groupForm.GROUPTYPE);
    },
    methods: {
        // 获取树级列表
        async getTreeData(type) {
            const res = await getTreeGroups({ type });
            if (res.code === 200) {
                this.treeData = res.data;
            }
        },

        // 树级节点点击
        async handleNodeClick(obj, node, el) {
            this.groupID = obj.PID;
            this.currentPage = 1;
            let params = {
                groupid: obj.PID
            };
            this.getTableData(params);
            this.serveForm.GROUPID = obj.PID;
            
        },

        // 新增
        handleAdd() {
            this.serveForm.PID = 0;
            this.serveVisible = true;
        },

        // 搜索
        handleSearch() {
            this.currentPage = 1;
            let params = {
                keyword: this.searchTXT
            };
            this.getTableData(params);
        },

        // 获取表格数据
        async getTableData(form) {
            let params = {
                groupid: this.groupID,
                keyword: '',
                currentpage: this.currentPage,
                pagesize: 10,
                kind: 0,
                datasource: 0
            };
            if (form?.groupid) {
                Object.assign(params, form);
            }
            if (form?.keyword) {
                Object.assign(params, form);
            }
            const res = await getWebGisLayers(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },

        // 页数点击
        handlePageChange(val) {
            this.currentPage = val;
            this.getTableData();
        },

        // 新增图层组
        addService() {
            this.groupVisible = true;
            this.groupTitle = '新增图层组';
            Object.assign(this.groupForm, { PID: 0, PARENTID: 0 });
        },

        // 保存图层组
        saveGroupDialog() {
            this.$refs.groupForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请输入必填项');
                const res = await saveGroup(this.groupForm);
                if (res.code === 200) {
                    this.$message.success('操作成功');
                    this.groupVisible = false;
                    if (this.groupForm.PID == 0) {
                        // 添加图层组数据只有在失败的时候需要刷新获取最新数据
                        const node = {
                          PID: res.data,
                          PARENTID: this.groupForm.PARENTID,
                          SERIAL: this.groupForm.SERIAL,
                          SNAME: this.groupForm.SNAME,
                          GROUPTYPE: 0
                        }
                        this.$refs.layerTreeRef.append(node, this.groupForm.PARENTID);
                    } else {
                        if (this.groupForm.PARENTID == 0) {
                            this.getTreeData(this.groupForm.GROUPTYPE);
                            return ;
                        }
                        // 获取节点并进行修改
                        // 获取父级节点
                        const parentNode = this.$refs.layerTreeRef.getNode(this.groupForm.PARENTID);
                        // 循环比较
                        let dataList = [];
                        parentNode.childNodes.forEach(item => {
                            if (item.data.PID == this.groupForm.PID) {
                                item.data.SNAME = this.groupForm.SNAME;
                            }
                            dataList.push(item.data);
                        })
                        this.$refs.layerTreeRef.updateKeyChildren(this.groupForm.PARENTID, dataList);
                    }
                } else {
                    this.getTreeData(this.groupForm.GROUPTYPE);
                }
            });
        },

        // 添加图层
        addLayer(row) {
            this.groupVisible = true;
            Object.assign(this.groupForm, { PARENTID: row.PID, PID: 0 });
        },

        // 图层弹窗关闭
        closedGroup() {
            this.$refs.groupForm.resetFields();
        },

        // 编辑树分组
        editTree(row) {
            this.groupVisible = true;
            this.groupTitle = '编辑图层组';
            Object.assign(this.groupForm, row);
        },

        // 删除树分组
        async delTree(row) {
            //询问是否删除
            this.$confirm('此操作将永久删除该图层组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    const node = this.$refs.layerTreeRef.getNode(row.PID);
                    if (node == null) {
                        // 数据可能已过期，需要刷新
                        this.$message.warning("数据已过期，请刷新后重试！")
                        this.getTreeData(this.groupForm.GROUPTYPE);
                    }
                    if (node != null && node.childNodes.length > 0) {
                      this.$message.error("当前图层下存在子图层，请先删除子图层！");
                      return;
                    }
                    const res = await delGroup({ pid: row.PID });
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        // 直接根据pid进行删除
                        this.$refs.layerTreeRef.remove(row.PID);
                    } else {
                        // 操作失败，需要重新加载数据
                        this.getTreeData(this.groupForm.GROUPTYPE);
                    }
                })
                .catch(() => {
                    console.log("节点 -> ", node);
                    this.$message.info('已取消删除');
                });
        },

        // 获取服务器列表
        async getDataServers() {
            const res = await getServers();
            if (res.code === 200) {
                this.dataServers = res.data;
            }
        },

        // 服务器列表选择
        async changeIP(obj) {
            console.log(this.dataServers, 'dataServers');
            let data = this.dataServers.filter((item) => {
                return obj == item.IP;
            });
            console.log(data, 'data');
            if (data.length > 0) {
                this.serveUrl = '';
                //this.serveForm.URL = '';
                let params = {
                    serverpid: data[0].PID
                };
                // 服务名称列表
                const res = await getServeName(params);
                if (res.code === 200) {
                    this.serverNameList = res.data;
                    console.log(res.data, 'serverNameList');
                    this.serveUrl = this.serveForm.URL;
                }
            }
        },

        // 服务类型
        async getServeTypeList() {
            const res = await getServeType();
            if (res.code === 200) {
                this.serveTypeList = res.data;
            }
        },

        changeServe(val) {
            this.serveForm.URL = val;
        },

        // 获取数据来源
        async getSource() {
            const res = await getDataResource();
            if (res.code === 200) {
                this.dataSourceList = res.data;
            }
        },

        // 获取服务名称列表
        getServerNameList() {
            let data = this.dataServers.filter((item) => {
                return this.serveForm.IP == item.IP;
            });
        },

        // 保存服务弹窗
        saveServeDialog() {
            this.$refs.serveForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveMapServe(this.serveForm);
                if (res.code == 200) {
                    this.$message.success('保存成功');
                    this.serveVisible = false;
                    this.getTableData();
                }
            });
        },

        // 关闭服务弹窗
        closeServeDialog() {
            this.$refs.serveForm.resetFields();
            this.serveUrl = '';
            this.serverNameList = [];
        },

        // 删除服务
        async handleDelete(row) {
            this.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                    const res = await delMapServer({ pid: row.PID });
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getTableData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },

        // 编辑服务
        handleEdit(row) {
            console.log(row);
            this.setServerDialogName = this.isAdmin == 'true' ? '编辑服务' : '查看服务';
            this.serveVisible = true;
            this.$nextTick(() => {
                this.serveForm.GROUPID = Number(row.GROUPID);
                this.serveForm.DATASOURCE = String(row.DATASOURCE);
                this.serveForm.IP = row.IP;
                this.serveForm.URL = row.URL;
                this.serveForm.NAME = row.NAME;
                this.serveForm.KIND = String(row.KIND);
                this.serveForm.ENABLE = row.ENABLE;
                this.serveForm.ORDERNUM = row.ORDERNUM;
                this.serveForm.OPACITY = Number(row.OPACITY);
                this.serveForm.PID = row.PID;
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
        padding: 0 2px;
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
        font-size: 16px;
        padding: 2px 0;
        align-items: start;
        height: 100%;
    }
    .add-service {
        text-align: center;
        margin: 5px 0;

    }

    .layerSpan {
      display: inline-block;
      width: 300px;
      word-break: break-all;
      white-space: normal;
    }
    .el-select,
    .el-cascader {
        width: 100%;
    }
}
</style>
